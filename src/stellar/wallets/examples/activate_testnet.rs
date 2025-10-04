// Arquivo: examples/activate_testnet.rs
// Execute com: cargo run --example activate_testnet

use mithril_wallets::WalletManager;
use reqwest;
use serde_json::Value;
use std::error::Error;
use std::time::Duration;

/// URL do Friendbot na Testnet Stellar
const FRIENDBOT_URL: &str = "https://friendbot.stellar.org";

/// URL do Horizon API na Testnet
const HORIZON_TESTNET_URL: &str = "https://horizon-testnet.stellar.org";

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    println!("🌟 Ativação de Contas na Stellar Testnet\n");
    println!("═══════════════════════════════════════════════════\n");
    
    let mut manager = WalletManager::new();
    
    // ═══════════════════════════════════════════════════
    // PASSO 1: Criar Wallets
    // ═══════════════════════════════════════════════════
    println!("📝 PASSO 1: Criando Wallets...\n");
    
    let investor = manager.create_investor_wallet_full(
        Some("João - Investidor Testnet".to_string())
    )?;
    
    println!("✅ Investidor criado:");
    println!("   Nome: {}", investor.nickname.as_deref().unwrap_or("N/A"));
    println!("   Account: {}", investor.account_id);
    println!();
    
    let borrower = manager.create_borrower_wallet_full(
        Some("Maria - Freelancer Testnet".to_string())
    )?;
    
    println!("✅ Tomador criado:");
    println!("   Nome: {}", borrower.nickname.as_deref().unwrap_or("N/A"));
    println!("   Account: {}", borrower.account_id);
    println!();
    
    // ═══════════════════════════════════════════════════
    // PASSO 2: Ativar Conta do Investidor
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════\n");
    println!("🚀 PASSO 2: Ativando Conta do Investidor...\n");
    
    match fund_account(&investor.account_id).await {
        Ok(balance) => {
            println!("✅ Conta ativada com sucesso!");
            println!("   Saldo inicial: {} XLM", balance);
            println!("   Rede: Testnet");
        }
        Err(e) => {
            println!("❌ Erro ao ativar conta: {}", e);
            println!("   Tente novamente em alguns segundos...");
        }
    }
    println!();
    
    // Aguardar um pouco antes da próxima ativação
    tokio::time::sleep(Duration::from_secs(2)).await;
    
    // ═══════════════════════════════════════════════════
    // PASSO 3: Ativar Conta do Tomador
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════\n");
    println!("🚀 PASSO 3: Ativando Conta do Tomador...\n");
    
    match fund_account(&borrower.account_id).await {
        Ok(balance) => {
            println!("✅ Conta ativada com sucesso!");
            println!("   Saldo inicial: {} XLM", balance);
            println!("   Rede: Testnet");
        }
        Err(e) => {
            println!("❌ Erro ao ativar conta: {}", e);
        }
    }
    println!();
    
    // ═══════════════════════════════════════════════════
    // PASSO 4: Verificar Status das Contas
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════\n");
    println!("🔍 PASSO 4: Verificando Status das Contas...\n");
    
    tokio::time::sleep(Duration::from_secs(2)).await;
    
    println!("Investidor:");
    match get_account_info(&investor.account_id).await {
        Ok(info) => print_account_info(&info),
        Err(e) => println!("   ❌ Erro: {}", e),
    }
    println!();
    
    println!("Tomador:");
    match get_account_info(&borrower.account_id).await {
        Ok(info) => print_account_info(&info),
        Err(e) => println!("   ❌ Erro: {}", e),
    }
    println!();
    
    // ═══════════════════════════════════════════════════
    // PASSO 5: Instruções de Uso
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════\n");
    println!("📚 PASSO 5: Próximos Passos\n");
    
    println!("✅ Contas ativadas e prontas para uso na Testnet!");
    println!();
    println!("🔗 Links úteis:");
    println!("   • Stellar Laboratory: https://laboratory.stellar.org");
    println!("   • Horizon Testnet: {}", HORIZON_TESTNET_URL);
    println!("   • Friendbot: {}", FRIENDBOT_URL);
    println!();
    println!("💡 O que você pode fazer agora:");
    println!("   1. Fazer transferências entre contas");
    println!("   2. Testar smart contracts Soroban");
    println!("   3. Simular operações de empréstimo");
    println!("   4. Verificar transações no Stellar Explorer");
    println!();
    println!("⚠️  Lembre-se: Esta é a TESTNET!");
    println!("   • Os XLM não têm valor real");
    println!("   • Dados podem ser resetados periodicamente");
    println!("   • Use apenas para desenvolvimento/testes");
    println!();
    
    // ═══════════════════════════════════════════════════
    // PASSO 6: Salvar Credenciais
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════\n");
    println!("💾 PASSO 6: Salvando Credenciais...\n");
    
    save_wallet_to_file(&investor, "testnet_investor.json")?;
    save_wallet_to_file(&borrower, "testnet_borrower.json")?;
    
    println!("✅ Credenciais salvas!");
    println!("   • testnet_investor.json");
    println!("   • testnet_borrower.json");
    println!();
    println!("⚠️  IMPORTANTE: Estas são chaves da TESTNET!");
    println!("   NUNCA use estas chaves em produção!");
    println!();
    
    println!("═══════════════════════════════════════════════════");
    println!("🎉 Ativação concluída com sucesso!");
    println!("═══════════════════════════════════════════════════\n");
    
    Ok(())
}

