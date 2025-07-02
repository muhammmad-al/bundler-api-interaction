/**************************************************************************
 *  Gelato bundler → eth_maxPriorityFeePerGas                              *
 *                                                                        *
 *  ENV required                                                          *
 *  ────────────────────────────────────────────────────────────────────── *
 *  GELATO_API_KEY   1Balance sponsor key (or leave blank for native pay) *
 *  CHAIN_ID         default 11155111 (Sepolia)                           *
 **************************************************************************/
import 'dotenv/config';

const apiKey  = process.env.GELATO_API_KEY ?? '';   // key is optional here
const chainId = process.env.CHAIN_ID ?? '11155111'; // Sepolia default

const bundlerUrl =
  `https://api.gelato.digital/bundlers/${chainId}/rpc` +
  (apiKey ? `?sponsorApiKey=${apiKey}` : '');

const body = {
  id: 1,
  jsonrpc: '2.0',
  method: 'eth_maxPriorityFeePerGas',
  params: [],
};

(async () => {
  console.log('➡️  Requesting maxPriorityFee …');
  const res = await fetch(bundlerUrl, {
    method : 'POST',
    headers: { 'content-type': 'application/json' },
    body   : JSON.stringify(body),
  }).then(r => r.json());

  if (res.result) {
    const gwei = parseInt(res.result, 16) / 1e9;
    console.log(`✅  maxPriorityFeePerGas: ${res.result}  (~${gwei} gwei)`);
  } else {
    console.error('❌  Gelato error:\n', res.error || res);
    process.exit(1);
  }
})(); 