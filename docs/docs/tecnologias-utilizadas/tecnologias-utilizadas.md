---
sidebar_position: 9
title: Tecnologias Utilizadas
---

## Back-end (Python/FastAPI)
- FastAPI 0.104.x, Uvicorn 0.24.x
- SQLAlchemy 2.0.x
- PostgreSQL (Supabase) + `psycopg2-binary` 2.9.x
- Pydantic 2.5.x
- Autenticação/segurança: `python-jose[cryptography]` 3.3.x, `passlib` 1.7.x, `bcrypt` 3.2.x
- Upload/multipart: `python-multipart` 0.0.6
- Configuração: `python-dotenv` 1.0.x

## Mobile (React Native / Expo)
- React 18, React Native 0.76
- Expo 54 e módulos (StatusBar, LinearGradient, Crypto, Font)
- Navegação: `@react-navigation` (stack, tabs, native-stack)
- Estado/async: `@tanstack/react-query` 5.x, `@react-native-async-storage/async-storage`
- UI e UX: `@expo/vector-icons`, `react-native-toast-message`, `react-native-safe-area-context`, `react-native-screens`, `react-native-gesture-handler`
- Stellar SDK JS: `@stellar/stellar-base` 11.x
- Utilitários: `axios` 1.x, `buffer`, `process`, `react-native-get-random-values`, `react-native-keychain`
- Tooling: TypeScript 5.x, `@babel/core`

## Blockchain (Stellar / Soroban)
- Linguagem: Rust (Contratos Soroban)
- SDK: `soroban-sdk` (cliente de token) — ver `src/stellar/contracts/*`
- Estruturas: contratos `credit_score`, `governance`, `loan`; crate utilitário `wallets`
- Scripts de deploy/teste: `src/stellar/contracts/deploy/*.sh`

## Banco de Dados
- SGBD: PostgreSQL 14+ (Supabase)
- Extensões: `uuid-ossp`, `pgcrypto`
- Script fonte: `src/backend/banco-dados/db.sql`

## Infra/DevOps
- Docker/Compose (orquestração local via `compose.yaml`)
- Hospedagem alvo: Amazon EC2
- Health checks via `GET /health` em todos os serviços

## Documentação
- Docusaurus (site em `docs/`), build estático em `docs/build/`
- Assets estáticos em `docs/static/`

Referências cruzadas:
- Back-end: ver `Desenvolvimento > Back-End`
- Banco de Dados: ver `Desenvolvimento > Banco de Dados`
- Blockchain: ver `Desenvolvimento > Implementação de Blockchain Stellar`
