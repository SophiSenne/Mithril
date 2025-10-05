#!/bin/bash

# Script para integrar os contratos Mithril
# Configure as permissões e conexões entre contratos

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Mithril - Integração${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Configurações
CONFIG_FILE="deploy/contracts_config.txt"

if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}Erro: Arquivo $CONFIG_FILE não encontrado${NC}"
    echo "Execute a inicialização primeiro: ./deploy/initialize_contracts.sh"
    exit 1
fi

# Carregar configurações
source $CONFIG_FILE

echo -e "${YELLOW}Configurações carregadas:${NC}"
echo "Network: $NETWORK"
echo "Admin: $ADMIN_ADDRESS"
echo ""
echo "Contratos:"
echo "  Credit Score: $CREDIT_SCORE_CONTRACT"
echo "  Governance:   $GOVERNANCE_CONTRACT"
echo "  Loan:         $LOAN_CONTRACT"
echo ""

SOURCE_ACCOUNT="mithril-admin"

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Configurando Integrações${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# INTEGRAÇÃO 1: Credit Score precisa conhecer o Loan Contract
echo -e "${YELLOW}[1/1] Configurando Credit Score Contract...${NC}"
echo "Definindo Loan Contract autorizado para registrar pagamentos"

stellar contract invoke \
    --id $CREDIT_SCORE_CONTRACT \
    --source $SOURCE_ACCOUNT \
    --network $NETWORK \
    -- \
    set_loan_contract \
    --loan_contract $LOAN_CONTRACT

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Credit Score integrado com Loan Contract${NC}"
else
    echo -e "${RED}✗ Erro na integração${NC}"
    exit 1
fi
echo ""

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Integração Concluída!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "${YELLOW}Status das Integrações:${NC}"
echo "✓ Credit Score ← Loan Contract (autorizado a registrar pagamentos)"
echo "✓ Loan → Credit Score (pode verificar scores)"
echo "✓ Loan → Governance (coleta taxas)"
echo ""
echo "Próximo passo: Testar as funcionalidades"
echo "Execute: ./deploy/test_contracts.sh"