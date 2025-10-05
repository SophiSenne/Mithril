use soroban_sdk::{contract, contractimpl, token, Address, Env, String, Vec};

mod types;
mod events;

use types::{
    Loan, LoanStatus, InvestmentCard, RequestCard, CardType, 
    Payment, LoanApplication, ApplicationStatus
};
use events::{emit_loan_created, emit_payment_made, emit_loan_completed, emit_card_created};

const DAY_IN_SECONDS: u64 = 86400;

#[contract]
pub struct LoanContract;

#[contractimpl]
impl LoanContract {
    /// Inicializa o contrato
    pub fn initialize(
        env: Env,
        admin: Address,
        token: Address,
        governance_contract: Address,
        credit_score_contract: Address,
    ) {
        admin.require_auth();
        
        env.storage().instance().set(&"ADMIN", &admin);
        env.storage().instance().set(&"TOKEN", &token);
        env.storage().instance().set(&"GOVERNANCE", &governance_contract);
        env.storage().instance().set(&"CREDIT_SCORE", &credit_score_contract);
        env.storage().instance().set(&"NEXT_LOAN_ID", &1u64);
        env.storage().instance().set(&"NEXT_CARD_ID", &1u64);
        env.storage().instance().set(&"NEXT_APP_ID", &1u64);
    }

    /// Cria um card de investimento
    pub fn create_investment_card(
        env: Env,
        investor: Address,
        max_amount: i128,
        min_amount: i128,
        interest_rate: u32,
        max_installments: u32,
        target_risk_level: u32,
    ) -> u64 {
        investor.require_auth();

        let card_id: u64 = env.storage().instance().get(&"NEXT_CARD_ID").unwrap();
        
        let card = InvestmentCard {
            id: card_id,
            investor: investor.clone(),
            max_amount,
            min_amount,
            interest_rate,
            max_installments,
            target_risk_level,
            is_active: true,
            total_invested: 0,
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&("INV_CARD", card_id), &card);
        env.storage().instance().set(&"NEXT_CARD_ID", &(card_id + 1));

        emit_card_created(&env, card_id, investor, true);
        card_id
    }

    /// Cria um card de solicitação de crédito
    pub fn create_request_card(
        env: Env,
        borrower: Address,
        requested_amount: i128,
        desired_installments: u32,
        preferred_payment_dates: Vec<u64>,
        description: String,
    ) -> u64 {
        borrower.require_auth();

        let card_id: u64 = env.storage().instance().get(&"NEXT_CARD_ID").unwrap();
        
        let card = RequestCard {
            id: card_id,
            borrower: borrower.clone(),
            requested_amount,
            desired_installments,
            preferred_payment_dates,
            description,
            is_active: true,
            is_funded: false,
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&("REQ_CARD", card_id), &card);
        env.storage().instance().set(&"NEXT_CARD_ID", &(card_id + 1));

        emit_card_created(&env, card_id, borrower, false);
        card_id
    }

    /// Tomador solicita aprovação em um card de investimento
    pub fn apply_to_investment_card(
        env: Env,
        borrower: Address,
        card_id: u64,
        amount: i128,
    ) -> u64 {
        borrower.require_auth();

        // Verificar se o card existe e está ativo
        let card: InvestmentCard = env.storage()
            .persistent()
            .get(&("INV_CARD", card_id))
            .expect("Card not found");
        
        assert!(card.is_active, "Card is not active");
        assert!(amount >= card.min_amount && amount <= card.max_amount, "Amount out of range");

        // Verificar score de crédito
        let credit_score_contract: Address = env.storage()
            .instance()
            .get(&"CREDIT_SCORE")
            .unwrap();
        
        // TODO: Chamar contrato de score para verificar se pode emprestar

        let app_id: u64 = env.storage().instance().get(&"NEXT_APP_ID").unwrap();
        
        let application = LoanApplication {
            id: app_id,
            card_id,
            card_type: CardType::Investment,
            applicant: borrower,
            amount,
            status: ApplicationStatus::Pending,
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&("APP", app_id), &application);
        env.storage().instance().set(&"NEXT_APP_ID", &(app_id + 1));

        app_id
    }

