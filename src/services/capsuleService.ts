import { ethers } from 'ethers';
import AioniosCapsuleABI from '../contracts/AioniosCapsuleABI.json';
import { CONTRACT_ADDRESSES, API_URLS } from '@/web3/config';

// API Base URL
const API_BASE_URL = API_URLS.BASE_URL;
const IPFS_GATEWAY = API_URLS.IPFS_GATEWAY;
const AIONIOS_CONTRACT_ADDRESS = CONTRACT_ADDRESSES.AIONIOS_CAPSULE;

/**
 * Creates a new time capsule
 * @param capsuleData - The capsule data
 * @returns The created capsule
 */
export const createCapsule = async (capsuleData: any) => {
  try {
    // First, interact with the blockchain to create the capsule
    const blockchainId = await createCapsuleOnBlockchain(
      capsuleData.conditionType,
      capsuleData.openDate,
      capsuleData.recipients.map((r: any) => r.address),
      capsuleData.witnesses?.map((w: any) => w.address) || []
    );

    // Prepare form data for backend
    const formData = new FormData();
    
    // Add the capsule metadata
    const capsulePayload = {
      ...capsuleData,
      blockchainId,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    
    formData.append('capsule', new Blob([JSON.stringify(capsulePayload)], {
      type: 'application/json'
    }));

    // Add content file if any
    if (capsuleData.files && capsuleData.files.length > 0) {
      formData.append('content', capsuleData.files[0]);
    }

    // Send to backend
    const response = await fetch(`${API_BASE_URL}/capsules`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating capsule:", error);
    throw error;
  }
};

/**
 * Creates a capsule on the blockchain
 * @param conditionType - Type of condition (time, multisig, oracle, compound)
 * @param openDate - Date when capsule can be opened (for time condition)
 * @param recipients - Array of recipient addresses
 * @param witnesses - Array of witness addresses (for multisig condition)
 * @returns Blockchain transaction ID
 */
export const createCapsuleOnBlockchain = async (
  conditionType: string,
  openDate: Date | null,
  recipients: string[],
  witnesses: string[]
) => {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error("Ethereum provider not found");
    }

    // Get provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Create contract instance
    const contract = new ethers.Contract(
      AIONIOS_CONTRACT_ADDRESS,
      AioniosCapsuleABI,
      signer
    );

    let tx;
    // Different function calls based on condition type
    switch (conditionType) {
      case 'time':
        if (!openDate) throw new Error("Open date is required for time condition");
        const timestamp = Math.floor(openDate.getTime() / 1000);
        tx = await contract.createTimeCapsule(recipients, timestamp);
        break;
      
      case 'multisig':
        if (!witnesses || witnesses.length < 2) 
          throw new Error("At least two witnesses are required for multisig condition");
        tx = await contract.createMultisigCapsule(recipients, witnesses, witnesses.length);
        break;
      
      // Add other condition types as needed
      default:
        throw new Error(`Unsupported condition type: ${conditionType}`);
    }

    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    // Extract capsule ID from events (adjust based on your contract implementation)
    const event = receipt.events.find((e: any) => e.event === 'CapsuleCreated');
    if (!event) throw new Error("Capsule creation event not found");
    
    return event.args.capsuleId.toString();
  } catch (error) {
    console.error("Error creating capsule on blockchain:", error);
    throw error;
  }
};

/**
 * Uploads a file to IPFS
 * @param file - File to upload
 * @returns IPFS hash
 */
export const uploadToIPFS = async (file: File) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);

    // Send to backend IPFS service
    const response = await fetch(`${API_BASE_URL}/ipfs/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.hash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
};

/**
 * Gets a capsule by its ID
 * @param id - Capsule ID
 * @returns The capsule
 */
export const getCapsule = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/capsules/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting capsule:", error);
    throw error;
  }
};

/**
 * Gets capsules by creator address
 * @param address - Creator's blockchain address
 * @returns List of capsules
 */
export const getCapsulesByCreator = async (address: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/capsules/creator/${address}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting capsules by creator:", error);
    throw error;
  }
};

/**
 * Gets capsules by recipient address
 * @param address - Recipient's blockchain address
 * @returns List of capsules
 */
export const getCapsulesByRecipient = async (address: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/capsules/recipient/${address}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting capsules by recipient:", error);
    throw error;
  }
};

/**
 * Gets all capsules for an address (as creator or recipient)
 * @param address - Blockchain address
 * @returns List of capsules
 */
export const getCapsulesByAddress = async (address: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/capsules/address/${address}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting capsules by address:", error);
    throw error;
  }
};

/**
 * Attempts to open a capsule
 * @param id - Capsule ID
 * @param address - Requester's blockchain address
 * @returns The opened capsule if successful
 */
export const openCapsule = async (id: number, address: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/capsules/${id}/open?requesterAddress=${address}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error opening capsule:", error);
    throw error;
  }
};

/**
 * Gets the full URL for an IPFS hash
 * @param hash - IPFS hash
 * @returns Full URL
 */
export const getIPFSUrl = (hash: string) => {
  return `${IPFS_GATEWAY}${hash}`;
};

/**
 * Gets popular capsules
 * @param limit - Maximum number of capsules to return
 * @returns List of popular capsules
 */
export const getPopularCapsules = async (limit: number = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/capsules/explore/popular?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting popular capsules:", error);
    throw error;
  }
};

/**
 * Gets featured capsules
 * @returns List of featured capsules
 */
export const getFeaturedCapsules = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/capsules/explore/featured`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting featured capsules:", error);
    throw error;
  }
};

/**
 * Gets recently opened capsules
 * @param limit - Maximum number of capsules to return
 * @returns List of recently opened capsules
 */
export const getRecentlyOpenedCapsules = async (limit: number = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/capsules/explore/recent?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting recently opened capsules:", error);
    throw error;
  }
};

/**
 * Gets most subscribed capsules
 * @param limit - Maximum number of capsules to return
 * @returns List of most subscribed capsules
 */
export const getMostSubscribedCapsules = async (limit: number = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/capsules/explore/subscribed?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting most subscribed capsules:", error);
    throw error;
  }
};

/**
 * Increment view count for a capsule
 * @param id - Capsule ID
 * @returns Updated capsule
 */
export const incrementViewCount = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/capsules/${id}/view`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error incrementing view count:", error);
    // Don't throw error to avoid disrupting user experience
    return null;
  }
};

/**
 * Increment share count for a capsule
 * @param id - Capsule ID
 * @returns Updated capsule
 */
export const incrementShareCount = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/capsules/${id}/share`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error incrementing share count:", error);
    // Don't throw error to avoid disrupting user experience
    return null;
  }
};

/**
 * Subscribe to a capsule
 * @param id - Capsule ID
 * @param userAddress - User's blockchain address
 * @returns Updated capsule
 */
export const subscribeToCapsule = async (id: number, userAddress: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/capsules/${id}/subscribe?userAddress=${userAddress}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error subscribing to capsule:", error);
    throw error;
  }
};