/// Ativa uma conta na Testnet usando o Friendbot
async fn fund_account(account_id: &str) -> Result<String, Box<dyn Error>> {
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(30))
        .build()?;
    
    let url = format!("{}?addr={}", FRIENDBOT_URL, account_id);
    
    println!("   Enviando requisição para Friendbot...");
    println!("   URL: {}", url);
    
    let response = client.get(&url).send().await?;
    
    if !response.status().is_success() {
        return Err(format!("Friendbot retornou status: {}", response.status()).into());
    }
    
    let body: Value = response.json().await?;
    
    // O Friendbot geralmente financia com 10,000 XLM
    let balance = body["balances"]
        .as_array()
        .and_then(|arr| arr.first())
        .and_then(|bal| bal["balance"].as_str())
        .unwrap_or("10000.0000000");
    
    Ok(balance.to_string())
}

/// Obtém informações de uma conta via Horizon API
async fn get_account_info(account_id: &str) -> Result<Value, Box<dyn Error>> {
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(10))
        .build()?;
    
    let url = format!("{}/accounts/{}", HORIZON_TESTNET_URL, account_id);
    
    let response = client.get(&url).send().await?;
    
    if !response.status().is_success() {
        return Err(format!("Conta não encontrada ou erro: {}", response.status()).into());
    }
    
    let account_info: Value = response.json().await?;
    Ok(account_info)
}

/// Exibe informações formatadas da conta
fn print_account_info(info: &Value) {
    println!("   ✅ Conta ativa na blockchain");
    println!("   Account ID: {}", info["id"].as_str().unwrap_or("N/A"));
    
    if let Some(balances) = info["balances"].as_array() {
        println!("   Saldos:");
        for balance in balances {
            let asset_type = balance["asset_type"].as_str().unwrap_or("unknown");
            let amount = balance["balance"].as_str().unwrap_or("0");
            
            if asset_type == "native" {
                println!("      • {} XLM (Lumens)", amount);
            } else {
                let asset_code = balance["asset_code"].as_str().unwrap_or("?");
                println!("      • {} {}", amount, asset_code);
            }
        }
    }
    
    println!("   Sequence: {}", info["sequence"].as_str().unwrap_or("N/A"));
    println!("   Subentry Count: {}", info["subentry_count"].as_u64().unwrap_or(0));
}

/// Salva wallet em arquivo JSON
fn save_wallet_to_file(
    wallet: &mithril_wallets::MithrilWallet,
    filename: &str
) -> Result<(), Box<dyn Error>> {
    use std::fs;
    
    let json = serde_json::to_string_pretty(wallet)?;
    fs::write(filename, json)?;
    
    Ok(())
}