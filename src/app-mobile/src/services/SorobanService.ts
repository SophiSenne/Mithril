import { blockchainConfig } from '../config/blockchain';

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params?: any;
}

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RPC ${res.status}: ${text}`);
  }
  return res.json();
}

export class SorobanService {
  static async getCreditScore(userPublicKey: string) {
    const contractId = blockchainConfig.contracts.creditScore;
    if (!contractId) throw new Error('CREDIT_SCORE contract não configurado');

    // Minimalistic contract read via simulateTransaction is non-trivial without client libs.
    // Here we rely on a backend or future client; for now, return null to keep app stable.
    // You can replace this with a backend proxy call.
    return null;
  }
}
