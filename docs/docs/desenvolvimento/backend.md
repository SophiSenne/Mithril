---
sidebar_position: 4
title: Back-End
label: Back-End
---

Este documento descreve a arquitetura, microsserviços, endpoints, configuração e operações do back-end do projeto Mithril. A implementação segue um estilo de microsserviços com FastAPI e PostgreSQL (Supabase), integrando-se com contratos Soroban/Stellar documentados em `Introdução à Blockchain Stellar`.

## Visão geral da arquitetura
- Serviços Python (FastAPI) separados por domínio: autenticação/usuários/carteiras, marketplace de crédito, gestão de contratos/parcelas, pagamentos/financeiro.
- Banco de dados PostgreSQL gerenciado (Supabase) compartilhado, com schemas compatíveis com o script `src/backend/banco-dados/db.sql`.
- Integração on-chain via registros e metadados de transações/contratos (IDs/hashes/ledger), interoperando com os contratos Rust em `src/stellar/contracts`.
- CORS liberado para facilitar o desenvolvimento local.

## Microsserviços
Abaixo, o resumo por serviço com principais rotas. Cada serviço expõe um endpoint `/health` para verificação.

### api-autenticacao
Caminho: `src/backend/api-autenticacao/`

Responsável por: cadastro de usuários, autenticação básica (hash Bcrypt com truncamento seguro), e gestão de carteiras Stellar vinculadas ao usuário.

- Modelos: `Usuario`, `Autenticacao`, `StellarWallet` (+ enum `wallet_type_enum`).
- DB: usa `SUPABASE_URL` via SQLAlchemy.

Principais endpoints:
- `POST /usuarios/` — cria usuário e credenciais; retorna `UsuarioResponse`.
- `GET /usuarios/` — lista usuários (pagina por `skip`, `limit`).
- `GET /usuarios/{usuario_id}` — usuário + `wallets`.
- `PUT /usuarios/{usuario_id}` — atualiza dados do usuário.
- `DELETE /usuarios/{usuario_id}` — remove usuário.
- `POST /login/` — autenticação por CPF e senha; retorna dados básicos.
- `POST /wallets/` — cria carteira Stellar vinculada.
- `GET /wallets/` — lista carteiras.
- `GET /usuarios/{usuario_id}/wallets` — carteiras do usuário.
- `GET /wallets/{wallet_id}` — detalhes da carteira.
- `PUT /wallets/{wallet_id}` — atualiza `principal`/`ativo`.
- `DELETE /wallets/{wallet_id}` — remove carteira.
- `GET /health` — status do serviço.

Notas de segurança:
- Hash de senha com `passlib[bcrypt]` e truncamento de 72 bytes (limite do Bcrypt) aplicado em hash e verificação.
- Bloqueio após 5 tentativas falhas com janela de 15 minutos.

### api-marketplace
Caminho: `src/backend/api-marketplace/`

Responsável por: fluxo de solicitações de crédito, ofertas de investimento e perfis (investidor/tomador).

- Entidades: `SolicitacaoCredito`, `OfertaInvestimento`, `PerfilInvestidor`, `PerfilTomador` (Enums Postgres: `finalidade_credito_enum`, `status_solicitacao_enum`, `status_oferta_enum`, `perfil_risco_enum`, `ocupacao_enum`).
- DB: `SUPABASE_URL`.

Principais endpoints:
- `POST /solicitacoes-credito/` — cria solicitação com finalidade, prazo e valor.
- `GET /solicitacoes-credito/` — lista solicitações.
- `GET /solicitacoes-credito/{solicitacao_id}` — detalhe.
- `PUT /solicitacoes-credito/{solicitacao_id}` — atualiza campos.
- `PATCH /solicitacoes-credito/{solicitacao_id}/status` — altera status (marca `respondido_em` quando terminal).
- `POST /ofertas-investimento/` — cria oferta vinculada a solicitação; `expira_em` padrão em 7 dias.
- `GET /ofertas-investimento/` — lista ofertas.
- `GET /ofertas-investimento/{oferta_id}` — detalhe.
- `PATCH /ofertas-investimento/{oferta_id}/status` — atualiza status.
- `POST /perfis-investidor/` | `GET/PUT /perfis-investidor/{usuario_id}` — perfil do investidor.
- `POST /perfis-tomador/` | `GET/PUT /perfis-tomador/{usuario_id}` — perfil do tomador.

### api-gestao-credito
Caminho: `src/backend/api-gestao-credito/`

