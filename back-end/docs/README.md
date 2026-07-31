# Beautéch API (Back-end)

API REST desenvolvida para o projeto **Beautéch**, responsável pelo gerenciamento de médicos, clientes, protocolos, agendamentos, atendimentos e autenticação.

---

## 🚀 Tecnologias utilizadas

- Node.js
- Express 5
- MySQL
- JWT (JSON Web Token)
- bcrypt
- CORS
- dotenv
- Nodemon (desenvolvimento)

---

## 📁 Estrutura do projeto

```bash
src/
├── configs/         # Configurações do banco e upload
├── controllers/     # Regras de negócio
├── middlewares/     # Autenticação e uploads
├── models/          # Entidades do sistema
├── repositories/    # Acesso ao banco de dados
├── routes/          # Rotas da API
└── server.js        # Inicialização do servidor
```

---

## ⚙️ Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/beautech.git
cd beautech/back-end
```

### 2. Instalar as dependências

```bash
npm install
```

---

## 🔐 Configuração do ambiente

Crie um arquivo **.env** na raiz do projeto:

```env
SERVER_PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=user_beautech
DB_PASSWORD=senha@4321
DB_DATABASE=beautech

JWT_SECRET=sua_chave_secreta
```

---

## ▶️ Executando o projeto

### Desenvolvimento (com nodemon)

Adicione no `package.json`:

```json
"scripts": {
  "dev": "nodemon src/server.js"
}
```

Execute:

```bash
npm run dev
```

### Produção

```bash
node src/server.js
```

---

## 🌐 URL base

```text
http://localhost:3000
```

---

# 🔑 Autenticação

A API utiliza **JWT Bearer Token**.

Envie o token no cabeçalho das rotas protegidas:

```http
Authorization: Bearer SEU_TOKEN
```

---

# 📌 Endpoints

## Auth

| Método | Rota |
|--------|------|
| POST | `/login/medico` |
| POST | `/login/cliente` |

### Exemplo

```http
POST /login/medico
Content-Type: application/json

{
  "email": "medico@teste.com",
  "senha": "123456"
}
```

---

## 👨‍⚕️ Médicos

| Método | Rota |
|--------|------|
| POST | `/medicos` |
| GET | `/medicos` |
| GET | `/medicos/:id` |
| PUT | `/medicos/:id` |
| DELETE | `/medicos/:id` |

> Todas as rotas, exceto o cadastro, exigem autenticação.

---

## 👤 Clientes

| Método | Rota |
|--------|------|
| POST | `/clientes` |
| GET | `/clientes` |
| GET | `/clientes/:id` |
| PUT | `/clientes/:id` |
| DELETE | `/clientes/:id` |

> Todas as rotas, exceto o cadastro, exigem autenticação.

---

## 📅 Agendamentos

| Método | Rota |
|--------|------|
| POST | `/agendamentos` |
| GET | `/agendamentos` |
| PUT | `/agendamentos/:id` |
| DELETE | `/agendamentos/:id` |

> Todas as rotas exigem autenticação.

---

## 🩺 Atendimentos

| Método | Rota |
|--------|------|
| POST | `/atendimentos` |
| GET | `/atendimentos` |
| GET | `/atendimentos/:id` |
| DELETE | `/atendimentos/:id` |

> Todas as rotas exigem autenticação.

---

## 📋 Protocolos

| Método | Rota |
|--------|------|
| POST | `/protocolos` |
| GET | `/protocolos` |
| GET | `/protocolos/:id` |
| PUT | `/protocolos/:id` |
| DELETE | `/protocolos/:id` |

> Todas as rotas exigem autenticação.

---

# 🗄️ Banco de dados

A conexão é realizada através de um **pool de conexões MySQL** configurado em:

```bash
src/configs/Database.js
```

Variáveis utilizadas:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_DATABASE`

---

# 🏗️ Organização da arquitetura

O projeto segue uma separação em camadas:

```text
Routes
   ↓
Controllers
   ↓
Repositories
   ↓
Models
```

### Responsabilidades

- **Routes:** recebe as requisições HTTP
- **Controllers:** controla o fluxo da aplicação
- **Repositories:** executa operações no banco
- **Models:** representa as entidades do domínio

---

# 🛡️ Middlewares

### `authMiddleware`

Responsável por:

- Validar o token JWT
- Permitir acesso às rotas protegidas

### `uploadImage.middleware`

Preparado para tratamento de upload de imagens.

---

# 📤 Exemplo de resposta

### Sucesso

```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": {}
}
```

### Erro

```json
{
  "success": false,
  "message": "Token inválido"
}
```

---

# 📈 Melhorias sugeridas

- Adicionar **Swagger/OpenAPI**
- Criar **testes automatizados**
- Implementar **refresh token**
- Adicionar **validação com Zod ou Joi**
- Configurar **logs estruturados**
- Criar **Dockerfile** e **docker-compose**

---

# 📜 Scripts recomendados

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

---

# 👩‍💻 Desenvolvido para o projeto Beautéch

API criada para fins acadêmicos/profissionais, com foco em organização em camadas, autenticação JWT e integração com banco de dados MySQL.