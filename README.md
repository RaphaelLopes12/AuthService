# Auth Service

Um microsserviço de autenticação utilizando **Node.js** com **NestJS** e **TypeORM**, fornecendo funcionalidades como registro de usuários, login, logout, renovação de tokens e gerenciamento de tokens de acesso e refresh.

## Funcionalidades

- **Registro de Usuário:** Permite registrar novos usuários com validação de e-mail único.
- **Login:** Gera tokens de acesso (JWT) e refresh token ao autenticar o usuário.
- **Logout:** Invalida o refresh token ao deslogar.
- **Renovação de Token:** Permite gerar um novo token de acesso válido a partir de um refresh token.
- **Health Check:** Endpoint para verificar se o serviço está online.

## Tecnologias Utilizadas

- **Node.js**
- **NestJS**
- **TypeORM**
- **PostgreSQL**
- **JWT (JSON Web Tokens)**
- **ESLint e Prettier**

## Requisitos

- **Node.js**: v16+
- **npm** ou **yarn**
- **PostgreSQL**

## Configuração e Instalação

1. Clone o repositório:

   ```bash
   git clone <url-do-repositorio>
   cd auth-service
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   Crie um arquivo `.env` na raiz do projeto com as seguintes configurações:

   ```env
   PORT=3000
   JWT_SECRET=sua-key-aqui
   DB_HOST=<seu-host>
   DB_PORT=5432
   DB_USERNAME=<seu-usuario>
   DB_PASSWORD=<sua-senha>
   DB_NAME=auth_service
   ```

4. Inicialize o banco de dados:

   Certifique-se de que o banco de dados PostgreSQL está configurado e rodando. O TypeORM criará as tabelas automaticamente ao iniciar a aplicação.

5. Inicie o servidor:

   ```bash
   npm run start
   ```

   O serviço estará disponível em `http://localhost:3000`.

## Endpoints

### **Autenticação**

- **POST /auth/register**
  - Registro de um novo usuário.
  - Payload:
    ```json
    {
      "email": "example@example.com",
      "password": "password123"
    }
    ```

- **POST /auth/login**
  - Login do usuário e geração de tokens.
  - Payload:
    ```json
    {
      "email": "example@example.com",
      "password": "password123"
    }
    ```
  - Retorno:
    ```json
    {
      "access_token": "...",
      "refresh_token": "..."
    }
    ```

- **POST /auth/refresh-token**
  - Gera um novo token de acesso usando o refresh token.
  - Payload:
    ```json
    {
      "userId": "<user-id>",
      "refreshToken": "<refresh-token>"
    }
    ```

- **POST /auth/logout**
  - Invalida o refresh token do usuário ao deslogar.
  - Payload:
    ```json
    {
      "refreshToken": "<refresh-token>"
    }
    ```

### **Health Check**

- **GET /health**
  - Retorna o status da aplicação.

### **Perfil do Usuário**

- **POST /auth/profile**
  - Retorna informações do usuário autenticado.
  - Requer o token de acesso no cabeçalho:
    ```bash
    Authorization: Bearer <access_token>
    ```

## Testes

1. Execute os testes unitários:

   ```bash
   npm run test
   ```

2. Execute os testes de integração:

   ```bash
   npm run test:e2e
   ```

3. Verifique a cobertura de testes:

   ```bash
   npm run test:cov
   ```

## Lint e Formatação

- Para verificar o lint:

  ```bash
  npm run lint
  ```

- Para corrigir automaticamente problemas de lint:

  ```bash
  npm run lint:fix
  ```

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais informações.
