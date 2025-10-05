#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};

// ==================== TYPES ====================

#[derive(Clone, Debug)]
#[contracttype]
pub struct FeeConfig {
    pub transaction_fee: u32,
    pub gas_fee: u32,
    pub last_updated: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct ProtectionFund {
    pub total_balance: i128,
    pub total_claims: u32,
    pub active_claims: u32,
}

impl FeeConfig {
    pub fn calculate_transaction_fee(&self, amount: i128) -> i128 {
        (amount * self.transaction_fee as i128) / 10000
    }

    pub fn calculate_gas_fee(&self, amount: i128) -> i128 {
        (amount * self.gas_fee as i128) / 10000
    }
}

// ==================== CONTRACT ====================

#[contract]
pub struct GovernanceContract;

#[contractimpl]
impl GovernanceContract {
    pub fn initialize(
        env: Env,
        admin: Address,
        token: Address,
        transaction_fee: u32,
        gas_fee: u32,
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
        
        token_client.transfer(&from, &env.current_contract_address(), &fee);

        fee
    }

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
        
        token_client.transfer(&from, &env.current_contract_address(), &gas_fee);

        let mut fund: ProtectionFund = env.storage()
            .instance()
            .get(&"PROTECTION_FUND")
            .unwrap();
        
        fund.total_balance += gas_fee;
        env.storage().instance().set(&"PROTECTION_FUND", &fund);

        gas_fee
    }

    pub fn claim_protection(
        env: Env,
        lender: Address,
        loan_id: u64,
        amount: i128,
    ) -> bool {
        lender.require_auth();

        let mut fund: ProtectionFund = env.storage()
            .instance()
            .get(&"PROTECTION_FUND")
            .unwrap();

        if fund.total_balance < amount {
            return false;
        }

        let coverage = (amount * 80) / 100;
        let payout = coverage.min(fund.total_balance);

        let token_address: Address = env.storage().instance().get(&"TOKEN").unwrap();
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&env.current_contract_address(), &lender, &payout);

        fund.total_balance -= payout;
        fund.total_claims += 1;
        fund.active_claims += 1;
        
        env.storage().instance().set(&"PROTECTION_FUND", &fund);

        env.storage().persistent().set(&("CLAIM", loan_id), &payout);

        true
    }

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

    pub fn get_fees(env: Env) -> FeeConfig {
        env.storage().instance().get(&"FEE_CONFIG").unwrap()
    }

    pub fn get_protection_fund(env: Env) -> ProtectionFund {
        env.storage().instance().get(&"PROTECTION_FUND").unwrap()
    }

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
        
        let contract_balance = token_client.balance(&env.current_contract_address());
        
        let available = contract_balance - fund.total_balance;
        assert!(amount <= available, "Insufficient available funds");

        token_client.transfer(&env.current_contract_address(), &recipient, &amount);
    }

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

    pub fn transfer_admin(env: Env, new_admin: Address) {
        let admin: Address = env.storage().instance().get(&"ADMIN").unwrap();
        admin.require_auth();
        
        env.storage().instance().set(&"ADMIN", &new_admin);
    }
}