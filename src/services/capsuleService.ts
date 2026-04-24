import { ethers } from 'ethers';
import AioniosCapsuleABI from '../contracts/AioniosCapsuleABI.json';
import { CONTRACT_ADDRESSES } from '@/web3/config';
import { supabase } from '@/lib/supabase';
import type { Capsule } from '@/store/slices/capsuleSlice';

// -------------------------------------------------------
// Helpers: map Supabase row → Redux Capsule shape
// -------------------------------------------------------
function mapRow(row: any): Capsule {
  return {
    id:               String(row.id),
    title:            row.title,
    description:      row.description || '',
    content:          row.ipfs_hash   || '',
    openCondition: {
      type:  (row.condition_type || 'time').toLowerCase() as any,
      value: row.open_date ? new Date(row.open_date).getTime() : Date.now(),
    },
    assets:           [],
    recipientAddress: row.creator_address || '',
    status:           (row.status || 'SEALED').toLowerCase() as any,
    createdAt:        row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    openedAt:         row.opened_at  ? new Date(row.opened_at).getTime()  : undefined,
    viewCount:        row.view_count         || 0,
    shareCount:       row.share_count        || 0,
    subscriptionCount: row.subscription_count || 0,
    featured:         row.featured           || false,
  };
}

// -------------------------------------------------------
// READ operations — Supabase
// -------------------------------------------------------
export const getPopularCapsules = async (limit = 10): Promise<Capsule[]> => {
  const { data } = await supabase
    .from('capsules')
    .select('*')
    .order('view_count', { ascending: false })
    .limit(limit);
  return (data || []).map(mapRow);
};

export const getFeaturedCapsules = async (): Promise<Capsule[]> => {
  const { data } = await supabase
    .from('capsules')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });
  return (data || []).map(mapRow);
};

export const getRecentlyOpenedCapsules = async (limit = 10): Promise<Capsule[]> => {
  const { data } = await supabase
    .from('capsules')
    .select('*')
    .eq('status', 'OPENED')
    .order('opened_at', { ascending: false })
    .limit(limit);
  return (data || []).map(mapRow);
};

export const getMostSubscribedCapsules = async (limit = 10): Promise<Capsule[]> => {
  const { data } = await supabase
    .from('capsules')
    .select('*')
    .order('subscription_count', { ascending: false })
    .limit(limit);
  return (data || []).map(mapRow);
};

export const getCapsule = async (id: number): Promise<Capsule | null> => {
  const { data } = await supabase
    .from('capsules')
    .select('*')
    .eq('id', id)
    .single();
  return data ? mapRow(data) : null;
};

export const getCapsulesByCreator = async (address: string): Promise<Capsule[]> => {
  const { data } = await supabase
    .from('capsules')
    .select('*')
    .eq('creator_address', address)
    .order('created_at', { ascending: false });
  return (data || []).map(mapRow);
};

export const getCapsulesByAddress = async (address: string): Promise<Capsule[]> => {
  const { data } = await supabase
    .from('capsules')
    .select('*')
    .or(`creator_address.eq.${address},recipient_address.eq.${address}`)
    .order('created_at', { ascending: false });
  return (data || []).map(mapRow);
};

// -------------------------------------------------------
// WRITE operations
// -------------------------------------------------------
export const createCapsule = async (capsuleData: any): Promise<Capsule> => {
  // 1. Blockchain interaction (unchanged)
  const blockchainId = await createCapsuleOnBlockchain(
    capsuleData.conditionType,
    capsuleData.openDate,
    capsuleData.recipients.map((r: any) => r.address),
    capsuleData.witnesses?.map((w: any) => w.address) || []
  );

  // 2. Upload to IPFS if there's a file
  let ipfsHash: string | null = null;
  if (capsuleData.files && capsuleData.files.length > 0) {
    ipfsHash = await uploadToIPFS(capsuleData.files[0]);
  }

  // 3. Save metadata to Supabase (replaces backend POST)
  const { data, error } = await supabase
    .from('capsules')
    .insert({
      title:            capsuleData.title,
      description:      capsuleData.description || '',
      blockchain_id:    blockchainId,
      creator_address:  capsuleData.creatorAddress,
      recipient_address: capsuleData.recipients?.[0]?.address || null,
      status:           'PENDING',
      condition_type:   (capsuleData.conditionType || 'TIME').toUpperCase(),
      open_date:        capsuleData.openDate,
      ipfs_hash:        ipfsHash,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data);
};

export const incrementViewCount = async (id: number): Promise<void> => {
  try {
    await supabase.rpc('increment_capsule_views', { capsule_id: id });
  } catch {
    // Silently ignore errors
  }
};

export const incrementShareCount = async (id: number): Promise<void> => {
  try {
    await supabase.rpc('increment_capsule_shares', { capsule_id: id });
  } catch {
    // Silently ignore errors
  }
};

export const subscribeToCapsule = async (id: number): Promise<void> => {
  try {
    await supabase.from('interactions').insert({
      target_id:        String(id),
      target_type:      'capsule',
      interaction_type: 'subscribe',
    });
  } catch {
    // Silently ignore errors
  }
};

export const openCapsule = async (id: number): Promise<Capsule | null> => {
  const { data } = await supabase
    .from('capsules')
    .update({ status: 'OPENED', opened_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return data ? mapRow(data) : null;
};

// -------------------------------------------------------
// IPFS helper
// -------------------------------------------------------
export const getIPFSUrl = (hash: string): string => {
  const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.ipfs.io/ipfs/';
  return `${gateway}${hash}`;
};

export const uploadToIPFS = async (file: File): Promise<string> => {
  // Upload to Supabase Storage as alternative to IPFS
  const path = `capsules/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('capsule-content')
    .upload(path, file, { upsert: false });
  if (error) throw new Error(error.message);
  return data.path;
};

// -------------------------------------------------------
// BLOCKCHAIN — unchanged
// -------------------------------------------------------
export const createCapsuleOnBlockchain = async (
  conditionType: string,
  openDate: Date | null,
  recipients: string[],
  witnesses: string[]
): Promise<string> => {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('Ethereum provider not found');
  }
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer   = await provider.getSigner();
  const contract = new ethers.Contract(
    CONTRACT_ADDRESSES.AIONIOS_CAPSULE,
    AioniosCapsuleABI,
    signer
  );

  let tx;
  switch (conditionType) {
    case 'time': {
      if (!openDate) throw new Error('Open date is required for time condition');
      const timestamp = Math.floor(openDate.getTime() / 1000);
      tx = await contract.createTimeCapsule(recipients, timestamp);
      break;
    }
    case 'multisig': {
      if (!witnesses || witnesses.length < 2)
        throw new Error('At least two witnesses are required');
      tx = await contract.createMultisigCapsule(recipients, witnesses, witnesses.length);
      break;
    }
    default:
      throw new Error(`Unsupported condition type: ${conditionType}`);
  }

  const receipt = await tx.wait();
  const event   = receipt.events?.find((e: any) => e.event === 'CapsuleCreated');
  if (!event) throw new Error('Capsule creation event not found');
  return event.args.capsuleId.toString();
};
