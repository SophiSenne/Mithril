#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Vec};

// ==================== TYPES ====================

#[derive(Clone, Debug)]
#[contracttype]
pub enum RiskLevel {
    Low,
    Medium,
    High,
}

#[derive(Clone, Debug)]
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

// ==================== STORAGE ====================

const CREDIT_SCORE_KEY: &str = "SCORE";
const PAYMENT_HISTORY_KEY: &str = "PAYMENTS";

fn get_credit_score(env: &Env, user: &Address) -> Option<CreditScore> {
    let key = (CREDIT_SCORE_KEY, user.clone());
    env.storage().persistent().get(&key)
}

fn set_credit_score(env: &Env, score: &CreditScore) {
    let key = (CREDIT_SCORE_KEY, score.user.clone());
    env.storage().persistent().set(&key, score);
}

fn get_payment_history(env: &Env, user: &Address) -> Option<Vec<PaymentRecord>> {
    let key = (PAYMENT_HISTORY_KEY, user.clone());
    env.storage().persistent().get(&key)
}

fn add_payment_record(env: &Env, user: &Address, record: PaymentRecord) {
    let key = (PAYMENT_HISTORY_KEY, user.clone());
    let mut history: Vec<PaymentRecord> = env.storage()
        .persistent()
        .get(&key)
        .unwrap_or(Vec::new(env));
    
    history.push_back(record);
    env.storage().persistent().set(&key, &history);
}

// ==================== CALCULATOR ====================

const ON_CHAIN_WEIGHT: u32 = 60;
const OFF_CHAIN_WEIGHT: u32 = 40;
const PAYMENT_HISTORY_WEIGHT: u32 = 40;
const PUNCTUALITY_WEIGHT: u32 = 30;
const VOLUME_WEIGHT: u32 = 20;
const REPUTATION_WEIGHT: u32 = 10;

fn calculate_on_chain_score(
    payment_history: &Vec<PaymentRecord>,
    total_volume: i128,
    _env: &Env,
) -> u32 {
    if payment_history.is_empty() {
        return 0;
    }

    let mut on_time_count = 0u32;
    for i in 0..payment_history.len() {
        if let Some(record) = payment_history.get(i) {
            if record.on_time {
                on_time_count += 1;
            }
        }
    }
    
    let total_payments = payment_history.len();
    let punctuality_score = if total_payments > 0 {
        (on_time_count * 100) / total_payments
    } else {
        0
    };

    let history_score = if total_payments > 50 {
        100
    } else {
        (total_payments * 2).min(100)
    };

    let volume_score = if total_volume > 100_000_0000000 {
        100
    } else if total_volume > 10_000_0000000 {
        75
    } else if total_volume > 1_000_0000000 {
        50
    } else {
        25
    };

    let reputation_score = if punctuality_score > 90 && total_payments > 10 {
        100
    } else if punctuality_score > 75 {
        75
    } else {
        50
    };

    let weighted_score = 
        (history_score * PAYMENT_HISTORY_WEIGHT +
         punctuality_score * PUNCTUALITY_WEIGHT +
         volume_score * VOLUME_WEIGHT +
         reputation_score * REPUTATION_WEIGHT) / 100;

    weighted_score.min(100)
}

fn calculate_off_chain_score(
    has_bank_statements: bool,
    has_pix_history: bool,
    has_invoices: bool,
    has_credit_bureau: bool,
    credit_bureau_score: u32,
) -> u32 {
    let mut score = 0u32;

    if has_bank_statements {
        score += 20;
    }
    if has_pix_history {
        score += 20;
    }
    if has_invoices {
        score += 20;
    }
    if has_credit_bureau {
        score += (credit_bureau_score * 40) / 1000;
    }

    score.min(100)
}

fn calculate_final_score(on_chain_score: u32, off_chain_score: u32) -> u32 {
    let final_score = 
        (on_chain_score * ON_CHAIN_WEIGHT + off_chain_score * OFF_CHAIN_WEIGHT) / 100;
    
    final_score.min(100)
}

fn determine_risk_level(score: u32) -> RiskLevel {
    if score >= 70 {
        RiskLevel::Low
    } else if score >= 40 {
        RiskLevel::Medium
    } else {
        RiskLevel::High
    }
}

// ==================== CONTRACT ====================

#[contract]
pub struct CreditScoreContract;

#[contractimpl]
impl CreditScoreContract {
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&"ADMIN", &admin);
    }

    pub fn update_credit_score(
        env: Env,
        user: Address,
        off_chain_data: OffChainData,
        credit_bureau_score: u32,
    ) -> CreditScore {
        user.require_auth();

        let mut score = get_credit_score(&env, &user).unwrap_or(CreditScore {
            user: user.clone(),
            score: 0,
            risk_level: RiskLevel::High,
            on_chain_score: 0,
            off_chain_score: 0,
            payment_history: 0,
            total_transactions: 0,
            default_count: 0,
            last_updated: env.ledger().timestamp(),
        });

        let payment_history = get_payment_history(&env, &user)
            .unwrap_or(Vec::new(&env));

        let mut total_volume: i128 = 0;
        for i in 0..payment_history.len() {
            if let Some(record) = payment_history.get(i) {
                total_volume += record.amount;
            }
        }

        let on_chain = calculate_on_chain_score(&payment_history, total_volume, &env);
        let off_chain = calculate_off_chain_score(
            off_chain_data.bank_statements,
            off_chain_data.pix_history,
            off_chain_data.invoices,
            off_chain_data.credit_bureau,
            credit_bureau_score,
        );
        
        let final_score = calculate_final_score(on_chain, off_chain);
        let risk = determine_risk_level(final_score);

        score.on_chain_score = on_chain;
        score.off_chain_score = off_chain;
        score.score = final_score;
        score.risk_level = risk;
        score.payment_history = payment_history.len();
        score.last_updated = env.ledger().timestamp();

        set_credit_score(&env, &score);
        score
    }

    pub fn record_payment(
        env: Env,
        user: Address,
        loan_id: u64,
        amount: i128,
        on_time: bool,
    ) {
        let loan_contract: Address = env.storage()
            .instance()
            .get(&"LOAN_CONTRACT")
            .expect("Loan contract not set");
        loan_contract.require_auth();

        let record = PaymentRecord {
            loan_id,
            amount,
            on_time,
            timestamp: env.ledger().timestamp(),
        };

        add_payment_record(&env, &user, record);

        if let Some(mut score) = get_credit_score(&env, &user) {
            score.total_transactions += 1;
            if !on_time {
                score.default_count += 1;
            }
            set_credit_score(&env, &score);
        }
    }

    pub fn get_score(env: Env, user: Address) -> Option<CreditScore> {
        get_credit_score(&env, &user)
    }

    pub fn can_borrow(env: Env, user: Address, amount: i128) -> bool {
        if let Some(score) = get_credit_score(&env, &user) {
            match score.risk_level {
                RiskLevel::Low => true,
                RiskLevel::Medium => amount <= 50_000_0000000,
                RiskLevel::High => amount <= 10_000_0000000,
            }
        } else {
            amount <= 5_000_0000000
        }
    }

    pub fn set_loan_contract(env: Env, loan_contract: Address) {
        let admin: Address = env.storage()
            .instance()
            .get(&"ADMIN")
            .expect("Admin not set");
        admin.require_auth();

        env.storage().instance().set(&"LOAN_CONTRACT", &loan_contract);
    }

    pub fn get_payment_history(env: Env, user: Address) -> Option<Vec<PaymentRecord>> {
        get_payment_history(&env, &user)
    }
}