use soroban_sdk::{contracttype, symbol_short, Address, Env, Symbol};

// Símbolos para eventos
pub const LOAN_CREATED: Symbol = symbol_short!("created");
pub const PAYMENT_MADE: Symbol = symbol_short!("payment");
pub const LOAN_COMPLETED: Symbol = symbol_short!("complete");
pub const LOAN_DEFAULTED: Symbol = symbol_short!("default");
pub const CARD_CREATED: Symbol = symbol_short!("card_new");
pub const CARD_FUNDED: Symbol = symbol_short!("funded");
pub const APPLICATION_SUBMITTED: Symbol = symbol_short!("app_sub");
pub const APPLICATION_APPROVED: Symbol = symbol_short!("app_appr");

#[contracttype]
#[derive(Clone)]
pub struct LoanCreatedEvent {
    pub loan_id: u64,
    pub borrower: Address,
    pub lender: Address,
    pub amount: i128,
}

#[contracttype]
#[derive(Clone)]
pub struct PaymentMadeEvent {
    pub loan_id: u64,
    pub borrower: Address,
    pub amount: i128,
    pub installment: u32,
    pub on_time: bool,
}

#[contracttype]
#[derive(Clone)]
pub struct LoanCompletedEvent {
    pub loan_id: u64,
    pub borrower: Address,
    pub total_paid: i128,
}

#[contracttype]
#[derive(Clone)]
pub struct CardCreatedEvent {
    pub card_id: u64,
    pub creator: Address,
    pub is_investment_card: bool,
}

pub fn emit_loan_created(env: &Env, loan_id: u64, borrower: Address, lender: Address, amount: i128) {
    env.events().publish(
        (LOAN_CREATED,),
        LoanCreatedEvent {
            loan_id,
            borrower,
            lender,
            amount,
        },
    );
}

pub fn emit_payment_made(env: &Env, loan_id: u64, borrower: Address, amount: i128, installment: u32, on_time: bool) {
    env.events().publish(
        (PAYMENT_MADE,),
        PaymentMadeEvent {
            loan_id,
            borrower,
            amount,
            installment,
            on_time,
        },
    );
}

pub fn emit_loan_completed(env: &Env, loan_id: u64, borrower: Address, total_paid: i128) {
    env.events().publish(
        (LOAN_COMPLETED,),
        LoanCompletedEvent {
            loan_id,
            borrower,
            total_paid,
        },
    );
}

pub fn emit_card_created(env: &Env, card_id: u64, creator: Address, is_investment_card: bool) {
    env.events().publish(
        (CARD_CREATED,),
        CardCreatedEvent {
            card_id,
            creator,
            is_investment_card,
        },
    );
}