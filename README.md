
# 🎓 StudyFlow: Organize seus Estudos e Acompanhe seu Progresso

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/MSW-FF6A33?style=for-the-badge&logo=mockserviceworker&logoColor=white" alt="MSW">
  <img src="https://img.shields.io/badge/Biome-06B6D4?style=for-the-badge&logo=biome&logoColor=white" alt="Biome">
</p>

O **StudyFlow** é uma aplicação web moderna e intuitiva projetada para ajudar estudantes e aprendizes a organizar seus cursos, acompanhar o progresso e alcançar suas metas de estudo de forma eficiente.

Este projeto nasceu da necessidade de uma ferramenta centralizada que não apenas registra o avanço nos estudos, mas também motiva o usuário através de uma interface limpa, insights visuais e um sistema de metas claras. Em um mundo com inúmeras fontes de conhecimento, o StudyFlow busca ser o seu parceiro para transformar o caos de informações em uma jornada de aprendizado estruturada e gratificante.

---

## ✨ Visão Geral

Com uma interface limpa e focada na experiência do usuário, o StudyFlow permite que você centralize todos os seus materiais de estudo, visualize seu desempenho através de estatísticas detalhadas e se mantenha motivado com um painel de insights. O objetivo é remover a fricção do gerenciamento de estudos, permitindo que você se concentre no que realmente importa: aprender.

<!-- Adicione um GIF ou uma captura de tela da aplicação aqui -->
![StudyFlow Screenshot](/banner-img.png)

## 🚀 Funcionalidades Principais

- **📚 Gerenciamento de Cursos:** Adicione e organize seus cursos, definindo o total de horas e aulas.
- **📦 Módulos Detalhados:** Divida cada curso em módulos com informações específicas como título, número de aulas, duração e status de conclusão.
- **📊 Acompanhamento de Progresso:** Visualize estatísticas completas, incluindo progresso geral, total de cursos, horas de estudo e módulos concluídos.
- **🎯 Metas de Estudo:** Defina e acompanhe suas metas de estudo para se manter focado e motivado.
- **💡 Painel de Insights:** Obtenha informações valiosas sobre seus hábitos e desempenho de estudo.
- **🎨 Tema Dinâmico:** Alterne entre os modos claro e escuro para uma experiência de visualização confortável.
- **📱 Responsivo:** Acesse e organize seus estudos em qualquer dispositivo.

---

## 🛠️ Stack de Tecnologias

O projeto foi construído utilizando tecnologias modernas e eficientes para garantir uma base sólida e escalável.

| Ferramenta             | Descrição                                         |
| ---------------------- | --------------------------------------------------- |
| **React 19**           | Biblioteca principal para a construção da UI.       |
| **TypeScript**         | Superset do JavaScript para tipagem estática.       |
| **Vite**               | Build tool de última geração para o frontend.       |
| **Tailwind CSS**       | Framework CSS utility-first para estilização.       |
| **MSW**                | Mock de API no navegador para desenvolvimento local.      |
| **Axios**              | Cliente HTTP com interceptors para integração com a API.  |
| **TanStack React Query**| Gerenciamento de estado assíncrono e caching.     |
| **React Hook Form**    | Gerenciamento de formulários.                       |
| **Zod**                | Validação de schemas e tipos.                       |
| **Radix UI & Shadcn/ui**| Componentes de UI acessíveis e reutilizáveis.       |
| **Biome**              | Linter e formatador de código.                      |

---

## 🏁 Como Começar

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 20 ou superior)
- [pnpm](https://pnpm.io/) (gerenciador de pacotes)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/SEU_USUARIO/studyflow.git
    cd studyflow
    ```

2.  **Instale as dependências:**
    ```bash
    pnpm install
    ```

3.  **Execute o projeto:**
    ```bash
    pnpm dev
    ```

A aplicação estará disponível em `http://localhost:5173`.

---

## 📂 Estrutura do Projeto

A estrutura de arquivos foi organizada para manter o código modular, escalável e de fácil manutenção, seguindo princípios de separação de responsabilidades.

```
/src
├── /assets
├── /components
│   ├── /ui (Componentes reutilizáveis do Shadcn/ui)
│   └── (Componentes específicos da aplicação)
├── /hooks (Hooks customizados para gerenciamento de estado e lógica da UI)
├── /lib (Configurações de clientes - Axios, QueryClient e utils)
├── /mocks (Handlers e dados mockados com MSW)
├── /schemas (Validação de dados com Zod)
├── /services (Lógica de negócios e comunicação com a API mockada)
├── /types (Definições de tipos e interfaces do TypeScript)
│   ├── 📁 /requests (Tipos de payload para envio à API)
│   └── 📁 /responses (Tipos de retorno da API)
└── /utils (Funções utilitárias)
```

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
