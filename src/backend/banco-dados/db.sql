-- ========================================
-- EXTENSÕES NECESSÁRIAS
-- ========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- TIPOS ENUMERADOS (ENUMS)
-- ========================================

CREATE TYPE perfil_risco_enum AS ENUM ('CONSERVADOR', 'MODERADO', 'ARROJADO');
CREATE TYPE ocupacao_enum AS ENUM ('EMPREGADO', 'AUTONOMO', 'EMPRESARIO', 'APOSENTADO');
CREATE TYPE classificacao_score_enum AS ENUM ('EXCELENTE', 'BOM', 'REGULAR', 'RUIM');
CREATE TYPE finalidade_credito_enum AS ENUM ('PESSOAL', 'EDUCACAO', 'SAUDE', 'NEGOCIO', 'OUTROS');
CREATE TYPE status_solicitacao_enum AS ENUM ('PENDENTE', 'ANALISE', 'APROVADO', 'REPROVADO', 'CANCELADO');
CREATE TYPE status_oferta_enum AS ENUM ('PENDENTE', 'ACEITA', 'RECUSADA', 'EXPIRADA');
CREATE TYPE status_contrato_enum AS ENUM ('ATIVO', 'QUITADO', 'INADIMPLENTE', 'CANCELADO');
CREATE TYPE status_parcela_enum AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO');
CREATE TYPE tipo_transacao_enum AS ENUM ('TRANSFERENCIA', 'PAGAMENTO_PARCELA', 'INVESTIMENTO', 'RESGATE');
CREATE TYPE status_transacao_enum AS ENUM ('PENDENTE', 'CONFIRMADA', 'FALHA');
CREATE TYPE tipo_movimentacao_enum AS ENUM ('DEPOSITO', 'SAQUE', 'INVESTIMENTO', 'PAGAMENTO', 'TAXA', 'RENDIMENTO');
CREATE TYPE wallet_type_enum AS ENUM ('STANDARD', 'CUSTODIAL', 'HARDWARE');
CREATE TYPE classificacao_fraude_enum AS ENUM ('BAIXO', 'MEDIO', 'ALTO', 'CRITICO');
CREATE TYPE tipo_alerta_enum AS ENUM ('PADRAO_SUSPEITO', 'VALOR_ANOMALO', 'FREQUENCIA_ALTA', 'DISPOSITIVO_NOVO');
CREATE TYPE severidade_enum AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA');
CREATE TYPE tipo_recomendacao_enum AS ENUM ('INVESTIMENTO', 'CREDITO', 'PRODUTO');
CREATE TYPE tipo_consentimento_enum AS ENUM ('DADOS_PESSOAIS', 'CONSULTA_CREDITO', 'OPEN_FINANCE', 'MARKETING');
CREATE TYPE tipo_pix_enum AS ENUM ('ENTRADA', 'SAIDA');
CREATE TYPE status_pix_enum AS ENUM ('PENDENTE', 'CONCLUIDA', 'FALHA');
CREATE TYPE status_chat_enum AS ENUM ('ABERTA', 'RESOLVIDA', 'FECHADA');
CREATE TYPE remetente_enum AS ENUM ('USUARIO', 'BOT', 'ATENDENTE');
CREATE TYPE rede_blockchain_enum AS ENUM ('TESTNET', 'MAINNET');

-- ========================================
-- TABELAS DE USUÁRIOS E AUTENTICAÇÃO
-- ========================================

CREATE TABLE usuario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cpf VARCHAR(11) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nome_completo VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    data_nascimento DATE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    ultimo_acesso TIMESTAMP
);

CREATE TABLE autenticacao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    senha_hash VARCHAR(255) NOT NULL,
    biometria_token TEXT,
    device_id VARCHAR(255),
    ultimo_login TIMESTAMP,
    tentativas_falhas INTEGER DEFAULT 0,
    bloqueado BOOLEAN DEFAULT FALSE,
    bloqueado_ate TIMESTAMP
);

