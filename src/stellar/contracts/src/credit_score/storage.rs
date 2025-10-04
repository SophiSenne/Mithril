use soroban_sdk::{Address, Env};
use crate::types::{CreditScore, PaymentRecord};

const CREDIT_SCORE_KEY: &str = "SCORE";
const PAYMENT_HISTORY_KEY: &str = "PAYMENTS";
const TOTAL_USERS_KEY: &str = "TOTAL_USERS";

pub fn get_credit_score(env: &Env, user: &Address) -> Option<CreditScore> {
    let key = (CREDIT_SCORE_KEY, user.clone());
    env.storage().persistent().get(&key)
}

pub fn set_credit_score(env: &Env, score: &CreditScore) {
    let key = (CREDIT_SCORE_KEY, score.user.clone());
    env.storage().persistent().set(&key, score);
}

pub fn get_payment_history(env: &Env, user: &Address) -> Option<soroban_sdk::Vec<PaymentRecord>> {
    let key = (PAYMENT_HISTORY_KEY, user.clone());
    env.storage().persistent().get(&key)
}

pub fn add_payment_record(env: &Env, user: &Address, record: PaymentRecord) {
    let key = (PAYMENT_HISTORY_KEY, user.clone());
    let mut history: soroban_sdk::Vec<PaymentRecord> = env.storage()
        .persistent()
        .get(&key)
        .unwrap_or(soroban_sdk::Vec::new(env));
    
    history.push_back(record);
    env.storage().persistent().set(&key, &history);
}

pub fn increment_total_users(env: &Env) -> u32 {
    let current: u32 = env.storage()
        .instance()
        .get(&TOTAL_USERS_KEY)
        .unwrap_or(0);
    let new_total = current + 1;
    env.storage().instance().set(&TOTAL_USERS_KEY, &new_total);
    new_total
}

pub fn get_total_users(env: &Env) -> u32 {
    env.storage().instance().get(&TOTAL_USERS_KEY).unwrap_or(0)
}