Responsável por: gestão de contratos e parcelas, com referência opcional a smart contracts (Soroban) e transações Stellar.

- Entidades: `SmartContract`, `Contrato`, `Parcela` (Enums: `rede_blockchain_enum`, `status_contrato_enum`, `status_parcela_enum`).
- DB: `SUPABASE_URL`.

Principais endpoints:
- `POST /smart-contracts/` | `GET /smart-contracts/` | `GET/PUT/DELETE /smart-contracts/{contract_id}` — CRUD metadados de contratos on-chain.
- `POST /contratos/` | `GET /contratos/` | `GET/PUT /contratos/{contrato_id}` — CRUD de contratos (conversão de strings para UUIDs ao salvar/atualizar).
- `PATCH /contratos/{contrato_id}/status` — altera status.
- `DELETE /contratos/{contrato_id}` — remove contrato.
- `POST /parcelas/` | `GET /parcelas/` | `GET /parcelas/{parcela_id}` — CRUD de parcelas.
- `GET /contratos/{contrato_id}/parcelas` — lista parcelas do contrato.
- `PUT /parcelas/{parcela_id}` — atualiza parcela.
- `PATCH /parcelas/{parcela_id}/status` — altera status da parcela.
- `PATCH /parcelas/{parcela_id}/pagamento` — registra pagamento, define `status=PAGO`, opcional `stellar_tx_id`.
- `DELETE /parcelas/{parcela_id}` — remove parcela.
- `GET /health` — status do serviço.

### api-pagamentos
Caminho: `src/backend/api-pagamentos/`

Responsável por: registro de transações Stellar, PIX, movimentações financeiras internas, conversões cambiais e configuração de taxas.

- Entidades: `TransacaoStellar`, `MovimentacaoFinanceira`, `TransacaoPix`, `ConversaoCambial`, `FeeConfig` (Enums: `status_transacao_enum`, `tipo_transacao_enum`, `tipo_movimentacao_enum`, `tipo_pix_enum`, `status_pix_enum`).
- DB: `SUPABASE_URL`.

Principais endpoints:
- `POST/GET/GET:id/PUT:status /transacoes-stellar` — cria, lista, consulta e atualiza status (marca `confirmado_em`).
- `POST/GET /movimentacoes-financeiras` e `GET /movimentacoes-financeiras/usuario/{usuario_id}` — movimentações.
- `POST/GET/GET:id/PUT:status /transacoes-pix` — fluxo PIX.
- `POST/GET` e `GET /conversoes-cambiais/usuario/{usuario_id}` — conversões.
- `POST/GET/GET:{tipo}/PUT:{tipo} /fee-config` — configuração de taxas com atualização de `atualizado_em`.
- `GET /health` — status do serviço.

## Banco de dados
- Configuração via variável `SUPABASE_URL` (DSN do PostgreSQL). Consulte o documento `Banco de Dados` para entidades, enums, índices, views, funções e seeds iniciais. O script mestre está em `src/backend/banco-dados/db.sql`.
- As tabelas e enums citados nos serviços alinham-se com o diagrama `/img/db.svg`.

## Integração com Stellar/Soroban
- `api-gestao-credito` referencia `smart_contract_id` e `stellar_tx_id` em `Contrato`/`Parcela`.
- `api-pagamentos` armazena `transacao_stellar` com `ledger_sequence`, `smart_contract_id` e metadados.
- Scripts e contratos estão em `src/stellar/contracts` (ver documentação específica em `Implementação de Blockchain Stellar`).

## Configuração e execução local
Pré-requisitos:
- Python 3.11+
- PostgreSQL gerenciado (Supabase) e variável `SUPABASE_URL` válida.

Instalação (por serviço):
1. `cd src/backend/<serviço>`
2. `pip install -r requirements.txt`
3. `uvicorn src.main:app --reload --port <porta>`

Portas sugeridas:
- Autenticação: 8000
- Pagamentos: 8001
- Gestão de Crédito: 8002
- Marketplace: 8003

CORS: habilitado com `allow_origins=["*"]` nos serviços que expõem UI/consumo direto.

## Observabilidade e saúde
- `GET /health` disponível em todos os serviços.
- Log padrão do Uvicorn/Starlette.



## Roadmap técnico (back-end)
- Autorização/bearer tokens (JWT) entre serviços e clientes.
- Webhooks/assíncrono para confirmação on-chain/PIX.
- Serviços de orquestração para funding automático e reconciliação financeira.
- Observabilidade aprimorada (métricas, tracing distribuído) e políticas de rate limit.