# Proffy API

API para o Proffy, uma plataforma para conectar estudantes e professores.

## Tecnologias

- [Node.js](https://nodejs.org/)
- [Fastify](https://www.fastify.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Começando

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v22.18.0 ou superior)
- [Docker](https://www.docker.com/) (se você quiser rodar o projeto com Docker)

### Instalação

1. Clone o repositório:
   ```bash
   git clone git@github.com:Santosfael/api-proffy-android.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd api-proffy
   ```
3. Crie um arquivo `.env` baseado no arquivo `.env.example` e preencha as variáveis de ambiente necessárias.
4. Instale as dependências:
   ```bash
   npm install
   ```

### Executando a aplicação com Docker

A maneira mais fácil de executar a aplicação é usando o Docker.

1.  Certifique-se de ter o Docker e o Docker Compose instalados.
2.  Execute o seguinte comando para iniciar a aplicação:

    ```bash
    docker-compose up --build -d
    ```

A aplicação estará disponível em `http://localhost:3001`.

### Executando a aplicação localmente

1.  Certifique-se de ter uma instância do PostgreSQL em execução e que a `DATABASE_URL` no seu arquivo `.env` esteja configurada corretamente.
2.  Execute as migrações do banco de dados:

    ```bash
    npm run db:migrate
    ```

3.  Inicie a aplicação em modo de desenvolvimento:

    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:3333` (ou a porta que você configurou no seu arquivo `.env`).

## Endpoints da API

Os endpoints disponíveis são documentados automaticamente usando o Swagger. Você pode acessar a documentação em `http://localhost:3333/docs`.

Aqui está uma lista das rotas disponíveis:

-   `POST /users` - Cria um novo usuário
-   `POST /login` - Autentica um usuário
-   `POST /classes` - Cria uma nova aula
-   `GET /classes` - Lista todas as aulas

Os seguintes endpoints requerem autenticação:
- `POST /classes`

Você pode verificar todos os endpoints criados no diretório `src/routes`.