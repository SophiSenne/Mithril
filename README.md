# Mithril

💳 **Plataforma de crédito e investimento para freelancers e autônomos**

🔒 Transparente | ⚡ Rápida | 🌍 Justa

O Mithril é uma plataforma de crédito e investimento que visa empoderar freelancers e profissionais autônomos, reconhecendo as dificuldades que esses profissionais enfrentam para acessar crédito devido à renda variável e à falta de histórico formal, o Mithril oferece uma solução transparente, segura e eficiente.

Construído sobre a blockchain Stellar, o Mithril conecta investidores a tomadores de crédito de forma direta, eliminando intermediários e reduzindo a burocracia. Todas as transações são registradas em contratos inteligentes, garantindo total transparência e imutabilidade. Investidores podem escolher onde alocar seus fundos, enquanto tomadores de crédito podem solicitar empréstimos com juros padronizados e significativamente mais baixos do que os praticados pelos bancos tradicionais.

Com o Mithril, freelancers e autônomos ganham acesso a um ecossistema financeiro justo e adaptado às suas realidades, impulsionando seu crescimento e estabilidade financeira.

## Documentação

Acesse a documentação completa do projeto:
👉 [Mithril Docs](https://sophisenne.github.io/Mithril/)

## ✅ Pré-requisitos

- **Docker** e **Docker Compose** (para subir os serviços de backend)
- **Node.js 20+** e **npm** (para a documentação Docusaurus)
- **Expo CLI** e **Expo Go** (para o app mobile)
  - Instale o Expo CLI: `npm i -g @expo/cli`

## 🚀 Tecnologias

- **App Mobile:** React Native
- **Documentação:** Docusaurus
- **Blockchain:** Stellar
- **Backend & APIs:** FastAPI
- **Deploy:** Vercel, Supabase e AWS

## ⚙️ Como executar

Clone o repositório:
```bash
git clone https://github.com/sophisenne/Mithril.git
cd Mithril
```

### Rodar a documentação

```bash
cd docs
npm install
npm start
```

Requisitos:
- Node.js 20 ou superior.

### Rodar o sistema

#### Back-End

```bash
docker compose up --build
```

#### App Mobile

```bash
cd ./src/app-mobile
npm install
npx expo start -c
```

Caso prefira usar túnel (útil em redes restritas):
```bash
npx expo start --tunnel
```

## 📸 Demonstração

![Tela principal do Mithril](./docs/static/img/docusaurus.png)

## 🛠️ Funcionalidades

- [x] App mobile (Expo/React Native)
- [x] Autenticação: login e registro em 3 etapas (fluxos e telas)
- [x] Dashboard: resumo financeiro e cards de ações
- [x] Investimentos: listagem e navegação principal
- [x] Crédito: opções de crédito e telas de solicitação
- [x] Perfil do usuário: dados e configurações básicas
- [x] Navegação por abas (Tab) e pilha (Stack)
- [x] Componentes UI reutilizáveis (Button, Input, Card, Checkbox, Progress)
- [x] Sistema de tema consistente
- [x] Serviços FastAPI orquestrados via Docker Compose
- [x] Mock de API de PIX
- [x] Blockchain (Stellar)
- [x] Repositório de contratos e testes para `credit_score`, `governance` e `loan`
- [ ] Fluxo de pagamentos e liquidação (integração PIX e reconciliação)
- [ ] Biometria/segurança avançada no mobile
- [ ] Observabilidade (logs/metrics) nos serviços
- [ ] Testes (unitários, integração e E2E) e CI/CD

## 📂 Estrutura de Pastas

```bash
├── compose.yaml                # Orquestração dos serviços
├── docs/                       # Documentação (Docusaurus)
│   ├── docs/                   # Conteúdo da documentação
│   ├── src/                    # Código do site
│   └── static/                 # Assets estáticos
├── src/
│   ├── app-mobile/             # App mobile (Expo/React Native)
│   ├── backend/                # APIs (FastAPI) e serviços
└── stellar/                    # Contratos e ferramentas Stellar
```

## 👩‍💻 Equipe

<div align="center">

| [<img src="./docs/static/img/Isabelle.png" width=150><br><sub><b>Isabelle Dantas</b></sub>](https://www.linkedin.com/in/iisabelledantas/) | [<img src="./docs/static/img/sophia.png" width=150><br><sub><b>Sophia Emanuele</b></sub>](https://www.linkedin.com/in/sophia-emanuele-de-senne-silva/) |
|---|---|

</div>

