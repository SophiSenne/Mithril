---
sidebar_position: 3
title: Banco de Dados
label: Banco de Dados
---

Este documento descreve o desenho lógico e as principais entidades do banco de dados do projeto, além de índices, views, funções, triggers, sementes iniciais e orientações operacionais.

### Visão geral
- **SGBD**: PostgreSQL 14+ (com extensões `uuid-ossp` e `pgcrypto`).
- **Hospedagem**: Supabase (PostgreSQL gerenciado).
- **Script fonte**: `src/backend/banco-dados/db.sql`.
- **Domínios**: usuários/autenticação, perfis e score, crédito e investimento, transações on-chain (Stellar), fraude, recomendações, LGPD/consentimentos, integrações externas, chat/suporte.
- **Identificadores**: todas as tabelas utilizam `UUID` como chave primária.

### Diagrama
Para visão macro de entidades e relacionamentos, consulte o diagrama:

![Diagrama de Banco de Dados](/img/db.svg)

### Extensões e tipos
- Extensões: `uuid-ossp`, `pgcrypto`.
- Enums principais: `perfil_risco_enum`, `ocupacao_enum`, `classificacao_score_enum`, `finalidade_credito_enum`, `status_solicitacao_enum`, `status_oferta_enum`, `status_contrato_enum`, `status_parcela_enum`, `tipo_transacao_enum`, `status_transacao_enum`, `tipo_movimentacao_enum`, `wallet_type_enum`, `classificacao_fraude_enum`, `tipo_alerta_enum`, `severidade_enum`, `tipo_recomendacao_enum`, `tipo_consentimento_enum`, `tipo_pix_enum`, `status_pix_enum`, `status_chat_enum`, `remetente_enum`, `rede_blockchain_enum`.

### Principais tabelas (por domínio)

#### Usuários e autenticação
- `usuario`: dados cadastrais, status e timestamps; índices em `cpf`, `email`, `ativo`.
- `autenticacao`: credenciais/biometria por `usuario_id`, controle de bloqueio e tentativas; índice por `usuario_id`.
- `stellar_wallet`: chaves públicas Stellar vinculadas ao usuário; flags `principal` e `wallet_type`; índices por `usuario_id` e `public_key`.

#### Perfis e score
- `perfil_investidor`: saldo, total investido, retorno e `perfil_risco` (1–1 com `usuario`).
- `perfil_tomador`: renda, `ocupacao`, empresa, limites (1–1 com `usuario`).
- `score_credito`: scores internos/externos, `classificacao`, validade; histórico em `historico_score`.
- `score_investidor`: avaliação de investidor por `usuario_id`.
- `historico_score`: trilha de alterações para `score_credito`.

#### Crédito e investimento
- `solicitacao_credito`: pedido do tomador com `finalidade`, `prazo_meses`, valor e `analise_ia`; status indexado.
- `oferta_investimento`: ofertas de investidores para uma solicitação com taxa e validade; status indexado.
- `smart_contract`: metadados de contratos implantados em Stellar (rede, endereço, wasm/hash).
- `contrato`: vínculo tomador–investidor–solicitação–oferta, termos financeiros, `status` e referência opcional a `smart_contract`.
- `parcela`: amortização por contrato com valores, `data_vencimento`, `status` e controle de multas/juros; `UNIQUE(contrato_id, numero_parcela)`.

#### Transações e financeiro
- `transacao_stellar`: registro de operações on-chain (hash, contas, valor, `tipo`, `status`, `ledger_sequence`).
- `fee_config`: tabela de configuração de taxas por `tipo` (percentual e/ou valor fixo).
- `fundo_inadimplencia`: saldo e movimentação agregada do fundo.
- `movimentacao_financeira`: movimentações off-chain por `usuario_id` e `tipo` (depósito, investimento, rendimento, etc.).
- `conversao_cambial`: execuções com par de moeda, taxa e vínculos a transações Stellar.
- `auditoria_blockchain`: eventos e metadados de auditoria vinculados a `transacao_stellar`.

#### Fraude e risco operacional
- `analise_fraude`: score/classificação, features de ML, bloqueio e motivo.
- `alerta_fraude`: alertas com `tipo_alerta`, `severidade`, detalhes e resolução.

