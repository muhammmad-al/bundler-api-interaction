# Gelato Bundler API Interaction

A comprehensive collection of scripts to interact with Gelato's Account Abstraction (AA) bundler API endpoints. This project demonstrates how to use various ERC-4337 bundler methods.

## 🎯 Overview

This project provides TypeScript examples for all major Gelato bundler API endpoints, showing how to:
- Send UserOperations
- Estimate gas costs
- Query operation status and receipts
- Get gas prices and supported entry points
- Check bundler chain compatibility

## 🏗️ Project Structure

```
bundler-api-interaction/
├── eth_chainId/                           # Chain ID verification
│   └── checkBundlerChainId.ts
├── eth_sendUserOperation/                 # Send UserOperations
│   └── sendUserOp1Balance.ts
├── eth_estimateUserOperationGas/          # Gas estimation
│   └── estimateUserOperationGas.ts
├── eth_getUserOperationByHash/            # Query by hash
│   └── getUserOperationByHash.ts
├── eth_getUserOperationReceipt/           # Get receipts
│   └── getUserOperationReceipt.ts
├── eth_maxPriorityFeePerGas/              # Priority fee info
│   └── maxPriorityFeePerGas.ts
├── eth_supportedEntryPoints/              # Supported entry points
│   └── supportedEntryPoints.ts
├── eth_getUserOperationGasPrice/          # Gas price info
│   └── getUserOperationGasPrice.ts
├── package.json
└── README.md
```

## 🚀 Available Commands

```bash
# Check bundler chain ID
pnpm run check-chain

# Send UserOperation (sponsored by 1Balance)
pnpm run send-userop

# Estimate gas costs for UserOperation
pnpm run estimate-gas

# Get UserOperation by hash
HASH=0xabc123... pnpm run get-userop

# Get UserOperation receipt
HASH=0xabc123... pnpm run get-receipt

# Get max priority fee per gas
pnpm run max-priority-fee

# Get supported entry points
pnpm run supported-entrypoints

# Get UserOperation gas price
pnpm run userop-gas-price
```

## 🔧 Environment Setup

Create a `.env` file in the project root:

```env
# Required for most operations
PRIVATE_KEY=0x...                    # Your private key
RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Gelato API keys (for sponsored transactions)
GELATO_API_KEY=your_gelato_api_key
SPONSOR_API_KEY=your_gelato_api_key  # Alternative name

# Optional: Chain configuration
CHAIN_ID=11155111                    # Default: Ethereum Sepolia

# For native fee mode (when not using sponsorship)
PAY_NATIVE=true
```

## 📋 API Endpoints Covered

### 1. **eth_chainId** - Chain Verification
- **Purpose**: Verify the chain ID that the bundler is serving
- **Script**: `eth_chainId/checkBundlerChainId.ts`
- **Command**: `pnpm run check-chain`

### 2. **eth_sendUserOperation** - Send UserOperations
- **Purpose**: Submit UserOperations to the bundler for processing
- **Script**: `eth_sendUserOperation/sendUserOp1Balance.ts`
- **Command**: `pnpm run send-userop`
- **Features**: 
  - Uses Safe smart wallet with Permissionless.js
  - Sponsored by 1Balance (zero gas fees)
  - Kernel account with ECDSA validator

### 3. **eth_estimateUserOperationGas** - Gas Estimation
- **Purpose**: Estimate gas costs for UserOperations before sending
- **Script**: `eth_estimateUserOperationGas/estimateUserOperationGas.ts`
- **Command**: `pnpm run estimate-gas`
- **Features**:
  - Safe smart wallet integration
  - Handles both deployed and counterfactual accounts
  - Zero gas cost estimation for sponsored operations

### 4. **eth_getUserOperationByHash** - Query by Hash
- **Purpose**: Retrieve UserOperation details by its hash
- **Script**: `eth_getUserOperationByHash/getUserOperationByHash.ts`
- **Command**: `HASH=0xabc123... pnpm run get-userop`

### 5. **eth_getUserOperationReceipt** - Get Receipts
- **Purpose**: Get transaction receipt for completed UserOperations
- **Script**: `eth_getUserOperationReceipt/getUserOperationReceipt.ts`
- **Command**: `HASH=0xabc123... pnpm run get-receipt`

### 6. **eth_maxPriorityFeePerGas** - Priority Fee Info
- **Purpose**: Get current max priority fee per gas
- **Script**: `eth_maxPriorityFeePerGas/maxPriorityFeePerGas.ts`
- **Command**: `pnpm run max-priority-fee`

### 7. **eth_supportedEntryPoints** - Entry Point Support
- **Purpose**: List supported entry point contracts
- **Script**: `eth_supportedEntryPoints/supportedEntryPoints.ts`
- **Command**: `pnpm run supported-entrypoints`

### 8. **eth_getUserOperationGasPrice** - Gas Price Info
- **Purpose**: Get recommended gas prices for UserOperations
- **Script**: `eth_getUserOperationGasPrice/getUserOperationGasPrice.ts`
- **Command**: `pnpm run userop-gas-price`
- **Features**:
  - Supports both sponsored and native fee modes
  - Returns both maxPriorityFeePerGas and maxFeePerGas

## 🛡️ Smart Wallet Integration

### Safe Wallet with Permissionless.js

The examples use Safe smart wallets created with Permissionless.js:

```typescript
import { toSafeSmartAccount } from 'permissionless/accounts';

const account = await toSafeSmartAccount({
  client: publicClient,
  entryPoint: { address: ENTRY_POINT, version: '0.7' },
  owners: [signer],
  saltNonce: 0n,
  version: '1.4.1',
});
```

## 🔑 Key Features

- **Sponsored Transactions**: All examples support 1Balance sponsorship for zero gas fees
- **Native Fee Mode**: Option to pay gas fees natively when sponsorship is not available
- **Multi-Chain Support**: Configurable for different networks (default: Ethereum Sepolia)
- **TypeScript**: Full type safety and IntelliSense support
- **Error Handling**: Comprehensive error handling and user feedback
- **Gas Optimization**: Automatic gas estimation and optimization

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your keys and configuration
   ```

3. **Run examples**:
   ```bash
   # Check if bundler is working
   pnpm run check-chain
   
   # Send a UserOperation
   pnpm run send-userop
   ```

## 📚 Dependencies

- **viem**: Ethereum client and utilities
- **permissionless**: Account abstraction utilities
- **dotenv**: Environment variable management

## 🔗 Useful Links

- [Gelato Documentation](https://docs.gelato.network/)
- [1Balance Sponsorship](https://docs.gelato.network/developer-services/1balance)
- [ERC-4337 Specification](https://eips.ethereum.org/EIPS/eip-4337)
- [Permissionless.js](https://permissionless.js.org/)
- [Safe Documentation](https://docs.safe.global/)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the [MIT License](LICENSE). 