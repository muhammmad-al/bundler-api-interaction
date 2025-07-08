/**************************************************************************
 *  Sepolia · Safe (self‑funded native ETH) · eth_estimateUserOperationGas *
 *                                                                          *
 *  .env variables                                                          *
 *  ─────────────────────────────────────────────────────────────────────── *
 *  PRIVATE_KEY    Safe owner EOA (0x…)                                     *
 *  RPC_URL        HTTPS Sepolia RPC endpoint                               *
 **************************************************************************/

import 'dotenv/config';
import { createPublicClient, http } from 'viem';
import {
  createBundlerClient,
  type UserOperation as ViemUserOperation,
} from 'viem/account-abstraction';
import { privateKeyToAccount } from 'viem/accounts';
import { toSafeSmartAccount } from 'permissionless/accounts';
import { sepolia } from 'viem/chains';

// -------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------

type UserOperation = ViemUserOperation;

// -------------------------------------------------------------------------
// Constants & ENV
// -------------------------------------------------------------------------

const ENTRY_POINT = '0x0000000071727De22E5E9d8BAf0edAc6f37da032'; // v0.7
const chain       = sepolia;
const chainID     = chain.id;                                       // 11155111

const RPC_URL     = process.env.RPC_URL     ?? '';
const PRIVATE_KEY = process.env.PRIVATE_KEY ?? '';

if (!RPC_URL || !PRIVATE_KEY)
  throw new Error('Set RPC_URL & PRIVATE_KEY in .env');

// -------------------------------------------------------------------------
// 1. viem public client & signer
// -------------------------------------------------------------------------

const publicClient = createPublicClient({ chain, transport: http(RPC_URL) });
const signer       = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

// -------------------------------------------------------------------------
// 2. Safe smart account (permissionless.js wrapper)
// -------------------------------------------------------------------------

const account = await toSafeSmartAccount({
  client: publicClient,
  entryPoint: { address: ENTRY_POINT, version: '0.7' },
  owners: [signer],
  saltNonce: 0n,
  version: '1.4.1',
});
console.log('Safe address:', account.address);

// -------------------------------------------------------------------------
// 3. Bundler client (helpers only)
// -------------------------------------------------------------------------

const bundlerUrl = `https://api.gelato.digital/bundlers/${chainID}/rpc`;

const bundlerClient = createBundlerClient({
  client: publicClient,
  transport: http(bundlerUrl),
});

// -------------------------------------------------------------------------
// 4. Prepare blank-fee UserOperation (self‑funded)
// -------------------------------------------------------------------------

let userOp: UserOperation = await bundlerClient.prepareUserOperation({
  account,
  calls: [{ to: account.address, value: 0n, data: '0x' }], // no‑op ping
  maxFeePerGas: 0n,
  maxPriorityFeePerGas: 0n,
});

userOp = {
  ...userOp,
  preVerificationGas: 0n,
  maxFeePerGas: 0n,
  maxPriorityFeePerGas: 0n,
  // self‑funded → no paymaster fields
};

// -------------------------------------------------------------------------
// 5. Shape payload for v0.7 RPC spec
// -------------------------------------------------------------------------

const toHex = (n: bigint) => `0x${n.toString(16)}` as const;

const rpcUserOp: any = {
  sender:                userOp.sender,
  nonce:                 toHex(userOp.nonce),
  callData:              userOp.callData,
  callGasLimit:          toHex(userOp.callGasLimit),
  verificationGasLimit:  toHex(userOp.verificationGasLimit),
  preVerificationGas:    toHex(userOp.preVerificationGas),
  maxFeePerGas:          '0x0',
  maxPriorityFeePerGas:  '0x0',
  signature:             userOp.signature, // dummy for estimation
};

if (userOp.factory && userOp.factory !== '0x') {
  rpcUserOp.factory     = userOp.factory;
  rpcUserOp.factoryData = userOp.factoryData ?? '0x';
}

// -------------------------------------------------------------------------
// 6. Call eth_estimateUserOperationGas
// -------------------------------------------------------------------------

console.log('\n➡️  Requesting gas estimation …');
const res = await fetch(bundlerUrl, {
  method : 'POST',
  headers: { 'content-type': 'application/json' },
  body   : JSON.stringify({
    id: 1,
    jsonrpc: '2.0',
    method: 'eth_estimateUserOperationGas',
    params: [rpcUserOp, ENTRY_POINT],
  }),
}).then(r => r.json());

if (res.result) {
  const gas = res.result as {
    preVerificationGas: `0x${string}`;
    callGasLimit: `0x${string}`;
    verificationGasLimit: `0x${string}`;
  };
  console.log('✅  Estimated gas:', gas);
} else {
  console.error('❌  Bundler error:\n', res.error || res);
  process.exit(1);
}
