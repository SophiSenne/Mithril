# Guia de Instalação - Mithril Mobile

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### 1. Node.js e npm
- **Node.js**: versão 16 ou superior
- **npm**: versão 8 ou superior (vem com o Node.js)

Verifique as versões:
```bash
node --version
npm --version
```

### 2. Expo CLI
Instale globalmente:
```bash
npm install -g @expo/cli
```

### 3. Expo Go App
- **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

## 🚀 Instalação Passo a Passo

### 1. Navegue para o diretório do projeto
```bash
cd /home/inteli/Mithril/src/frontend-mobile
```

### 2. Instale as dependências
```bash
npm install
```

**Nota**: Se encontrar erros de dependências, tente:
```bash
npm install --legacy-peer-deps
```

### 3. Inicie o servidor de desenvolvimento
```bash
npm start
```

### 4. Execute no dispositivo

#### Opção A: Usando Expo Go (Recomendado para desenvolvimento)
1. Abra o app **Expo Go** no seu smartphone
2. Escaneie o QR code que aparece no terminal
3. Aguarde o app carregar

#### Opção B: Usando emulador
```bash
# Para Android
npm run android

# Para iOS (apenas no macOS)
npm run ios
```

## 🔧 Solução de Problemas

### Erro de dependências
Se encontrar erros relacionados a dependências:
```bash
# Limpe o cache do npm
npm cache clean --force

# Delete node_modules e reinstale
rm -rf node_modules
npm install
```

### Erro de Metro bundler
```bash
# Limpe o cache do Metro
npx expo start --clear
```

### Problemas com Expo Go
1. Certifique-se de que o dispositivo e o computador estão na mesma rede Wi-Fi
2. Tente usar o túnel do Expo:
   ```bash
   npx expo start --tunnel
   ```

### Erro de TypeScript
Se houver erros de TypeScript, verifique se todas as dependências estão instaladas:
```bash
npm install @types/react @types/react-native
```

## 📱 Testando o App

### Funcionalidades Disponíveis
1. **Login**: Tela de login com validação
2. **Registro**: Processo de cadastro em 3 etapas
3. **Dashboard**: Tela principal com resumo financeiro
4. **Investimentos**: Lista de investimentos
5. **Crédito**: Opções de crédito disponíveis
6. **Perfil**: Configurações do usuário

### Navegação
- Use as abas na parte inferior para navegar entre as seções principais
- Use o botão "Voltar" para retornar às telas anteriores
- O app mantém o estado de navegação entre as telas

## 🛠️ Desenvolvimento

### Estrutura de Arquivos
```
src/
├── components/ui/     # Componentes reutilizáveis
├── screens/          # Telas do aplicativo
├── navigation/       # Configuração de navegação
├── context/          # Contextos React (tema, etc.)
└── assets/           # Imagens e recursos
```

### Adicionando Novas Telas
1. Crie o componente da tela em `src/screens/`
2. Adicione a rota em `src/navigation/AppNavigator.tsx`
3. Configure a navegação conforme necessário

### Modificando Estilos
1. Edite o tema em `src/context/ThemeContext.tsx`
2. Use o hook `useTheme()` nos componentes
3. Mantenha consistência com o design system

## 📦 Build para Produção

### Android
```bash
# Build local
npx expo build:android

# Ou usando EAS Build (recomendado)
npx eas build --platform android
```

### iOS
```bash
# Build local (apenas no macOS)
npx expo build:ios

# Ou usando EAS Build
npx eas build --platform ios
```

## 🔍 Debugging

### Logs do Console
```bash
# Android
npx react-native log-android

# iOS
npx react-native log-ios
```

### Debug no Expo Go
1. Agite o dispositivo
2. Selecione "Debug Remote JS"
3. Abra o Chrome DevTools

## 📚 Recursos Adicionais

- [Documentação do Expo](https://docs.expo.dev/)
- [Documentação do React Navigation](https://reactnavigation.org/)
- [Documentação do React Native](https://reactnative.dev/)
- [Guia de TypeScript para React Native](https://reactnative.dev/docs/typescript)

## 🆘 Suporte

Se encontrar problemas:

1. Verifique se seguiu todos os passos de instalação
2. Consulte a documentação oficial do Expo
3. Verifique se todas as dependências estão atualizadas
4. Limpe o cache e reinstale as dependências

## 📝 Notas Importantes

- O app está configurado para funcionar com Expo Go para desenvolvimento
- Para produção, será necessário configurar builds nativos
- Algumas funcionalidades (como biometria) precisam de configuração adicional
- O app usa TypeScript, então certifique-se de manter a tipagem correta
