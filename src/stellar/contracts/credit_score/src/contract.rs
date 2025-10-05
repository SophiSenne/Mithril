use soroban_sdk::{contract, contractimpl, Address, Env};

mod types;
mod storage;
mod calculator;

use types::{CreditScore, PaymentRecord, OffChainData, RiskLevel};
use storage::{get_credit_score, set_credit_score, add_payment_record, get_payment_history};
use calculator::{calculate_on_chain_score, calculate_off_chain_score, calculate_final_score, determine_risk_level};

#[contract]
pub struct CreditScoreContract;

#[contractimpl]
impl CreditScoreContract {
    /// Inicializa o contrato
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&"ADMIN", &admin);
    }

    /// Cria ou atualiza o score de crédito de um usuário
    pub fn update_credit_score(
        env: Env,
        user: Address,
        off_chain_data: OffChainData,
        credit_bureau_score: u32,
    ) -> CreditScore {
        user.require_auth();

        // Buscar ou criar score existente
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

        // Obter histórico de pagamentos
        let payment_history = get_payment_history(&env, &user)
            .unwrap_or(soroban_sdk::Vec::new(&env));

        // Calcular volume total transacionado
        let mut total_volume: i128 = 0;
        for i in 0..payment_history.len() {
            if let Some(record) = payment_history.get(i) {
                total_volume += record.amount;
            }
        }

        // Calcular scores
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

        // Atualizar score
        score.on_chain_score = on_chain;
        score.off_chain_score = off_chain;
        score.score = final_score;
        score.risk_level = risk;
        score.payment_history = payment_history.len();
        score.last_updated = env.ledger().timestamp();

        set_credit_score(&env, &score);
        score
    }

    /// Registra um pagamento realizado
    pub fn record_payment(
        env: Env,
        user: Address,
        loan_id: u64,
        amount: i128,
        on_time: bool,
    ) {
        // Apenas o contrato de empréstimo pode chamar
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

        // Atualizar contador de transações
        if let Some(mut score) = get_credit_score(&env, &user) {
            score.total_transactions += 1;
            if !on_time {
                score.default_count += 1;
            }
            set_credit_score(&env, &score);
        }
    }

    /// Obtém o score de crédito de um usuário
    pub fn get_score(env: Env, user: Address) -> Option<CreditScore> {
        get_credit_score(&env, &user)
    }

    /// Verifica se um usuário pode tomar empréstimo baseado no score
    pub fn can_borrow(env: Env, user: Address, amount: i128) -> bool {
        if let Some(score) = get_credit_score(&env, &user) {
            // Usuários com score baixo não podem emprestar valores altos
            match score.risk_level {
                RiskLevel::Low => true,
                RiskLevel::Medium => amount <= 50_000_0000000, // até 50k
                RiskLevel::High => amount <= 10_000_0000000,   // até 10k
            }
        } else {
            // Novos usuários podem emprestar valores pequenos
            amount <= 5_000_0000000 // até 5k
        }
    }

    /// Define o contrato de empréstimo autorizado
    pub fn set_loan_contract(env: Env, loan_contract: Address) {
        let admin: Address = env.storage()
            .instance()
            .get(&"ADMIN")
            .expect("Admin not set");
        admin.require_auth();

        env.storage().instance().set(&"LOAN_CONTRACT", &loan_contract);
    }

    /// Obtém o histórico de pagamentos de um usuário
    pub fn get_payment_history(env: Env, user: Address) -> Option<soroban_sdk::Vec<PaymentRecord>> {
        get_payment_history(&env, &user)
    }
}