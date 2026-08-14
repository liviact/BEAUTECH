# BEAUTECH — projeto unificado

Este projeto une o front-end do **BEAUTECH(1)** com a estrutura de autenticação e back-end conectado ao MySQL do **BEAUTECH (2)**.

## Estrutura

- `back-end/` — API Express + MySQL + JWT do BEAUTECH (2).
- `front-end/` — páginas do BEAUTECH (1) + login/cadastro médico do BEAUTECH (2), usando a API do back-end.
- `docs/database.md` — estrutura do banco.

## Páginas

- `/` — login do cliente
- `/cadastro` — cadastro do cliente
- `/login-medico` — login/cadastro do médico
- `/dashboard` — painel
- `/perfil` — perfil
- `/perfil/editar` — edição do perfil
- `/agendamentos` — listagem dos agendamentos
- `/agendamentos/novo` — criação de agendamento

## Integração

O front-end usa `http://localhost:8000` como endereço da API, conforme o back-end do BEAUTECH (2).

O token JWT é salvo no `localStorage` e enviado automaticamente no header `Authorization: Bearer <token>` nas requisições protegidas.

### Observação importante

O back-end atual do BEAUTECH (2) autentica **clientes por CPF**, não por e-mail. Por isso, o login e o cadastro do cliente foram ajustados para utilizar CPF e os demais campos existentes na tabela `clientes`.

## Como executar

### 1. Banco de dados

Crie/tenha o banco `beautech` no MySQL e confira as credenciais em `back-end/.env`.

### 2. Back-end

```bash
cd back-end
npm install
npm run dev
```

O servidor usa a porta definida em `SERVER_PORT` (no projeto enviado: `8000`).

### 3. Front-end

```bash
cd front-end
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite.
