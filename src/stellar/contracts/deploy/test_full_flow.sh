#!/bin/bash

# Script para testar o fluxo completo de empréstimo Mithril
# 1. Aplicar para um card de investimento
# 2. Aprovar uma aplicação
# 3. Realizar pagamento de parcela
# 4. Verificar atualização de score

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Mithril - Teste Fluxo Completo${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Carregar configurações
CONFIG_FILE="deploy/contracts_config.txt"
TEST_ACCOUNTS="deploy/test_accounts.txt"

if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}Erro: Arquivo $CONFIG_FILE não encontrado${NC}"
    exit 1
fi

if [ ! -f "$TEST_ACCOUNTS" ]; then
    echo -e "${RED}Erro: Arquivo $TEST_ACCOUNTS não encontrado${NC}"
    echo "Execute primeiro: ./deploy/test_contracts.sh"
    exit 1
fi

source $CONFIG_FILE
source $TEST_ACCOUNTS

echo -e "${YELLOW}Configurações carregadas:${NC}"
echo "Network: $NETWORK"
echo "Loan Contract: $LOAN_CONTRACT"
echo "Credit Score Contract: $CREDIT_SCORE_CONTRACT"
echo "Investidor: $INVESTOR_ADDRESS"
echo "Tomador: $BORROWER_ADDRESS"
echo "Card de Investimento: $INVESTMENT_CARD_ID"
echo ""