    /// Investidor aprova uma aplicação
    pub fn approve_application(
        env: Env,
        app_id: u64,
        installments: u32,
        payment_dates: Vec<u64>,
    ) -> u64 {
        let mut application: LoanApplication = env.storage()
            .persistent()
            .get(&("APP", app_id))
            .expect("Application not found");

        let card: InvestmentCard = env.storage()
            .persistent()
            .get(&("INV_CARD", application.card_id))
            .expect("Card not found");

        card.investor.require_auth();

        // Criar empréstimo
        let loan_id = Self::create_loan_internal(
            &env,
            application.applicant.clone(),
            card.investor.clone(),
            application.amount,
            card.interest_rate,
            installments,
            payment_dates,
        );

        application.status = ApplicationStatus::Approved;
        env.storage().persistent().set(&("APP", app_id), &application);

        loan_id
    }

    /// Investidor financia um card de solicitação
    pub fn fund_request_card(
        env: Env,
        lender: Address,
        card_id: u64,
        interest_rate: u32,
    ) -> u64 {
        lender.require_auth();

        let mut card: RequestCard = env.storage()
            .persistent()
            .get(&("REQ_CARD", card_id))
            .expect("Card not found");

        assert!(card.is_active && !card.is_funded, "Card unavailable");

        // Criar empréstimo
        let loan_id = Self::create_loan_internal(
            &env,
            card.borrower.clone(),
            lender,
            card.requested_amount,
            interest_rate,
            card.desired_installments,
            card.preferred_payment_dates.clone(),
        );

        card.is_funded = true;
        env.storage().persistent().set(&("REQ_CARD", card_id), &card);

        loan_id
    }

    /// Função interna para criar empréstimo
    fn create_loan_internal(
        env: &Env,
        borrower: Address,
        lender: Address,
        amount: i128,
        interest_rate: u32,
        installments: u32,
        payment_dates: Vec<u64>,
    ) -> u64 {
        let loan_id: u64 = env.storage().instance().get(&"NEXT_LOAN_ID").unwrap();

        // Calcular valor total com juros
        let total_with_interest = amount + (amount * interest_rate as i128) / 10000;
        let installment_amount = total_with_interest / installments as i128;

        let loan = Loan {
            id: loan_id,
            borrower: borrower.clone(),
            lender: lender.clone(),
            amount,
            interest_rate,
            installments,
            installment_amount,
            paid_installments: 0,
            total_paid: 0,
            status: LoanStatus::Active,
            created_at: env.ledger().timestamp(),
            next_payment_date: payment_dates.get(0).unwrap_or(env.ledger().timestamp() + 30 * DAY_IN_SECONDS),
            payment_dates,
        };

        // Transferir fundos para o tomador
        let token_address: Address = env.storage().instance().get(&"TOKEN").unwrap();
        let token_client = token::Client::new(env, &token_address);
        token_client.transfer(&lender, &borrower, &amount);

        // Coletar taxa de governança
        let governance: Address = env.storage().instance().get(&"GOVERNANCE").unwrap();
        let governance_fee = (amount * 50) / 10000; // 0.5% taxa
        token_client.transfer(&lender, &governance, &governance_fee);

        env.storage().persistent().set(&("LOAN", loan_id), &loan);
        env.storage().instance().set(&"NEXT_LOAN_ID", &(loan_id + 1));

        emit_loan_created(env, loan_id, borrower, lender, amount);
        loan_id
    }

    /// Realizar pagamento de parcela
    pub fn make_payment(env: Env, loan_id: u64) -> bool {
        let mut loan: Loan = env.storage()
            .persistent()
            .get(&("LOAN", loan_id))
            .expect("Loan not found");

        loan.borrower.require_auth();
        assert_eq!(loan.status, LoanStatus::Active, "Loan not active");

        let current_time = env.ledger().timestamp();
        let on_time = current_time <= loan.next_payment_date + DAY_IN_SECONDS;

        // Transferir pagamento
        let token_address: Address = env.storage().instance().get(&"TOKEN").unwrap();
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&loan.borrower, &loan.lender, &loan.installment_amount);

