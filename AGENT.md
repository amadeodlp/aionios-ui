# Agent Context — aionios-ui

## Vision — where this app is headed

Aionios is a Web3 time capsule platform. Users connect their MetaMask wallet, create digital capsules that lock content until a future date on-chain, and explore capsules created by others. The end goal is a fully working dApp where the blockchain is the source of truth: capsule creation writes to the contract, the unlock date is enforced by the contract, and capsule reads reflect on-chain state — with Supabase as a secondary store for off-chain metadata only.

The app's visual and structural shell is essentially complete. The remaining work is closing the gap between the UI and the actual blockchain/Supabase data flows. The agent should move the app toward a state where a user can create a capsule, receive a real tx hash, see it appear in explore, navigate to its detail page, and (if the date has passed) open it — all with real data, not mocks.

## Stack

Next.js 14 (App Router), React 18, TypeScript, Redux Toolkit, Tailwind CSS, ethers.js v6, web3-react (MetaMask), Supabase, Framer Motion

## Project structure

- `src/app/` — Next.js App Router pages: `page.tsx` (home), `capsule/[id]/`, `create/`, `explore/`, `about/`
- `src/components/` — shared UI: atoms → molecules → organisms → steps (wizard steps for capsule creation)
- `src/store/` — Redux Toolkit slices: `capsuleSlice`, `walletSlice`, `uiSlice`
- `src/services/` — `capsuleService.ts` (Supabase), `cryptoService.ts` (contract calls), `notificationService.ts`
- `src/web3/` — wallet connectors, config, ABIs
- `src/contracts/` — `AioniosCapsuleABI.json`
- `src/lib/` — `supabase.ts` client
- `src/types/` — `capsule.ts` shared types

## Key patterns

- Wallet via `@web3-react/core` + `@web3-react/metamask` — access with `useWeb3React()` hook
- Contract calls via `ethers.Contract` using ABI from `src/contracts/AioniosCapsuleABI.json` or `src/web3/abis/TimeCapsule.json`
- Redux for UI and capsule state — `useSelector` / `useDispatch`
- Supabase for off-chain metadata — always destructure `{ data, error }` and check error before use
- Framer Motion for transitions — follow existing animation patterns, don't add new ones
- Do NOT add new pages without a corresponding entry in the App Router `src/app/` directory

## Known incomplete areas — prioritize these

- `SuccessStep` — displays hardcoded `capsuleData.txHash` and `capsuleData.id` placeholders instead of the real values returned from the contract transaction; the `formData` prop does not carry tx hash or created capsule ID back from the blockchain call — thread the real values through from `cryptoService` to the step
- `src/app/capsule/[id]/` — the "Open Capsule" / "View Contents" action must check the capsule's unlock date before calling the contract; if the date has not passed, show a locked state with time remaining; if it has passed, call the contract read method
- `/dashboard` route — `SuccessStep` links here but this page does not exist in the App Router; either create a minimal dashboard page listing the user's capsules from Supabase, or reroute the link to `/explore` filtered by the connected wallet address
- Oracle compound conditions UI — currently a visual placeholder with no logic; either wire the simplest condition type (e.g. date-only) to the contract call, or replace the placeholder with a clear "coming soon" empty state so users aren't confused
