use soroban_sdk::{contract, contractimpl, token, Address, Env};

mod fees;
use fees::{FeeConfig, ProtectionFund};

#[contract]
pub struct GovernanceContract;

#[contractimpl]
impl GovernanceContract {
    /// Inicializa o contrato de governança
    pub fn initialize(
        env: Env,
        admin: Address,
        token: Address,
        transaction_fee: u32,      // Em basis points (ex: 50 = 0.5%)
        gas_fee: u32,              // Em basis points
    ) {
        admin.require_auth();
        
        env.storage().instance().set(&"ADMIN", &admin);
        env.storage().instance().set(&"TOKEN", &token);
        
        let fee_config = FeeConfig {
            transaction_fee,
            gas_fee,
            last_updated: env.ledger().timestamp(),
        };
        
        env.storage().instance().set(&"FEE_CONFIG", &fee_config);
        
        let protection_fund = ProtectionFund {
            total_balance: 0,
            total_claims: 0,
            active_claims: 0,
        };
        
        env.storage().instance().set(&"PROTECTION_FUND", &protection_fund);
    }

    /// Coletar taxa de transação
    pub fn collect_transaction_fee(
        env: Env,
        from: Address,
        amount: i128,
    ) -> i128 {
        let fee_config: FeeConfig = env.storage()
            .instance()
            .get(&"FEE_CONFIG")
            .unwrap();

        let fee = (amount * fee_config.transaction_fee as i128) / 10000;
        
        let token_address: Address = env.storage().instance().get(&"TOKEN").unwrap();
        let token_client = token::Client::new(&env, &token_address);
        
        // Transferir taxa para o contrato
        token_client.transfer(&from, &env.current_contract_address(), &fee);

        fee
    }

    /// Coletar taxa de gás para o fundo de proteção
    pub fn collect_gas_fee(
        env: Env,
        from: Address,
        transaction_amount: i128,
    ) -> i128 {
        let fee_config: FeeConfig = env.storage()
            .instance()
            .get(&"FEE_CONFIG")
            .unwrap();

        let gas_fee = (transaction_amount * fee_config.gas_fee as i128) / 10000;
        
        let token_address: Address = env.storage().instance().get(&"TOKEN").unwrap();
        let token_client = token::Client::new(&env, &token_address);
        
        // Transferir para o contrato
        token_client.transfer(&from, &env.current_contract_address(), &gas_fee);

        // Adicionar ao fundo de proteção
        let mut fund: ProtectionFund = env.storage()
            .instance()
            .get(&"PROTECTION_FUND")
            .unwrap();
        
        fund.total_balance += gas_fee;
        env.storage().instance().set(&"PROTECTION_FUND", &fund);

        gas_fee
    }

    /// Processar reivindicação do fundo de proteção (inadimplência)
    pub fn claim_protection(
        env: Env,
        lender: Address,
        loan_id: u64,
        amount: i128,
    ) -> bool {
        lender.require_auth();

        // Verificar se o loan está de fato inadimplente
        // TODO: Integrar com contrato de loan para verificar status

        let mut fund: ProtectionFund = env.storage()
            .instance()
            .get(&"PROTECTION_FUND")
            .unwrap();

        // Verificar se há fundos suficientes
        if fund.total_balance < amount {
            return false;
        }

        // Calcular percentual de cobertura (máximo 80% do valor)
        let coverage = (amount * 80) / 100;
        let payout = coverage.min(fund.total_balance);

        // Transferir fundos
        let token_address: Address = env.storage().instance().get(&"TOKEN").unwrap();
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&env.current_contract_address(), &lender, &payout);

        // Atualizar fundo
        fund.total_balance -= payout;
        fund.total_claims += 1;
        fund.active_claims += 1;
        
        env.storage().instance().set(&"PROTECTION_FUND", &fund);

        // Registrar claim
        env.storage().persistent().set(&("CLAIM", loan_id), &payout);

        true
    }

    /// Atualizar configuração de taxas (apenas admin)
    pub fn update_fees(
        env: Env,
        transaction_fee: u32,
        gas_fee: u32,
    ) {
        let admin: Address = env.storage().instance().get(&"ADMIN").unwrap();
        admin.require_auth();

        let fee_config = FeeConfig {
            transaction_fee,
            gas_fee,
            last_updated: env.ledger().timestamp(),
        };

        env.storage().instance().set(&"FEE_CONFIG", &fee_config);
    }

    /// Obter configuração de taxas
    pub fn get_fees(env: Env) -> FeeConfig {
        env.storage().instance().get(&"FEE_CONFIG").unwrap()
    }

    /// Obter status do fundo de proteção
    pub fn get_protection_fund(env: Env) -> ProtectionFund {
        env.storage().instance().get(&"PROTECTION_FUND").unwrap()
    }

    /// Sacar fundos de taxas acumuladas (apenas admin)
    pub fn withdraw_fees(
        env: Env,
        recipient: Address,
        amount: i128,
    ) {
        let admin: Address = env.storage().instance().get(&"ADMIN").unwrap();
        admin.require_auth();

        let fund: ProtectionFund = env.storage()
            .instance()
            .get(&"PROTECTION_FUND")
            .unwrap();

        let token_address: Address = env.storage().instance().get(&"TOKEN").unwrap();
        let token_client = token::Client::new(&env, &token_address);
        
        // Obter balanço do contrato
        let contract_balance = token_client.balance(&env.current_contract_address());
        
        // Não pode sacar fundos do fundo de proteção
        let available = contract_balance - fund.total_balance;
        assert!(amount <= available, "Insufficient available funds");

        token_client.transfer(&env.current_contract_address(), &recipient, &amount);
    }

    /// Adicionar fundos ao fundo de proteção manualmente
    pub fn add_to_protection_fund(
        env: Env,
        from: Address,
        amount: i128,
    ) {
        from.require_auth();

        let token_address: Address = env.storage().instance().get(&"TOKEN").unwrap();
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&from, &env.current_contract_address(), &amount);

        let mut fund: ProtectionFund = env.storage()
            .instance()
            .get(&"PROTECTION_FUND")
            .unwrap();
        
        fund.total_balance += amount;
        env.storage().instance().set(&"PROTECTION_FUND", &fund);
    }

    /// Transferir administração
    pub fn transfer_admin(env: Env, new_admin: Address) {
        let admin: Address = env.storage().instance().get(&"ADMIN").unwrap();
        admin.require_auth();
        
        env.storage().instance().set(&"ADMIN", &new_admin);
    }
}