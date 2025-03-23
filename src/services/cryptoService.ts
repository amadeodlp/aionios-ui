import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '@/web3/config';
import TimeCapsuleABI from '@/web3/abis/TimeCapsule.json';

// Type definitions
export interface CapsuleData {
    title: string;
    contentHash: string;
    recipient: string;
    openTime?: number | Date;
    witnesses?: { address: string; name: string }[];
    requiredSignatures?: number;
    [key: string]: any;
}

export interface Asset {
    type: 'ETH' | 'ERC20' | 'NFT';
    amount: string | number;
    token?: string;
    transferType: 'immediate' | 'conditional';
    isApproved?: boolean;
    condition?: string;
}

export interface TransactionResult {
    asset: Asset;
    txHash: string;
    status: number;
}

/**
 * Initialize connection to the TimeCapsule contract
 * @param provider - Web3 provider
 * @returns TimeCapsule contract instance
 */
export const getTimeCapsuleContract = (provider: ethers.providers.Web3Provider | null): ethers.Contract | null => {
    if (!provider) return null;

    const signer = provider.getSigner();
    return new ethers.Contract(
        CONTRACT_ADDRESSES.AIONIOS_CAPSULE,
        TimeCapsuleABI,
        signer
    );
};

/**
 * Create a new time capsule on the blockchain
 * @param capsuleData - Data for the new capsule
 * @param provider - Web3 provider
 * @returns Created capsule data including transaction receipt
 */
export const createCapsuleOnChain = async (
    capsuleData: CapsuleData,
    provider: ethers.providers.Web3Provider
): Promise<CapsuleData & { id: number; txHash: string; blockNumber: number }> => {
    const contract = getTimeCapsuleContract(provider);
    if (!contract) throw new Error('Contract not initialized');

    const { title, contentHash, recipient, openTime } = capsuleData;

    // Convert openTime to Unix timestamp if it's a Date object
    const openTimestamp = typeof openTime === 'object' && openTime instanceof Date
        ? Math.floor(openTime.getTime() / 1000)
        : typeof openTime === 'number' ? openTime : Math.floor(Date.now() / 1000);

    // Create the capsule transaction
    const tx = await contract.createTimeCapsule(
        title,
        contentHash,
        recipient,
        openTimestamp
    );

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    // Find the CapsuleCreated event to get the capsule ID
    const event = receipt.events.find((e: any) => e.event === 'CapsuleCreated');
    const capsuleId = event.args.capsuleId.toNumber();

    return {
        id: capsuleId,
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        ...capsuleData
    };
};

/**
 * Create multi-signature time capsule on the blockchain
 * @param capsuleData - Data for the new capsule
 * @param provider - Web3 provider
 * @returns Created capsule data including transaction receipt
 */
export const createMultiSigCapsuleOnChain = async (
    capsuleData: CapsuleData,
    provider: ethers.providers.Web3Provider
): Promise<CapsuleData & { id: number; txHash: string; blockNumber: number }> => {
    const contract = getTimeCapsuleContract(provider);
    if (!contract) throw new Error('Contract not initialized');

    const { title, contentHash, recipient, witnesses, requiredSignatures } = capsuleData;

    if (!witnesses || witnesses.length === 0) {
        throw new Error('Witnesses are required for multi-signature capsules');
    }

    // Create multi-sig capsule
    const tx = await contract.createMultiSigCapsule(
        title,
        contentHash,
        recipient,
        witnesses.map(w => w.address),
        requiredSignatures || witnesses.length
    );

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    // Find the CapsuleCreated event to get the capsule ID
    const event = receipt.events.find((e: any) => e.event === 'CapsuleCreated');
    const capsuleId = event.args.capsuleId.toNumber();

    return {
        id: capsuleId,
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        ...capsuleData
    };
};

/**
 * Add crypto assets to a capsule
 * @param capsuleId - ID of the capsule
 * @param assets - Assets to add to the capsule
 * @param provider - Web3 provider
 * @returns Transaction receipts for each asset
 */
