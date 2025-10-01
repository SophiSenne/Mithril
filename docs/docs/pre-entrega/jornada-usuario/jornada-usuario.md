---
sidebar_position: 3
title: Jornada do Usuário
---

# Jornada do Usuário

## Introdução

&emsp; A Jornada do Usuário é uma representação visual do caminho que um usuário percorre ao interagir com um produto, serviço ou sistema. Nesse sentido, ela descreve as etapas, as emoções, as ações e os pontos de contato que o usuário experimenta ao longo de sua interação. Dessa maneira, a jornada do usuário é uma ferramenta valiosa para identificar oportunidades de melhoria, pontos de atrito e necessidades não atendidas, permitindo que a equipe de design e desenvolvimento crie soluções mais eficazes e centradas no usuário (Kalbach, 2016).

&emsp; Além disso, é importante destacar que as ações descritas na jornada do usuário realizam uma relação direta com os [requisitos funcionais (RFs)](../requisitos-funcionais/requisitos-funcionais.md) estabelecidos, reforçando sua ligação intrínseca com as necessidades e dores levantadas pela persona [Juliana Amorim](../persona/persona.md). Dessa maneira, cada ação mapeada na jornada funciona como uma validação das funcionalidades, garantindo que a solução seja não apenas funcional, mas também significativa para o usuário final."

## Desenvolvimento da Jornada do Usuário

&emsp; A jornada da [Juliana Amorim](../persona/persona.md), a designer freelancer, através do Mithril é dividida em cinco fases principais, refletindo suas necessidades, dores e a interação com as funcionalidades da solução.

<p style={{textAlign: 'center'}}>Figura 1: Jornada do Usuário</p>

<div style={{margin: 25}}>
    <div style={{textAlign: 'center'}}>
        <img src={require("../../../static/img/Jornada.png").default} style={{width: 800}} />
        <br />
    </div>
</div>

<p style={{textAlign: 'center'}}>
  Fonte: Produzida pelos Autores (2025) <br/> <a href="https://www.figma.com/design/VdYZWwi9ZsCK7Ufwj7on6y/Persona-templete--Copy-?node-id=1-49&t=3QeCafLryBTEhpgU-1" target="_blank"> Acesse aqui </a>
</p>

### Fase 1: Descoberta e Cadastro

- **Cenário:** Frustrada com bancos tradicionais, busca alternativas online e encontra o app Mithril de empréstimos e investimentos.

- **Sentimentos:** Curiosidade sobre a proposta inovadora, esperança de finalmente encontrar uma solução que se adapte à sua realidade, mas também um certo ceticismo devido a experiências anteriores com promessas não cumpridas de outras plataformas.


- **Pensamento:** ""Será que este aplicativo é diferente? Será que realmente me oferece juros melhores e mais transparência? Preciso verificar se é seguro e fácil de usar.""

- **Ações:**

