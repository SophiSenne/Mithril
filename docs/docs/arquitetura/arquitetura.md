---
sidebar_position: 7
title: Diagrama de Arquitetura
---
import useBaseUrl from '@docusaurus/useBaseUrl';


&emsp; Este documento descreve a arquitetura proposta para o sistema, que integra blockchain, open finance, machine learning e microsserviços. O objetivo é oferecer segurança, escalabilidade, transparência e suporte a funcionalidades de detecção de fraudes, recomendação de crédito e atendimento ao usuário.  

&emsp; Contudo, esta arquitetura representa o desenho completo do sistema. Entretanto, durante o hackathon será implementada apenas uma versão reduzida, com foco em validar as principais funcionalidades do projeto.  

<div style={{ textAlign: 'center' }}>
  <p><strong>Figura 1 - Diagrama de Arquitetura</strong></p>
  <img 
    src={useBaseUrl('/img/diagrama-arquitetura.svg')} 
    alt="Diagrama de Arquitetura" 
    title="Diagrama de Arquitetura" 
    style={{ maxWidth: '100%', height: 'auto' }}
  />
  <p>Fonte: Elaborado pelos autores (2025)</p>
</div>

&emsp; A fim de possibilitar uma melhor visualização, o diagrama também está disponível [aqui](https://www.mermaidchart.com/d/e415d1fe-ceb1-47c2-9e2e-16081349f201).

&emsp; Nesse sentido, a arquitetura foi projetada sob os princípios de:
* **Transparência** (blockchain pública para auditoria de transações)
* **Segurança máxima** (biometria, autenticação forte, chaves locais)
* **Zero burocracia** (cadastro simplificado, aprovação via IA)
* **Inteligência de risco e recomendação** (ML detectando fraudes e sugerindo investimentos)

## Camadas da Arquitetura

### Camada de Cliente (App Mobile)

* **React Native App (iOS/Android):** interface intuitiva para investidores e tomadores.
* **Stellar Wallet Client-Side:** gerenciamento de chaves e assinaturas totalmente local, sem repasse ao backend.
* **Biometria e Secure Storage:** autenticação via Face ID/Touch ID e chaves protegidas no Keychain/Keystore.
* **Conexão Direta com a Blockchain:** operações financeiras transparentes, submetidas diretamente.

&emsp; Desse modo, a modelagem conecta-se com a proposta de valor nos seguintes aspectos:

* **Dor:** falta de confiança em fintechs e medo de fraude.
* **Alívio:** transparência total + segurança máxima.
* **Ganho:** experiência digital simples, rápida e segura.

### API Gateway

* **Controle de Acesso:** autenticação JWT, rate limiting e proteção contra abuso.
* **Centralização:** ponto único para entrada no backend, respeitando arquitetura zero-trust.

### Microsserviços (FastAPI)

1. **Autenticação:** emissão de tokens JWT, integração com biometria e logs.

2. **Motor Antifraude (ML):**
   * Pipeline de detecção em tempo real.
   * API de inferência para monitorar operações.

3. **Motor de Recomendação (ML):**
   * Sugestão de investimentos com base em perfil.

4. **Monitor Blockchain:** leitura do Horizon API para auditoria e notificações.

5. **Logs & Auditoria:** rastreabilidade completa para LGPD e segurança.

6. **Suitability & Score:** cálculo de risco e score progressivo com dados internos e externos (Serasa, Open Finance).

7. **LGPD:** gestão de consentimento, deleção e acesso a dados.

8. **Chatbot Inteligente (LLM):** suporte 24/7.

**→ Relaciona-se com:**

* **Dor:** medo de fraude, juros abusivos, burocracia.
* **Alívio:** aprovação instantânea, proteção inteligente, juros justos.
* **Ganho:** score progressivo, flexibilidade e suporte contínuo.

### Armazenamento

* **PostgreSQL:** dados relacionais, contas e endereços Stellar.
* **MongoDB:** logs e auditorias imutáveis.
* **MinIO:** armazenamento seguro de documentos (compliance, contratos digitais).
* **MLflow:** versionamento de modelos de ML (fraude e recomendação).

**→ Relaciona-se com:**

* **Alívio:** conformidade com LGPD e segurança.
* **Ganho:** inteligência contínua com ML adaptativo.

### Integrações Externas

* **Serasa:** consulta de score para complementar análise.
* **Open Finance:** ingestão automática de histórico bancário.
* **PIX:** liquidação instantânea de transferências.

**→ Relaciona-se com:**

* **Dor:** demora na aprovação de crédito.
* **Alívio:** crédito liberado em minutos.
* **Ganho:** economia em juros e flexibilidade.

### Stellar Blockchain

* **Stellar Horizon API:** leitura e submissão de transações.
* **Stellar Core:** ledger distribuído com smart contracts simples (trustlines, pagamentos condicionais).

**→ Relaciona-se com:**

* **Dor:** falta de transparência nos bancos.
* **Alívio:** blockchain garante prova pública de todas as operações.
* **Ganho:** impacto social visível para investidores.

## Como a Arquitetura Atende ao Desafio

1. **Sistema de Carteira**
   * O **Stellar Wallet Client-Side** permite que cada usuário gerencie suas chaves privadas localmente, garantindo soberania sobre seus ativos sem depender do backend.  
   * As operações financeiras são assinadas e transmitidas diretamente para a Stellar Blockchain, assegurando transparência e auditabilidade pública.  
   * Além disso, a integração com PIX e Open Finance amplia a usabilidade, permitindo movimentação fluida entre cripto e sistema financeiro tradicional.

2. **Infraestrutura Peer-to-Peer (P2P)**
   * A utilização da Stellar Blockchain proporciona liquidação descentralizada das transações, dispensando intermediários.  
   * A lógica de pagamentos condicionais e trustlines garante trocas diretas e seguras entre investidores e tomadores, de forma verdadeiramente P2P.  
   * O monitoramento em tempo real via Horizon API assegura visibilidade e notificações das operações sem dependência de instituições centrais.

3. **Garantia de Requisitos de Segurança (Antifraude)**
   * O Motor Antifraude, baseado em modelos de Machine Learning, avalia transações em tempo real, identificando padrões suspeitos de fraude.  
   * O uso de biometria, autenticação forte (JWT, rate limiting) e armazenamento seguro (Keychain/Keystore) reforça a proteção do usuário.  
   * A arquitetura de microsserviços com logs e auditoria imutáveis em MongoDB e trilhas completas de conformidade (LGPD) assegura rastreabilidade e governança.

4. **Sistema de Score de Crédito**
   * O microsserviço de Suitability & Score integra dados internos (histórico de uso da plataforma) e externos (Serasa, Open Finance) para calcular o risco do usuário.  
   * Esse score é progressivo e adaptativo, sendo atualizado com base em comportamento financeiro e transacional.  
   * O modelo de recomendação, integrado ao score, permite oferecer crédito mais justo e condizente com o perfil de cada tomador, reduzindo juros abusivos.


## Conclusão

&emsp; À vista do apresentado, a arquitetura consolida os pilares de inovação, segurança e transparência. Embora durante o hackathon seja implementada uma versão reduzida, o desenho completo demonstra a visão de longo prazo: uma plataforma escalável e confiável, que integra blockchain, open finance, microsserviços e machine learning para oferecer soluções de crédito mais justas, prevenção de fraudes em tempo real e suporte inteligente ao usuário. Dessa forma, a proposta não apenas responde às dores do mercado — como burocracia, insegurança e desconfiança —, mas também cria valor ao proporcionar uma experiência simples, rápida e confiável, com potencial de impacto social positivo.