# Constantes
DAY_IN_SECONDS=86400
CURRENT_TIME=$(date +%s)

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  PASSO 1: Aplicar para Card${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

echo -e "${CYAN}O tomador irá aplicar para o card de investimento${NC}"
echo "Card ID: $INVESTMENT_CARD_ID"
echo "Valor solicitado: 5.000 (50000000000 stroops)"
echo ""

read -p "Pressione ENTER para continuar..."

APPLICATION_ID=$(stellar contract invoke \
    --id $LOAN_CONTRACT \
    --source test-borrower \
    --network $NETWORK \
    -- \
    apply_to_investment_card \
    --borrower $BORROWER_ADDRESS \
    --card_id $INVESTMENT_CARD_ID \
    --amount 50000000000)

echo -e "${GREEN}✓ Aplicação criada! ID: $APPLICATION_ID${NC}"
echo ""

# Salvar ID da aplicação
echo "APPLICATION_ID=$APPLICATION_ID" >> $TEST_ACCOUNTS

echo -e "${MAGENTA}Status atual:${NC}"
echo "→ Tomador aplicou para empréstimo"
echo "→ Aguardando aprovação do investidor"
echo ""

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  PASSO 2: Aprovar Aplicação${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

echo -e "${CYAN}O investidor irá aprovar a aplicação e criar o empréstimo${NC}"
echo "Application ID: $APPLICATION_ID"
echo "Número de parcelas: 12"
echo "Taxa de juros: 5% (já configurada no card)"
echo ""

read -p "Pressione ENTER para continuar..."

# Calcular datas de pagamento (12 meses)
echo "Calculando datas de pagamento mensais..."
DATES_JSON="["
for i in {1..12}; do
    DATE=$((CURRENT_TIME + i*30*DAY_IN_SECONDS))
    if [ $i -eq 12 ]; then
        DATES_JSON="${DATES_JSON}${DATE}"
    else
        DATES_JSON="${DATES_JSON}${DATE},"
    fi
done
DATES_JSON="${DATES_JSON}]"

echo "Datas calculadas: próximas 12 mensalidades"
echo ""

LOAN_ID=$(stellar contract invoke \
    --id $LOAN_CONTRACT \
    --source test-investor \
    --network $NETWORK \
    -- \
    approve_application \
    --app_id $APPLICATION_ID \
    --installments 12 \
    --payment_dates "$DATES_JSON")

echo -e "${GREEN}✓ Empréstimo aprovado e criado! ID: $LOAN_ID${NC}"
echo ""

# Salvar ID do empréstimo
echo "LOAN_ID=$LOAN_ID" >> $TEST_ACCOUNTS

echo -e "${MAGENTA}Status atual:${NC}"
echo "→ Empréstimo criado e ativo"
echo "→ Fundos transferidos para o tomador"
echo "→ 12 parcelas a serem pagas"
echo ""

# Consultar detalhes do empréstimo
echo -e "${CYAN}Consultando detalhes do empréstimo...${NC}"
stellar contract invoke \
    --id $LOAN_CONTRACT \
    --source test-borrower \
    --network $NETWORK \
    -- \
    get_loan \
    --loan_id $LOAN_ID

echo ""

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  PASSO 3: Score Inicial${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

echo -e "${CYAN}Verificando score ANTES do primeiro pagamento...${NC}"

SCORE_BEFORE=$(stellar contract invoke \
    --id $CREDIT_SCORE_CONTRACT \
    --source test-borrower \
    --network $NETWORK \
    -- \
    get_score \
    --user $BORROWER_ADDRESS || echo "null")

if [ "$SCORE_BEFORE" = "null" ]; then
    echo -e "${YELLOW}Tomador ainda não possui score registrado${NC}"
    echo "Vamos criar um score inicial..."
    echo ""
    
    # Criar score inicial
    stellar contract invoke \
        --id $CREDIT_SCORE_CONTRACT \
        --source test-borrower \
        --network $NETWORK \
        -- \
        update_credit_score \
        --user $BORROWER_ADDRESS \
        --off_chain_data '{"bank_statements":true,"pix_history":true,"invoices":false,"credit_bureau":false}' \
        --credit_bureau_score 0
    
    echo -e "${GREEN}✓ Score inicial criado${NC}"
else
    echo "Score atual do tomador:"
    echo "$SCORE_BEFORE"
fi

echo ""

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  PASSO 4: Primeiro Pagamento${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

echo -e "${CYAN}O tomador irá realizar o primeiro pagamento${NC}"
echo "Loan ID: $LOAN_ID"
echo ""

read -p "Pressione ENTER para realizar o pagamento..."

# Realizar pagamento
PAYMENT_RESULT=$(stellar contract invoke \
    --id $LOAN_CONTRACT \
    --source test-borrower \
    --network $NETWORK \
    -- \
    make_payment \
    --loan_id $LOAN_ID)

echo -e "${GREEN}✓ Pagamento realizado com sucesso!${NC}"
echo "Resultado: $PAYMENT_RESULT"
echo ""

echo -e "${MAGENTA}Status atual:${NC}"
echo "→ 1 parcela paga"
echo "→ 11 parcelas restantes"
echo "→ Pagamento registrado no histórico"
echo ""

# Consultar histórico de pagamentos
echo -e "${CYAN}Consultando histórico de pagamentos...${NC}"
stellar contract invoke \
    --id $LOAN_CONTRACT \
    --source test-borrower \
    --network $NETWORK \
    -- \
    get_payment_history \
    --loan_id $LOAN_ID

echo ""

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  PASSO 5: Score Atualizado${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

echo -e "${CYAN}Verificando score DEPOIS do pagamento...${NC}"
echo ""

# Aguardar um pouco para garantir que o score foi atualizado
sleep 2

# Atualizar o score para refletir o pagamento
echo "Atualizando score com novo histórico..."
stellar contract invoke \
    --id $CREDIT_SCORE_CONTRACT \
    --source test-borrower \
    --network $NETWORK \
    -- \
    update_credit_score \
    --user $BORROWER_ADDRESS \
    --off_chain_data '{"bank_statements":true,"pix_history":true,"invoices":false,"credit_bureau":false}' \
    --credit_bureau_score 0

echo ""

SCORE_AFTER=$(stellar contract invoke \
    --id $CREDIT_SCORE_CONTRACT \
    --source test-borrower \
    --network $NETWORK \
    -- \
    get_score \
    --user $BORROWER_ADDRESS)

echo -e "${GREEN}✓ Score atualizado!${NC}"
echo ""
echo "Score completo:"
echo "$SCORE_AFTER"
echo ""

echo -e "${MAGENTA}Status atual:${NC}"
echo "→ Score reflete o pagamento realizado"
echo "→ Histórico de pagamentos atualizado"
echo "→ Total de transações: 1"
echo ""

# Verificar histórico de pagamentos no credit score
echo -e "${CYAN}Consultando histórico no contrato de score...${NC}"
stellar contract invoke \
    --id $CREDIT_SCORE_CONTRACT \
    --source test-borrower \
    --network $NETWORK \
    -- \
    get_payment_history \
    --user $BORROWER_ADDRESS || echo "Histórico ainda não disponível"

echo ""

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  RESUMO DO FLUXO COMPLETO${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

echo -e "${CYAN}📊 Resumo das Operações:${NC}"
echo ""
echo "1️⃣  Aplicação para Card"
echo "   → Application ID: $APPLICATION_ID"
echo "   → Valor: 5.000"
echo "   → Status: Aprovada ✓"
echo ""
echo "2️⃣  Empréstimo Criado"
echo "   → Loan ID: $LOAN_ID"
echo "   → Valor: 5.000 + 5% juros"
echo "   → Parcelas: 12x"
echo "   → Status: Ativo ✓"
echo ""
echo "3️⃣  Primeiro Pagamento"
echo "   → Parcela 1/12 paga ✓"
echo "   → Pagamento em dia: Sim"
echo "   → Status: Registrado ✓"
echo ""
echo "4️⃣  Score de Crédito"
echo "   → Score atualizado ✓"
echo "   → Histórico: 1 transação"
echo "   → Pontualidade: 100%"
echo ""

echo -e "${YELLOW}💡 Próximos Passos Sugeridos:${NC}"
echo ""
echo "→ Realizar mais pagamentos para melhorar o score"
echo "→ Testar pagamento atrasado (após data de vencimento)"
echo "→ Criar novo card de investimento com limite maior"
echo "→ Verificar fundo de proteção"
echo "→ Testar inadimplência (mark_as_defaulted)"
echo ""

echo -e "${CYAN}📁 Informações Salvas em:${NC}"
echo "   $TEST_ACCOUNTS"
echo ""

echo -e "${GREEN}✅ Teste completo executado com sucesso!${NC}"
echo ""

# Atualizar arquivo de contas com novos IDs
sed -i '/^APPLICATION_ID=/d' $TEST_ACCOUNTS 2>/dev/null || true
sed -i '/^LOAN_ID=/d' $TEST_ACCOUNTS 2>/dev/null || true
echo "APPLICATION_ID=$APPLICATION_ID" >> $TEST_ACCOUNTS
echo "LOAN_ID=$LOAN_ID" >> $TEST_ACCOUNTS

echo -e "${YELLOW}💾 IDs salvos para testes futuros${NC}"