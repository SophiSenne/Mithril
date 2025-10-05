# Mithril Mobile App

Este é o aplicativo mobile do Mithril, convertido de React (Vite) com Tailwind CSS para React Native com Expo.

## 🚀 Funcionalidades

- **Autenticação**: Login e registro com múltiplas etapas
- **Dashboard**: Visão geral de investimentos e crédito
- **Investimentos**: Gestão de portfólio de investimentos
- **Crédito**: Solicitação e gestão de empréstimos
- **Perfil**: Configurações e dados do usuário
- **Navegação**: Sistema de navegação por abas e stack

## 📱 Tecnologias Utilizadas

- **React Native** com **Expo**
- **TypeScript** para tipagem
- **React Navigation** para navegação
- **Expo Vector Icons** para ícones
- **React Native Paper** para componentes UI
- **React Hook Form** para formulários
- **Zod** para validação
- **React Query** para gerenciamento de estado

## 🛠️ Instalação

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app no seu dispositivo móvel

### Passos para instalação

1. **Clone o repositório e navegue para a pasta do mobile:**
   ```bash
   cd src/frontend-mobile
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   # ou
   yarn start
   ```

4. **Execute no dispositivo:**
   - Instale o app **Expo Go** no seu smartphone
   - Escaneie o QR code que aparece no terminal
   - O app será carregado no seu dispositivo

## 📁 Estrutura do Projeto

```
src/frontend-mobile/
├── App.tsx                          # Componente principal
├── app.json                         # Configuração do Expo
├── package.json                     # Dependências do projeto
├── tsconfig.json                    # Configuração do TypeScript
├── babel.config.js                  # Configuração do Babel
├── metro.config.js                  # Configuração do Metro
├── assets/                          # Imagens e recursos
│   └── logo.jpeg
└── src/
    ├── context/
    │   └── ThemeContext.tsx         # Contexto de tema
    ├── navigation/
    │   └── AppNavigator.tsx         # Configuração de navegação
    ├── components/
    │   └── ui/                      # Componentes UI reutilizáveis
    │       ├── Button.tsx
    │       ├── Input.tsx
    │       ├── Card.tsx
    │       ├── Checkbox.tsx
    │       └── Progress.tsx
    └── screens/                     # Telas do aplicativo
        ├── LoginScreen.tsx
        ├── HomeScreen.tsx
        ├── RegistrationStep1Screen.tsx
        ├── RegistrationStep2Screen.tsx
        ├── RegistrationStep3Screen.tsx
        ├── InvestmentsScreen.tsx
        ├── CreditScreen.tsx
        ├── ProfileScreen.tsx
        └── ...
```

## 🎨 Sistema de Design

O app utiliza um sistema de design consistente baseado no tema original:

### Cores
- **Primary**: #1e40af (azul principal)
- **Success**: #10b981 (verde para sucessos)
- **Error**: #ef4444 (vermelho para erros)
- **Warning**: #f59e0b (amarelo para avisos)

### Componentes UI
- **Button**: Botões com diferentes variantes (primary, secondary, outline, ghost)
- **Input**: Campos de entrada com suporte a ícones e validação
- **Card**: Containers para agrupar conteúdo
- **Checkbox**: Caixas de seleção para formulários
- **Progress**: Barras de progresso

## 🔄 Conversões Realizadas

### HTML → React Native
- `div` → `View`
- `span`, `p`, `h1-h6` → `Text`
- `img` → `Image`
- `button` → `TouchableOpacity` ou `Pressable`
- `input` → `TextInput`
- `form` → `View` com `TextInput` components

### CSS → StyleSheet
- Classes Tailwind CSS foram convertidas para `StyleSheet.create()`
- Flexbox mantido com propriedades React Native
- Cores e espaçamentos adaptados para o sistema de tema

### Navegação
- `react-router-dom` → `@react-navigation/native`
- Rotas convertidas para Stack Navigator e Tab Navigator
- Navegação programática adaptada para React Navigation

## 📱 Funcionalidades Implementadas

### ✅ Completas
- Sistema de login e registro
- Navegação por abas e stack
- Dashboard principal
- Telas de investimentos e crédito
- Perfil do usuário
- Componentes UI reutilizáveis
- Sistema de tema consistente

### 🚧 Em Desenvolvimento
- Integração com APIs reais
- Funcionalidades de biometria
- Notificações push
- Gráficos e visualizações avançadas
- Formulários complexos de investimento/crédito

## 🚀 Scripts Disponíveis

```bash
# Iniciar o servidor de desenvolvimento
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar no web
npm run web

# Build para produção (Android)
npm run build:android

# Build para produção (iOS)
npm run build:ios
```

## 📝 Notas Importantes

1. **Assets**: Substitua o arquivo `assets/logo.jpeg` pelo logo real do projeto
2. **APIs**: Configure as URLs das APIs reais no contexto de autenticação
3. **Biometria**: Implemente a funcionalidade de biometria usando `react-native-biometrics`
4. **Notificações**: Configure as notificações push usando Expo Notifications
5. **Validação**: Complete a validação de formulários com Zod

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
