# **Análise de Riscos**

# Objetivo

&emsp; Identificar, classificar e propor ações mitigadoras para os principais riscos associados ao projeto Mithril, com base na documentação técnica, proposta de valor e requisitos funcionais.

## Acesso Não Autorizado e Transações Fraudulentas (Account Takeover).
*   **Descrição:** Um invasor obtém acesso não autorizado à conta de um usuário legítimo, seja por meio de roubo do dispositivo físico, descoberta de credenciais (phishing, vazamento de senhas) ou outras técnicas. Uma vez dentro da conta, o invasor pode realizar transações fraudulentas em nome da vítima, como solicitar empréstimos ou transferir fundos para outra carteira.

*   **Consequências Potenciais:** Perda financeira direta para o usuário legítimo (se seus fundos forem movidos) ou para os investidores (se um empréstimo fraudulento for solicitado e não pago), além de grave dano à confiança e reputação da plataforma.

*   **Ações Mitigadoras Sugeridas Propostas:**
    1.  **Autenticação Multifator (MFA) Obrigatória:** A principal barreira contra esse risco. Conforme o requisito **RF02**, exigir um segundo fator de autenticação (biometria, código de aplicativo autenticador ou SMS) para login e, crucialmente, para a autorização de transações financeiras críticas (resgates, transferências, solicitação de empréstimos).

## Inadimplência dos Tomadores.
*   **Descrição:**  Existe a possibilidade de tomadores de crédito não realizarem os pagamentos devidos dentro do prazo estipulado, levando à perda do capital investido.
*   **Consequências Potenciais:**  Perdas financeiras diretas para os investidores, resultando em uma crise de confiança e potencial fuga de capital da plataforma se o problema for sistêmico.

*   **Ações Mitigadoras Sugeridas:**
    1. **Fundo de Proteção ao Investidor (Mecanismo de Seguro):** Esta é a principal mitigação para a consequência do risco. Conforme o requisito RF09, a plataforma coletará uma pequena taxa de gás (gas fee) em cada transação bem-sucedida. Essa taxa alimentará um fundo de reserva destinado a ressarcir total ou parcialmente os investidores em caso de inadimplência do tomador. A existência desse fundo funciona como um seguro, protegendo o capital do investidor e mantendo a confiança no ecossistema.

    2. **Análise de Risco para Prevenção:** Para reduzir a probabilidade de inadimplência, o sistema deve continuar aprimorando o Score Híbrido (**RF08**). Ao integrar mais fontes de dados e refinar os modelos de Machine Learning, a plataforma pode prever com maior precisão a capacidade

## Falta de Liquidez (Investidores vs. Tomadores).
*   **Descrição:** Ocorre um desequilíbrio entre a oferta de capital (investidores) e a demanda por crédito (tomadores). Pode haver muito dinheiro disponível sem tomadores suficientes, ou muitos tomadores sem capital para atendê-los.
*   **Consequências Potenciais:** Frustração para ambos os lados, com investidores deixando o capital ocioso e tomadores não conseguindo acesso ao crédito, levando ao abandono da plataforma.
*   **Ações Mitigadoras Sugeridas:**
    1.  **Blend Ativo de Capital:** Permitir que investidores deixem o capital ocioso render automaticamente na plataforma por meio de um mecanismo de investimento temporário em produtos internos de baixo risco
    2.  **Mecanismo de Taxas de Juros Dinâmicas (Leilão Reverso):** Implementar um sistema de leilão onde a alta demanda dos tomadores naturalmente eleva as taxas de juros oferecidas aos investidores. Isso torna o retorno mais competitivo e atrativo, sinalizando ao mercado de investidores que há uma oportunidade de maior rentabilidade na plataforma.


## Complexidade da Experiência do Usuário (UX)

*   **Descrição:** A integração de conceitos técnicos como blockchain, carteiras digitais e score híbrido pode tornar o aplicativo confuso e intimidante para usuários leigos, que são parte importante do público-alvo.
*   **Consequências Potenciais:** Baixa taxa de adesão, alta taxa de abandono do aplicativo e avaliações negativas, limitando o crescimento da base de usuários.

*   **Ações Mitigadoras Sugeridas:**
    1.  **Testes de Usabilidade Contínuos:** Realizar sessões de teste de usabilidade regularmente com usuários reais que correspondam ao perfil da persona (Juliana), a fim de identificar e corrigir pontos de fricção.
    2.  **Processo de Onboarding Guiado:** Desenvolver um tutorial interativo e visual que guie os novos usuários pelas principais funcionalidades, explicando os conceitos mais complexos de forma simples e didática.
    3.  **Suporte Contextual com Chatbot:** Utilizar o chatbot inteligente para oferecer ajuda contextualizada dentro do aplicativo, respondendo às dúvidas dos usuários em tempo real.

# Conclusão

&emsp; Com base na análise realizada, conclui-se que o projeto Mithril apresenta riscos relacionados à segurança, operação financeira e experiência do usuário, mas que já foram contemplados com estratégias de contenção. Nesse sentido, medidas como autenticação multifator, fundos de proteção ao investidor, aprimoramento do score de crédito e iniciativas de UX demonstram um compromisso claro com a segurança, a confiabilidade e a acessibilidade da plataforma. Assim, a implementação efetiva dessas ações não apenas reduz a probabilidade e o impacto dos riscos identificados, como também fortalece a confiança de investidores e usuários, criando um ecossistema sustentável, seguro e atraente para todos os participantes.
