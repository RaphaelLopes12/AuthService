# Auth Service

Um microsserviço de autenticação utilizando **Node.js** com **NestJS** e **TypeORM**, fornecendo funcionalidades como registro de usuários, login, logout, renovação de tokens e gerenciamento de tokens de acesso e refresh, com suporte a informações detalhadas de perfil, incluindo endereço.

## Funcionalidades

- **Registro de Usuário:** Permite registrar novos usuários com validação de e-mail único e CPF/CNPJ.
- **Gerenciamento de Endereços:** Registra e armazena o endereço do usuário, com vinculação à tabela de usuários.
- **Login:** Gera tokens de acesso (JWT) e refresh token ao autenticar o usuário.
- **Logout:** Invalida o refresh token ao deslogar.
- **Renovação de Token:** Permite gerar um novo token de acesso válido a partir de um refresh token.
- **Validação de E-mails:** Integração opcional com a API [Zero Bounce](https://www.zerobounce.net/) para validação de endereços de e-mail antes do registro.
- **Validação de CPF/CNPJ:** Verifica a validade do CPF ou CNPJ fornecido durante o registro.
- **Health Check:** Endpoint para verificar se o serviço está online.

## Tecnologias Utilizadas

- **Node.js**
- **NestJS**
- **TypeORM**
- **PostgreSQL**
- **JWT (JSON Web Tokens)**
- **Zero Bounce** (opcional)
- **ESLint e Prettier**

## Requisitos

- **Node.js**: v16+
- **npm** ou **yarn**
- **PostgreSQL**
- **Chave de API do Zero Bounce** (opcional)

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

#### Registro de Usuário com Validação de CPF/CNPJ e Endereço
- **POST /auth/register**
  - Registro de um novo usuário com validação de e-mail e CPF/CNPJ únicos, além de armazenamento do endereço fornecido.
  - Payload:
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "johndoe@example.com",
      "password": "password123",
      "confirmPassword": "password123",
      "birthDate": "25/02/2000",
      "phoneNumber": "555123456",
      "cpfOrCnpj": "12345678909",
      "address": {
        "postalCode": "12345678",
        "street": "Rua Exemplo",
        "number": "100",
        "complement": "Apto 101",
        "neighborhood": "Centro",
        "city": "São Paulo",
        "state": "SP"
      }
    }
    ```
  - Respostas:
    - **Sucesso**:
      ```json
      {
        "userId": "123",
        "message": "User registered successfully"
      }
      ```
    - **Erro - CPF ou CNPJ inválido**:
      ```json
      {
        "statusCode": 400,
        "message": "Invalid CPF or CNPJ.",
        "error": "Bad Request"
      }
      ```

#### Login
- **POST /auth/login**
  - Autentica o usuário e retorna os tokens de acesso e refresh.
  - Payload:
    ```json
    {
      "email": "johndoe@example.com",
      "password": "password123"
    }
    ```
  - Respostas:
    - **Sucesso**:
      ```json
      {
        "access_token": "<jwt-token>",
        "refresh_token": "<jwt-refresh-token>"
      }
      ```
    - **Erro - Credenciais inválidas**:
      ```json
      {
        "statusCode": 401,
        "message": "Invalid email or password",
        "error": "Unauthorized"
      }
      ```

#### Perfil do Usuário
- **POST /auth/profile**
  - Retorna as informações completas do perfil do usuário logado, incluindo endereços.
  - Requer um token JWT válido no cabeçalho Authorization.
  - Respostas:
    - **Sucesso**:
      ```json
      {
        "id": "123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "johndoe@example.com",
        "birthDate": "2000-02-25T02:00:00.000Z",
        "cpfOrCnpj": "12345678909",
        "phoneNumber": "555123456",
        "addresses": [
          {
            "postalCode": "12345678",
            "street": "Rua Exemplo",
            "number": "100",
            "complement": "Apto 101",
            "neighborhood": "Centro",
            "city": "São Paulo",
            "state": "SP"
          }
        ]
      }
      ```

#### Logout
- **POST /auth/logout**
  - Invalida o refresh token do usuário logado.
  - Payload:
    ```json
    {
      "refreshToken": "<jwt-refresh-token>"
    }
    ```

#### Renovação de Token
- **POST /auth/refresh-token**
  - Gera um novo token de acesso com base no refresh token válido.
  - Payload:
    ```json
    {
      "userId": "123",
      "refreshToken": "<jwt-refresh-token>"
    }
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

## Observação sobre a Validação de E-mails

A API Zero Bounce é usada para validar e-mails em tempo real durante o registro. Certifique-se de configurar a chave de API corretamente no arquivo `.env`. Caso a API do Zero Bounce esteja indisponível, a validação será interrompida, e nenhum usuário será registrado com e-mails inválidos.

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais informações.

