#!/bin/bash

# Script para deploy dos contratos Mithril na Stellar Mainnet
# ATENÇÃO: Este script faz deploy na mainnet! Use com cuidado!

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${RED}======================================${NC}"
echo -e "${RED}  ATENÇÃO: DEPLOY MAINNET${NC}"
echo -e "${RED}======================================${NC}"
echo ""
echo -e "${YELLOW}Você está prestes a fazer deploy na MAINNET${NC}"
echo -e "${YELLOW}Isso consumirá XLM real!${NC}"
echo ""
read -p "Tem certeza que deseja continuar? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Deploy cancelado"
    exit 0
fi

echo ""

# Verificar se stellar-cli está instalado
if ! command -v stellar &> /dev/null; then
    echo -e "${RED}Erro: stellar-cli não está instalado${NC}"
    echo "Instale com: cargo install --locked stellar-cli"
    exit 1
fi

# Configurações
NETWORK="mainnet"
SOURCE_ACCOUNT=${SOURCE_ACCOUNT:-"default"}

echo -e "${YELLOW}Configurações:${NC}"
echo "Network: $NETWORK"
echo "Source Account: $SOURCE_ACCOUNT"
echo ""

# Verificar saldo
echo -e "${YELLOW}Verificando saldo da conta...${NC}"
BALANCE=$(stellar keys address $SOURCE_ACCOUNT)
echo "Account: $BALANCE"
echo ""

read -p "Confirme o endereço da conta. Continue? (yes/no): " CONFIRM_ACCOUNT
if [ "$CONFIRM_ACCOUNT" != "yes" ]; then
    echo "Deploy cancelado"
    exit 0
fi

# Build dos contratos com otimizações máximas
echo -e "${YELLOW}[1/4] Building contracts (release mode)...${NC}"
stellar contract build --release

if [ $? -ne 0 ]; then
    echo -e "${RED}Erro ao fazer build dos contratos${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build concluído${NC}"
echo ""

# Deploy Credit Score Contract
echo -e "${YELLOW}[2/4] Deploying Credit Score Contract...${NC}"
read -p "Deploy Credit Score Contract? (yes/no): " DEPLOY_CS
if [ "$DEPLOY_CS" = "yes" ]; then
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
else
    echo "Credit Score deploy skipped"
    CREDIT_SCORE_ID="SKIPPED"
fi
echo ""

# Deploy Governance Contract
echo -e "${YELLOW}[3/4] Deploying Governance Contract...${NC}"
read -p "Deploy Governance Contract? (yes/no): " DEPLOY_GOV
if [ "$DEPLOY_GOV" = "yes" ]; then
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
else
    echo "Governance deploy skipped"
    GOVERNANCE_ID="SKIPPED"
fi
echo ""

# Deploy Loan Contract
echo -e "${YELLOW}[4/4] Deploying Loan Contract...${NC}"
read -p "Deploy Loan Contract? (yes/no): " DEPLOY_LOAN
if [ "$DEPLOY_LOAN" = "yes" ]; then
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
else
    echo "Loan deploy skipped"
    LOAN_ID="SKIPPED"
fi
echo ""

# Salvar IDs dos contratos
echo -e "${YELLOW}Saving contract IDs...${NC}"
cat > deployed_contracts_mainnet.txt <<EOF
# Mithril Contracts - MAINNET
# Deployed at: $(date)

CREDIT_SCORE_CONTRACT=$CREDIT_SCORE_ID
GOVERNANCE_CONTRACT=$GOVERNANCE_ID
LOAN_CONTRACT=$LOAN_ID

# Network: $NETWORK
# Source Account: $SOURCE_ACCOUNT
EOF

echo -e "${GREEN}✓ Contract IDs saved to deployed_contracts_mainnet.txt${NC}"
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
echo -e "${RED}IMPORTANTE:${NC}"
echo "1. Guarde os IDs dos contratos em local seguro"
echo "2. Faça backup do arquivo deployed_contracts_mainnet.txt"
echo "3. Inicialize os contratos antes de usar"
echo "4. Configure as integrações entre contratos"
echo ""