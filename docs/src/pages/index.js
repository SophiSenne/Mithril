import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          Mithril
        </Heading>
        <p className={styles.heroSubtitle}>
          Conectamos investidores e tomadores de crédito através de blockchain e IA. 
          Juros até 70% menores que bancos. Rentabilidade superior ao CDI. Transparência total.
        </p>
        <div className={styles.buttons}>
          <Link
            className={clsx('button', styles.buttonPrimary)}
            to="https://mithril-fawn.vercel.app/">
            Acessar Plataforma
          </Link>
          <Link
            className={clsx('button', styles.buttonSecondary)}
            to="/docs/intro">
            Ver Documentação
          </Link>
        </div>
      </div>
    </header>
  );
}

function MithrilNameSection() {
  return (
    <section className={styles.mithrilSection}>
      <div className="container">
        <Heading as="h2" className={clsx(styles.sectionTitle, 'text--center')} style={{ marginTop: '60px' }} >
          Por que Mithril?
        </Heading>
        <p className={clsx(styles.sectionSubtitle, 'text--center')}>
          O nome <strong>Mithril</strong> foi escolhido em referência ao universo da Terra-média, de <em>O Senhor dos Anéis</em>. 
          No contexto literário, o mithril é um metal raríssimo, extremamente leve, resistente e de grande valor, capaz de oferecer 
          proteção sem comprometer a mobilidade. Essa simbologia conecta-se diretamente à proposta do sistema: oferecer uma 
          infraestrutura segura, transparente e robusta, mas ao mesmo tempo ágil, acessível e eficiente, unindo força e leveza em 
          um ecossistema financeiro de próxima geração.
        </p>
      </div>
    </section>
  );
}

