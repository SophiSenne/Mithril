use mithril_wallets::{WalletManager, UserType};
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    println!("🌟 Sistema de Wallets Mithril - Stellar Blockchain\n");
    println!("═══════════════════════════════════════════════════\n");
    
    let mut manager = WalletManager::new();
    
    // ═══════════════════════════════════════════════════
    // EXEMPLO 1: Criar Wallets Públicas (Recomendado)
    // ═══════════════════════════════════════════════════
    println!("📊 EXEMPLO 1: Criando Wallets (Info Pública)\n");
    
    let investor1 = manager.create_investor_wallet(
        Some("João Silva".to_string())
    )?;
    
    println!("✅ Investidor criado:");
    println!("   Nome: {}", investor1.nickname.as_deref().unwrap_or("N/A"));
    println!("   Account ID: {}", investor1.account_id);
    println!("   Tipo: {:?}", investor1.user_type);
    println!();
    
    let borrower1 = manager.create_borrower_wallet(
        Some("Maria Santos - Freelancer".to_string())
    )?;
    
    println!("✅ Tomador de Crédito criado:");
    println!("   Nome: {}", borrower1.nickname.as_deref().unwrap_or("N/A"));
    println!("   Account ID: {}", borrower1.account_id);
    println!("   Tipo: {:?}", borrower1.user_type);
    println!();
    
    // ═══════════════════════════════════════════════════
    // EXEMPLO 2: Criar Wallet Completa (COM Secret Key)
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════\n");
    println!("🔐 EXEMPLO 2: Criando Wallet Completa (COM Secret)\n");
    
    let investor2_full = manager.create_investor_wallet_full(
        Some("Pedro Investidor".to_string())
    )?;
    
    println!("✅ Wallet Completa criada:");
    println!("   Nome: {}", investor2_full.nickname.as_deref().unwrap_or("N/A"));
    println!("   Public Key: {}", investor2_full.public_key);
    println!("   Secret Key: {}", investor2_full.secret_key.as_deref().unwrap_or("N/A"));
    println!("   ⚠️  NUNCA compartilhe a Secret Key!");
    println!();
    
    // ═══════════════════════════════════════════════════
    // EXEMPLO 3: Listar Todas as Wallets
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════\n");
    println!("📋 EXEMPLO 3: Listando Todas as Wallets\n");
    
    let all_wallets = manager.list_wallets();
    
    println!("Total de wallets: {}\n", all_wallets.len());
    
    for (idx, wallet) in all_wallets.iter().enumerate() {
        println!("{}. {:?}", idx + 1, wallet.user_type);
        println!("   Nome: {}", wallet.nickname.as_deref().unwrap_or("Anônimo"));
        println!("   Account: {}...{}", 
            &wallet.account_id[..8], 
            &wallet.account_id[wallet.account_id.len()-4..]
        );
        println!();
    }
    
    // ═══════════════════════════════════════════════════
    // EXEMPLO 4: Buscar Wallet por Account ID
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════\n");
    println!("🔍 EXEMPLO 4: Buscar Wallet por Account ID\n");
    
    let search_account = &investor1.account_id;
    
    if let Some(found_wallet) = manager.find_public_by_account_id(search_account) {
        println!("✅ Wallet encontrada:");
        println!("   Account: {}", found_wallet.account_id);
        println!("   Nome: {}", found_wallet.nickname.as_deref().unwrap_or("N/A"));
    } else {
        println!("❌ Wallet não encontrada");
    }
    println!();
    
    // ═══════════════════════════════════════════════════
    // EXEMPLO 5: Estatísticas
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════\n");
    println!("📈 EXEMPLO 5: Estatísticas do Sistema\n");
    
    let all = manager.list_wallets();
    let investors_count = all.iter()
        .filter(|w| w.user_type == UserType::Investor)
        .count();
    let borrowers_count = all.iter()
        .filter(|w| w.user_type == UserType::Borrower)
        .count();
    
    println!("Total de wallets: {}", manager.count());
    println!("├─ Investidores: {}", investors_count);
    println!("└─ Tomadores: {}", borrowers_count);
    println!();
    
    // ═══════════════════════════════════════════════════
    // EXEMPLO 6: Validação e Segurança
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════\n");
    println!("🔒 EXEMPLO 6: Validação e Segurança\n");
    
    println!("Validando wallets criadas:");
    for wallet in manager.get_all_wallets() {
        match wallet.validate() {
            Ok(_) => println!("  ✅ {} - Válida", 
                wallet.nickname.as_deref().unwrap_or("Wallet")),
            Err(e) => println!("  ❌ {} - Erro: {}", 
                wallet.nickname.as_deref().unwrap_or("Wallet"), e),
        }
    }
    println!();
    
    // ═══════════════════════════════════════════════════
    // EXEMPLO 7: Salvar Wallet em Arquivo (Opcional)
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════\n");
    println!("💾 EXEMPLO 7: Persistência (Conceito)\n");
    
    println!("Para salvar uma wallet, use:");
    println!("  let wallet = manager.create_investor_wallet_full(...)?;");
    println!("  // Serialize para JSON");
    println!("  let json = serde_json::to_string_pretty(&wallet)?;");
    println!("  // Salve com criptografia!");
    println!("  std::fs::write(\"wallet_encrypted.json\", encrypt(json))?;");
    println!();
    println!("⚠️  IMPORTANTE: SEMPRE criptografe antes de salvar!");
    println!();
    
    // ═══════════════════════════════════════════════════
    // Resumo Final
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════");
    println!("🎉 Demonstração concluída com sucesso!");
    println!("═══════════════════════════════════════════════════\n");
    
    println!("📚 Próximos passos:");
    println!("  1. Ativar contas na Testnet: cargo run --example activate_testnet");
    println!("  2. Implementar smart contracts");
    println!("  3. Criar API REST");
    println!("  4. Integrar com frontend");
    println!();
    
    Ok(())
}
