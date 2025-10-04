//! Módulo de integração com Stellar

pub mod wallet;
pub mod encoding;

pub use wallet::create_stellar_wallet;
pub use encoding::{encode_stellar_public_key, encode_stellar_secret_key};
