# Beautech Front-end

Aplicação web desenvolvida para o projeto **Beautech**, responsável pela interface do sistema de gerenciamento de médicos, clientes, protocolos, agendamentos e atendimentos, consumindo a API REST do projeto.
   
---

## 🚀 Tecnologias utilizadas

- React
- Vite
- JavaScript
- React Router DOM
- Axios
- CSS
- JWT (Autenticação)
- Context API

---

## 📁 Estrutura do projeto

```bash
src/
├── assets/          # Imagens, ícones e arquivos estáticos
├── components/      # Componentes reutilizáveis
├── contexts/        # Contextos da aplicação
├── pages/           # Páginas do sistema
├── routes/          # Configuração das rotas
├── services/        # Comunicação com a API
├── styles/          # Arquivos de estilos
├── utils/           # Funções auxiliares
├── App.jsx
└── main.jsx
```

---

## ⚙️ Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/beautech.git
cd beautech/front-end
```

### 2. Instalar as dependências

```bash
npm install
```

---

## 🔐 Configuração do ambiente

Crie um arquivo **.env** na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

Essa variável define a URL base da API utilizada pelo front-end.

---

## ▶️ Executando o projeto

### Desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:5173
```

### Build para produção

```bash
npm run build
```

### Visualizar a build

```bash
npm run preview
```

---

## 🌐 Integração com a API

Toda a comunicação com o back-end é realizada através do Axios utilizando a URL configurada no arquivo `.env`.

Exemplo:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;
```

---

## 🔑 Autenticação

A autenticação é realizada utilizando **JWT (JSON Web Token)**.

Após o login:

- O token é recebido da API;
- É armazenado no navegador;
- É enviado automaticamente nas requisições protegidas através do cabeçalho:

```http
Authorization: Bearer SEU_TOKEN
```

---

## 📄 Funcionalidades

### Login

- Login de médicos
- Login de clientes
- Controle de autenticação
- Persistência da sessão

### 👨‍⚕️ Médicos

- Cadastro
- Listagem
- Visualização
- Edição
- Exclusão

### 👤 Clientes

- Cadastro
- Listagem
- Visualização
- Edição
- Exclusão

### 📅 Agendamentos

- Cadastro
- Listagem
- Atualização
- Cancelamento

### 🩺 Atendimentos

- Cadastro
- Listagem
- Visualização

### 📋 Protocolos

- Cadastro
- Listagem
- Visualização
- Atualização
- Exclusão

---

## 🏗️ Organização da arquitetura

O projeto segue uma arquitetura baseada em componentes.

```text
Pages
   ↓
Components
   ↓
Services
   ↓
API REST
```

### Responsabilidades

- **Pages:** telas da aplicação.
- **Components:** componentes reutilizáveis.
- **Services:** comunicação com a API.
- **Contexts:** gerenciamento de estado global.
- **Routes:** configuração e proteção das rotas.

---

## 🔒 Rotas protegidas

Após a autenticação, determinadas páginas ficam disponíveis apenas para usuários autenticados.

Exemplos:

- Médicos
- Clientes
- Agendamentos
- Atendimentos
- Protocolos

Caso o token expire ou seja inválido, o usuário será redirecionado para a tela de login.

---

## 📤 Comunicação com a API

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

## 📈 Melhorias sugeridas

- Implementar tema claro/escuro
- Adicionar notificações (Toast)
- Criar tratamento global de erros
- Implementar paginação
- Adicionar filtros de pesquisa
- Melhorar responsividade
- Criar testes automatizados
- Configurar ESLint e Prettier
- Adicionar CI/CD com GitHub Actions

---

## 📜 Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 👩‍💻 Desenvolvido para o projeto Beautech

Aplicação desenvolvida para fins acadêmicos e profissionais, com foco na criação de uma interface moderna, intuitiva e integrada à API REST do projeto Beautech, oferecendo recursos para gerenciamento de médicos, clientes, protocolos, agendamentos e atendimentos.