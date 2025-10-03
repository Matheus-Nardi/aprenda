# Aprenda - Frontend

Este é o frontend da plataforma Aprenda, desenvolvido para fornecer uma interface de usuário rica e interativa para o ecossistema de aprendizado, permitindo que alunos e professores colaborem de forma eficiente.

## Stack Utilizada

<span>
  <img src="https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React">
  <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Nextjs">
  <img src="https://img.shields.io/badge/shadcn%2Fui-000?style=for-the-badge&logo=shadcnui&logoColor=fff" alt="Shadcn">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
</span>


## Rodando Localmente 🖥️

Para executar o projeto em seu ambiente local, certifique-se de que o **[Backend do Aprenda](https://www.google.com/search?q=https://github.com/gustavo-oli-silva/aprenda.backend)** esteja em execução. Em seguida, siga os passos abaixo.

### Pré-requisitos

  - Node.js (versão 18.18.0 ou superior)
  - Um gerenciador de pacotes (`npm`, `yarn`, `pnpm` ou `bun`)
  - Instância do Backend rodando em `http://localhost:5183`

### Passos

1.  **Clone o repositório:**

    ```sh
    git clone https://github.com/matheus-nardi/aprenda.git
    ```

2.  **Entre no diretório do repositório:**

    ```sh
    cd aprenda
    ```

3.  **Instale as dependências:**

    ```sh
    npm install
    ```

    *ou utilize seu gerenciador de pacotes preferido (yarn, pnpm, bun).*

4.  **Inicie o servidor de desenvolvimento:**

    ```sh
    npm run dev
    ```

    Isso iniciará o servidor com o Turbopack para um desenvolvimento mais rápido.

5.  A aplicação estará disponível em `http://localhost:3000`.

## Estrutura de Pastas

O projeto utiliza a estrutura do **App Router** do Next.js, organizada para manter uma clara separação de responsabilidades.

```
/src
 ├── /app             # Contém todas as rotas, layouts e páginas da aplicação.
 │   ├── /context     # Contextos React (ex: AuthContext para autenticação).
 │   ├── /login       # Rota e página de login.
 │   ├── /professor   # Rotas aninhadas para o dashboard do professor.
 │   ├── /student     # Rotas aninhadas para o dashboard do aluno.
 │   ├── layout.tsx   # Layout principal da aplicação.
 │   └── page.tsx     # Página inicial (landing page).
 │
 ├── /components      # Componentes reutilizáveis da interface.
 │   ├── /project     # Componentes específicos do domínio do projeto (ex: CardClassroom).
 │   └── /ui          # Componentes genéricos de UI (shadcn/ui).
 │
 ├── /hooks           # Hooks React customizados (ex: useAuth).
 │
 ├── /lib             # Funções utilitárias e serviços.
 │   ├── /services    # Lógica para comunicação com a API backend (ex: AuthService).
 │   └── utils.ts     # Funções auxiliares (ex: cn para classes CSS).
 │
 └── /types           # Definições de tipos e interfaces TypeScript.

/public               # Arquivos estáticos (imagens, ícones).
next.config.ts        # Arquivo de configuração do Next.js.
tailwind.config.ts    # Arquivo de configuração do Tailwind CSS.
```
