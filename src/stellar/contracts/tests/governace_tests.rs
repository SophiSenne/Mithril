#![cfg(test)]

use soroban_sdk::{testutils::Address as _, token, Address, Env};
use mithril_contracts::governance::{GovernanceContract, GovernanceContractClient};

fn create_token_contract<'a>(env: &Env, admin: &Address) -> token::Client<'a> {
    token::Client::new(env, &env.register_stellar_asset_contract(admin.clone()))
}

fn create_governance_contract<'a>(env: &Env) -> (Address, GovernanceContractClient<'a>) {
    let contract_id = env.register_contract(None, GovernanceContract);
    let client = GovernanceContractClient::new(env, &contract_id);
    (contract_id, client)
}

#[test]
fn test_initialize() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    
    let (_, client) = create_governance_contract(&env);
    
    client.initialize(
        &admin,
        &token_client.address,
        &50,  // 0.5% transaction fee
        &10,  // 0.1% gas fee
    );
    
    let fees = client.get_fees();
    assert_eq!(fees.transaction_fee, 50);
    assert_eq!(fees.gas_fee, 10);
}

#[test]
fn test_collect_transaction_fee() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    let user = Address::generate(&env);
    
    let (contract_id, client) = create_governance_contract(&env);
    
    client.initialize(&admin, &token_client.address, &50, &10);
    
    // Mint tokens para o usuário
    token_client.mint(&user, &100_000_0000000);
    
    // Coletar taxa de 0.5% sobre 100k = 500
    let fee = client.collect_transaction_fee(&user, &100_000_0000000);
    
    assert_eq!(fee, 500_0000000);
    
    // Verificar balanço do contrato
    let contract_balance = token_client.balance(&contract_id);
    assert_eq!(contract_balance, 500_0000000);
}

#[test]
fn test_collect_gas_fee() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    let user = Address::generate(&env);
    
    let (contract_id, client) = create_governance_contract(&env);
    
    client.initialize(&admin, &token_client.address, &50, &10);
    
    // Mint tokens para o usuário
    token_client.mint(&user, &100_000_0000000);
    
    // Coletar taxa de gás de 0.1% sobre 100k = 100
    let gas_fee = client.collect_gas_fee(&user, &100_000_0000000);
    
    assert_eq!(gas_fee, 100_0000000);
    
    // Verificar que foi adicionado ao fundo de proteção
    let fund = client.get_protection_fund();
    assert_eq!(fund.total_balance, 100_0000000);
}

#[test]
fn test_update_fees() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    
    let (_, client) = create_governance_contract(&env);
    
    client.initialize(&admin, &token_client.address, &50, &10);
    
    // Atualizar taxas
    client.update_fees(&100, &20);
    
    let fees = client.get_fees();
    assert_eq!(fees.transaction_fee, 100);
    assert_eq!(fees.gas_fee, 20);
}

#[test]
fn test_add_to_protection_fund() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    let contributor = Address::generate(&env);
    
    let (_, client) = create_governance_contract(&env);
    
    client.initialize(&admin, &token_client.address, &50, &10);
    
    // Mint tokens para o contribuidor
    token_client.mint(&contributor, &50_000_0000000);
    
    // Adicionar ao fundo
    client.add_to_protection_fund(&contributor, &10_000_0000000);
    
    let fund = client.get_protection_fund();
    assert_eq!(fund.total_balance, 10_000_0000000);
}

#[test]
fn test_claim_protection() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    let lender = Address::generate(&env);
    let user = Address::generate(&env);
    
    let (_, client) = create_governance_contract(&env);
    
    client.initialize(&admin, &token_client.address, &50, &10);
    
    // Adicionar fundos ao fundo de proteção
    token_client.mint(&user, &100_000_0000000);
    client.add_to_protection_fund(&user, &50_000_0000000);
    
    // Fazer claim de 10k (80% = 8k será pago)
    let result = client.claim_protection(&lender, &1, &10_000_0000000);
    
    assert!(result);
    
    // Verificar que recebeu 80%
    let lender_balance = token_client.balance(&lender);
    assert_eq!(lender_balance, 8_000_0000000);
    
    // Verificar que o fundo diminuiu
    let fund = client.get_protection_fund();
    assert_eq!(fund.total_balance, 42_000_0000000); // 50k - 8k
    assert_eq!(fund.total_claims, 1);
}

#[test]
fn test_claim_protection_insufficient_funds() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    let lender = Address::generate(&env);
    let user = Address::generate(&env);
    
    let (_, client) = create_governance_contract(&env);
    
    client.initialize(&admin, &token_client.address, &50, &10);
    
    // Adicionar fundos pequenos ao fundo de proteção
    token_client.mint(&user, &10_000_0000000);
    client.add_to_protection_fund(&user, &5_000_0000000);
    
    // Tentar claim maior que o disponível
    let result = client.claim_protection(&lender, &1, &100_000_0000000);
    
    assert!(!result); // Deve falhar
}

#[test]
fn test_withdraw_fees() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    let user = Address::generate(&env);
    let recipient = Address::generate(&env);
    
    let (_, client) = create_governance_contract(&env);
    
    client.initialize(&admin, &token_client.address, &50, &10);
    
    // Coletar algumas taxas
    token_client.mint(&user, &100_000_0000000);
    client.collect_transaction_fee(&user, &100_000_0000000);
    
    // Sacar taxas
    client.withdraw_fees(&recipient, &200_0000000);
    
    let recipient_balance = token_client.balance(&recipient);
    assert_eq!(recipient_balance, 200_0000000);
}

#[test]
#[should_panic(expected = "Insufficient available funds")]
fn test_withdraw_fees_from_protection_fund() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    let user = Address::generate(&env);
    let recipient = Address::generate(&env);
    
    let (_, client) = create_governance_contract(&env);
    
    client.initialize(&admin, &token_client.address, &50, &10);
    
    // Adicionar ao fundo de proteção
    token_client.mint(&user, &100_000_0000000);
    client.add_to_protection_fund(&user, &50_000_0000000);
    
    // Tentar sacar mais do que está disponível (excluindo fundo de proteção)
    client.withdraw_fees(&recipient, &60_000_0000000);
}

#[test]
fn test_transfer_admin() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let new_admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    
    let (_, client) = create_governance_contract(&env);
    
    client.initialize(&admin, &token_client.address, &50, &10);
    
    // Transferir administração
    client.transfer_admin(&new_admin);
    
    // Novo admin pode atualizar taxas
    client.update_fees(&75, &15);
    
    let fees = client.get_fees();
    assert_eq!(fees.transaction_fee, 75);
}