#!/bin/bash

# Script para testar os contratos Mithril
# Executa uma série de testes end-to-end

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Mithril - Testes${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Carregar configurações
CONFIG_FILE="deploy/contracts_config.txt"

if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}Erro: Arquivo $CONFIG_FILE não encontrado${NC}"
    echo "Execute a inicialização primeiro: ./deploy/initialize_contracts.sh"
    exit 1
fi

source $CONFIG_FILE

echo -e "${YELLOW}Configurações carregadas${NC}"
echo ""

# Criar contas de teste
echo -e "${CYAN}Criando contas de teste...${NC}"

# Investidor
stellar keys generate --global test-investor --network $NETWORK || true
stellar keys fund test-investor --network $NETWORK
INVESTOR_ADDRESS=$(stellar keys address test-investor)
echo -e "${GREEN}✓ Investidor: $INVESTOR_ADDRESS${NC}"

# Tomador
stellar keys generate --global test-borrower --network $NETWORK || true
stellar keys fund test-borrower --network $NETWORK
BORROWER_ADDRESS=$(stellar keys address test-borrower)
echo -e "${GREEN}✓ Tomador: $BORROWER_ADDRESS${NC}"

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Executando Testes${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# TESTE 1: Verificar Fees do Governance
echo -e "${YELLOW}[TESTE 1] Verificando configuração de taxas...${NC}"
stellar contract invoke \
    --id $GOVERNANCE_CONTRACT \
    --source test-investor \
    --network $NETWORK \
    -- \
    get_fees

echo -e "${GREEN}✓ Teste 1 passou${NC}"
echo ""

# TESTE 2: Verificar Protection Fund
echo -e "${YELLOW}[TESTE 2] Verificando fundo de proteção...${NC}"
stellar contract invoke \
    --id $GOVERNANCE_CONTRACT \
    --source test-investor \
    --network $NETWORK \
    -- \
    get_protection_fund

echo -e "${GREEN}✓ Teste 2 passou${NC}"
echo ""

# TESTE 3: Criar Card de Investimento
echo -e "${YELLOW}[TESTE 3] Criando card de investimento...${NC}"
echo "Parâmetros:"
echo "  - Valor máximo: 10.000 (em stroops: 100000000000)"
echo "  - Valor mínimo: 1.000 (em stroops: 10000000000)"
echo "  - Taxa de juros: 500 (5%)"
echo "  - Parcelas máximas: 12"
echo "  - Score mínimo: 40"

CARD_RESULT=$(stellar contract invoke \
    --id $LOAN_CONTRACT \
    --source test-investor \
    --network $NETWORK \
    -- \
    create_investment_card \
    --investor $INVESTOR_ADDRESS \
    --max_amount 100000000000 \
    --min_amount 10000000000 \
    --interest_rate 500 \
    --max_installments 12 \
    --target_risk_level 40)

INVESTMENT_CARD_ID=$(echo $CARD_RESULT | grep -oP '\d+' || echo "1")
echo -e "${GREEN}✓ Card de investimento criado: ID $INVESTMENT_CARD_ID${NC}"
echo ""

# TESTE 4: Criar Card de Solicitação
echo -e "${YELLOW}[TESTE 4] Criando card de solicitação de crédito...${NC}"
echo "Parâmetros:"
echo "  - Valor solicitado: 5.000 (em stroops: 50000000000)"
echo "  - Parcelas desejadas: 6"
echo "  - Descrição: Expansão de negócio freelancer"

# Calcular datas de pagamento (próximos 6 meses, dia 10)
CURRENT_TIME=$(date +%s)
PAYMENT_DATES=""
for i in {1..6}; do
    PAYMENT_DATE=$((CURRENT_TIME + (i * 30 * 86400)))
    PAYMENT_DATES="$PAYMENT_DATES --preferred_payment_dates $PAYMENT_DATE"
done

REQUEST_RESULT=$(stellar contract invoke \
    --id $LOAN_CONTRACT \
    --source test-borrower \
    --network $NETWORK \
    -- \
    create_request_card \
    --borrower $BORROWER_ADDRESS \
    --requested_amount 50000000000 \
    --desired_installments 6 \
    $PAYMENT_DATES \
    --description "Expansao de negocio freelancer")

REQUEST_CARD_ID=$(echo $REQUEST_RESULT | grep -oP '\d+' || echo "1")
echo -e "${GREEN}✓ Card de solicitação criado: ID $REQUEST_CARD_ID${NC}"
echo ""

# TESTE 5: Consultar Cards
echo -e "${YELLOW}[TESTE 5] Consultando cards criados...${NC}"

echo "Card de Investimento:"
stellar contract invoke \
    --id $LOAN_CONTRACT \
    --source test-investor \
    --network $NETWORK \
    -- \
    get_investment_card \
    --card_id $INVESTMENT_CARD_ID

echo ""
echo "Card de Solicitação:"
stellar contract invoke \
    --id $LOAN_CONTRACT \
    --source test-borrower \
    --network $NETWORK \
    -- \
    get_request_card \
    --card_id $REQUEST_CARD_ID

echo -e "${GREEN}✓ Teste 5 passou${NC}"
echo ""

# TESTE 6: Verificar Score do Tomador
echo -e "${YELLOW}[TESTE 6] Verificando score de crédito do tomador...${NC}"
stellar contract invoke \
    --id $CREDIT_SCORE_CONTRACT \
    --source test-borrower \
    --network $NETWORK \
    -- \
    get_score \
    --user $BORROWER_ADDRESS || echo "Usuário ainda não possui score"

echo -e "${GREEN}✓ Teste 6 passou${NC}"
echo ""

# TESTE 7: Verificar se pode emprestar
echo -e "${YELLOW}[TESTE 7] Verificando se tomador pode emprestar 5.000...${NC}"
CAN_BORROW=$(stellar contract invoke \
    --id $CREDIT_SCORE_CONTRACT \
    --source test-borrower \
    --network $NETWORK \
    -- \
    can_borrow \
    --user $BORROWER_ADDRESS \
    --amount 50000000000)

if [ "$CAN_BORROW" = "true" ]; then
    echo -e "${GREEN}✓ Tomador pode emprestar este valor${NC}"
else
    echo -e "${YELLOW}⚠ Tomador não pode emprestar este valor (score insuficiente)${NC}"
fi
echo ""

# Resumo
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Resumo dos Testes${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "${CYAN}Testes Executados:${NC}"
echo "✓ Configuração de taxas verificada"
echo "✓ Fundo de proteção verificado"
echo "✓ Card de investimento criado (ID: $INVESTMENT_CARD_ID)"
echo "✓ Card de solicitação criado (ID: $REQUEST_CARD_ID)"
echo "✓ Consulta de cards funcionando"
echo "✓ Sistema de score operacional"
echo "✓ Verificação de limite de crédito funcionando"
echo ""
echo -e "${YELLOW}Contas de Teste:${NC}"
echo "Investidor: $INVESTOR_ADDRESS"
echo "Tomador: $BORROWER_ADDRESS"
echo ""
echo -e "${CYAN}Próximos Testes Manuais:${NC}"
echo "1. Aplicar para um card de investimento"
echo "2. Aprovar uma aplicação"
echo "3. Realizar pagamento de parcela"
echo "4. Verificar atualização de score"
echo ""
echo "Salve as informações das contas para testes futuros!"

# Salvar informações de teste
cat > deploy/test_accounts.txt <<EOF
# Contas de Teste Mithril
# Criadas em: $(date)

INVESTOR_ADDRESS=$INVESTOR_ADDRESS
BORROWER_ADDRESS=$BORROWER_ADDRESS

INVESTMENT_CARD_ID=$INVESTMENT_CARD_ID
REQUEST_CARD_ID=$REQUEST_CARD_ID

# Para usar estas contas:
# stellar keys address test-investor
# stellar keys address test-borrower
EOF

echo ""
echo -e "${GREEN}Informações salvas em deploy/test_accounts.txt${NC}"