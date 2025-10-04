use crate::wallet::types::{MithrilWallet, UserType};
use super::encoding::{encode_stellar_public_key, encode_stellar_secret_key};
use ed25519_dalek::SigningKey;
use rand::rngs::OsRng;
use std::error::Error;

/// Cria uma nova wallet Stellar
pub fn create_stellar_wallet(
    user_type: UserType,
    nickname: Option<String>
) -> Result<MithrilWallet, Box<dyn Error>> {
    // Gerar par de chaves Ed25519
    let mut csprng = OsRng;
    let signing_key = SigningKey::generate(&mut csprng);
    let verifying_key = signing_key.verifying_key();
    
    // Converter para formato Stellar
    let public_key = encode_stellar_public_key(&verifying_key.to_bytes())?;
    let secret_key = encode_stellar_secret_key(&signing_key.to_bytes())?;
    
    // Criar estrutura da wallet
    let wallet = MithrilWallet {
        user_type,
        public_key: public_key.clone(),
        secret_key: Some(secret_key),
        account_id: public_key,
        created_at: get_current_timestamp(),
        nickname,
        email: None,
        credit_score: None,
    };
    
    // Validar antes de retornar
    wallet.validate()?;
    
    Ok(wallet)
}

/// Obtém timestamp atual no formato ISO 8601
fn get_current_timestamp() -> String {
    // Implementação simples sem chrono
    use std::time::{SystemTime, UNIX_EPOCH};
    
    let duration = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap();
    
    format!("{}", duration.as_secs())
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_create_investor_wallet() {
        let wallet = create_stellar_wallet(
            UserType::Investor,
            Some("Test Investor".to_string())
        ).unwrap();
        
        assert!(wallet.public_key.starts_with('G'));
        assert!(wallet.secret_key.as_ref().unwrap().starts_with('S'));
        assert_eq!(wallet.user_type, UserType::Investor);
    }
    
    #[test]
    fn test_create_borrower_wallet() {
        let wallet = create_stellar_wallet(
            UserType::Borrower,
            Some("Test Borrower".to_string())
        ).unwrap();
        
        assert_eq!(wallet.user_type, UserType::Borrower);
        assert!(wallet.nickname.is_some());
    }
}