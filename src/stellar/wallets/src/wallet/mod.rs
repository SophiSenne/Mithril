//! Módulo de gerenciamento de wallets

pub mod types;
pub mod manager;

// Re-exports
pub use types::{MithrilWallet, UserType, PublicWalletInfo};
pub use manager::WalletManager;
