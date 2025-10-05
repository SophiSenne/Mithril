use soroban_sdk::{contracttype, Address, String};

#[derive(Clone)]
#[contracttype]
pub enum RiskLevel {
    Low,
    Medium,
    High,
}

#[derive(Clone)]
#[contracttype]
pub struct CreditScore {
    pub user: Address,
    pub score: u32,
    pub risk_level: RiskLevel,
    pub on_chain_score: u32,
    pub off_chain_score: u32,
    pub payment_history: u32,
    pub total_transactions: u32,
    pub default_count: u32,
    pub last_updated: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct PaymentRecord {
    pub loan_id: u64,
    pub amount: i128,
    pub on_time: bool,
    pub timestamp: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct OffChainData {
    pub bank_statements: bool,
    pub pix_history: bool,
    pub invoices: bool,
    pub credit_bureau: bool,
}