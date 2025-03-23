# AIONIOS Frontend

Frontend application for the AIONIOS blockchain time capsule project.

## Overview

This React.js application provides the user interface for creating, managing, and interacting with blockchain-based time capsules. The frontend focuses on delivering an emotionally meaningful and user-friendly experience for preserving digital memories and assets.

## Features

- Modern, responsive interface for creating time capsules
- Simplified creation process (under 10 minutes)
- Integration with Web3.js/ethers.js for connecting wallets
- Dynamic visualization of NFTs and capsule states
- Emotionally engaging experience for creating meaningful digital memories

## Tech Stack

- **React.js** - Modern UI framework
- **Web3.js/ethers.js** - Blockchain interaction
- **CSS/SCSS** - Styling
- **Redux/Context API** - State management

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Web3 wallet (MetaMask, etc.)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd AIONIOS/frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Build for production
```bash
npm run build
# or
yarn build
```

## Key Components

- **Capsule Creation Wizard**: Streamlined process for creating new time capsules
- **Dashboard**: Overview of all user-owned time capsules
- **Capsule Viewer**: Interface for viewing and interacting with time capsules
- **Wallet Integration**: Connect with cryptocurrency wallets for transactions
- **NFT Visualization**: Display dynamic NFTs that represent capsule access

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=<smart_contract_address>
NEXT_PUBLIC_INFURA_ID=<infura_project_id>
NEXT_PUBLIC_CHAIN_ID=<blockchain_network_id>
NEXT_PUBLIC_IPFS_GATEWAY=<ipfs_gateway_url>
```

## Contributing

Please read the [CONTRIBUTING.md](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.
