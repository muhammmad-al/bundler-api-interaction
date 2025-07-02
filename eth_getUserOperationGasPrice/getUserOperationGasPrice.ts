/**************************************************************************
 *  eth_getUserOperationGasPrice – sponsored vs native mode toggle         *
 *                                                                        *
 *  ENV:                                                                   *
 *    PAY_NATIVE      "true" → no sponsor key → real gas price            *
 *    GELATO_API_KEY  1Balance key (ignored when PAY_NATIVE=true)         *
 *    CHAIN_ID        default 11155111 (Sepolia)                          *
 **************************************************************************/
import 'dotenv/config';

const payNative = process.env.PAY_NATIVE === 'true';
const chainId   = process.env.CHAIN_ID  ?? '11155111';
const apiKey    = process.env.GELATO_API_KEY ?? '';

if (!payNative && !apiKey)
  throw new Error('GELATO_API_KEY missing (or set PAY_NATIVE=true)');

const bundlerUrl =
  `https://api.gelato.digital/bundlers/${chainId}/rpc` +
  (payNative ? '' : `?sponsorApiKey=${apiKey}`);

const body = {
  id: 1,
  jsonrpc: '2.0',
  method: 'eth_getUserOperationGasPrice',
  params: [],
};

const toGwei = (x: `0x${string}`) => parseInt(x, 16) / 1e9;

(async () => {
  console.log(
    `➡️  Requesting gas price (${payNative ? 'native mode' : 'sponsored'}) …`
  );
  const { result, error } = await fetch(bundlerUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json());

  if (result) {
    console.log('✅  Response:');
    console.log(
      `   maxPriorityFeePerGas: ${result.maxPriorityFeePerGas}  (~${toGwei(
        result.maxPriorityFeePerGas
      )} gwei)`
    );
    console.log(
      `   maxFeePerGas:        ${result.maxFeePerGas}  (~${toGwei(
        result.maxFeePerGas
      )} gwei)`
    );
  } else {
    console.error('❌  Gelato error:\n', error);
    process.exit(1);
  }
})();
