use serde::{Deserialize, Serialize};
use std::error::Error;

/// Tipo de usuário na plataforma Mithril
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum UserType {
    /// Investidor - fornece capital
    Investor,
    /// Tomador de crédito - freelancer/autônomo
    Borrower,
}

/// Estrutura principal da Wallet Mithril
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MithrilWallet {
    /// Tipo de usuário
    pub user_type: UserType,
    
    /// Chave pública Stellar (formato G...)
    pub public_key: String,
    
    /// Chave secreta Stellar (formato S...) - NUNCA expor
    #[serde(skip_serializing_if = "Option::is_none")]
    pub secret_key: Option<String>,
    
    /// Account ID na rede Stellar
    pub account_id: String,
    
    /// Data de criação (ISO 8601)
    pub created_at: String,
    
    /// Nome/apelido do usuário (opcional)
    pub nickname: Option<String>,
    
    /// Endereço de email (opcional)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,
    
    /// Score de crédito (apenas para Borrowers)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub credit_score: Option<u32>,
}

/// Informações públicas da wallet (sem secret_key)
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PublicWalletInfo {
    pub user_type: UserType,
    pub account_id: String,
    pub nickname: Option<String>,
    pub created_at: String,
    pub credit_score: Option<u32>,
}

impl MithrilWallet {
    /// Converte para informações públicas (sem secret_key)
    pub fn to_public(&self) -> PublicWalletInfo {
        PublicWalletInfo {
            user_type: self.user_type.clone(),
            account_id: self.account_id.clone(),
            nickname: self.nickname.clone(),
            created_at: self.created_at.clone(),
            credit_score: self.credit_score,
        }
    }
    
    /// Valida se a wallet está completa
    pub fn validate(&self) -> Result<(), Box<dyn Error>> {
        if self.public_key.is_empty() {
            return Err("Public key não pode estar vazia".into());
        }
        
        if self.account_id.is_empty() {
            return Err("Account ID não pode estar vazio".into());
        }
        
        if !self.public_key.starts_with('G') {
            return Err("Public key deve começar com G".into());
        }
        
        if let Some(ref secret) = self.secret_key {
            if !secret.starts_with('S') {
                return Err("Secret key deve começar com S".into());
            }
        }
        
        Ok(())
    }
}

impl UserType {
    /// Retorna string legível do tipo
    pub fn as_str(&self) -> &str {
        match self {
            UserType::Investor => "Investidor",
            UserType::Borrower => "Tomador de Crédito",
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_user_type_serialization() {
        let investor = UserType::Investor;
        let json = serde_json::to_string(&investor).unwrap();
        assert_eq!(json, r#""Investor""#);
    }
    
    #[test]
    fn test_wallet_validation() {
        let wallet = MithrilWallet {
            user_type: UserType::Investor,
            public_key: "GABC123...".to_string(),
            secret_key: Some("SABC123...".to_string()),
            account_id: "GABC123...".to_string(),
            created_at: "2025-10-04T12:00:00Z".to_string(),
            nickname: Some("Test".to_string()),
            email: None,
            credit_score: None,
        };
        
        assert!(wallet.validate().is_ok());
    }
}