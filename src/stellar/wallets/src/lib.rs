pub mod wallet;
pub mod stellar;
pub mod utils;

// Re-exports principais
pub use wallet::{
    types::{MithrilWallet, UserType, PublicWalletInfo},
    manager::WalletManager,
};

pub use stellar::wallet::create_stellar_wallet;

/// Versão da biblioteca
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_library_integration() {
        let mut manager = WalletManager::new();
        
        let investor = manager.create_investor_wallet(
            Some("Test".to_string())
        ).unwrap();
        
        assert_eq!(manager.count(), 1);
        assert!(investor.public_key.starts_with('G'));
    }
}