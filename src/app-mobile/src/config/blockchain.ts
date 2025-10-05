const {
  EXPO_PUBLIC_SOROBAN_RPC = 'https://soroban-testnet.stellar.org',
  EXPO_PUBLIC_HORIZON_URL = 'https://horizon-testnet.stellar.org',
  EXPO_PUBLIC_NETWORK = 'testnet',
  EXPO_PUBLIC_CREDIT_SCORE_CONTRACT = '',
  EXPO_PUBLIC_GOVERNANCE_CONTRACT = '',
  EXPO_PUBLIC_LOAN_CONTRACT = '',
} = process.env as Record<string, string>;

export const blockchainConfig = {
  network: (EXPO_PUBLIC_NETWORK || 'testnet') as 'testnet' | 'mainnet',
  rpcUrl: EXPO_PUBLIC_SOROBAN_RPC,
  horizonUrl: EXPO_PUBLIC_HORIZON_URL,
  contracts: {
    creditScore: EXPO_PUBLIC_CREDIT_SCORE_CONTRACT,
    governance: EXPO_PUBLIC_GOVERNANCE_CONTRACT,
    loan: EXPO_PUBLIC_LOAN_CONTRACT,
  },
};

export type NetworkType = typeof blockchainConfig.network;
