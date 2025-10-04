---
sidebar_position: 1
title: Visão Geral do Projeto
---

O Mithril é um sistema de fornecimento de crédito e investimentos, desenhado para atender às necessidades de freelancers e profissionais autônomos. Este público, muitas vezes negligenciado pelo sistema financeiro tradicional, encontra no Mithril uma plataforma segura, transparente e eficiente para obter crédito e realizar investimentos. A solução utiliza a tecnologia blockchain para garantir a transparência e a segurança de todas as transações, conectando investidores a tomadores de crédito de forma direta e desburocratizada.

## Descrição do Problema

O crescente número de profissionais freelancers e autônomos representa uma parcela significativa da força de trabalho global. No Brasil, o cenário não é diferente. De acordo com uma pesquisa realizada pela Onlinecurriculo em junho de 2024, **38% dos brasileiros trabalham atualmente como freelancers** [1]. Além disso, dados do IBGE do último trimestre de 2022 já apontavam a existência de mais de **25,7 milhões de trabalhadores independentes** no país, um aumento de 4,7% em relação ao ano anterior [2].

No entanto, esses profissionais frequentemente enfrentam barreiras substanciais para acessar crédito no sistema financeiro tradicional. A principal dificuldade reside na comprovação de renda, uma vez que seus rendimentos são muitas vezes variáveis e não se enquadram nos modelos de análise de crédito convencionais, que privilegiam a estabilidade de um emprego formal. A falta de um histórico de crédito formal e a ausência de garantias reais são outros obstáculos que limitam o acesso a financiamentos, empréstimos e outros produtos financeiros essenciais para o crescimento de seus negócios e para a estabilidade financeira pessoal. Essa exclusão financeira não apenas restringe o potencial de crescimento individual desses profissionais, mas também impacta negativamente a economia como um todo, que deixa de se beneficiar do dinamismo e da inovação que esse setor pode oferecer.

## Objetivo

O objetivo principal do Mithril é democratizar o acesso ao crédito e às oportunidades de investimento para freelancers e autônomos, um segmento da população que enfrenta dificuldades significativas no sistema financeiro convencional. Através da utilização da tecnologia blockchain, o Mithril visa criar um ecossistema financeiro mais inclusivo, transparente e eficiente, onde a comprovação de renda e a burocracia são minimizadas, e a confiança é estabelecida por meio de contratos inteligentes e registros imutáveis. Busca-se, assim, fomentar o desenvolvimento econômico desses profissionais, oferecendo-lhes as ferramentas necessárias para gerenciar suas finanças e impulsionar seus projetos.

## Descrição da Solução

O Mithril opera como uma plataforma descentralizada que conecta investidores e tomadores de crédito (freelancers e autônomos) de forma direta e transparente, utilizando a tecnologia blockchain para garantir a integridade e a segurança de todas as operações.

### Score de Crédito Híbrido

Para solucionar o desafio da análise de crédito para freelancers, o Mithril implementa um **modelo de score de crédito híbrido**, que combina dados **on-chain** (gerados na própria plataforma) e **off-chain** (externos). Essa abordagem permite uma avaliação de risco mais justa e precisa, adaptada à realidade dos profissionais autônomos.

*   **Dados On-Chain:** Incluem o histórico de pagamentos na plataforma, pontualidade, volume transacionado e a reputação construída junto a outros investidores. Por serem registrados em blockchain, esses dados são imutáveis e totalmente auditáveis.
*   **Dados Off-Chain:** A plataforma poderá integrar, com a autorização do usuário, dados de Open Finance (como extratos bancários e histórico do PIX), comprovantes de renda digital (como notas fiscais de MEI e recibos de plataformas de freelancers) e informações de birôs de crédito tradicionais (Serasa, SPC).

Um **smart contract** registrará dinamicamente o score de cada tomador, que será utilizado para classificar o risco (baixo, médio ou alto), permitindo que os investidores tomem decisões mais informadas e que os tomadores com bom histórico tenham acesso a melhores condições de crédito.

### Fluxo de Operação

