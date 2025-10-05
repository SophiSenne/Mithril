use soroban_sdk::{contracttype, Address, String, Vec};

#[derive(Clone, PartialEq)]
#[contracttype]
pub enum LoanStatus {
    Pending,      // Aguardando aprovação
    Active,       // Empréstimo ativo
    Completed,    // Totalmente pago
    Defaulted,    // Inadimplente
    Cancelled,    // Cancelado
}

#[derive(Clone, PartialEq)]
#[contracttype]
pub enum CardType {
    Investment,   // Card criado por investidor
    Request,      // Card criado por tomador
}

#[derive(Clone)]
#[contracttype]
pub struct Loan {
    pub id: u64,
    pub borrower: Address,
    pub lender: Address,
    pub amount: i128,
    pub interest_rate: u32,        // Taxa de juros em base points (ex: 500 = 5%)
    pub installments: u32,
    pub installment_amount: i128,
    pub paid_installments: u32,
    pub total_paid: i128,
    pub status: LoanStatus,
    pub created_at: u64,
    pub next_payment_date: u64,
    pub payment_dates: Vec<u64>,
}

#[derive(Clone)]
#[contracttype]
pub struct InvestmentCard {
    pub id: u64,
    pub investor: Address,
    pub max_amount: i128,
    pub min_amount: i128,
    pub interest_rate: u32,
    pub max_installments: u32,
    pub target_risk_level: u32,    // Score mínimo aceito
    pub is_active: bool,
    pub total_invested: i128,
    pub created_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct RequestCard {
    pub id: u64,
    pub borrower: Address,
    pub requested_amount: i128,
    pub desired_installments: u32,
    pub preferred_payment_dates: Vec<u64>,
    pub description: String,
    pub is_active: bool,
    pub is_funded: bool,
    pub created_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct Payment {
    pub loan_id: u64,
    pub installment_number: u32,
    pub amount: i128,
    pub paid_at: u64,
    pub was_on_time: bool,
}

#[derive(Clone)]
#[contracttype]
pub struct LoanApplication {
    pub id: u64,
    pub card_id: u64,
    pub card_type: CardType,
    pub applicant: Address,
    pub amount: i128,
    pub status: ApplicationStatus,
    pub created_at: u64,
}

#[derive(Clone, PartialEq)]
#[contracttype]
pub enum ApplicationStatus {
    Pending,
    Approved,
    Rejected,
}