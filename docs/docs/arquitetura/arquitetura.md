---
sidebar_position: 6
title: Diagrama de Arquitetura
---
import useBaseUrl from '@docusaurus/useBaseUrl';


&emsp; Este documento descreve a arquitetura proposta para o sistema, que integra blockchain, open finance, machine learning e microsserviços. O objetivo é oferecer segurança, escalabilidade, transparência e suporte a funcionalidades de detecção de fraudes, recomendação de crédito e atendimento ao usuário.  

&emsp; Contudo, esta arquitetura representa o desenho completo do sistema. Entretanto, durante o hackathon será implementada apenas uma versão reduzida, com foco em validar as principais funcionalidades do projeto.  

<div style={{ textAlign: 'center' }}>
  <p><strong>Figura 1 - Diagrama de Arquitetura</strong></p>
  <img 
    src={useBaseUrl('/img/diagrama-arquitetura-v2.svg')} 
    alt="Diagrama de Arquitetura" 
    title="Diagrama de Arquitetura" 
    style={{ maxWidth: '100%', height: 'auto' }}
  />
  <p>Fonte: Elaborado pelos autores (2025)</p>
</div>

&emsp; A fim de possibilitar uma melhor visualização, o diagrama também está disponível [aqui](https://www.mermaidchart.com/d/e26a49a6-9812-4871-87ef-65c80e9228ec).

&emsp; Nesse sentido, a arquitetura foi projetada sob os princípios de:
* **Transparência** (blockchain pública para auditoria de transações)
* **Segurança máxima** (biometria, autenticação forte, chaves locais)
* **Zero burocracia** (cadastro simplificado, aprovação via IA)
* **Inteligência de risco e recomendação** (ML detectando fraudes e sugerindo investimentos)

## Camadas da Arquitetura

&emsp; A arquitetura do sistema é composta por diversas camadas interconectadas, cada uma com responsabilidades específicas. A Camada de Cliente interage diretamente com os usuários, enquanto a Camada de Microsserviços orquestra a lógica de negócios. A Camada de Armazenamento gerencia os dados, e a Rede Blockchain Stellar provê a infraestrutura descentralizada para as transações. Além disso, o sistema se integra com Recursos do Dispositivo, um API Gateway para segurança e gerenciamento de tráfego, módulos de Machine Learning para inteligência de negócios e diversas Integrações Externas para complementar os dados e funcionalidades.

## 3. Componentes da Arquitetura

### 3.1. Camada de Cliente (Client Layer)

A camada de cliente é o ponto de interação primário para os usuários, tanto investidores quanto tomadores. Ela é composta por:

*   **React Native App (APP)**: Uma aplicação móvel desenvolvida em React Native, compatível com iOS e Android, que serve como interface principal para investidores e tomadores. Este aplicativo permite aos usuários gerenciar seus perfis, visualizar oportunidades de investimento, solicitar empréstimos e acompanhar suas transações.
*   **Stellar Wallet (WALLET)**: Uma carteira Stellar implementada no lado do cliente, responsável pelo gerenciamento seguro de pares de chaves (keypairs). Esta carteira é fundamental para a interação dos usuários com a rede Stellar, permitindo a assinatura de transações de forma segura e descentralizada.
*   **Stellar SDK (BLOCKCHAIN_SDK)**: Um kit de desenvolvimento de software (SDK) para Stellar, implementado em JavaScript/TypeScript, que facilita a interação do aplicativo com a rede Stellar. Ele é utilizado para construir e assinar transações, consultar o estado da blockchain e interagir com smart contracts.

### 3.2. Recursos do Dispositivo (Device Resources)

Para garantir a segurança e a usabilidade, o sistema aproveita os recursos nativos dos dispositivos móveis:

*   **Biometria & Face ID (BIO)**: Utilizado para autenticação e autorização de transações, proporcionando uma camada adicional de segurança e conveniência para os usuários.
*   **Secure Storage (SECURE_STORAGE)**: Mecanismos de armazenamento seguro, como Keychain (iOS) e Keystore (Android), são empregados para proteger as chaves privadas dos usuários, garantindo que elas permaneçam isoladas e inacessíveis a outras aplicações.

### 3.3. API Gateway (Gateway)

O API Gateway atua como um ponto de entrada unificado para todos os microsserviços, oferecendo funcionalidades essenciais para a segurança e o gerenciamento do tráfego:

*   **API Gateway (APIGW)**: Responsável por rotear as requisições para os microsserviços apropriados, aplicar autenticação baseada em JWT (JSON Web Tokens) e implementar políticas de rate limiting para proteger os serviços contra abusos e sobrecarga.

### 3.4. Machine Learning (ML)

Os módulos de Machine Learning são cruciais para a inteligência de negócios, especialmente na detecção de fraudes e análise de risco:

*   **Pipeline ML - Detecção de Fraudes (FRAUD_PIPE)**: Um pipeline de Machine Learning desenvolvido em Python, focado na detecção de atividades fraudulentas através da análise comportamental dos usuários. Este pipeline processa dados para identificar padrões suspeitos.
*   **API Inferência - Fraudes (FRAUD_API)**: Uma API construída com FastAPI que expõe os modelos de detecção de fraude para que outros microsserviços possam consultar o risco de fraude em tempo real.
*   **Pipeline ML - Análise de Risco (RISK_PIPE)**: Similar ao pipeline de fraude, este módulo em Python é dedicado à análise de risco e classificação de tomadores, avaliando a probabilidade de inadimplência com base em diversos fatores.
*   **API Inferência - Risco (RISK_API)**: Uma API FastAPI que fornece acesso aos modelos de análise de risco, permitindo que os microsserviços de crédito e marketplace tomem decisões informadas.

### 3.5. Microsserviços (Services) - FastAPI

A espinha dorsal da lógica de negócios é composta por uma série de microsserviços, todos implementados com FastAPI para alta performance e facilidade de desenvolvimento:

*   **Autenticação (AUTH)**: Gerencia o registro, login e perfis de usuário, utilizando JWT para autenticação segura.
*   **API Score Híbrido (SCORE)**: Calcula um score dinâmico para os tomadores, combinando dados on-chain da Stellar com informações off-chain de fontes externas. Este serviço é crítico para a avaliação de crédito.
*   **API Marketplace (MARKETPLACE)**: Facilita a criação e exibição de cards de investimento e solicitação de crédito, além de realizar o match P2P entre investidores e tomadores.
*   **API Gestão Crédito (CREDIT)**: Responsável por gerenciar todo o ciclo de vida das solicitações de crédito, aprovações e contratos.
*   **API Pagamentos (PAYMENT)**: Orquestra o agendamento e execução de pagamentos, além de gerenciar a inadimplência.
*   **API Monitor Blockchain (BLOCKCHAIN_MONITOR)**: Uma API somente leitura que interage com a Stellar Horizon API para monitorar o histórico on-chain e eventos da blockchain.
*   **API Logs (LOGS)**: Centraliza a auditoria e o registro de eventos do sistema para compliance e rastreabilidade.
*   **API Investidores (INVEST)**: Permite aos investidores visualizar seu portfólio, rentabilidade e histórico de investimentos.
*   **API LGPD (LGPD)**: Garante a conformidade com a Lei Geral de Proteção de Dados, gerenciando o consentimento e os dados dos usuários.
*   **Chatbot (CHAT)**: Um chatbot de suporte integrado, utilizando LLM (Large Language Model) para interações inteligentes com os usuários.
*   **API Fundo Reserva (RESERVE)**: Gerencia o fundo de reserva para proteção dos investidores e ressarcimento em casos específicos.
*   **API Notificações (NOTIF)**: Envia notificações push e e-mail para alertar os usuários sobre eventos importantes, como aprovações de crédito ou pagamentos.

### 3.6. Camada de Armazenamento (Storage Layer)

A camada de armazenamento é responsável pela persistência e recuperação de dados, utilizando diferentes tecnologias para otimizar o desempenho e a escalabilidade:

*   **PostgreSQL (POSTGRES)**: Um banco de dados relacional utilizado para armazenar dados estruturados, como informações de usuários, cards de investimento, solicitações de crédito e registros de investimentos.
*   **MongoDB (MONGO)**: Um banco de dados NoSQL, ideal para armazenar logs e dados de auditoria, bem como eventos do sistema, devido à sua flexibilidade e escalabilidade para dados não estruturados.
*   **MinIO (MINIO)**: Um armazenamento de objetos compatível com S3, utilizado para guardar documentos, comprovantes de renda e notas fiscais MEI, oferecendo alta disponibilidade e durabilidade.
*   **MLflow (MLFLOW)**: Uma plataforma para gerenciar o ciclo de vida de Machine Learning, utilizada para versionar modelos de ML, artefatos e experimentos.
*   **Redis (REDIS)**: Um armazenamento de dados em memória, empregado para cache, gerenciamento de sessões de usuário e implementação de rate limiting, garantindo respostas rápidas e reduzindo a carga sobre os bancos de dados primários.

### 3.7. Integrações Externas (External Integrations)

O sistema se conecta a diversas APIs e serviços externos para enriquecer os dados e funcionalidades:

*   **API Serasa/SPC (SERASA)**: Utilizada para consultar o score de crédito tradicional e o histórico de crédito dos tomadores, fornecendo dados off-chain cruciais para a análise de risco.
*   **Open Finance (OPENF)**: Permite o acesso a extratos bancários, histórico de PIX e movimentações financeiras dos usuários, com o consentimento destes, para uma análise de crédito mais aprofundada.
*   **API PIX (PIX_API)**: Habilita transferências via PIX, facilitando as operações de on-ramp (entrada de fiat) e off-ramp (saída de fiat) para os usuários.
*   **APIs MEI (MEI)**: Integração com serviços da Receita Federal para consulta de notas fiscais e comprovantes de renda de Microempreendedores Individuais.
*   **Plataformas Freelancer (FREELANCE)**: Conexão com plataformas como Workana, 99Freelas e Fiverr para validação de comprovantes de renda de freelancers.

### 3.8. Rede Blockchain Stellar (Stellar Blockchain Network)

A rede Stellar é a base para a descentralização e transparência das operações financeiras:

*   **Stellar Horizon API (HORIZON)**: Uma API pública que permite a leitura de dados da blockchain Stellar e a submissão de transações, servindo como interface para a interação com a rede.
*   **Stellar Core (STELLAR_CORE)**: O nó central da rede Stellar, responsável por manter o ledger distribuído e garantir o consenso através do Stellar Consensus Protocol (SCP).
*   **Smart Contracts (SMART_CONTRACTS)**: Contratos inteligentes implementados na rede Stellar para automatizar acordos de crédito P2P, pagamentos automáticos, registro de score e gestão do fundo de reserva.
*   **Assets/Tokens (TOKENS)**: Representações digitais de valor na rede Stellar, incluindo stablecoins atreladas ao BRL e tokens que representam crédito, permitindo operações multi-moeda.

## 4. Considerações de Segurança

A segurança é um pilar fundamental desta arquitetura, sendo abordada em múltiplas camadas:

*   **Autenticação e Autorização**: Utilização de JWT para autenticação de API e integração com biometria/Face ID nos dispositivos móveis para autenticação de usuário, garantindo que apenas usuários autorizados acessem os recursos.
*   **Proteção de Chaves Privadas**: As chaves privadas da Stellar Wallet são armazenadas em `Secure Storage` (Keychain/Keystore) nos dispositivos, isoladas de outras aplicações e protegidas por hardware.
*   **API Gateway**: Atua como uma barreira de segurança, aplicando rate limiting para prevenir ataques de negação de serviço (DoS) e garantindo que todas as requisições sejam autenticadas.
*   **Segurança em Microsserviços**: Cada microsserviço é projetado com princípios de segurança em mente, incluindo validação de entrada, tratamento seguro de dados e comunicação criptografada entre serviços.
*   **Conformidade com LGPD**: O microsserviço `LGPD` garante que o tratamento de dados pessoais esteja em conformidade com a legislação, incluindo gestão de consentimento e direitos dos titulares dos dados.
*   **Detecção de Fraudes**: Os `Pipelines ML` e `APIs de Inferência de Fraudes` atuam proativamente na identificação e mitigação de atividades fraudulentas, protegendo tanto investidores quanto tomadores.
*   **Segurança da Blockchain**: A rede Stellar, por sua natureza descentralizada e o Stellar Consensus Protocol (SCP), oferece um alto nível de segurança e resiliência contra ataques.
*   **Armazenamento Seguro**: Utilização de `MinIO` para armazenamento de objetos com controle de acesso e criptografia, e `PostgreSQL`/`MongoDB` com configurações de segurança robustas.

## 6. Conclusão

Esta arquitetura representa um sistema financeiro descentralizado, que combina a blockchain Stellar com a flexibilidade de microsserviços e a inteligência de Machine Learning. Ao integrar diversas tecnologias e serviços externos, o sistema visa oferecer uma plataforma segura, eficiente e transparente para o mercado de crédito e investimentos, promovendo a inclusão financeira e a inovação no setor. A modularidade da arquitetura permite futuras expansões e adaptações às necessidades do mercado e regulamentações.

## 7. Referências

[1] Stellar Development Foundation. *Stellar Horizon API*. Disponível em: [https://developers.stellar.org/api/](https://developers.stellar.org/api/)

[2] Stellar Development Foundation. *Stellar Core*. Disponível em: [https://github.com/stellar/stellar-core](https://github.com/stellar/stellar-core)

[3] FastAPI. *FastAPI documentation*. Disponível em: [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)

[4] React Native. *React Native documentation*. Disponível em: [https://reactnative.dev/](https://reactnative.dev/)

[5] PostgreSQL. *PostgreSQL documentation*. Disponível em: [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)

[6] MongoDB. *MongoDB documentation*. Disponível em: [https://docs.mongodb.com/](https://docs.mongodb.com/)

[7] MinIO. *MinIO documentation*. Disponível em: [https://min.io/docs/](https://min.io/docs/)

[8] MLflow. *MLflow documentation*. Disponível em: [https://mlflow.org/docs/latest/index.html](https://mlflow.org/docs/latest/index.html)

[9] Redis. *Redis documentation*. Disponível em: [https://redis.io/docs/](https://redis.io/docs/)

[10] Serasa Experian. *APIs Serasa*. Disponível em: [https://www.serasaexperian.com.br/](https://www.serasaexperian.com.br/) (Link genérico, pois APIs específicas podem variar)

[11] Banco Central do Brasil. *Open Finance Brasil*. Disponível em: [https://www.bcb.gov.br/estabilidadefinanceira/openfinance](https://www.bcb.gov.br/estabilidadefinanceira/openfinance)

[12] Banco Central do Brasil. *PIX*. Disponível em: [https://www.bcb.gov.br/estabilidadefinanceira/pix](https://www.bcb.gov.br/estabilidadefinanceira/pix)

[13] Receita Federal do Brasil. *Microempreendedor Individual (MEI)*. Disponível em: [https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/quero-ser-mei](https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/quero-ser-mei/) (Link genérico, pois APIs específicas podem variar)

[14] Workana. *Workana*. Disponível em: [https://www.workana.com/](https://www.workana.com/)

[15] 99Freelas. *99Freelas*. Disponível em: [https://www.99freelas.com.br/](https://www.99freelas.com.br/)

[16] Fiverr. *Fiverr*. Disponível em: [https://www.fiverr.com/](https://www.fiverr.com/)

