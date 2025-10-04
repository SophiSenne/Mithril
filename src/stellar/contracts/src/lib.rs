#![no_std]

pub mod credit_score;
pub mod governance;
pub mod loan;

pub use credit_score::CreditScoreContract;
pub use governance::GovernanceContract;
pub use loan::LoanContract;