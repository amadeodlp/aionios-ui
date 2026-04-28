# Agent Context — aionios-ui

## What this app is

Aionios is a Web3 platform for creating and managing time capsules on the blockchain. Users connect their MetaMask wallet, create capsules (digital vaults that unlock at a future date), explore others' capsules, and interact with smart contracts on-chain.

## Stack

Next.js 14 (App Router), React 18, TypeScript, Redux Toolkit, Tailwind CSS, ethers.js v6, web3-react (MetaMask), Supabase, Framer Motion

## Project structure

- `src/app/` — Next.js App Router pages: `page.tsx` (home), `capsule/`, `create/`, `explore/`, `about/`
- `src/components/` — shared UI components
- `src/store/` — Redux Toolkit slices
- `src/services/` — API/blockchain service layer
- `src/web3/` — wallet connection logic (web3-react hooks)
- `src/contracts/` — ABI definitions for smart contract interaction
- `src/lib/` — utilities, Supabase client
- `src/types/` — shared TypeScript types
- `src/app/providers.tsx` — wraps app with Redux + Web3 providers

## Key patterns

- Wallet connection via `@web3-react/core` + `@web3-react/metamask` — access with `useWeb3React()` hook
- Contract calls via `ethers.Contract` using ABIs from `src/contracts/`
- State managed in Redux slices, accessed via `useSelector` / `useDispatch`
- Supabase used alongside blockchain for off-chain metadata storage
- Framer Motion used for page transitions and animations
- `react-datepicker` used for capsule unlock date selection

## Known incomplete areas — prioritize these

- Individual capsule page — check that "Open Capsule" / "View Contents" respects the unlock date and calls the contract
- SuccessStep uses a hardcoded mock `capsuleData.txHash` and `capsuleData.id` instead of the real values returned from the blockchain transaction — the `formData` prop does not carry the created capsule ID or tx hash back to the step
- Oracle compound conditions UI is a placeholder with no real logic
- Dashboard link in SuccessStep (`/dashboard`) points to a page that does not exist in the app router