function ValueProposition() {
  return (
    <section className={styles.valueSection}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <div className={styles.valueCard}>
              <Heading as="h2" className={styles.sectionTitle}>Para Investidores</Heading>
              <ul className={styles.benefitsList}>
                <li>
                  <strong>Rentabilidade Superior</strong>
                  <span>Retornos acima do CDI com transparência total</span>
                </li>
                <li>
                  <strong>Você no Controle</strong>
                  <span>Escolha onde e como investir seu dinheiro</span>
                </li>
                <li>
                  <strong>Transparência Blockchain</strong>
                  <span>Acompanhe cada transação em tempo real</span>
                </li>
                <li>
                  <strong>Diversificação Inteligente</strong>
                  <span>IA recomenda os melhores investimentos</span>
                </li>
                <li>
                  <strong>Impacto Social</strong>
                  <span>Ajude pessoas reais a alcançar seus objetivos</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="col col--6">
            <div className={styles.valueCard}>
              <Heading as="h2" className={styles.sectionTitle}>Para Tomadores</Heading>
              <ul className={styles.benefitsList}>
                <li>
                  <strong>Juros Justos</strong>
                  <span>Até 70% menores que bancos tradicionais</span>
                </li>
                <li>
                  <strong>Crédito Rápido</strong>
                  <span>Aprovação em menos de 5 minutos</span>
                </li>
                <li>
                  <strong>Score Progressivo</strong>
                  <span>Melhore seu histórico automaticamente</span>
                </li>
                <li>
                  <strong>Sem Complicações</strong>
                  <span>Processo 100% digital e simplificado</span>
                </li>
                <li>
                  <strong>Flexibilidade Total</strong>
                  <span>Negocie prazos e valores livremente</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className={styles.howItWorksSection}>
      <div className="container">
        <Heading as="h2" className={clsx(styles.sectionTitle, 'text--center')}>
          Como Funciona
        </Heading>
        <p className={clsx(styles.sectionSubtitle, 'text--center')}>
          Investir nunca foi tão simples
        </p>
        <div className="row">
          <div className="col col--4">
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3>Cadastro Simples</h3>
              <p>Crie sua conta em minutos com verificação biométrica e integração Open Finance</p>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3>Análise Inteligente</h3>
              <p>Nossa IA avalia seu perfil e define condições justas em tempo real</p>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3>Conexão Direta</h3>
              <p>Investidores e tomadores se conectam de forma transparente e segura</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DifferentialsSection() {
  const differentials = [
    {
      icon: '🔗',
      title: 'Transparência Blockchain',
      traditional: 'Você não sabe onde seu dinheiro está',
      ours: 'Acompanhe cada transação em tempo real'
    },
    {
      icon: '💎',
      title: 'Juros Personalizados',
      traditional: 'Taxa fixa alta para todos',
      ours: 'Leilão reverso com juros até 70% menores'
    },
    {
      icon: '📈',
      title: 'Score Progressivo',
      traditional: 'Score estático que só piora',
      ours: 'Melhoria automática com pagamentos em dia'
    },
    {
      icon: '🛡️',
      title: 'Proteção Inteligente',
      traditional: 'Sistemas vulneráveis',
      ours: 'IA antifraude com arquitetura zero trust'
    },
    {
      icon: '🤝',
      title: 'Humanização',
      traditional: 'Algoritmo decide tudo',
      ours: 'Pessoas negociam diretamente'
    },
    {
      icon: '🌍',
      title: 'Impacto Social',
      traditional: 'Lucro vai para acionistas',
      ours: 'Conecta quem tem com quem precisa'
    }
  ];

  return (
    <section className={styles.differentialsSection}>
      <div className="container">
        <Heading as="h2" className={clsx(styles.sectionTitle, 'text--center')}>
          Por Que Escolher Nossa Solução?
        </Heading>
        <div className={styles.comparisonGrid}>
          {differentials.map((diff, idx) => (
            <div key={idx} className={styles.comparisonCard}>
              <div className={styles.cardIcon}>{diff.icon}</div>
              <h3>{diff.title}</h3>
              <div className={styles.comparison}>
                <div className={styles.traditional}>
                  <span className={styles.label}>Bancos Tradicionais</span>
                  <p>{diff.traditional}</p>
                </div>
                <div className={styles.ours}>
                  <span className={styles.label}>Nossa Plataforma</span>
                  <p>{diff.ours}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  const technologies = [
    {
      icon: '🔐',
      title: 'Blockchain Stellar',
      description: 'Smart contracts garantem transparência e segurança total'
    },
    {
      icon: '🤖',
      title: 'Machine Learning',
      description: 'Antifraude em tempo real e score progressivo inteligente'
    },
    {
      icon: '⚡',
      title: 'PIX Integrado',
      description: 'Transferências instantâneas 24/7'
    },
    {
      icon: '🏦',
      title: 'Open Finance',
      description: 'Importação automática de histórico bancário'
    },
    {
      icon: '🛡️',
      title: 'Zero Trust',
      description: 'Arquitetura de segurança máxima com multi-fator'
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Dashboard completo para gestão de investimentos'
    }
  ];

  return (
    <section className={styles.techSection}>
      <div className="container">
        <Heading as="h2" className={clsx(styles.sectionTitle, 'text--center')}>
          Tecnologia de Ponta
        </Heading>
        <p className={clsx(styles.sectionSubtitle, 'text--center')}>
          Segurança, transparência e inovação em cada detalhe
        </p>
        <div className={styles.techGrid}>
          {technologies.map((tech, idx) => (
            <div key={idx} className={styles.techCard}>
              <div className={styles.techIcon}>{tech.icon}</div>
              <h3>{tech.title}</h3>
              <p>{tech.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <div className="text--center">
          <Heading as="h2" className={styles.ctaTitle}>
            Você no Controle das Suas Finanças
          </Heading>
          <p className={styles.ctaSubtitle}>
            Transparente. Seguro. Descomplicado.
          </p>
          <div className={styles.ctaButtons}>
            <Link
              className={clsx('button', styles.buttonPrimaryCTA)}
              to="https://seu-app-deploy.vercel.app">
              Começar Agora
            </Link>
            <Link
              className={clsx('button', styles.buttonSecondaryCTA)}
              to="/docs/intro">
              Conhecer Mais
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Plataforma P2P de Crédito e Investimento"
      description="Conectamos investidores e tomadores através de blockchain e IA. Crédito rápido, seguro e sem complicações.">
      <HomepageHeader />
      <main>
        <MithrilNameSection />
        <ValueProposition />
        <HowItWorks />
        <DifferentialsSection />
        <TechStack />
        <CTASection />
      </main>
    </Layout>
  );
}