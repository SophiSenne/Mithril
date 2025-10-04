#!/bin/bash

# Script para deploy dos contratos Mithril na Stellar Testnet
# Pré-requisitos: stellar-cli instalado e configurado

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Mithril - Deploy Testnet${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# Verificar se stellar-cli está instalado
if ! command -v stellar &> /dev/null; then
    echo -e "${RED}Erro: stellar-cli não está instalado${NC}"
    echo "Instale com: cargo install --locked stellar-cli"
    exit 1
fi

# Configurações
NETWORK="testnet"
SOURCE_ACCOUNT=${SOURCE_ACCOUNT:-"default"}

echo -e "${YELLOW}Configurações:${NC}"
echo "Network: $NETWORK"
echo "Source Account: $SOURCE_ACCOUNT"
echo ""

# Build dos contratos
echo -e "${YELLOW}[1/4] Building contracts...${NC}"
stellar contract build

if [ $? -ne 0 ]; then
    echo -e "${RED}Erro ao fazer build dos contratos${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build concluído${NC}"
echo ""

# Deploy Credit Score Contract
echo -e "${YELLOW}[2/4] Deploying Credit Score Contract...${NC}"
CREDIT_SCORE_ID=$(stellar contract deploy \
    --wasm target/wasm32-unknown-unknown/release/credit_score.wasm \
    --source $SOURCE_ACCOUNT \
    --network $NETWORK)

if [ -z "$CREDIT_SCORE_ID" ]; then
    echo -e "${RED}Erro ao fazer deploy do Credit Score Contract${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Credit Score Contract deployed${NC}"
echo "Contract ID: $CREDIT_SCORE_ID"
echo ""

# Deploy Governance Contract
echo -e "${YELLOW}[3/4] Deploying Governance Contract...${NC}"
GOVERNANCE_ID=$(stellar contract deploy \
    --wasm target/wasm32-unknown-unknown/release/governance.wasm \
    --source $SOURCE_ACCOUNT \
    --network $NETWORK)

if [ -z "$GOVERNANCE_ID" ]; then
    echo -e "${RED}Erro ao fazer deploy do Governance Contract${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Governance Contract deployed${NC}"
echo "Contract ID: $GOVERNANCE_ID"
echo ""

# Deploy Loan Contract
echo -e "${YELLOW}[4/4] Deploying Loan Contract...${NC}"
LOAN_ID=$(stellar contract deploy \
    --wasm target/wasm32-unknown-unknown/release/loan.wasm \
    --source $SOURCE_ACCOUNT \
    --network $NETWORK)

if [ -z "$LOAN_ID" ]; then
    echo -e "${RED}Erro ao fazer deploy do Loan Contract${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Loan Contract deployed${NC}"
echo "Contract ID: $LOAN_ID"
echo ""

# Salvar IDs dos contratos
echo -e "${YELLOW}Saving contract IDs...${NC}"
cat > deployed_contracts_testnet.txt <<EOF
# Mithril Contracts - Testnet
# Deployed at: $(date)

CREDIT_SCORE_CONTRACT=$CREDIT_SCORE_ID
GOVERNANCE_CONTRACT=$GOVERNANCE_ID
LOAN_CONTRACT=$LOAN_ID

# Network: $NETWORK
# Source Account: $SOURCE_ACCOUNT
EOF

echo -e "${GREEN}✓ Contract IDs saved to deployed_contracts_testnet.txt${NC}"
echo ""

# Resumo
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Deploy Concluído!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo "Contract IDs:"
echo "  Credit Score: $CREDIT_SCORE_ID"
echo "  Governance:   $GOVERNANCE_ID"
echo "  Loan:         $LOAN_ID"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Inicializar os contratos"
echo "2. Configurar as integrações entre contratos"
echo "3. Testar as funcionalidades"
echo ""
echo "Use o arquivo deployed_contracts_testnet.txt para referência"