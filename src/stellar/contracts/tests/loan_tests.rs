#![cfg(test)]

use soroban_sdk::{testutils::Address as _, token, Address, Env, String, Vec};
use mithril_contracts::loan::{LoanContract, LoanContractClient, LoanStatus};

fn create_token_contract<'a>(env: &Env, admin: &Address) -> token::Client<'a> {
    token::Client::new(env, &env.register_stellar_asset_contract(admin.clone()))
}

fn create_loan_contract<'a>(env: &Env) -> (Address, LoanContractClient<'a>) {
    let contract_id = env.register_contract(None, LoanContract);
    let client = LoanContractClient::new(env, &contract_id);
    (contract_id, client)
}

#[test]
fn test_initialize() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    let governance = Address::generate(&env);
    let credit_score = Address::generate(&env);
    
    let (_, client) = create_loan_contract(&env);
    
    client.initialize(
        &admin,
        &token_client.address,
        &governance,
        &credit_score,
    );
}

#[test]
fn test_create_investment_card() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    let governance = Address::generate(&env);
    let credit_score = Address::generate(&env);
    let investor = Address::generate(&env);
    
    let (_, client) = create_loan_contract(&env);
    
    client.initialize(&admin, &token_client.address, &governance, &credit_score);
    
    let card_id = client.create_investment_card(
        &investor,
        &100_000_0000000,  // 100k max
        &5_000_0000000,    // 5k min
        &500,              // 5% interest
        &12,               // 12 installments
        &50,               // min score 50
    );
    
    assert_eq!(card_id, 1);
    
    let card = client.get_investment_card(&card_id);
    assert!(card.is_some());
    
    let card_data = card.unwrap();
    assert_eq!(card_data.investor, investor);
    assert_eq!(card_data.max_amount, 100_000_0000000);
    assert!(card_data.is_active);
}

#[test]
fn test_create_request_card() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    let governance = Address::generate(&env);
    let credit_score = Address::generate(&env);
    let borrower = Address::generate(&env);
    
    let (_, client) = create_loan_contract(&env);
    
    client.initialize(&admin, &token_client.address, &governance, &credit_score);
    
    let mut payment_dates = Vec::new(&env);
    payment_dates.push_back(env.ledger().timestamp() + 30 * 86400);
    
    let description = String::from_str(&env, "Need funds for project");
    
    let card_id = client.create_request_card(
        &borrower,
        &20_000_0000000,
        &6,
        &payment_dates,
        &description,
    );
    
    assert_eq!(card_id, 1);
    
    let card = client.get_request_card(&card_id);
    assert!(card.is_some());
    
    let card_data = card.unwrap();
    assert_eq!(card_data.borrower, borrower);
    assert_eq!(card_data.requested_amount, 20_000_0000000);
    assert!(card_data.is_active);
    assert!(!card_data.is_funded);
}

#[test]
fn test_apply_to_investment_card() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    let governance = Address::generate(&env);
    let credit_score = Address::generate(&env);
    let investor = Address::generate(&env);
    let borrower = Address::generate(&env);
    
    let (_, client) = create_loan_contract(&env);
    
    client.initialize(&admin, &token_client.address, &governance, &credit_score);
    
    // Criar card de investimento
    let card_id = client.create_investment_card(
        &investor,
        &100_000_0000000,
        &5_000_0000000,
        &500,
        &12,
        &50,
    );
    
    // Tomador aplica para o card
    let app_id = client.apply_to_investment_card(
        &borrower,
        &card_id,
        &50_000_0000000,
    );
    
    assert_eq!(app_id, 1);
}

#[test]
#[should_panic(expected = "Card not found")]
fn test_apply_to_nonexistent_card() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    let governance = Address::generate(&env);
    let credit_score = Address::generate(&env);
    let borrower = Address::generate(&env);
    
    let (_, client) = create_loan_contract(&env);
    
    client.initialize(&admin, &token_client.address, &governance, &credit_score);
    
    // Tentar aplicar para card inexistente
    client.apply_to_investment_card(&borrower, &999, &50_000_0000000);
}

#[test]
#[should_panic(expected = "Amount out of range")]
fn test_apply_with_amount_out_of_range() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    let governance = Address::generate(&env);
    let credit_score = Address::generate(&env);
    let investor = Address::generate(&env);
    let borrower = Address::generate(&env);
    
    let (_, client) = create_loan_contract(&env);
    
    client.initialize(&admin, &token_client.address, &governance, &credit_score);
    
    let card_id = client.create_investment_card(
        &investor,
        &100_000_0000000,
        &5_000_0000000,
        &500,
        &12,
        &50,
    );
    
    // Tentar aplicar com valor acima do máximo
    client.apply_to_investment_card(&borrower, &card_id, &150_000_0000000);
}

#[test]
fn test_cancel_investment_card() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    let governance = Address::generate(&env);
    let credit_score = Address::generate(&env);
    let investor = Address::generate(&env);
    
    let (_, client) = create_loan_contract(&env);
    
    client.initialize(&admin, &token_client.address, &governance, &credit_score);
    
    let card_id = client.create_investment_card(
        &investor,
        &100_000_0000000,
        &5_000_0000000,
        &500,
        &12,
        &50,
    );
    
    // Cancelar card
    client.cancel_card(&card_id, &true);
    
    let card = client.get_investment_card(&card_id).unwrap();
    assert!(!card.is_active);
}

#[test]
fn test_cancel_request_card() {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    let governance = Address::generate(&env);
    let credit_score = Address::generate(&env);
    let borrower = Address::generate(&env);
    
    let (_, client) = create_loan_contract(&env);
    
    client.initialize(&admin, &token_client.address, &governance, &credit_score);
    
    let mut payment_dates = Vec::new(&env);
    payment_dates.push_back(env.ledger().timestamp() + 30 * 86400);
    
    let description = String::from_str(&env, "Need funds");
    
    let card_id = client.create_request_card(
        &borrower,
        &20_000_0000000,
        &6,
        &payment_dates,
        &description,
    );
    
    // Cancelar card
    client.cancel_card(&card_id, &false);
    
    let card = client.get_request_card(&card_id).unwrap();
    assert!(!card.is_active);
}