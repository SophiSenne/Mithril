---
sidebar_position: 1
title: Diagrama de Arquitetura
---

Este documento descreve a arquitetura proposta para o sistema, que integra blockchain, open finance, machine learning e microsserviços. O objetivo é oferecer segurança, escalabilidade, transparência e suporte a funcionalidades de detecção de fraudes, recomendação de crédito e atendimento ao usuário.

---

## 1. Visão Geral

A arquitetura é composta por:

* **Camada de Cliente** (aplicativo mobile);
* **API Gateway** para autenticação e gerenciamento de requisições;
* **Microsserviços** desenvolvidos em **FastAPI** e Rust;
* **Componentes de Machine Learning** para detecção de fraudes e recomendações;
* **Armazenamento** distribuído entre bancos relacionais, NoSQL e object storage;
* **Integrações externas** (PIX, Serasa, Open Finance, Stellar Blockchain);
* **Recursos do Dispositivo** (biometria e reconhecimento facial).

---

## 2. Camada de Cliente

* **React Native App (iOS & Android)**
  Aplicativo que oferece interface para usuários finais realizarem transferências, solicitarem crédito, receberem recomendações e interagirem com o chatbot.
  Conecta-se exclusivamente ao **API Gateway**.

---

## 3. API Gateway

* **API Gateway (JWT Authentication, Rate Limiting)**
  Responsável por:

  * Autenticação e autorização (JWT);
  * Controle de tráfego e limitação de requisições;
  * Encaminhamento de chamadas aos microsserviços.

---

## 4. Microsserviços (FastAPI + Rust)

### 4.1 Autenticação

* **Autenticação (FastAPI + JWT)**
  Fornece autenticação de usuários e gestão de sessões seguras.

### 4.2 Blockchain e Contratos Inteligentes

* **API Smart Contracts (FastAPI + Rust)**
  Interage com a **Stellar Network** para execução de contratos inteligentes e operações financeiras descentralizadas.

### 4.3 Cálculo de Score

* **API Suitability (FastAPI)**
  Responsável pelo cálculo de score de crédito, considerando dados do Serasa, Open Finance e modelos ML.

### 4.4 Gestão de Dados e LGPD

* **API LGPD (FastAPI)**
  Controla armazenamento e uso de dados pessoais, garantindo conformidade regulatória.

### 4.5 Logs e Auditoria

* **API Logs & Auditoria (FastAPI)**
  Centraliza registros de operações e fornece trilhas de auditoria.

### 4.6 Chatbot Inteligente

* **Chatbot Suporte (FastAPI + LLM)**
  Oferece atendimento automatizado 24/7 com suporte baseado em linguagem natural.

---

## 5. Machine Learning

### 5.1 Pipelines

* **Pipeline ML Detecção de Fraudes (Python)**
  Detecta padrões suspeitos de comportamento em tempo real.
* **Pipeline ML Recomendações (Python)**
  Gera recomendações personalizadas de crédito e investimento.

### 5.2 Inferência

* **APIs de Inferência (FastAPI)**

  * API Inferência Fraudes
  * API Inferência Recomendações
    Disponibilizam previsões para os microsserviços.

### 5.3 Gerenciamento de Modelos

* **MLflow**
  Utilizado para versionamento, treinamento e deploy de modelos de machine learning.

---

## 6. Armazenamento

* **PostgreSQL (Dados Relacionais)**
  Dados de usuários, transações e cadastros.
* **MongoDB (Logs & Auditoria)**
  Armazenamento não-relacional de eventos e registros.
* **MinIO (Object Storage de Documentos)**
  Armazena documentos digitalizados, contratos e comprovantes.

---

## 7. Recursos do Dispositivo

* **Biometria & Face ID**
  Usados para autenticação forte, aumentando a segurança do login e autorizações sensíveis.

---

## 8. Integrações Externas

* **Stellar Network (Blockchain)**: operações financeiras e contratos inteligentes.
* **API PIX (Transferências)**: integração com o sistema de pagamentos instantâneos.
* **API Serasa (Consulta Score)**: obtenção de score de crédito oficial.
* **Open Finance (Histórico Bancário)**: acesso a informações financeiras para melhor análise de crédito.

---

## 9. Fluxo de Requisições

1. O usuário acessa o **app mobile**, que envia requisições ao **API Gateway**.
2. O Gateway valida a autenticação via **JWT** e direciona a chamada ao microsserviço correto.
3. Microsserviços podem consultar:

   * **Modelos ML** via APIs de inferência;
   * **Banco relacional, NoSQL ou Object Storage** para persistência;
   * **Integrações externas** para enriquecimento de dados.
4. O resultado é retornado ao cliente via Gateway.

---

## 10. Benefícios da Arquitetura

* **Escalabilidade**: Microsserviços independentes permitem crescimento modular.
* **Segurança**: Uso de blockchain, autenticação biométrica e compliance com LGPD.
* **Resiliência**: Logs, auditoria e armazenamento distribuído garantem confiabilidade.
* **Inteligência**: Modelos de ML aprimoram recomendações e combatem fraudes em tempo real.

---

## 11. Tecnologias Principais

* **Frontend**: React Native
* **Backend/Microsserviços**: FastAPI (Python) + Rust
* **Machine Learning**: Python, MLflow, FastAPI para APIs de inferência
* **Banco de Dados**: PostgreSQL, MongoDB, MinIO
* **Integrações**: Stellar Blockchain, Open Finance, Serasa, PIX
* **Segurança**: JWT, biometria, LGPD compliance

---

## 12. Próximos Passos

1. Definição de SLAs para cada microsserviço.
2. Implementação de CI/CD para deploy automatizado.
3. Monitoramento e observabilidade (Prometheus, Grafana).
4. Testes de segurança (Pentest, auditorias regulares).

---
