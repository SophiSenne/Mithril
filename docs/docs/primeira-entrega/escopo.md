---
sidebar_position: 3
title: Escopo
---

&emsp; Embora a arquitetura completa do sistema represente uma visão de longo prazo, durante o hackathon será desenvolvida uma versão reduzida, com foco em validar os principais fluxos críticos e comprovar a viabilidade técnica da proposta. O objetivo é entregar um protótipo funcional que demonstre o valor da solução, ainda que com escopo limitado em relação às funcionalidades finais previstas.  

## Funcionalidades

* **Cadastro e Autenticação de Usuários (RF01, RF02):**
  - Criação de perfis de usuários.
  - Login com credenciais e autenticação segura via JWT.

* **Operações Básicas na Blockchain:**
  - Depósito de fundos via Pix (mockado) integrado à carteira (RF04).
  - Resgate de fundos pelo investidor (RF05).
  - Solicitação inicial de empréstimo (RF06).

* **Score Inicial e Suitability:**
  - Cálculo de um `Score Dinâmico` inicial do usuário (RF08).
  - Aplicação de formulário de suitability para personalização da experiência (RF01).

* **Registro de Transações na Blockchain:**
  - Todas as movimentações (depósitos, resgates e empréstimos) registradas na rede Stellar.

* **Logs Essenciais (RF13):**
  - Armazenamento mínimo de auditoria para rastreabilidade de ações críticas.

* **Cálculo de Score e Juros:**
  - Determinação de condições de crédito com base no score inicial.

* **Integração com Frontend:**
  - Disponibilização de rotas de API conectadas ao banco relacional para suportar o aplicativo.  

## Justificativa

&emsp; O escopo reduzido foi definido considerando as restrições de tempo e recursos do hackathon. As funcionalidades selecionadas priorizam a validação da proposta de valor, garantindo a entrega de um MVP funcional que demonstra a viabilidade técnica da solução, mesmo que limitado em relação à visão final do produto.
