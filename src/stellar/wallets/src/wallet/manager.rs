use super::types::{MithrilWallet, UserType, PublicWalletInfo};
use std::error::Error;

/// Gerenciador de wallets
pub struct WalletManager {
    wallets: Vec<MithrilWallet>,
}

impl WalletManager {
    pub fn new() -> Self {
        WalletManager {
            wallets: Vec::new(),
        }
    }
    
    /// Cria wallet para investidor e retorna informações públicas
    pub fn create_investor_wallet(
        &mut self,
        nickname: Option<String>
    ) -> Result<PublicWalletInfo, Box<dyn Error>> {
        let wallet = crate::stellar::wallet::create_stellar_wallet(
            UserType::Investor, 
            nickname
        )?;
        let public_info = wallet.to_public();
        self.wallets.push(wallet);
        Ok(public_info)
    }
    
    /// Cria wallet para tomador e retorna informações públicas
    pub fn create_borrower_wallet(
        &mut self,
        nickname: Option<String>
    ) -> Result<PublicWalletInfo, Box<dyn Error>> {
        let wallet = crate::stellar::wallet::create_stellar_wallet(
            UserType::Borrower, 
            nickname
        )?;
        let public_info = wallet.to_public();
        self.wallets.push(wallet);
        Ok(public_info)
    }
    
    /// Cria wallet e retorna a wallet completa (COM secret_key)
    /// ⚠️ CUIDADO: Retorna dados sensíveis!
    pub fn create_investor_wallet_full(
        &mut self,
        nickname: Option<String>
    ) -> Result<MithrilWallet, Box<dyn Error>> {
        let wallet = crate::stellar::wallet::create_stellar_wallet(
            UserType::Investor, 
            nickname
        )?;
        let wallet_clone = wallet.clone();
        self.wallets.push(wallet);
        Ok(wallet_clone)
    }
    
    /// Cria wallet completa para tomador
    /// ⚠️ CUIDADO: Retorna dados sensíveis!
    pub fn create_borrower_wallet_full(
        &mut self,
        nickname: Option<String>
    ) -> Result<MithrilWallet, Box<dyn Error>> {
        let wallet = crate::stellar::wallet::create_stellar_wallet(
            UserType::Borrower, 
            nickname
        )?;
        let wallet_clone = wallet.clone();
        self.wallets.push(wallet);
        Ok(wallet_clone)
    }
    
    /// Lista todas as wallets públicas
    pub fn list_wallets(&self) -> Vec<PublicWalletInfo> {
        self.wallets.iter().map(|w| w.to_public()).collect()
    }
    
    /// Busca wallet por account_id (retorna clone para evitar borrow issues)
    pub fn find_by_account_id(&self, account_id: &str) -> Option<MithrilWallet> {
        self.wallets
            .iter()
            .find(|w| w.account_id == account_id)
            .cloned()
    }
    
    /// Busca apenas informações públicas por account_id
    pub fn find_public_by_account_id(&self, account_id: &str) -> Option<PublicWalletInfo> {
        self.wallets
            .iter()
            .find(|w| w.account_id == account_id)
            .map(|w| w.to_public())
    }
    
    /// Total de wallets cadastradas
    pub fn count(&self) -> usize {
        self.wallets.len()
    }
    
    /// Obtém todas as wallets (clone)
    pub fn get_all_wallets(&self) -> Vec<MithrilWallet> {
        self.wallets.clone()
    }
}

impl Default for WalletManager {
    fn default() -> Self {
        Self::new()
    }
}