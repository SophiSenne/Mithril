# Documentação Técnica \- Frontend Mobile Mithril

## 1\. Visão Geral

O **Mithril Mobile** é uma aplicação desenvolvida em React Native com o framework Expo, representando a evolução estratégica da plataforma web Mithril para o ambiente móvel. A migração foi motivada pela necessidade de oferecer uma experiência de usuário mais acessível, conveniente e otimizada para os investidores e tomadores de crédito que utilizam o sistema. O objetivo central é permitir acesso rápido e seguro às funcionalidades de investimento e solicitação de crédito diretamente de dispositivos móveis, aproveitando a capacidade de uma interação mais fluida e engajadora.

## 2\. Estrutura do Projeto

A estrutura do projeto foi organizada para promover a escalabilidade, manutenibilidade e clareza, separando as responsabilidades em diretórios bem definidos. A adoção de uma arquitetura baseada em componentes permite um alto grau de reutilização e consistência visual em toda a aplicação.

``` bash
src/app-mobile/

├── assets/                         \# Recursos estáticos como imagens e fontes

├── src/

│   ├── components/                 \# Componentes de UI reutilizáveis e globais

│   │   └── ui/                     \# Componentes de interface de baixo nível (folhas da árvore)

│   │       ├── Button.tsx          \# Botão customizado com variantes de estilo

│   │       ├── Card.tsx            \# Componente de container para agrupar informações

│   │       ├── Checkbox.tsx        \# Caixa de seleção para formulários

│   │       ├── Input.tsx           \# Campo de entrada de texto com validação

│   │       └── Progress.tsx        \# Barra de progresso para fluxos de múltiplas etapas

│   ├── context/

│   │   └── ThemeContext.tsx        \# Contexto para gerenciamento do tema (cores, espaçamentos, tipografia)

│   ├── navigation/

│   │   └── AppNavigator.tsx        \# Configuração central da navegação (Stack e Tab Navigator)

│   └── screens/                    \# Telas da aplicação, representando cada rota

│       ├── LoginScreen.tsx

│       ├── RegistrationStep1Screen.tsx

│       ├── RegistrationStep2Screen.tsx

│       ├── RegistrationStep2AScreen.tsx

│       ├── RegistrationStep2BScreen.tsx

│       ├── RegistrationStep3Screen.tsx

│       ├── HomeScreen.tsx

│       ├── InvestmentDashboardScreen.tsx

│       ├── CreditDashboardScreen.tsx

│       ├── ExtractScreen.tsx

│       ├── CreateCreditOpportunityScreen.tsx

│       ├── CreateInvestmentRequestScreen.tsx

│       ├── CreditRequestScreen.tsx

│       ├── LoanOpportunitiesScreen.tsx

│       └── ProfileScreen.tsx

├── App.tsx                         \# Componente raiz da aplicação, onde os providers são inicializados

├── app.json                        \# Arquivo de configuração do Expo (nome, ícone, splash screen, etc.)

├── package.json                    \# Dependências do projeto e scripts de execução

├── tsconfig.json                   \# Configuração do compilador TypeScript

├── babel.config.js                 \# Configuração do Babel para transpilação de código

└── metro.config.js                 \# Configuração do Metro Bundler, o bundler para React Native

```
x
## 3\. Fluxos de Usuário

Os fluxos de usuário foram desenhados para serem intuitivos, guiando o usuário através das tarefas principais com o mínimo de atrito.

### Fluxo 1: Cadastro de Novo Usuário

1. **Início**: O usuário clica em "Cadastre-se" na `LoginScreen`.  
2. **Etapa 1 (`RegistrationStep1Screen`)**: Preenche dados pessoais (nome, CPF, etc.) e aceita os termos (LGPD).  
3. **Etapa 2 (`RegistrationStep2Screen`, `2AScreen`, `2BScreen`)**: Seleciona e responde a perguntas de segurança para futura recuperação de conta.  
4. **Etapa 3 (`RegistrationStep3Screen`)**: Recebe a confirmação de cadastro e é redirecionado para a `LoginScreen`.

### Fluxo 2: Criação de uma Oportunidade de Crédito (Investidor)

1. **Início**: Na `HomeScreen` ou `InvestmentDashboardScreen`, o investidor navega para a seção de oportunidades.  
2. **Listagem (`LoanOpportunitiesScreen`)**: Visualiza as oportunidades existentes e clica em "Criar Nova Oportunidade".  
3. **Criação (`CreateCreditOpportunityScreen`)**: Preenche o formulário com os detalhes da oportunidade (valor, taxa, prazo, perfil de risco).  
4. **Confirmação**: Após a submissão, a nova oportunidade é enviada ao backend e o usuário recebe uma notificação de sucesso.

### Fluxo 3: Solicitação de um Empréstimo (Tomador)

1. **Início**: Na `HomeScreen` ou `CreditDashboardScreen`, o tomador clica em "Solicitar Crédito".  
2. **Simulação/Listagem (`CreditRequestScreen`)**: O usuário pode simular um empréstimo ou visualizar as oportunidades de crédito disponíveis que se encaixam em seu perfil.  
3. **Solicitação (`CreateInvestmentRequestScreen`)**: Preenche um formulário detalhado com o valor desejado, finalidade e informações adicionais.  
4. **Análise**: A solicitação é enviada para análise e o usuário pode acompanhar o status em seu dashboard.

## 4\. Instalação e Configuração

Para configurar e executar o projeto em um ambiente de desenvolvimento local, siga os passos abaixo.

### Pré-requisitos

- **Node.js**: Versão 18 ou superior.  
- **Gerenciador de Pacotes**: `npm` ou `yarn`.  
- **Expo CLI**: Instalado globalmente (`npm install -g @expo/cli`).  
- **Ambiente de Simulação**: App Expo Go (iOS/Android) ou um simulador/emulador configurado (Xcode/Android Studio).

### Passos de Instalação

1. **Clonar o Repositório e Instalar Dependências**: Navegue até o diretório `src/app-mobile` e execute o comando para instalar as dependências listadas no `package.json`.  
```bash     
   cd src/app-mobile  
     
   npm install  
```     
2. **Instalar Dependências Nativas (se necessário)**: O Expo pode requerer a instalação de versões específicas de pacotes nativos. O comando a seguir resolve inconsistências.  
```bash     
   npx expo install \--fix  
``` 
### Executando a Aplicação

- **Iniciar o Servidor de Desenvolvimento**: Este comando inicia o Metro Bundler e exibe um QR Code para abrir a aplicação no Expo Go.  

```bash    
npx expo start --clear  
``` 