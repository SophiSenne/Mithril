#!/bin/bash

echo "🚀 Instalando dependências do Mithril Mobile..."

# Limpar cache e node_modules
echo "🧹 Limpando cache e dependências antigas..."
rm -rf node_modules
rm -rf .expo
npm cache clean --force

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Verificar instalação
echo "✅ Verificando instalação..."
npx expo doctor

echo "🎉 Instalação concluída!"
echo ""
echo "Para iniciar o app, execute:"
echo "npm start"
echo ""
echo "Para usar com túnel (recomendado):"
echo "npx expo start --tunnel"
