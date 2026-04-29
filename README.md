# 🎓 StudyFlow

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Compose">
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions">
</p>

Plataforma para organizar estudos, acompanhar progresso e manter metas de aprendizado com foco em simplicidade, produtividade e evolução contínua.

![StudyFlow Banner](/banner-img.png)

## ✨ O que é o StudyFlow?

O StudyFlow e um app para quem quer estudar com mais organizacao.  
Em vez de anotar progresso em varios lugares, voce consegue centralizar cursos, modulos, metas e acompanhar como seus estudos estao evoluindo.

Hoje o projeto esta passando por uma evolucao importante: saindo de um modelo com mocks/Supabase para uma estrutura propria com backend em C# e banco PostgreSQL.

## 🚀 Principais funcionalidades

- **Cursos e modulos:** organize o que voce esta estudando em etapas menores.
- **Progresso e insights:** veja o quanto avancou e onde pode melhorar.
- **Metas de estudo:** defina objetivos e acompanhe o cumprimento.
- **Login flexivel:** acesso por email/senha ou conta GitHub.
- **Dados isolados por usuario:** cada pessoa ve somente os proprios dados.

## 🧭 Nova direcao do projeto

Para simplificar desenvolvimento e deploy, o projeto esta sendo estruturado como monorepo:

- `apps/web`: frontend React (interface);
- `apps/api`: backend ASP.NET Core monolitico (regras e API);
- `tests/StudyFlow.Tests`: projeto focado em testes da API;
- `infra`: arquivos de infraestrutura e deploy.

Essa mudanca traz uma base mais clara para crescer o produto com seguranca e previsibilidade.

## 🔐 Como vai funcionar a autenticacao

O backend vai suportar dois tipos de login:

1. **Email e senha**
2. **GitHub OAuth**

Se um usuario ja tiver conta com determinado email e entrar com GitHub usando esse mesmo email, a conta sera vinculada automaticamente.

## 🛠️ Detalhes tecnicos (resumo)

- Backend: ASP.NET Core (monolito em um unico projeto)
- Banco: PostgreSQL
- Auth: JWT + refresh token
- Frontend: React + Vite + TypeScript
- Deploy: VPS com Docker Compose
- CI/CD: GitHub Actions com release por tag semantica

## 📡 API planejada (v1)

Prefixo: `/api/v1`

- `auth`: `register`, `login`, `refresh`, `me`, `github/start`, `github/callback`
- `courses` e `modules`
- `goals`
- `certificates`
- `insights/overview`

## ✅ Qualidade e testes

Os testes ficam concentrados em `tests/StudyFlow.Tests`, com foco em:

- login e renovacao de sessao;
- fluxo de autenticacao com GitHub;
- isolamento de dados entre usuarios;
- cenarios principais do produto (curso -> modulo -> insights).

## 🚢 Entrega e deploy

O fluxo de entrega sera automatizado com:

- **CI:** build e testes em pull requests;
- **Release:** publicacao por tag (`v*.*.*`);
- **Deploy:** atualizacao automatica da VPS com health check.

## ℹ️ Status atual

Este repositorio esta em fase de migracao para essa nova arquitetura.  
Durante a transicao, e normal coexistirem partes legadas com a nova estrutura.

## 📄 Licenca

Este projeto esta licenciado sob a licenca MIT. Veja `LICENSE` para mais detalhes.
