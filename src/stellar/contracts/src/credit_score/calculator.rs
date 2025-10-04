use soroban_sdk::Env;
use crate::types::{RiskLevel, PaymentRecord};

// Pesos para cálculo do score
const ON_CHAIN_WEIGHT: u32 = 60; // 60% do score
const OFF_CHAIN_WEIGHT: u32 = 40; // 40% do score

const PAYMENT_HISTORY_WEIGHT: u32 = 40;
const PUNCTUALITY_WEIGHT: u32 = 30;
const VOLUME_WEIGHT: u32 = 20;
const REPUTATION_WEIGHT: u32 = 10;

pub fn calculate_on_chain_score(
    payment_history: &soroban_sdk::Vec<PaymentRecord>,
    total_volume: i128,
    env: &Env,
) -> u32 {
    if payment_history.is_empty() {
        return 0;
    }

    // Calcular taxa de pagamentos em dia
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

    // Score baseado no histórico (número de transações completadas)
    let history_score = if total_payments > 50 {
        100
    } else {
        (total_payments * 2).min(100)
    };

    // Score baseado no volume transacionado (normalizado)
    let volume_score = if total_volume > 100_000_0000000 { // > 100k
        100
    } else if total_volume > 10_000_0000000 { // > 10k
        75
    } else if total_volume > 1_000_0000000 { // > 1k
        50
    } else {
        25
    };

    // Reputação (simplificado - pode ser expandido)
    let reputation_score = if punctuality_score > 90 && total_payments > 10 {
        100
    } else if punctuality_score > 75 {
        75
    } else {
        50
    };

    // Calcular score ponderado
    let weighted_score = 
        (history_score * PAYMENT_HISTORY_WEIGHT +
         punctuality_score * PUNCTUALITY_WEIGHT +
         volume_score * VOLUME_WEIGHT +
         reputation_score * REPUTATION_WEIGHT) / 100;

    weighted_score.min(100)
}

pub fn calculate_off_chain_score(
    has_bank_statements: bool,
    has_pix_history: bool,
    has_invoices: bool,
    has_credit_bureau: bool,
    credit_bureau_score: u32,
) -> u32 {
    let mut score = 0u32;

    // Pontos por ter dados verificados
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
        // Score do birô normalizado (assumindo range 0-1000)
        score += (credit_bureau_score * 40) / 1000;
    }

    score.min(100)
}

pub fn calculate_final_score(on_chain_score: u32, off_chain_score: u32) -> u32 {
    let final_score = 
        (on_chain_score * ON_CHAIN_WEIGHT + off_chain_score * OFF_CHAIN_WEIGHT) / 100;
    
    final_score.min(100)
}

pub fn determine_risk_level(score: u32) -> RiskLevel {
    if score >= 70 {
        RiskLevel::Low
    } else if score >= 40 {
        RiskLevel::Medium
    } else {
        RiskLevel::High
    }
}