#### Para Investidores:

Investidores podem alocar capital na plataforma com total visibilidade sobre o destino de seus fundos, graças à imutabilidade do blockchain. Eles têm a opção de:

*   **Selecionar Oportunidades de Investimento:** Escolher em quais solicitações de crédito desejam investir, com base em critérios como valor, prazo de pagamento e o score de crédito do tomador.
*   **Criar Cards de Investimento:** Publicar ofertas de investimento com condições pré-definidas, como valor máximo a ser emprestado e prazo de retorno esperado. Tomadores de crédito podem então solicitar aprovação para esses cards.

#### Para Tomadores de Crédito (Freelancers e Autônomos):

Profissionais que necessitam de crédito podem criar solicitações detalhadas, especificando:

*   **Valor Desejado:** A quantia de crédito necessária.
*   **Quantidade de Parcelas:** O número de pagamentos para quitar o empréstimo.
*   **Data de Pagamento:** As datas preferenciais para os pagamentos.

Tomadores de crédito podem:

*   **Solicitar Aprovação:** Candidatar-se a um card de investimento já criado por um investidor.
*   **Criar Cards de Solicitação:** Publicar suas próprias necessidades de crédito, permitindo que investidores interessados coloquem dinheiro diretamente ou aprovem a solicitação.

Todas as transações e acordos são formalizados através de **contratos inteligentes (smart contracts)** na blockchain, que automatizam a execução das condições acordadas, como a liberação de fundos e o agendamento de pagamentos, eliminando a necessidade de intermediários e reduzindo a burocracia.

### Juros Padronizados e Reduzidos

Uma das propostas de valor do Mithril é oferecer taxas de juros significativamente mais baixas do que as praticadas por bancos tradicionais. Enquanto a taxa média de juros para empréstimos pessoais em bancos no Brasil pode variar amplamente, atingindo, por exemplo, 8,12% ao mês em maio de 2025 para empréstimos pessoais não consignados [3], e a taxa média para famílias e empresas chegou a 43,7% ao ano em fevereiro de 2025 [4], o Mithril busca padronizar e reduzir esses custos. Isso é possível devido à eliminação de intermediários, à eficiência operacional da blockchain e a um modelo de risco mais distribuído e transparente.

### Modelo de Retorno da Solução

O Mithril gerará receita através da cobrança de uma **taxa percentual mínima sobre cada transação** bem-sucedida realizada na plataforma. Essa taxa será transparente e comunicada claramente a todas as partes envolvidas, garantindo a sustentabilidade do ecossistema.

### Proteção aos Investidores

Para mitigar o risco de inadimplência e proteger os investidores, o Mithril implementará um mecanismo de segurança inovador. A cada transação, uma pequena taxa será coletada, a qual será direcionada para um fundo de reserva que poderá ser utilizado para ressarcir investidores em caso de não pagamento por parte do tomador de crédito. Este mecanismo, combinado com a transparência do blockchain, visa construir um ambiente de confiança e segurança para o capital investido.

## Escolha da Blockchain Stellar

A Stellar é uma rede descentralizada e de código aberto, projetada para facilitar transações financeiras globais de forma rápida, segura e com baixo custo [5]. As principais justificativas para a adoção da Stellar incluem:

