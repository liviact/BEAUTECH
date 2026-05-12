
# Sistema Beautech – Gestão de Clínica Estética

O **Sistema Beautech** é uma aplicação web desenvolvida para a gestão de uma clínica de estética, com foco na organização de clientes, agendamentos e histórico de procedimentos estéticos.

O sistema tem como objetivo modernizar os processos internos da clínica, melhorando o controle administrativo e a experiência dos clientes por meio de uma plataforma digital eficiente e intuitiva.

---

## Objetivo do Projeto

Criar um sistema capaz de:

- Gerenciar cadastro de clientes
- Controlar agendamentos de consultas
- Registrar histórico estético dos pacientes
- Organizar protocolos de tratamento
- Fornecer controle administrativo da clínica
- Garantir acesso seguro com autenticação de usuários

---

## Funcionalidades do Sistema

### Autenticação e Segurança
- Login de administradores e recepcionistas
- Controle de permissões de acesso

### Cadastro de Clientes
- Registro de dados pessoais
- Triagem estética (tipo de pele, preferências e histórico)
- Atualização de informações

### Histórico Estético
- Registro de procedimentos realizados
- Acompanhamento da evolução do cliente
- Recomendações personalizadas

### Agendamentos
- Marcação de consultas
- Cancelamento de horários
- Reagendamento de atendimentos

### Gestão Administrativa
- Visualização da agenda da clínica
- Organização de horários
- Controle da rotina de atendimentos

---

## Arquitetura do Sistema

O sistema segue uma arquitetura Full Stack:

- **Frontend:** Interface do usuário (Web)
- **Backend:** API e regras de negócio
- **Banco de Dados:** Armazenamento das informações
- **Documentação:** Especificações do sistema

---

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- JWT (autenticação)
- Banco de dados relacional (MySQL/PostgreSQL)

### Frontend
- HTML5
- CSS3
- JavaScript
- (Opcional: React)

### Banco de Dados
- Modelo relacional
- Scripts SQL

---

## Plataformas

- Aplicação Web (acesso via navegador)
- API hospedada em Render ou Vercel
- Banco de dados em servidor remoto

---

## Estrutura do Projeto
beautech-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── auth.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── clienteController.js
│   │   │   ├── agendamentoController.js
│   │   │   ├── historicoController.js
│   │   │   └── adminController.js
│   │   │
│   │   ├── models/
│   │   │   ├── Usuario.js
│   │   │   ├── Cliente.js
│   │   │   ├── Agendamento.js
│   │   │   ├── HistoricoEstetico.js
│   │   │   └── Protocolo.js
│   │   │
│   │   ├── repositories/
│   │   │   ├── usuarioRepository.js
│   │   │   ├── clienteRepository.js
│   │   │   ├── agendamentoRepository.js
│   │   │   └── historicoRepository.js
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── clienteService.js
│   │   │   └── agendamentoService.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── clienteRoutes.js
│   │   │   ├── agendamentoRoutes.js
│   │   │   └── historicoRoutes.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   │
│   │   ├── enums/
│   │   │   ├── tipoUsuario.js
│   │   │   └── statusAgendamento.js
│   │   │
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── styles/
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── Sidebar/
│   │   │   ├── CardCliente/
│   │   │   ├── FormAgendamento/
│   │   │   └── Calendar/
│   │   │
│   │   ├── pages/
│   │   │   ├── Login/
│   │   │   ├── Dashboard/
│   │   │   ├── Clientes/
│   │   │   ├── Agendamentos/
│   │   │   ├── Historico/
│   │   │   └── Administracao/
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── clienteService.js
│   │   │   └── agendamentoService.js
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   │
│   │   ├── utils/
│   │   │   └── formatadores.js
│   │   │
│   │   ├── App.js
│   │   └── main.js
│   │
│   ├── package.json
│   └── .env
│
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
│
│
├── docs/
│   ├── requisitos.md
│   ├── casos_de_uso.md
│   ├── arquitetura.md
│   └── manual_usuario.md
│
│
├── README.md
└── .gitignore