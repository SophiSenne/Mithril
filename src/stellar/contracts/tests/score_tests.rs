#![cfg(test)]

use soroban_sdk::{testutils::Address as _, Address, Env};
use mithril_contracts::credit_score::{CreditScoreContract, CreditScoreContractClient, OffChainData, RiskLevel};

fn create_contract() -> (Env, Address, CreditScoreContractClient) {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, CreditScoreContract);
    let client = CreditScoreContractClient::new(&env, &contract_id);
    
    (env, contract_id, client)
}

#[test]
fn test_initialize() {
    let (env, _, client) = create_contract();
    let admin = Address::generate(&env);
    
    client.initialize(&admin);
    
    // Verificar se foi inicializado corretamente
    // (adicionar getters se necessário)
}

#[test]
fn test_update_credit_score_new_user() {
    let (env, _, client) = create_contract();
    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    
    client.initialize(&admin);
    
    let off_chain_data = OffChainData {
        bank_statements: true,
        pix_history: true,
        invoices: false,
        credit_bureau: false,
    };
    
    let score = client.update_credit_score(&user, &off_chain_data, &0);
    
    assert_eq!(score.user, user);
    assert!(score.score >= 0 && score.score <= 100);
    assert_eq!(score.payment_history, 0);
}

#[test]
fn test_update_credit_score_with_bureau() {
    let (env, _, client) = create_contract();
    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    
    client.initialize(&admin);
    
    let off_chain_data = OffChainData {
        bank_statements: true,
        pix_history: true,
        invoices: true,
        credit_bureau: true,
    };
    
    let score = client.update_credit_score(&user, &off_chain_data, &800);
    
    assert!(score.off_chain_score > 0);
    assert_eq!(score.user, user);
}

#[test]
fn test_get_score_nonexistent_user() {
    let (env, _, client) = create_contract();
    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    
    client.initialize(&admin);
    
    let result = client.get_score(&user);
    assert!(result.is_none());
}

#[test]
fn test_can_borrow_new_user() {
    let (env, _, client) = create_contract();
    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    
    client.initialize(&admin);
    
    // Novo usuário pode emprestar até 5k
    assert!(client.can_borrow(&user, &5_000_0000000));
    assert!(!client.can_borrow(&user, &10_000_0000000));
}

#[test]
fn test_can_borrow_with_score() {
    let (env, _, client) = create_contract();
    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    
    client.initialize(&admin);
    
    let off_chain_data = OffChainData {
        bank_statements: true,
        pix_history: true,
        invoices: true,
        credit_bureau: true,
    };
    
    // Criar score alto
    client.update_credit_score(&user, &off_chain_data, &900);
    
    // Com score alto pode emprestar qualquer valor
    assert!(client.can_borrow(&user, &100_000_0000000));
}

#[test]
fn test_risk_level_classification() {
    let (env, _, client) = create_contract();
    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    
    client.initialize(&admin);
    
    let off_chain_low = OffChainData {
        bank_statements: true,
        pix_history: true,
        invoices: true,
        credit_bureau: true,
    };
    
    let score = client.update_credit_score(&user, &off_chain_low, &1000);
    
    // Score alto deve resultar em risco baixo
    match score.risk_level {
        RiskLevel::Low => assert!(score.score >= 70),
        RiskLevel::Medium => assert!(score.score >= 40 && score.score < 70),
        RiskLevel::High => assert!(score.score < 40),
    }
}

#[test]
#[should_panic(expected = "Loan contract not set")]
fn test_record_payment_without_loan_contract() {
    let (env, _, client) = create_contract();
    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    
    client.initialize(&admin);
    
    // Deve falhar pois o loan contract não foi configurado
    client.record_payment(&user, &1, &1000_0000000, &true);
}

#[test]
fn test_set_loan_contract() {
    let (env, _, client) = create_contract();
    let admin = Address::generate(&env);
    let loan_contract = Address::generate(&env);
    
    client.initialize(&admin);
    client.set_loan_contract(&loan_contract);
    
    // Se não der panic, configurou corretamente
}