*   **Velocidade e Eficiência:** As transações na rede Stellar são processadas em questão de segundos, tornando-a ideal para pagamentos globais e para a agilidade necessária em um sistema de crédito [6]. Esta velocidade é crucial para a experiência do usuário, tanto para investidores quanto para tomadores de crédito.
*   **Baixas Taxas de Transação:** A Stellar é conhecida por suas taxas de transação extremamente baixas, geralmente bem abaixo de US$0,001 por transação [7]. Isso é um diferencial competitivo significativo em relação aos sistemas financeiros tradicionais e outras blockchains, permitindo que o Mithril mantenha os custos operacionais reduzidos e, consequentemente, ofereça juros mais baixos aos tomadores de crédito.
*   **Suporte Multi-moeda Integrado:** A arquitetura da Stellar permite a emissão e troca de múltiplos ativos digitais (tokens) que representam moedas fiduciárias ou outros valores. Isso facilita a integração com diferentes moedas e a criação de um ecossistema financeiro global. A capacidade de operar com diversas moedas é fundamental para a integração com o PIX e para a expansão futura do Mithril [8].
*   **Transparência e Segurança:** Como uma blockchain pública, a Stellar oferece um registro imutável e transparente de todas as transações, o que é essencial para a proposta de valor do Mithril de garantir a confiança entre investidores e tomadores de crédito. Os contratos inteligentes na Stellar reforçam essa segurança e automatizam a execução dos acordos.
*   **Integração com o PIX:** A natureza da Stellar, que permite transações rápidas e de baixo custo, aliada ao seu suporte multi-moeda, facilita a integração com sistemas de pagamento instantâneo como o PIX no Brasil. Essa integração permitirá que as transações entre o blockchain e o sistema bancário tradicional sejam imediatas, proporcionando uma experiência fluida para os usuários.

## Referências

[1] FolhaBV. (2024, 28 de junho). *38% dos brasileiros trabalham atualmente como freelancers*. Disponível em: [https://www.folhabv.com.br/economia/38-dos-brasileiros-trabalham-atualmente-como-freelancers/](https://www.folhabv.com.br/economia/38-dos-brasileiros-trabalham-atualmente-como-freelancers/)

[2] Freelancermap. (2024, 20 de junho). *Ser freelancer no Brasil: Tudo o que você precisa saber em 2025*. Disponível em: [https://www.freelancermap.com/blog/pt/ser-freelancer-no-brasil-tudo-o-que-voce-precisa-saber-em-2024/](https://www.freelancermap.com/blog/pt/ser-freelancer-no-brasil-tudo-o-que-voce-precisa-saber-em-2024/)

[3] CNN Brasil. (2025, 20 de maio). *Taxa de juros no empréstimo pessoal cai em maio*. Disponível em: [https://www.cnnbrasil.com.br/economia/financas/taxa-de-juros-no-emprestimo-pessoal-cai-em-maio-compare-bancos/](https://www.cnnbrasil.com.br/economia/financas/taxa-de-juros-no-emprestimo-pessoal-cai-em-maio-compare-bancos/)

[4] Agência Brasil. (2025, 9 de abril). *Juros médios cobrados pelos bancos chegam a 43,7% ao ano em fevereiro*. Disponível em: [https://agenciabrasil.ebc.com.br/economia/noticia/2025-04/juros-medios-cobrados-pelos-bancos-chegam-437-ao-ano-em-fevereiro](https://agenciabrasil.ebc.com.br/economia/noticia/2025-04/juros-medios-cobrados-pelos-bancos-chegam-437-ao-ano-em-fevereiro)

[5] Stellar.org. *Stellar | Blockchain Network for Smart Contracts, DeFi*. Disponível em: [https://stellar.org/](https://stellar.org/)

[6] KriptoBR. *Stellar (XLM): Facilitando Transações Financeiras Globais*. Disponível em: [https://kriptobr.com/stellar-xlm-facilitando-transacoes-financeiras-globais/](https://kriptobr.com/stellar-xlm-facilitando-transacoes-financeiras-globais/)

[7] B2BinPay. (2025, 18 de setembro). *Top 12 Cheapest Cryptos to Transfer with Low Fees*. Disponível em: [https://b2binpay.com/en/news/top-12-cheapest-crypto-to-transfer-and-save-on-transaction-fees](https://b2binpay.com/en/news/top-12-cheapest-crypto-to-transfer-and-save-on-transaction-fees)

[8] Foxbit. (2025, 20 de agosto). *XLM: Stellar e seu ecossistema para criptomoedas*. Disponível em: [https://foxbit.com.br/blog/stellar-criptomoeda-o-que-e-e-como-funciona-no-mercado-global/](https://foxbit.com.br/blog/stellar-criptomoeda-o-que-e-e-como-funciona-no-mercado-global/)