CREATE TABLE stellar_wallet (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    public_key VARCHAR(56) UNIQUE NOT NULL,
    principal BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    wallet_type wallet_type_enum NOT NULL
);

-- ========================================
-- TABELAS DE PERFIL E SCORE
-- ========================================

CREATE TABLE perfil_investidor (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID UNIQUE NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    saldo_disponivel DECIMAL(15,2) DEFAULT 0.00,
    total_investido DECIMAL(15,2) DEFAULT 0.00,
    retorno_acumulado DECIMAL(15,2) DEFAULT 0.00,
    perfil_risco perfil_risco_enum,
    preferencias JSONB,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE perfil_tomador (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID UNIQUE NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    renda_mensal DECIMAL(15,2),
    ocupacao ocupacao_enum,
    empresa VARCHAR(255),
    limite_credito DECIMAL(15,2) DEFAULT 0.00,
    credito_utilizado DECIMAL(15,2) DEFAULT 0.00,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE score_credito (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    score_interno INTEGER CHECK (score_interno BETWEEN 0 AND 1000),
    score_serasa INTEGER,
    score_open_finance INTEGER,
    score_consolidado INTEGER CHECK (score_consolidado BETWEEN 0 AND 1000),
    classificacao classificacao_score_enum,
    detalhamento JSONB,
    calculado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valido_ate TIMESTAMP
);

CREATE TABLE score_investidor (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    score_investidor INTEGER CHECK (score_investidor BETWEEN 0 AND 1000),
    classificacao classificacao_score_enum,
    fatores JSONB,
    calculado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historico_score (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    score_credito_id UUID NOT NULL REFERENCES score_credito(id) ON DELETE CASCADE,
    score_anterior INTEGER,
    score_novo INTEGER,
    motivo_alteracao TEXT,
    dados_calculo JSONB,
    registrado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELAS DE CRÉDITO E INVESTIMENTO
-- ========================================

CREATE TABLE solicitacao_credito (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tomador_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    valor_solicitado DECIMAL(15,2) NOT NULL,
    prazo_meses INTEGER NOT NULL,
    finalidade finalidade_credito_enum NOT NULL,
    descricao TEXT,
    status status_solicitacao_enum DEFAULT 'PENDENTE',
    taxa_juros_sugerida DECIMAL(5,2),
    analise_ia JSONB,
    solicitado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    respondido_em TIMESTAMP
);

CREATE TABLE oferta_investimento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    solicitacao_credito_id UUID NOT NULL REFERENCES solicitacao_credito(id) ON DELETE CASCADE,
    investidor_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    valor_ofertado DECIMAL(15,2) NOT NULL,
    taxa_juros_oferecida DECIMAL(5,2) NOT NULL,
    status status_oferta_enum DEFAULT 'PENDENTE',
    mensagem TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira_em TIMESTAMP,
    respondido_em TIMESTAMP
);

CREATE TABLE smart_contract (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    rede rede_blockchain_enum NOT NULL,
    endereco_deploy VARCHAR(255),
    wasm_hash VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contrato (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    solicitacao_credito_id UUID NOT NULL REFERENCES solicitacao_credito(id),
    oferta_investimento_id UUID NOT NULL REFERENCES oferta_investimento(id),
    tomador_id UUID NOT NULL REFERENCES usuario(id),
    investidor_id UUID NOT NULL REFERENCES usuario(id),
    valor_total DECIMAL(15,2) NOT NULL,
    taxa_juros DECIMAL(5,2) NOT NULL,
    prazo_meses INTEGER NOT NULL,
    valor_parcela DECIMAL(15,2) NOT NULL,
    data_primeiro_vencimento DATE NOT NULL,
    status status_contrato_enum DEFAULT 'ATIVO',
    documento_hash VARCHAR(255),
    stellar_tx_id VARCHAR(255),
    smart_contract_id UUID REFERENCES smart_contract(id),
    assinado_em TIMESTAMP,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parcela (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contrato_id UUID NOT NULL REFERENCES contrato(id) ON DELETE CASCADE,
    numero_parcela INTEGER NOT NULL,
    valor_principal DECIMAL(15,2) NOT NULL,
    valor_juros DECIMAL(15,2) NOT NULL,
    valor_total DECIMAL(15,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    status status_parcela_enum DEFAULT 'PENDENTE',
    multa DECIMAL(15,2) DEFAULT 0.00,
    juros_atraso DECIMAL(15,2) DEFAULT 0.00,
    stellar_tx_id VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(contrato_id, numero_parcela)
);

-- ========================================
-- TRANSAÇÕES BLOCKCHAIN
-- ========================================

CREATE TABLE transacao_stellar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stellar_tx_hash VARCHAR(255) UNIQUE NOT NULL,
    usuario_origem_id UUID REFERENCES usuario(id),
    usuario_destino_id UUID REFERENCES usuario(id),
    conta_origem VARCHAR(56) NOT NULL,
    conta_destino VARCHAR(56) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    tipo tipo_transacao_enum NOT NULL,
    status status_transacao_enum DEFAULT 'PENDENTE',
    metadados JSONB,
    smart_contract_id UUID REFERENCES smart_contract(id),
    submetido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmado_em TIMESTAMP,
    ledger_sequence BIGINT
);

CREATE TABLE fee_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(50) NOT NULL UNIQUE,
    percentual DECIMAL(5,4),
    valor_fixo DECIMAL(15,2),
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fundo_inadimplencia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    saldo_atual DECIMAL(15,2) DEFAULT 0.00,
    total_reservado DECIMAL(15,2) DEFAULT 0.00,
    total_utilizado DECIMAL(15,2) DEFAULT 0.00,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movimentacao_financeira (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    origem_id UUID,
    destino_id UUID,
    tipo tipo_movimentacao_enum NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversao_cambial (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    par_moeda VARCHAR(20) NOT NULL,
    taxa_conversao DECIMAL(15,8) NOT NULL,
    valor_origem DECIMAL(15,2) NOT NULL,
    valor_destino DECIMAL(15,2) NOT NULL,
    stellar_tx_id VARCHAR(255),
    executado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auditoria_blockchain (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transacao_stellar_id UUID REFERENCES transacao_stellar(id) ON DELETE CASCADE,
    evento VARCHAR(255) NOT NULL,
    dados_transacao JSONB,
    ip_origem VARCHAR(45),
    user_agent TEXT,
    registrado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- DETECÇÃO DE FRAUDE
-- ========================================

CREATE TABLE analise_fraude (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    transacao_stellar_id UUID REFERENCES transacao_stellar(id),
    score_fraude DECIMAL(5,2) CHECK (score_fraude BETWEEN 0 AND 100),
    classificacao classificacao_fraude_enum,
    features_ml JSONB,
    modelo_versao VARCHAR(50),
    bloqueado BOOLEAN DEFAULT FALSE,
    motivo_bloqueio TEXT,
    analisado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alerta_fraude (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analise_fraude_id UUID NOT NULL REFERENCES analise_fraude(id) ON DELETE CASCADE,
    tipo_alerta tipo_alerta_enum NOT NULL,
    severidade severidade_enum NOT NULL,
    descricao TEXT,
    detalhes JSONB,
    resolvido BOOLEAN DEFAULT FALSE,
    resolucao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolvido_em TIMESTAMP
);

-- ========================================
-- RECOMENDAÇÕES
-- ========================================

CREATE TABLE recomendacao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    solicitacao_credito_id UUID REFERENCES solicitacao_credito(id),
    tipo tipo_recomendacao_enum NOT NULL,
    score_recomendacao DECIMAL(5,2),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    parametros JSONB,
    visualizado BOOLEAN DEFAULT FALSE,
    aceito BOOLEAN,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira_em TIMESTAMP
);

-- ========================================
-- LGPD E CONSENTIMENTOS
-- ========================================

CREATE TABLE consentimento_lgpd (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    tipo_consentimento tipo_consentimento_enum NOT NULL,
    consentido BOOLEAN NOT NULL,
    ip_consentimento VARCHAR(45),
    consentido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revogado_em TIMESTAMP,
    finalidade TEXT
);

-- ========================================
-- INTEGRAÇÕES EXTERNAS
-- ========================================

CREATE TABLE consulta_serasa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    score_retornado INTEGER,
    dados_completos JSONB,
    consultado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    protocolo_serasa VARCHAR(255)
);

CREATE TABLE dados_open_finance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    instituicao VARCHAR(255) NOT NULL,
    contas JSONB,
    transacoes JSONB,
    investimentos JSONB,
    sincronizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira_em TIMESTAMP
);

CREATE TABLE transacao_pix (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    transacao_stellar_id UUID REFERENCES transacao_stellar(id),
    pix_id VARCHAR(255) UNIQUE NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    tipo tipo_pix_enum NOT NULL,
    chave_pix VARCHAR(255),
    status status_pix_enum DEFAULT 'PENDENTE',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- CHAT E SUPORTE
-- ========================================

CREATE TABLE conversa_chat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    titulo VARCHAR(255),
    status status_chat_enum DEFAULT 'ABERTA',
    iniciado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mensagem_chat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversa_id UUID NOT NULL REFERENCES conversa_chat(id) ON DELETE CASCADE,
    remetente remetente_enum NOT NULL,
    conteudo TEXT NOT NULL,
    metadados JSONB,
    visualizado BOOLEAN DEFAULT FALSE,
    enviado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- ÍNDICES PARA OTIMIZAÇÃO
-- ========================================

-- Usuário e autenticação
CREATE INDEX idx_usuario_cpf ON usuario(cpf);
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_usuario_ativo ON usuario(ativo);
CREATE INDEX idx_autenticacao_usuario ON autenticacao(usuario_id);
CREATE INDEX idx_stellar_wallet_usuario ON stellar_wallet(usuario_id);
CREATE INDEX idx_stellar_wallet_public_key ON stellar_wallet(public_key);

-- Perfis
CREATE INDEX idx_perfil_investidor_usuario ON perfil_investidor(usuario_id);
CREATE INDEX idx_perfil_tomador_usuario ON perfil_tomador(usuario_id);

-- Scores
CREATE INDEX idx_score_credito_usuario ON score_credito(usuario_id);
CREATE INDEX idx_score_credito_valido ON score_credito(valido_ate);
CREATE INDEX idx_score_investidor_usuario ON score_investidor(usuario_id);
CREATE INDEX idx_historico_score_credito ON historico_score(score_credito_id);

-- Crédito e investimento
CREATE INDEX idx_solicitacao_tomador ON solicitacao_credito(tomador_id);
CREATE INDEX idx_solicitacao_status ON solicitacao_credito(status);
CREATE INDEX idx_oferta_solicitacao ON oferta_investimento(solicitacao_credito_id);
CREATE INDEX idx_oferta_investidor ON oferta_investimento(investidor_id);
CREATE INDEX idx_oferta_status ON oferta_investimento(status);
CREATE INDEX idx_contrato_tomador ON contrato(tomador_id);
CREATE INDEX idx_contrato_investidor ON contrato(investidor_id);
CREATE INDEX idx_contrato_status ON contrato(status);
CREATE INDEX idx_parcela_contrato ON parcela(contrato_id);
CREATE INDEX idx_parcela_vencimento ON parcela(data_vencimento);
CREATE INDEX idx_parcela_status ON parcela(status);

-- Transações
CREATE INDEX idx_transacao_stellar_hash ON transacao_stellar(stellar_tx_hash);
CREATE INDEX idx_transacao_origem ON transacao_stellar(usuario_origem_id);
CREATE INDEX idx_transacao_destino ON transacao_stellar(usuario_destino_id);
CREATE INDEX idx_transacao_status ON transacao_stellar(status);
CREATE INDEX idx_transacao_tipo ON transacao_stellar(tipo);
CREATE INDEX idx_movimentacao_usuario ON movimentacao_financeira(usuario_id);
CREATE INDEX idx_movimentacao_tipo ON movimentacao_financeira(tipo);
CREATE INDEX idx_conversao_usuario ON conversao_cambial(usuario_id);

-- Fraude
CREATE INDEX idx_analise_fraude_usuario ON analise_fraude(usuario_id);
CREATE INDEX idx_analise_fraude_transacao ON analise_fraude(transacao_stellar_id);
CREATE INDEX idx_analise_fraude_classificacao ON analise_fraude(classificacao);
CREATE INDEX idx_alerta_fraude_analise ON alerta_fraude(analise_fraude_id);
CREATE INDEX idx_alerta_fraude_resolvido ON alerta_fraude(resolvido);

-- Recomendações
CREATE INDEX idx_recomendacao_usuario ON recomendacao(usuario_id);
CREATE INDEX idx_recomendacao_tipo ON recomendacao(tipo);
CREATE INDEX idx_recomendacao_visualizado ON recomendacao(visualizado);

-- Integrações
CREATE INDEX idx_consulta_serasa_usuario ON consulta_serasa(usuario_id);
CREATE INDEX idx_dados_open_finance_usuario ON dados_open_finance(usuario_id);
CREATE INDEX idx_transacao_pix_usuario ON transacao_pix(usuario_id);
CREATE INDEX idx_transacao_pix_id ON transacao_pix(pix_id);

-- Chat
CREATE INDEX idx_conversa_usuario ON conversa_chat(usuario_id);
CREATE INDEX idx_conversa_status ON conversa_chat(status);
CREATE INDEX idx_mensagem_conversa ON mensagem_chat(conversa_id);

-- Auditoria
CREATE INDEX idx_auditoria_transacao ON auditoria_blockchain(transacao_stellar_id);
CREATE INDEX idx_auditoria_registrado ON auditoria_blockchain(registrado_em);

-- LGPD
CREATE INDEX idx_consentimento_usuario ON consentimento_lgpd(usuario_id);
CREATE INDEX idx_consentimento_tipo ON consentimento_lgpd(tipo_consentimento);

-- ========================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- ========================================

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de atualização
CREATE TRIGGER trigger_usuario_atualizado
    BEFORE UPDATE ON usuario
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_perfil_investidor_atualizado
    BEFORE UPDATE ON perfil_investidor
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_perfil_tomador_atualizado
    BEFORE UPDATE ON perfil_tomador
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_conversa_chat_atualizado
    BEFORE UPDATE ON conversa_chat
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

-- ========================================
-- VIEWS ÚTEIS
-- ========================================

-- View de usuários completos
CREATE VIEW vw_usuario_completo AS
SELECT 
    u.id,
    u.cpf,
    u.email,
    u.nome_completo,
    u.telefone,
    u.ativo,
    pi.saldo_disponivel,
    pi.total_investido,
    pi.perfil_risco,
    pt.renda_mensal,
    pt.limite_credito,
    pt.credito_utilizado,
    sc.score_consolidado,
    sc.classificacao as classificacao_credito
FROM usuario u
LEFT JOIN perfil_investidor pi ON u.id = pi.usuario_id
LEFT JOIN perfil_tomador pt ON u.id = pt.usuario_id
LEFT JOIN LATERAL (
    SELECT score_consolidado, classificacao
    FROM score_credito
    WHERE usuario_id = u.id
    ORDER BY calculado_em DESC
    LIMIT 1
) sc ON true;

-- View de contratos ativos
CREATE VIEW vw_contratos_ativos AS
SELECT 
    c.id,
    c.valor_total,
    c.taxa_juros,
    c.prazo_meses,
    c.valor_parcela,
    c.status,
    ut.nome_completo as tomador_nome,
    ui.nome_completo as investidor_nome,
    COUNT(p.id) as total_parcelas,
    COUNT(CASE WHEN p.status = 'PAGO' THEN 1 END) as parcelas_pagas,
    COUNT(CASE WHEN p.status = 'ATRASADO' THEN 1 END) as parcelas_atrasadas
FROM contrato c
JOIN usuario ut ON c.tomador_id = ut.id
JOIN usuario ui ON c.investidor_id = ui.id
LEFT JOIN parcela p ON c.id = p.contrato_id
WHERE c.status = 'ATIVO'
GROUP BY c.id, ut.nome_completo, ui.nome_completo;

-- View de parcelas vencendo
CREATE VIEW vw_parcelas_vencendo AS
SELECT 
    p.id,
    p.numero_parcela,
    p.valor_total,
    p.data_vencimento,
    c.id as contrato_id,
    u.nome_completo as tomador_nome,
    u.email as tomador_email,
    u.telefone as tomador_telefone
FROM parcela p
JOIN contrato c ON p.contrato_id = c.id
JOIN usuario u ON c.tomador_id = u.id
WHERE p.status = 'PENDENTE'
  AND p.data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days';

-- ========================================
-- FUNÇÕES ÚTEIS
-- ========================================

-- Função para calcular parcelas de um contrato
CREATE OR REPLACE FUNCTION calcular_parcelas(
    p_valor_total DECIMAL,
    p_taxa_juros DECIMAL,
    p_prazo_meses INTEGER
)
RETURNS DECIMAL AS $$
DECLARE
    taxa_mensal DECIMAL;
    valor_parcela DECIMAL;
BEGIN
    taxa_mensal := p_taxa_juros / 100 / 12;
    
    IF taxa_mensal = 0 THEN
        valor_parcela := p_valor_total / p_prazo_meses;
    ELSE
        valor_parcela := p_valor_total * (taxa_mensal * POWER(1 + taxa_mensal, p_prazo_meses)) / 
                        (POWER(1 + taxa_mensal, p_prazo_meses) - 1);
    END IF;
    
    RETURN ROUND(valor_parcela, 2);
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar saldo do investidor
CREATE OR REPLACE FUNCTION atualizar_saldo_investidor()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.tipo = 'INVESTIMENTO' THEN
        UPDATE perfil_investidor
        SET saldo_disponivel = saldo_disponivel - NEW.valor,
            total_investido = total_investido + NEW.valor
        WHERE usuario_id = NEW.usuario_id;
    ELSIF TG_OP = 'INSERT' AND NEW.tipo = 'RENDIMENTO' THEN
        UPDATE perfil_investidor
        SET saldo_disponivel = saldo_disponivel + NEW.valor,
            retorno_acumulado = retorno_acumulado + NEW.valor
        WHERE usuario_id = NEW.usuario_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_movimentacao_investidor
    AFTER INSERT ON movimentacao_financeira
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_saldo_investidor();

-- ========================================
-- DADOS INICIAIS (SEEDS)
-- ========================================

-- Configurações de taxas
INSERT INTO fee_config (tipo, percentual, valor_fixo) VALUES
    ('MITHRIL', 0.0150, 0.00),
    ('FUNDO_INADIMPLENCIA', 0.0100, 0.00),
    ('PIX', 0.0000, 2.00),
    ('CAMBIAL', 0.0050, 0.00);

-- Fundo de inadimplência inicial
INSERT INTO fundo_inadimplencia (saldo_atual, total_reservado, total_utilizado) 
VALUES (0.00, 0.00, 0.00);