export const addCryptoAssets = async (
    capsuleId: number,
    assets: Asset[],
    provider: ethers.providers.Web3Provider
): Promise<TransactionResult[]> => {
    const contract = getTimeCapsuleContract(provider);
    if (!contract) throw new Error('Contract not initialized');

    const receipts: TransactionResult[] = [];

    for (const asset of assets) {
        try {
            // Handle ETH deposits
            if (asset.type === 'ETH') {
                // If conditional transfer, add ETH to contract
                if (asset.transferType === 'conditional') {
                    const tx = await contract.depositEth(capsuleId, {
                        value: ethers.utils.parseEther(asset.amount.toString())
                    });

                    const receipt = await tx.wait();
                    receipts.push({
                        asset,
                        txHash: receipt.transactionHash,
                        status: receipt.status
                    });
                }
                // Immediate transfers don't need blockchain interaction
                // These will be handled by the backend directly
            }
            // Handle token assets (ERC20 or NFT)
            else {
                // Skip assets that are already approved in the UI
                if (asset.isApproved) continue;

                const isNFT = asset.type === 'NFT';
                const amount = isNFT
                    ? asset.amount.toString() // tokenId for NFTs
                    : ethers.utils.parseEther(asset.amount.toString()); // Parse amount for ERC20 tokens

                const transferType = asset.transferType === 'conditional'
                    ? 1 // AssetTransferType.Conditional
                    : 0; // AssetTransferType.Immediate

                if (!asset.token) {
                    throw new Error(`Token address is required for ${asset.type} assets`);
                }

                // Add the asset to the capsule
                const tx = await contract.addAsset(
                    capsuleId,
                    asset.token,  // token address
                    isNFT ? parseInt(asset.amount.toString()) : 0,  // tokenId (for NFTs)
                    amount,  // amount (for ERC20 tokens)
                    isNFT,  // isNFT flag
                    transferType  // transfer type
                );

                const receipt = await tx.wait();
                receipts.push({
                    asset,
                    txHash: receipt.transactionHash,
                    status: receipt.status
                });
            }
        } catch (error) {
            console.error(`Error adding asset ${asset.type}:`, error);
            // Re-throw or handle the error as needed
            throw error;
        }
    }

    return receipts;
};

/**
 * Open a time capsule
 * @param capsuleId - ID of the capsule to open
 * @param provider - Web3 provider
 * @returns Transaction receipt
 */
export const openCapsule = async (
    capsuleId: number,
    provider: ethers.providers.Web3Provider
): Promise<{ txHash: string; status: number; capsuleId: number }> => {
    const contract = getTimeCapsuleContract(provider);
    if (!contract) throw new Error('Contract not initialized');

    const tx = await contract.openCapsule(capsuleId);
    const receipt = await tx.wait();

    return {
        txHash: receipt.transactionHash,
        status: receipt.status,
        capsuleId
    };
};

/**
 * Approve a multi-signature capsule opening
 * @param capsuleId - ID of the capsule to approve
 * @param provider - Web3 provider
 * @returns Transaction receipt
 */
export const approveOpening = async (
    capsuleId: number,
    provider: ethers.providers.Web3Provider
): Promise<{ txHash: string; status: number; capsuleId: number }> => {
    const contract = getTimeCapsuleContract(provider);
    if (!contract) throw new Error('Contract not initialized');

    const tx = await contract.approveCapsuleOpening(capsuleId);
    const receipt = await tx.wait();

    return {
        txHash: receipt.transactionHash,
        status: receipt.status,
        capsuleId
    };
};

/**
 * Check if a capsule is ready to be opened
 * @param capsuleId - ID of the capsule to check
 * @param provider - Web3 provider
 * @returns Whether the capsule is ready to open
 */
export const isReadyToOpen = async (
    capsuleId: number,
    provider: ethers.providers.Web3Provider
): Promise<boolean> => {
    const contract = getTimeCapsuleContract(provider);
    if (!contract) throw new Error('Contract not initialized');

    return await contract.isReadyToOpen(capsuleId);
};

/**
 * Get capsule information
 * @param capsuleId - ID of the capsule
 * @param provider - Web3 provider
 * @returns Capsule information
 */
export const getCapsuleInfo = async (
    capsuleId: number,
    provider: ethers.providers.Web3Provider
): Promise<{
    id: number;
    title: string;
    contentHash: string;
    creator: string;
    recipient: string;
    creationTime: Date;
    openTime: Date;
    status: string;
    conditionType: string;
    ethBalance: string;
    assets: Array<{
        tokenAddress: string;
        tokenId: string;
        amount: string;
        isNFT: boolean;
        isApproved: boolean;
        transferType: string;
    }>;
}> => {
    const contract = getTimeCapsuleContract(provider);
    if (!contract) throw new Error('Contract not initialized');

    const info = await contract.getCapsuleInfo(capsuleId);
    const assets = await contract.getCapsuleAssets(capsuleId);

    // Format the data
    return {
        id: capsuleId,
        title: info.title,
        contentHash: info.contentHash,
        creator: info.creator,
        recipient: info.recipient,
        creationTime: new Date(info.creationTime.toNumber() * 1000),
        openTime: new Date(info.openTime.toNumber() * 1000),
        status: ['Draft', 'Pending', 'Sealed', 'ReadyToOpen', 'Opened', 'Failed'][info.status],
        conditionType: ['Time', 'MultiSig', 'Oracle', 'Compound'][info.conditionType],
        ethBalance: ethers.utils.formatEther(info.ethBalance),
        assets: assets.map((asset: any) => ({
            tokenAddress: asset.tokenAddress,
            tokenId: asset.tokenId.toString(),
            amount: asset.isNFT ? asset.tokenId.toString() : ethers.utils.formatEther(asset.amount),
            isNFT: asset.isNFT,
            isApproved: asset.isApproved,
            transferType: asset.transferType === 0 ? 'immediate' : 'conditional'
        }))
    };
};