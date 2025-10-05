#!/bin/bash

# Script para inicializar os contratos Mithril
# Execute após o deploy dos contratos

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Mithril - Inicialização${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Configurações
NETWORK="testnet"
SOURCE_ACCOUNT=${SOURCE_ACCOUNT:-"mithril-admin"}

# Ler IDs dos contratos deployados
DEPLOY_FILE="deploy/deployed_contracts_testnet.txt"

if [ ! -f "$DEPLOY_FILE" ]; then
    echo -e "${RED}Erro: Arquivo $DEPLOY_FILE não encontrado${NC}"
    echo "Execute o deploy primeiro: ./deploy/deploy_testnet.sh"
    exit 1
fi

# Extrair IDs dos contratos
CREDIT_SCORE_CONTRACT=$(grep "CREDIT_SCORE_CONTRACT=" $DEPLOY_FILE | cut -d'=' -f2)
GOVERNANCE_CONTRACT=$(grep "GOVERNANCE_CONTRACT=" $DEPLOY_FILE | cut -d'=' -f2)
LOAN_CONTRACT=$(grep "LOAN_CONTRACT=" $DEPLOY_FILE | cut -d'=' -f2)

echo -e "${YELLOW}Contratos encontrados:${NC}"
echo "Credit Score: $CREDIT_SCORE_CONTRACT"
echo "Governance:   $GOVERNANCE_CONTRACT"
echo "Loan:         $LOAN_CONTRACT"
echo ""

# Obter endereço do admin
ADMIN_ADDRESS=$(stellar keys address $SOURCE_ACCOUNT)
echo -e "${YELLOW}Admin Address: $ADMIN_ADDRESS${NC}"
echo ""

# Perguntar pelo token (você pode criar um token de teste ou usar USDC testnet)
echo -e "${YELLOW}Configuração do Token:${NC}"
echo "Você precisa de um token Stellar para usar como moeda dos empréstimos."
echo "Opções:"
echo "1. Usar token de teste existente"
echo "2. Criar novo token de teste"
echo ""
read -p "Digite o endereço do token (ou pressione Enter para criar novo): " TOKEN_ADDRESS

if [ -z "$TOKEN_ADDRESS" ]; then
    echo -e "${YELLOW}Criando novo token de teste...${NC}"
    # Aqui você implementaria a criação de um token
    # Por enquanto, vamos usar um placeholder
    TOKEN_ADDRESS="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
    echo "Token criado (simulado): $TOKEN_ADDRESS"
fi

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Iniciando Inicializações${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# PASSO 1: Inicializar Credit Score Contract
echo -e "${YELLOW}[1/3] Inicializando Credit Score Contract...${NC}"
stellar contract invoke \
    --id $CREDIT_SCORE_CONTRACT \
    --source $SOURCE_ACCOUNT \
    --network $NETWORK \
    -- \
    initialize \
    --admin $ADMIN_ADDRESS

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Credit Score Contract inicializado${NC}"
else
    echo -e "${RED}✗ Erro ao inicializar Credit Score Contract${NC}"
    exit 1
fi
echo ""

# PASSO 2: Inicializar Governance Contract
echo -e "${YELLOW}[2/3] Inicializando Governance Contract...${NC}"
echo "Configurando taxas:"
echo "  - Taxa de transação: 0.5% (50 basis points)"
echo "  - Taxa de gás: 0.1% (10 basis points)"

stellar contract invoke \
    --id $GOVERNANCE_CONTRACT \
    --source $SOURCE_ACCOUNT \
    --network $NETWORK \
    -- \
    initialize \
    --admin $ADMIN_ADDRESS \
    --token $TOKEN_ADDRESS \
    --transaction_fee 50 \
    --gas_fee 10

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Governance Contract inicializado${NC}"
else
    echo -e "${RED}✗ Erro ao inicializar Governance Contract${NC}"
    exit 1
fi
echo ""

# PASSO 3: Inicializar Loan Contract
echo -e "${YELLOW}[3/3] Inicializando Loan Contract...${NC}"
stellar contract invoke \
    --id $LOAN_CONTRACT \
    --source $SOURCE_ACCOUNT \
    --network $NETWORK \
    -- \
    initialize \
    --admin $ADMIN_ADDRESS \
    --token $TOKEN_ADDRESS \
    --governance_contract $GOVERNANCE_CONTRACT \
    --credit_score_contract $CREDIT_SCORE_CONTRACT

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Loan Contract inicializado${NC}"
else
    echo -e "${RED}✗ Erro ao inicializar Loan Contract${NC}"
    exit 1
fi
echo ""

# Salvar configuração
echo -e "${YELLOW}Salvando configuração...${NC}"
cat > deploy/contracts_config.txt <<EOF
# Mithril Contracts Configuration
# Initialized at: $(date)

NETWORK=$NETWORK
ADMIN_ADDRESS=$ADMIN_ADDRESS
TOKEN_ADDRESS=$TOKEN_ADDRESS

CREDIT_SCORE_CONTRACT=$CREDIT_SCORE_CONTRACT
GOVERNANCE_CONTRACT=$GOVERNANCE_CONTRACT
LOAN_CONTRACT=$LOAN_CONTRACT

# Fees
TRANSACTION_FEE=50  # 0.5%
GAS_FEE=10          # 0.1%
EOF

echo -e "${GREEN}✓ Configuração salva em deploy/contracts_config.txt${NC}"
echo ""

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Inicialização Concluída!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo "Próximo passo: Configurar integrações entre contratos"
echo "Execute: ./deploy/integrate_contracts.sh"