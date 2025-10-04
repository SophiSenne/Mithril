use mithril_wallets::{WalletManager, UserType};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🌟 Mithril Wallet Manager\n");
    
    let mut manager = WalletManager::new();
    
    // Criar wallets
    let investor = manager.create_investor_wallet(Some("João".to_string()))?;
    println!("✅ Investidor criado: {}", investor.account_id);
    
    let borrower = manager.create_borrower_wallet(Some("Maria".to_string()))?;
    println!("✅ Tomador criado: {}", borrower.account_id);
    
    // Listar
    println!("\n📋 Wallets cadastradas:");
    for (i, wallet) in manager.list_wallets().iter().enumerate() {
        println!("  {}. {} - {}", 
            i + 1,
            wallet.user_type.as_str(),
            wallet.nickname.as_deref().unwrap_or("Sem nome")
        );
    }
    
    Ok(())
}