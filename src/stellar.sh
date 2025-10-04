#!/bin/bash
# Script para criar a estrutura completa do projeto Mithril Wallets

set -e  # Parar em caso de erro

echo "🚀 Criando estrutura do projeto Mithril Wallets..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Diretório base
BASE_DIR="./stellar/wallets"

# Criar estrutura de diretórios
echo -e "${BLUE}📁 Criando diretórios...${NC}"
mkdir -p "$BASE_DIR/src/wallet"
mkdir -p "$BASE_DIR/src/stellar"
mkdir -p "$BASE_DIR/src/utils"
mkdir -p "$BASE_DIR/tests"
mkdir -p "$BASE_DIR/examples"

# Criar mod.rs para wallet
echo -e "${GREEN}✓${NC} Criando src/wallet/mod.rs"
cat > "$BASE_DIR/src/wallet/mod.rs" << 'EOF'
//! Módulo de gerenciamento de wallets

pub mod types;
pub mod manager;

// Re-exports
pub use types::{MithrilWallet, UserType, PublicWalletInfo};
pub use manager::WalletManager;
EOF

# Criar mod.rs para stellar
echo -e "${GREEN}✓${NC} Criando src/stellar/mod.rs"
cat > "$BASE_DIR/src/stellar/mod.rs" << 'EOF'
//! Módulo de integração com Stellar

pub mod wallet;
pub mod encoding;

pub use wallet::create_stellar_wallet;
pub use encoding::{encode_stellar_public_key, encode_stellar_secret_key};
EOF

# Criar mod.rs para utils
echo -e "${GREEN}✓${NC} Criando src/utils/mod.rs"
cat > "$BASE_DIR/src/utils/mod.rs" << 'EOF'
//! Utilitários

pub mod validation;

pub use validation::{
    is_valid_stellar_public_key,
    is_valid_stellar_secret_key,
    is_valid_email,
};
EOF

# Mensagem de instruções
echo ""
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Estrutura de diretórios criada com sucesso!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Copie o conteúdo dos arquivos do artefato anterior para:"
echo "   - src/wallet/types.rs"
echo "   - src/wallet/manager.rs"
echo "   - src/stellar/wallet.rs"
echo "   - src/stellar/encoding.rs"
echo "   - src/utils/validation.rs"
echo "   - src/lib.rs"
echo ""
echo "2. Atualize o Cargo.toml com as dependências:"
echo "   cd $BASE_DIR"
echo "   # Edite Cargo.toml conforme o artefato"
echo ""
echo "3. Compile o projeto:"
echo "   cargo build"
echo ""
echo "4. Execute os testes:"
echo "   cargo test"
echo ""
echo "5. Rode o exemplo:"
echo "   cargo run --example create_wallets"
echo ""
echo -e "${BLUE}════════════════════════════════════════════════${NC}"