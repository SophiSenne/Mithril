use std::error::Error;

/// Valida se uma chave pública Stellar é válida
pub fn is_valid_stellar_public_key(key: &str) -> bool {
    key.len() == 56 && key.starts_with('G')
}

/// Valida se uma chave secreta Stellar é válida
pub fn is_valid_stellar_secret_key(key: &str) -> bool {
    key.len() == 56 && key.starts_with('S')
}

/// Valida formato de email
pub fn is_valid_email(email: &str) -> bool {
    email.contains('@') && email.contains('.')
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_public_key_validation() {
        assert!(!is_valid_stellar_public_key("invalid"));
        assert!(!is_valid_stellar_public_key("SABC123"));
    }
}