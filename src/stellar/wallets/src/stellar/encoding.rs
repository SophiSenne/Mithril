use std::error::Error;

/// Alfabeto Base32 usado pela Stellar
const BASE32_ALPHABET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/// Codifica chave pública no formato Stellar (G...)
pub fn encode_stellar_public_key(key_bytes: &[u8]) -> Result<String, Box<dyn Error>> {
    encode_stellar_key(key_bytes, KeyType::PublicKey)
}

/// Codifica chave secreta no formato Stellar (S...)
pub fn encode_stellar_secret_key(key_bytes: &[u8]) -> Result<String, Box<dyn Error>> {
    encode_stellar_key(key_bytes, KeyType::SecretKey)
}

#[derive(Debug, Clone, Copy)]
enum KeyType {
    PublicKey,  // Prefixo: 0x30 (G)
    SecretKey,  // Prefixo: 0x90 (S)
}

/// Codifica chave no formato StrKey da Stellar
fn encode_stellar_key(key_bytes: &[u8], key_type: KeyType) -> Result<String, Box<dyn Error>> {
    // Adicionar prefixo de versão
    let version_byte = match key_type {
        KeyType::PublicKey => 6 << 3,  // 48 (0x30) - resulta em 'G'
        KeyType::SecretKey => 18 << 3, // 144 (0x90) - resulta em 'S'
    };
    
    let mut payload = vec![version_byte];
    payload.extend_from_slice(key_bytes);
    
    // Calcular e adicionar checksum CRC16
    let checksum = calculate_crc16_xmodem(&payload);
    payload.push((checksum & 0xff) as u8);
    payload.push((checksum >> 8) as u8);
    
    // Codificar em Base32
    Ok(encode_base32(&payload))
}

/// Calcula checksum CRC16-XModem
fn calculate_crc16_xmodem(data: &[u8]) -> u16 {
    let mut crc: u16 = 0x0000;
    
    for &byte in data {
        crc ^= (byte as u16) << 8;
        
        for _ in 0..8 {
            if crc & 0x8000 != 0 {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc <<= 1;
            }
        }
    }
    
    crc
}

/// Codifica dados em Base32
fn encode_base32(data: &[u8]) -> String {
    let mut result = String::new();
    let mut bits: u32 = 0;
    let mut bit_count = 0;
    
    for &byte in data {
        bits = (bits << 8) | byte as u32;
        bit_count += 8;
        
        while bit_count >= 5 {
            bit_count -= 5;
            let index = ((bits >> bit_count) & 0x1f) as usize;
            result.push(BASE32_ALPHABET[index] as char);
        }
    }
    
    // Padding final se necessário
    if bit_count > 0 {
        let index = ((bits << (5 - bit_count)) & 0x1f) as usize;
        result.push(BASE32_ALPHABET[index] as char);
    }
    
    result
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_encode_public_key() {
        let test_key = [0u8; 32]; // Chave de teste
        let encoded = encode_stellar_public_key(&test_key).unwrap();
        assert!(encoded.starts_with('G'));
        assert_eq!(encoded.len(), 56); // Tamanho padrão Stellar
    }
    
    #[test]
    fn test_encode_secret_key() {
        let test_key = [0u8; 32];
        let encoded = encode_stellar_secret_key(&test_key).unwrap();
        assert!(encoded.starts_with('S'));
        assert_eq!(encoded.len(), 56);
    }
    
    #[test]
    fn test_crc16_calculation() {
        let data = vec![0x30, 0x00, 0x00, 0x00];
        let crc = calculate_crc16_xmodem(&data);
        assert!(crc > 0); // Apenas garantir que calcula algo
    }
}