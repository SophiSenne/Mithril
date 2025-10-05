---
sidebar_position: 2
title: Implementação de Blockchain Stellar
label: Implementação de Blockchain Stellar
---

Esta seção documenta a integração da plataforma Mithril com a blockchain Stellar (Soroban). Toda a implementação de contratos e integrações on-chain foi programada em Rust (Soroban).

- Autenticação e gestão de carteiras (wallets) na Stellar.
- Contratos inteligentes para score de crédito, governança e empréstimos.
- Scripts de deploy, inicialização e testes de fluxo ponta a ponta.

Arquitetura on-chain principal:

- `credit_score`: calcula e armazena score de crédito com base em dados on-chain e off-chain.
- `governance`: mantém configuração de taxas e fundo de proteção.
- `loan`: gerencia cards de investimento/solicitação, criação de empréstimos e pagamentos.
- `wallets` (crate separada): utilitários para criação/gerenciamento de wallets de Investidor e Tomador.

Códigos relevantes:

- Contratos: `src/stellar/contracts/{credit_score,governance,loan}`
- Deploy/integração: `src/stellar/contracts/deploy/`
- Wallets: `src/stellar/wallets/`

## Contratos inteligentes

### CreditScore

Responsabilidades:
- Inicialização com admin.
- Cálculo de score final combinando dados on-chain e off-chain.
- Registro de pagamentos para alimentar histórico e inadimplência.
- Consulta de score e verificação de elegibilidade de crédito.

Principais entradas/saídas (APIs públicas):
- `initialize(admin: Address)` — define admin.
- `update_credit_score(user: Address, off_chain_data: OffChainData, credit_bureau_score: u32) -> CreditScore` — recalcula e persiste score.
- `record_payment(user: Address, loan_id: u64, amount: i128, on_time: bool)` — registra pagamento (chamado pelo contrato de empréstimo).
- `get_score(user: Address) -> Option<CreditScore>` — retorna score completo.
- `can_borrow(user: Address, amount: i128) -> bool` — valida elegibilidade por faixa de risco/valor.
- `set_loan_contract(loan_contract: Address)` — configura contrato de empréstimo autorizado a registrar pagamentos.
- `get_payment_history(user: Address) -> Option<Vec<PaymentRecord>>` — histórico do usuário.

Tipos relevantes:
- `CreditScore { user, score, risk_level, on_chain_score, off_chain_score, payment_history, total_transactions, default_count, last_updated }`
- `OffChainData { bank_statements, pix_history, invoices, credit_bureau }`
- `PaymentRecord { loan_id, amount, on_time, timestamp }`
- `RiskLevel = Low | Medium | High`

Observações:
- Ponderações de cálculo estão no módulo `calculator` e usam pesos distintos para on-chain/off-chain/pontualidade.
- Autorização: `initialize` exige `admin.require_auth()`. `record_payment` exige que o `LOAN_CONTRACT` esteja configurado e autorize a chamada.

### Governance

Responsabilidades:
- Armazenar configuração de taxas (transação e gás) e gerenciar o fundo de proteção.
- Cobrança de taxas usando o token configurado.

Principais entradas/saídas (APIs públicas):
- `initialize(admin: Address, token: Address, transaction_fee: u32, gas_fee: u32)` — configura admin, token e taxas (basis points).
- `collect_transaction_fee(from: Address, amount: i128) -> i128` — calcula e transfere taxa de transação para o contrato de governança.
- `collect_gas_fee(from: Address, amount: i128) -> i128` — calcula e transfere taxa de gás para o fundo de proteção.

Tipos relevantes:
- `FeeConfig { transaction_fee, gas_fee, last_updated }`
- `ProtectionFund { total_balance, total_claims, active_claims }`

Observações:
- O contrato espera um `token` compatível com o client `soroban_sdk::token::Client` para movimentação de valores.

### Loan

Responsabilidades:
- Inicialização referenciando `token`, `governance` e `credit_score`.
- Criação de cards: `Investment` (oferta do investidor) e `Request` (pedido do tomador).
- Aplicações, aprovações e funding.
- Criação do empréstimo, cronograma, pagamentos, finalização e marcação de inadimplência.

Principais entradas/saídas (APIs públicas):
- `initialize(admin, token, governance_contract, credit_score_contract)` — configura dependências e contadores iniciais.
- `create_investment_card(investor, max_amount, min_amount, interest_rate, max_installments, target_risk_level) -> u64`
- `create_request_card(borrower, requested_amount, desired_installments, preferred_payment_dates, description) -> u64`
- `apply_to_investment_card(borrower, card_id, amount) -> u64`
- `approve_application(app_id, installments, payment_dates) -> u64` — cria o empréstimo em nome do investidor.
- `fund_request_card(lender, card_id, interest_rate) -> u64` — financia um pedido e cria o empréstimo.
- `make_payment(loan_id) -> bool` — realiza pagamento, atualiza status e registra histórico.
- `mark_as_defaulted(loan_id)` — admin marca como inadimplente após grace period.
- Getters: `get_loan`, `get_investment_card`, `get_request_card`, `get_payment_history`.

Tipos relevantes:
- `Loan { id, borrower, lender, amount, interest_rate, installments, installment_amount, paid_installments, total_paid, status, created_at, next_payment_date, payment_dates }`
- `InvestmentCard`, `RequestCard`, `Payment`, `LoanApplication`
- Enums: `LoanStatus`, `CardType`, `ApplicationStatus`

Observações:
- O contrato transfere fundos usando `token::Client` e coleta taxa de governança (exemplo: 0,5%).
- Integração com `credit_score` para registrar pagamentos está prevista (TODO em comentários).

## Deploy, inicialização e integração

Scripts em `src/stellar/contracts/deploy/` auxiliam todo o ciclo:

- `deploy_testnet.sh` — compila e faz deploy dos contratos na testnet, salvando IDs em `deploy/deployed_contracts_testnet.txt`.
- `deploy_mainnet.sh` — versão interativa para mainnet (cautela; consome XLM real).
- `initialize_contracts.sh` — invoca `initialize` em cada contrato, configurando admin, token e taxas.
- `integrate_contracts.sh` — configura referências cruzadas quando aplicável (ex.: `set_loan_contract` no `credit_score`).
- `test_contracts.sh` e `test_full_flow.sh` — cenários de teste ponta a ponta.

Pré-requisitos:
- `stellar-cli` instalado.

## Wallets (crate `wallets`)

O crate `wallets` oferece utilitários para criação e gestão de carteiras Stellar para perfis de usuário Investidor e Tomador.

Componentes principais:
- `WalletManager` — gerencia ciclo de vida de múltiplas wallets em memória.
- Tipos: `MithrilWallet`, `PublicWalletInfo`, `UserType`.
- Funções utilitárias: `create_stellar_wallet(UserType, nickname)`.

Observações de segurança:
- Prefira trabalhar com `PublicWalletInfo` quando possível (sem chave secreta).
- Manipule `secret_key` somente quando indispensável e nunca faça log em produção.

## Referências rápidas

- Diretório contratos: `src/stellar/contracts/`
- Deploy scripts: `src/stellar/contracts/deploy/`
- Crate wallets: `src/stellar/wallets/`
- Client token utilizado: `soroban_sdk::token::Client`

## Próximos passos

- Finalizar chamadas cruzadas: `loan` → `credit_score.record_payment` e integrações com `governance` (fundo de proteção).
- Adicionar testes unitários/integrados adicionais nos contratos.