1. Inicia o processo de cadastro, preenchendo suas informações. ([RF01](../requisitos-funcionais/requisitos-funcionais.md#rf01))

2. Passa pelo Forms Suitability para definir seu perfil inicial. ([RF01](../requisitos-funcionais/requisitos-funcionais.md#rf01))

3. Configura a autenticação multifator (MFA) para maior segurança. ([RF02](../requisitos-funcionais/requisitos-funcionais.md#rf02))

- **Pontos de Contato com a Solução:** Formulário de cadastro, tela de configuração de segurança (MFA).

### Fase 2: Primeiro Contato com a Plataforma e Importação de Dados

- **Cenário:** Após o cadastro bem-sucedido, explora o aplicativo para entender suas funcionalidades e como ele pode atender às suas necessidades de crédito e investimento. Ela busca otimizar seu perfil para obter as melhores condições.

- **Sentimentos:** Entusiasmo inicial por ter acesso a uma plataforma que parece promissora, mas também uma leve apreensão sobre a complexidade e a segurança de vincular suas informações financeiras pessoais.
    
- **Pensamento:** "Como posso melhorar meu score rapidamente para ter acesso a juros mais baixos? Quero ver as opções de investimento e crédito disponíveis. É seguro importar meus dados bancários via Open Banking?"
    
- **Ações:**

1. Realiza o primeiro login, utilizando o teclado dinâmico para a senha e o MFA, sentindo-se mais segura. ([RF02](../requisitos-funcionais/requisitos-funcionais.md#rf02), [RF15](../requisitos-funcionais/requisitos-funcionais.md#rf15))

2. Acessa a seção de perfil para confirmar que pode atuar como investidora e tomadora, valorizando a flexibilidade. ([RF03](../requisitos-funcionais/requisitos-funcionais.md#rf03))

3. Opta por importar seu histórico financeiro via Open Banking para enriquecer seu Score Dinâmico, esperando que isso melhore suas condições de crédito. ([RF08]((../requisitos-funcionais/requisitos-funcionais.md#rf08)))

- **Pontos de Contato com a Solução:** Tela de login, dashboard principal, seção de perfil, funcionalidade de Open Banking.

### Fase 3: Solicitando Crédito e Realizando um Investimento

- **Cenário:** Juliana precisa de um empréstimo para comprar um novo software de design que impulsionará seu trabalho e decide testar a funcionalidade de investimento com uma pequena quantia que economizou de um projeto recente.

- **Sentimentos:** Expectativa de conseguir o crédito com boas condições, confiança na transparência do investimento, mas também um pouco de ansiedade sobre o processo de leilão reverso e a rentabilidade real.

- **Pensamento:** "Será que meu score é bom o suficiente para conseguir um empréstimo com juros realmente baixos? Quero ver meu dinheiro rendendo de verdade e saber exatamente onde ele está sendo aplicado, sem surpresas."

- **Ações:**

1. Inicia uma solicitação de empréstimo, especificando o valor e o prazo desejados para o software. ([RF06](../requisitos-funcionais/requisitos-funcionais.md#rf06))

2. Acompanha o Leilão Reverso para ver as ofertas de juros dos credores, buscando a melhor taxa. ([RF06](../requisitos-funcionais/requisitos-funcionais.md#rf06))

3. Aceita a melhor oferta de empréstimo, sentindo-se no controle da negociação. ([RF11](../requisitos-funcionais/requisitos-funcionais.md#rf11))

4. Realiza um depósito de fundos via Pix para iniciar um investimento, valorizando a agilidade. ([RF04](../requisitos-funcionais/requisitos-funcionais.md#rf04))

5. Visualiza as oportunidades de investimento e o nível de risco associado, sentindo-se informada e segura. ([RF09](../requisitos-funcionais/requisitos-funcionais.md#rf09))

- **Pontos de Contato com a Solução:** Seção de empréstimos, tela de solicitação de empréstimo, painel de  leilão reverso, seção de investimentos, tela de depósito via Pix.

### Fase 4: Acompanhamento e Gestão Financeira

- **Cenário:** Com o empréstimo ativo e o investimento em andamento, Juliana utiliza o aplicativo regularmente para monitorar suas finanças, garantir que tudo esteja conforme o planejado e manter-se informada sobre o desempenho de seus ativos.

- **Sentimentos:** Tranquilidade e controle ao ver seus recursos sendo bem gerenciados, satisfação com a transparência e a rentabilidade, e confiança na segurança da plataforma.

- **Pensamento:** "Meu dinheiro está seguro e rendendo. Consigo ver exatamente para onde foi meu investimento e como meu empréstimo está progredindo. Preciso garantir que meus pagamentos de empréstimo estejam em dia para manter meu score alto."

- **Ações:**

1. Acompanha em tempo real o status de seus investimentos e a alocação de seu dinheiro, sentindo-se no controle. ([RF10](../requisitos-funcionais/requisitos-funcionais.md#rf10))

2. Verifica a previsão de fluxo de caixa para seus recebimentos de investimento e pagamentos de empréstimo, auxiliando no planejamento financeiro. ([RF12](../requisitos-funcionais/requisitos-funcionais.md#rf12))

3. Realiza pagamentos do empréstimo e observa a atualização progressiva de seu Score Dinâmico, sentindo-se recompensada por sua responsabilidade. ([RF08](../requisitos-funcionais/requisitos-funcionais.md#rf08))

4. Recebe notificações sobre atividades suspeitas, caso ocorram, e o sistema bloqueia temporariamente ações, reforçando sua sensação de segurança. ([RF14](../requisitos-funcionais/requisitos-funcionais.md#rf14))

- **Pontos de Contato com a Solução:** Dashboard financeiro, painel de investimentos, painel de empréstimos

### Fase 5: Resgate e Reinvestimento/Novas Oportunidades

- **Cenário:** Juliana decide resgatar parte de seu investimento para uma nova necessidade pessoal ou profissional, ou reinvestir em outra oportunidade. Seu empréstimo está chegando ao fim, e ela considera uma nova solicitação, aproveitando seu histórico positivo.

- **Sentimentos:** Confiança na facilidade do processo de resgate, satisfação com os retornos obtidos e empoderamento para tomar decisões financeiras estratégicas, sabendo que tem controle sobre seu dinheiro.

- **Pensamento:** "O resgate é tão fácil e rápido quanto o depósito? Posso usar o dinheiro que rendeu para um novo projeto ou para uma emergência? Meu score melhorou significativamente, posso conseguir condições ainda melhores agora para um novo empréstimo."

- **Ações:**

1. Solicita o resgate de parte de seus fundos investidos, percebendo a agilidade do processo. ([RF05](../requisitos-funcionais/requisitos-funcionais.md#rf05))

2. Recebe os fundos em sua conta bancária via Pix, confirmando a eficiência do sistema. ([RF05](../requisitos-funcionais/requisitos-funcionais.md#rf05))

3. Considera uma nova solicitação de empréstimo, aproveitando seu Score Dinâmico melhorado e as condições favoráveis. ([RF06](../requisitos-funcionais/requisitos-funcionais.md#rf06), [RF08](../requisitos-funcionais/requisitos-funcionais.md#rf08))

4. Explora novas oportunidades de investimento ou utiliza a funcionalidade de transferências P2P para enviar fundos a um colega, valorizando a versatilidade da plataforma. ([RF07](../requisitos-funcionais/requisitos-funcionais.md#rf07))

- **Pontos de Contato com a Solução:** Seção de empréstimos, seção de investimentos

## Conclusão

&emsp; Por fim, esta jornada garante que as decisões de design e funcionalidades estejam alinhadas com a persona, pois cada etapa foi pensada a partir de suas necessidades, sentimentos e pensamentos. Ao visualizar o caminho da [Juliana Amorim](../persona/persona.md), a equipe pode priorizar o desenvolvimento de recursos que gerem confiança, como o teclado dinâmico ([RF15](../requisitos-funcionais/requisitos-funcionais.md#rf15)) e o bloqueio de ações suspeitas ([RF14](../requisitos-funcionais/requisitos-funcionais.md#rf14)), e que ofereçam autonomia, como o Score Dinâmico ([RF08](../requisitos-funcionais/requisitos-funcionais.md#rf08)) e a flexibilidade de negociação ([RF11](../requisitos-funcionais/requisitos-funcionais.md#rf11)).