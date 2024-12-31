# Auth Service

Um microsserviço de autenticação utilizando **Node.js** com **NestJS** e **TypeORM**, fornecendo funcionalidades como registro de usuários, login, logout, renovação de tokens e gerenciamento de tokens de acesso e refresh.

## Funcionalidades

- **Registro de Usuário:** Permite registrar novos usuários com validação de e-mail único e validação em tempo real via [Zero Bounce](https://www.zerobounce.net/).
- **Login:** Gera tokens de acesso (JWT) e refresh token ao autenticar o usuário.
- **Logout:** Invalida o refresh token ao deslogar.
- **Renovação de Token:** Permite gerar um novo token de acesso válido a partir de um refresh token.
- **Validação de E-mails:** Integração com a API [Zero Bounce](https://www.zerobounce.net/) para validar endereços de e-mail antes do registro.
- **Health Check:** Endpoint para verificar se o serviço está online.

## Tecnologias Utilizadas

- **Node.js**
- **NestJS**
- **TypeORM**
- **PostgreSQL**
- **JWT (JSON Web Tokens)**
- **Zero Bounce**
- **ESLint e Prettier**

## Requisitos

- **Node.js**: v16+
- **npm** ou **yarn**
- **PostgreSQL**
- **Chave de API do Zero Bounce**

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
   ZERO_BOUNCE_API_KEY=<sua-chave-api-zero-bounce>
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

#### Registro de Usuário com Validação de E-mail
- **POST /auth/register**
  - Registro de um novo usuário.
  - Realiza a validação do endereço de e-mail via API Zero Bounce antes de criar o usuário.
  - Payload:
    ```json
    {
      "email": "example@example.com",
      "password": "password123"
    }
    ```
  - Respostas:
    - **Sucesso**:
      ```json
      {
        "id": "123",
        "email": "example@example.com"
      }
      ```
    - **Erro - E-mail inválido**:
      ```json
      {
        "statusCode": 400,
        "message": "Invalid email address.",
        "error": "Bad Request"
      }
      ```
    - **Erro - E-mail já em uso**:
      ```json
      {
        "statusCode": 409,
        "message": "Email is already in use.",
        "error": "Conflict"
      }
      ```

### **Demais Endpoints**

Os outros endpoints permanecem os mesmos, conforme documentado na seção anterior.

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

## Observação sobre a Validação de E-mails

A API Zero Bounce é usada para validar e-mails em tempo real durante o registro. Certifique-se de configurar a chave de API corretamente no arquivo `.env`. Caso a API do Zero Bounce esteja indisponível, a validação será interrompida, e nenhum usuário será registrado com e-mails inválidos.

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais informações.
