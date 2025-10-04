// Arquivo: examples/transfer_testnet.rs
// Execute com: cargo run --example transfer_testnet --features testnet

use serde_json::{json, Value};
use std::error::Error;
use std::fs;

const HORIZON_TESTNET_URL: &str = "https://horizon-testnet.stellar.org";

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    println!("💸 Transferência de XLM na Stellar Testnet\n");
    println!("═══════════════════════════════════════════════════\n");
    
    // ═══════════════════════════════════════════════════
    // PASSO 1: Carregar Wallets
    // ═══════════════════════════════════════════════════
    println!("📂 PASSO 1: Carregando Wallets...\n");
    
    let investor = load_wallet("testnet_investor.json")?;
    let borrower = load_wallet("testnet_borrower.json")?;
    
    println!("✅ Wallets carregadas:");
    println!("   Origem (Investidor): {}...{}", 
        &investor.account_id[..8], 
        &investor.account_id[investor.account_id.len()-4..]
    );
    println!("   Destino (Tomador): {}...{}", 
        &borrower.account_id[..8], 
        &borrower.account_id[borrower.account_id.len()-4..]
    );
    println!();
    
    // ═══════════════════════════════════════════════════
    // PASSO 2: Verificar Saldos Iniciais
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════\n");
    println!("💰 PASSO 2: Verificando Saldos Iniciais...\n");
    
    let balance_origem = get_balance(&investor.account_id).await?;
    let balance_destino = get_balance(&borrower.account_id).await?;
    
    println!("   Origem: {} XLM", balance_origem);
    println!("   Destino: {} XLM", balance_destino);
    println!();
    
    // ═══════════════════════════════════════════════════
    // PASSO 3: Simular Empréstimo
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════\n");
    println!("🔄 PASSO 3: Simulando Empréstimo de 100 XLM...\n");
    
    let amount = "100.0000000";
    
    println!("📝 Detalhes da Transação:");
    println!("   Tipo: Empréstimo (Payment)");
    println!("   De: {} (Investidor)", 
        investor.nickname.as_deref().unwrap_or("Anônimo"));
    println!("   Para: {} (Tomador)", 
        borrower.nickname.as_deref().unwrap_or("Anônimo"));
    println!("   Valor: {} XLM", amount);
    println!("   Rede: Testnet");
    println!();
    
    // ═══════════════════════════════════════════════════
    // PASSO 4: Informações sobre a Transação
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════\n");
    println!("ℹ️  PASSO 4: Como Executar a Transação\n");
    
    println!("Para executar esta transferência, você precisa:");
    println!();
    println!("1️⃣  Usar o Stellar SDK completo:");
    println!("   cargo add stellar-sdk");
    println!();
    println!("2️⃣  Ou usar a Stellar Laboratory (Interface Web):");
    println!("   https://laboratory.stellar.org/#txbuilder?network=test");
    println!();
    println!("3️⃣  Dados da transação:");
    println!("   • Source Account: {}", investor.account_id);
    println!("   • Operation Type: Payment");
    println!("   • Destination: {}", borrower.account_id);
    println!("   • Amount: {}", amount);
    println!("   • Asset: XLM (native)");
    println!();
    
    // ═══════════════════════════════════════════════════
    // PASSO 5: Estrutura da Transação
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════\n");
    println!("📋 PASSO 5: Estrutura da Transação (Conceito)\n");
    
    let transaction_structure = json!({
        "source_account": investor.account_id,
        "operations": [
            {
                "type": "payment",
                "destination": borrower.account_id,
                "asset": "native",
                "amount": amount
            }
        ],
        "memo": {
            "type": "text",
            "value": "Emprestimo Mithril - Testnet"
        },
        "fee": "100",
        "network": "testnet"
    });
    
    println!("{}", serde_json::to_string_pretty(&transaction_structure)?);
    println!();
    
    // ═══════════════════════════════════════════════════
    // PASSO 6: Próximos Passos
    // ═══════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════\n");
    println!("🚀 PASSO 6: Implementação Futura\n");
    
    println!("Para implementar transações reais, adicione ao projeto:");
    println!();
    println!("A. Módulo de Transações:");
    println!("   src/stellar/transactions.rs");
    println!();
    println!("B. Funções necessárias:");
    println!("   • build_payment_transaction()");
    println!("   • sign_transaction()");
    println!("   • submit_transaction()");
    println!();
    println!("C. Exemplo de código:");
    println!("   use stellar_sdk::*;");
    println!("   ");
    println!("   let tx = TransactionBuilder::new(&source_account)");
    println!("       .add_operation(PaymentOperation {{");
    println!("           destination: borrower_account,");
    println!("           amount: \"100\",");
    println!("           asset: Asset::native(),");
    println!("       }})");
    println!("       .build();");
    println!();
    
    println!("═══════════════════════════════════════════════════");
    println!("✅ Simulação concluída!");
    println!("═══════════════════════════════════════════════════\n");
    
    println!("💡 Dica: Para testar transações reais:");
    println!("   1. Use o Stellar Laboratory (mais fácil)");
    println!("   2. Ou implemente o módulo de transações");
    println!("   3. Verifique no Stellar Explorer: https://stellar.expert/explorer/testnet");
    println!();
    
    Ok(())
}

/// Carrega wallet de arquivo JSON
fn load_wallet(filename: &str) -> Result<mithril_wallets::MithrilWallet, Box<dyn Error>> {
    let json = fs::read_to_string(filename)?;
    let wallet: mithril_wallets::MithrilWallet = serde_json::from_str(&json)?;
    Ok(wallet)
}

/// Obtém o saldo de XLM de uma conta
async fn get_balance(account_id: &str) -> Result<String, Box<dyn Error>> {
    let client = reqwest::Client::new();
    let url = format!("{}/accounts/{}", HORIZON_TESTNET_URL, account_id);
    
    let response = client.get(&url).send().await?;
    
    if !response.status().is_success() {
        return Err("Conta não encontrada".into());
    }
    
    let account_info: Value = response.json().await?;
    
    let balance = account_info["balances"]
        .as_array()
        .and_then(|arr| {
            arr.iter()
                .find(|bal| bal["asset_type"].as_str() == Some("native"))
        })
        .and_then(|bal| bal["balance"].as_str())
        .unwrap_or("0")
        .to_string();
    
    Ok(balance)
}