#### Recomendações
- `recomendacao`: recomendações por `usuario_id` e `tipo`, com `score_recomendacao`, parâmetros e flags de visualização/aceite.

#### LGPD e consentimentos
- `consentimento_lgpd`: consentimentos por `tipo_consentimento`, `ip_consentimento`, timestamps de concessão/revogação e finalidade.

#### Integrações externas
- `consulta_serasa`: resultado bruto e score retornado, com protocolo.
- `dados_open_finance`: contas, transações e investimentos agregados por instituição.
- `transacao_pix`: lançamento PIX (entrada/saída), chave, valor e `status`.

#### Chat e suporte
- `conversa_chat`: sessões com `status` e timestamps; trigger de atualização automática.
- `mensagem_chat`: mensagens por conversa com `remetente` e metadados.

### Relacionamentos (alto nível)
- `autenticacao.usuario_id → usuario.id` (1–1).
- `stellar_wallet.usuario_id → usuario.id` (1–N, uma carteira pode ser principal).
- `perfil_investidor.usuario_id` e `perfil_tomador.usuario_id` (1–1 com `usuario`).
- `score_*` e `historico_score` dependem de `usuario`/`score_credito`.
- `solicitacao_credito.tomador_id → usuario.id`.
- `oferta_investimento.(solicitacao_credito_id, investidor_id)` referenciam `solicitacao_credito` e `usuario`.
- `contrato` referencia `solicitacao_credito`, `oferta_investimento`, `usuario` (tomador e investidor) e opcionalmente `smart_contract`.
- `parcela.contrato_id → contrato.id` (1–N).
- `transacao_stellar` pode referenciar `usuario` (origem/destino) e `smart_contract`.
- `analise_fraude`/`alerta_fraude` vinculam-se a `usuario` e `transacao_stellar`.
- `recomendacao` pode referenciar `solicitacao_credito`.
- `conversas/mensagens` vinculam usuário e conversa.

### Índices
Há índices em campos-chave de busca e filtragem: documentos (`cpf`, `email`), flags (`ativo`, `status`), chaves estrangeiras frequentes (por exemplo, `usuario_id`, `contrato_id`), atributos de negócio (datas de vencimento, tipos e classificações), além de índices específicos para auditoria e integrações. Ver a seção "ÍNDICES" no `db.sql` para a lista completa.

### Views
- `vw_usuario_completo`: consolida dados de `usuario`, perfis e score vigente.
- `vw_contratos_ativos`: resumo de contratos ativos com contagem de parcelas pagas/atrasadas.
- `vw_parcelas_vencendo`: parcelas pendentes no horizonte de 7 dias (dados do tomador).

### Funções e triggers
- `calcular_parcelas(valor_total, taxa_juros, prazo_meses)`: retorna valor de parcela calculado pela fórmula de price.
- `atualizar_timestamp()`: trigger para manter `atualizado_em` em entidades selecionadas.
- `atualizar_saldo_investidor()`: trigger pós-inserção em `movimentacao_financeira` para ajuste de saldo/retorno.

Triggers definidos para: `usuario`, `perfil_investidor`, `perfil_tomador`, `conversa_chat` e `movimentacao_financeira` (via função específica).

### Seeds (dados iniciais)
- `fee_config`: configurações iniciais (MITHRIL, FUNDO_INADIMPLENCIA, PIX, CAMBIAL).
- `fundo_inadimplencia`: registro inicial com saldos zerados.

### Convenções e políticas
- Chaves primárias `UUID` geradas por `uuid_generate_v4()`.
- `ON DELETE CASCADE` em vínculos que exigem limpeza consistente (por exemplo, `autenticacao`, `parcela`, mensagens de chat, etc.).
- Timestamps padronizados: `criado_em`, `atualizado_em`, datas de eventos específicas por domínio.
- Enum para estados de negócio, evitando valores mágicos.

### Referências
- Script completo: `src/backend/banco-dados/db.sql`.
- Diagrama: `/img/db.svg`.

Em caso de divergências, o `db.sql` é a referência principal.
