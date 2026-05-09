# chama-sdk

A powerful, easy-to-use TypeScript/JavaScript SDK for interacting with the **ChamaVault** (Trustless Rotating Savings Circles) and **ChamaMiner** (On-Chain Yield Farming) smart contracts on the Celo Network.

## Features

- 🔄 **ChamaVault API**: Create, join, and manage your savings circles (Chama/Susu/Tontine).
- ⛏️ **ChamaMiner API**: Deposit cUSD, mine yield, harvest rewards, and upgrade your farming tier.
- ⚡ **Ethers.js Ready**: Seamlessly integrates with any standard `ethers.js` provider or signer.
- 📘 **TypeScript Support**: Full typing for predictable contract interactions.

## Installation

Install the package via npm:

```bash
npm install chama-sdk ethers
```

## Quick Start

### 1. Initialization

Import `ChamaSDK` and instantiate it with your `ethers.js` provider or signer, along with the addresses for your deployed `ChamaVault` and `ChamaMiner` contracts.

```typescript
import { ethers } from "ethers";
import { ChamaSDK } from "chama-sdk";

// 1. Setup your provider (e.g., using MetaMask or a custom RPC)
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// 2. Initialize the SDK
const VAULT_ADDRESS = "0xYourVaultContractAddress";
const MINER_ADDRESS = "0xYourMinerContractAddress";

const chamaSDK = new ChamaSDK(signer, VAULT_ADDRESS, MINER_ADDRESS);
```

### 2. Using ChamaVault

**Create a new Chama (Savings Circle):**
```typescript
const name = "Weekly Celo Savers";
const tokenAddress = "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // cUSD on Celo
const amount = ethers.parseUnits("10", 18); // 10 cUSD per round
const frequency = 86400 * 7; // 7 days (in seconds)
const maxMembers = 5;

const tx = await chamaSDK.createChama(name, tokenAddress, amount, frequency, maxMembers);
await tx.wait();
console.log("Chama created!");
```

**Join an existing Chama:**
```typescript
const chamaId = 0;
const tx = await chamaSDK.joinChama(chamaId);
await tx.wait();
```

**Contribute to a Round:**
```typescript
const tx = await chamaSDK.contribute(chamaId);
await tx.wait();
```

### 3. Using ChamaMiner

**Deposit cUSD for Yield Farming:**
```typescript
const depositAmount = ethers.parseUnits("50", 18);
const tx = await chamaSDK.deposit(depositAmount);
await tx.wait();
```

**Harvest yCHAMA Rewards:**
```typescript
const tx = await chamaSDK.harvest();
await tx.wait();
```

**Upgrade Your Farming Tier (0 = FREE, 1 = LITE, 2 = PRO):**
```typescript
const tx = await chamaSDK.upgradeTier(2); // Upgrade to PRO
await tx.wait();
```

## API Reference

### `ChamaVault` Methods
- `createChama(name, token, amount, frequency, maxMembers)`
- `joinChama(chamaId)`
- `contribute(chamaId)`
- `getChamaInfo(chamaId)`
- `getChamaMembers(chamaId)`
- `hasContributed(chamaId, round, member)`

### `ChamaMiner` Methods
- `deposit(amount)`
- `withdraw(amount)`
- `harvest()`
- `upgradeTier(tier)`
- `pendingRewards(account)`

## License

MIT License
