use soroban_sdk::contracttype;

#[derive(Clone)]
#[contracttype]
pub struct FeeConfig {
    pub transaction_fee: u32,  // Taxa de transação em basis points (ex: 50 = 0.5%)
    pub gas_fee: u32,          // Taxa de gás em basis points (ex: 10 = 0.1%)
    pub last_updated: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct ProtectionFund {
    pub total_balance: i128,   // Saldo total do fundo de proteção
    pub total_claims: u32,     // Total de reivindicações processadas
    pub active_claims: u32,    // Reivindicações ativas
}

impl FeeConfig {
    pub fn calculate_transaction_fee(&self, amount: i128) -> i128 {
        (amount * self.transaction_fee as i128) / 10000
    }

    pub fn calculate_gas_fee(&self, amount: i128) -> i128 {
        (amount * self.gas_fee as i128) / 10000
    }
}