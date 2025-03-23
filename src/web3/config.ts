// Contract addresses
export const CONTRACT_ADDRESSES = {
  // Default to localhost addresses if environment variables not provided
  AIONIOS_CAPSULE: process.env.NEXT_PUBLIC_AIONIOS_CAPSULE_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
};

// Chain IDs
export const CHAIN_IDS = {
  ETHEREUM_MAINNET: 1,
  GOERLI: 5,
  SEPOLIA: 11155111,
  POLYGON: 137,
  MUMBAI: 80001,
  LOCALHOST: 1337,
  HARDHAT: 31337,
};

// Network details
export const NETWORKS = {
  [CHAIN_IDS.ETHEREUM_MAINNET]: {
    name: 'Ethereum Mainnet',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
  },
  [CHAIN_IDS.GOERLI]: {
    name: 'Goerli Testnet',
    currency: 'ETH',
    explorerUrl: 'https://goerli.etherscan.io',
  },
  [CHAIN_IDS.SEPOLIA]: {
    name: 'Sepolia Testnet',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
  },
  [CHAIN_IDS.POLYGON]: {
    name: 'Polygon Mainnet',
    currency: 'MATIC',
    explorerUrl: 'https://polygonscan.com',
  },
  [CHAIN_IDS.MUMBAI]: {
    name: 'Mumbai Testnet',
    currency: 'MATIC',
    explorerUrl: 'https://mumbai.polygonscan.com',
  },
  [CHAIN_IDS.LOCALHOST]: {
    name: 'Localhost',
    currency: 'ETH',
    explorerUrl: '',
  },
  [CHAIN_IDS.HARDHAT]: {
    name: 'Hardhat',
    currency: 'ETH',
    explorerUrl: '',
  },
};

// API URLs
export const API_URLS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  IPFS_GATEWAY: process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.ipfs.io/ipfs/',
};