---
sidebar_position: 1
title: Primeira Versão do Front-End
label: Primeira Versão do Front-End
---

&emsp; Este documento descreve o processo de desenvolvimento do **frontend** do projeto disponível em: [mithril-fawn.vercel.app](https://mithril-fawn.vercel.app/).

## Tecnologias Utilizadas

* **[React](https://react.dev/):** Biblioteca JavaScript para construção de interfaces de usuário reativas.
* **[Tailwind CSS](https://tailwindcss.com/):** Framework CSS utilitário para estilização rápida e consistente.
* **[Vite](https://vitejs.dev/):** Ferramenta de build para desenvolvimento ágil e otimizado.
* **[Vercel](https://vercel.com/):** Plataforma de hospedagem e deploy contínuo para aplicações frontend.
* O desenvolvimento foi realizado com auxílio da **[Lovable](https://lovable.dev/)**.

## Formato

&emsp; O frontend foi projetado inicialmente para mobile-first, garantindo boa experiência em telas pequenas e posteriormente adaptado para desktops.

## Estrutura do Projeto

&emsp; A estrutura de diretórios do frontend segue o padrão abaixo:

```
📂 frontend
 ┣ 📂 node_modules      # Dependências do projeto
 ┣ 📂 public            # Arquivos estáticos acessíveis publicamente
 ┣ 📂 src               # Código-fonte principal
 ┣ 📜 .gitignore        # Arquivos e pastas ignorados pelo Git
 ┣ 📜 bun.lockb         # Lockfile para gerenciador Bun
 ┣ 📜 components.json   # Configuração de componentes
 ┣ 📜 dockerfile        # Arquivo de configuração para container Docker
 ┣ 📜 eslint.config.js  # Configuração do ESLint (linting de código)
 ┣ 📜 index.html        # HTML principal da aplicação
 ┣ 📜 package-lock.json # Lockfile de dependências (npm)
 ┣ 📜 package.json      # Metadados do projeto e scripts de execução
 ┣ 📜 postcss.config.js # Configuração do PostCSS
 ┣ 📜 README.md         # Documentação inicial do projeto
 ┣ 📜 tailwind.config.ts# Configuração do Tailwind CSS
 ┣ 📜 tsconfig.app.json # Configuração TypeScript para app
 ┣ 📜 tsconfig.json     # Configuração raiz do TypeScript
 ┣ 📜 tsconfig.node.json# Configuração TypeScript para ambiente Node
 ┗ 📜 vite.config.ts    # Configuração do Vite
```

## Como executar

1. **Clonagem do repositório**

   ```bash
   git clone <url-do-repositorio>
   cd frontend
   ```

2. **Instalação das dependências**

   ```bash
   npm install
   ```

3. **Execução em ambiente de desenvolvimento**

   ```bash
   npm run dev
   ```

4. **Build para produção**

   ```bash
   npm run build
   ```

5. **Deploy contínuo**
   Configurado via **Vercel**, com integração ao repositório GitHub.