        // Atualizar loan
        loan.paid_installments += 1;
        loan.total_paid += loan.installment_amount;

        // Registrar pagamento
        let payment = Payment {
            loan_id,
            installment_number: loan.paid_installments,
            amount: loan.installment_amount,
            paid_at: current_time,
            was_on_time: on_time,
        };
        
        let mut payments: Vec<Payment> = env.storage()
            .persistent()
            .get(&("PAYMENTS", loan_id))
            .unwrap_or(Vec::new(&env));
        payments.push_back(payment);
        env.storage().persistent().set(&("PAYMENTS", loan_id), &payments);

        // Atualizar próxima data de pagamento
        if loan.paid_installments < loan.installments {
            let next_idx = loan.paid_installments as u32;
            loan.next_payment_date = loan.payment_dates
                .get(next_idx)
                .unwrap_or(current_time + 30 * DAY_IN_SECONDS);
        } else {
            loan.status = LoanStatus::Completed;
            emit_loan_completed(&env, loan_id, loan.borrower.clone(), loan.total_paid);
        }

        env.storage().persistent().set(&("LOAN", loan_id), &loan);

        // Notificar contrato de score
        let credit_score_contract: Address = env.storage().instance().get(&"CREDIT_SCORE").unwrap();
        // TODO: Chamar credit_score_contract.record_payment()

        emit_payment_made(&env, loan_id, loan.borrower.clone(), loan.installment_amount, loan.paid_installments, on_time);

        loan.status == LoanStatus::Completed
    }

    /// Marcar empréstimo como inadimplente
    pub fn mark_as_defaulted(env: Env, loan_id: u64) {
        let admin: Address = env.storage().instance().get(&"ADMIN").unwrap();
        admin.require_auth();

        let mut loan: Loan = env.storage()
            .persistent()
            .get(&("LOAN", loan_id))
            .expect("Loan not found");

        let current_time = env.ledger().timestamp();
        let grace_period = 7 * DAY_IN_SECONDS;

        assert!(
            current_time > loan.next_payment_date + grace_period,
            "Grace period not expired"
        );

        loan.status = LoanStatus::Defaulted;
        env.storage().persistent().set(&("LOAN", loan_id), &loan);

        // Notificar fundo de garantia
        let governance: Address = env.storage().instance().get(&"GOVERNANCE").unwrap();
        // TODO: Acionar fundo de proteção
    }

    /// Obter informações de um empréstimo
    pub fn get_loan(env: Env, loan_id: u64) -> Option<Loan> {
        env.storage().persistent().get(&("LOAN", loan_id))
    }

    /// Obter card de investimento
    pub fn get_investment_card(env: Env, card_id: u64) -> Option<InvestmentCard> {
        env.storage().persistent().get(&("INV_CARD", card_id))
    }

    /// Obter card de solicitação
    pub fn get_request_card(env: Env, card_id: u64) -> Option<RequestCard> {
        env.storage().persistent().get(&("REQ_CARD", card_id))
    }

    /// Obter histórico de pagamentos de um empréstimo
    pub fn get_payment_history(env: Env, loan_id: u64) -> Option<Vec<Payment>> {
        env.storage().persistent().get(&("PAYMENTS", loan_id))
    }

    /// Cancelar card (apenas criador)
    pub fn cancel_card(env: Env, card_id: u64, is_investment: bool) {
        if is_investment {
            let mut card: InvestmentCard = env.storage()
                .persistent()
                .get(&("INV_CARD", card_id))
                .expect("Card not found");
            card.investor.require_auth();
            card.is_active = false;
            env.storage().persistent().set(&("INV_CARD", card_id), &card);
        } else {
            let mut card: RequestCard = env.storage()
                .persistent()
                .get(&("REQ_CARD", card_id))
                .expect("Card not found");
            card.borrower.require_auth();
            card.is_active = false;
            env.storage().persistent().set(&("REQ_CARD", card_id), &card);
        }
    }
}