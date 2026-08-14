# 🗄️ Database.md — Banco de Dados BeauTech

# 📌 Visão Geral

O banco de dados **BeauTech** foi desenvolvido para gerenciar uma clínica de estética/dermatologia, permitindo o controle de:

- usuários do sistema;
- clientes;
- agendamentos;
- atendimentos realizados;
- protocolos estéticos.

O modelo segue uma estrutura relacional utilizando **MySQL**.

---

# 🧩 Modelo Relacional

## 📍 Entidades do Sistema

- `usuarios`
- `clientes`
- `agendamentos`
- `atendimentos`
- `protocolos`

---

# 👨‍⚕️ Entidade: usuarios

## 📌 Descrição

Armazena os usuários do sistema, como administradores, médicos e recepcionistas.

## 🧾 Estrutura

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| id_usuario | INT | PK, AUTO_INCREMENT | Identificador único |
| nome | VARCHAR(100) | NOT NULL | Nome do usuário |
| email | VARCHAR(150) | NOT NULL, UNIQUE | E-mail do usuário |
| senha | VARCHAR(255) | NOT NULL | Senha criptografada |
| nivel_acesso | ENUM | NOT NULL | Perfil de acesso |
| crm | VARCHAR(20) | UNIQUE | Registro profissional |
| especializacao | VARCHAR(100) | — | Área de especialização |

## 🔗 Relacionamentos

- Um usuário pode possuir vários agendamentos.
- Relacionamento com `agendamentos.id_medico`.

---

# 👤 Entidade: clientes

## 📌 Descrição

Armazena os dados dos clientes da clínica.

## 🧾 Estrutura

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| id_cliente | INT | PK, AUTO_INCREMENT | Identificador único |
| nome | VARCHAR(100) | NOT NULL | Nome do cliente |
| telefone | VARCHAR(20) | NOT NULL | Telefone |
| cpf | CHAR(11) | NOT NULL, UNIQUE | CPF do cliente |
| tipo_pele | VARCHAR(50) | — | Tipo de pele |
| endereco | VARCHAR(200) | — | Endereço |
| data_cadastro | DATE | NOT NULL | Data de cadastro |

## 🔗 Relacionamentos

- Um cliente pode possuir vários agendamentos.
- Um cliente pode possuir vários atendimentos.
- Um cliente pode possuir vários protocolos.

---

# 📅 Entidade: agendamentos

## 📌 Descrição

Responsável pelo controle dos horários agendados para atendimento.

## 🧾 Estrutura

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| id_agendamento | INT | PK, AUTO_INCREMENT | Identificador do agendamento |
| id_cliente | INT | FK, NOT NULL | Cliente vinculado |
| id_medico | INT | FK, NOT NULL | Médico responsável |
| data | DATE | NOT NULL | Data do agendamento |
| hora | TIME | NOT NULL | Horário |
| tipo_atendimento | VARCHAR(100) | NOT NULL | Tipo do atendimento |
| status | ENUM | DEFAULT 'agendado' | Situação do atendimento |

## 📌 Valores do Campo `status`

- `agendado`
- `cancelado`
- `concluido`

## 🔗 Relacionamentos

| Origem | Destino | Tipo |
|---|---|---|
| id_cliente | clientes.id_cliente | Muitos para Um |
| id_medico | usuarios.id_usuario | Muitos para Um |

## ⚠️ Restrições

- Um cliente não pode possuir dois agendamentos no mesmo horário.
- Um médico não pode possuir dois atendimentos no mesmo horário.

```sql
UNIQUE (id_cliente, data, hora)
UNIQUE (id_medico, data, hora)
```

---

# 🩺 Entidade: atendimentos

## 📌 Descrição

Registra os atendimentos realizados na clínica.

## 🧾 Estrutura

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| id_atendimento | INT | PK, AUTO_INCREMENT | Identificador |
| id_cliente | INT | FK, NOT NULL | Cliente atendido |
| id_agendamento | INT | FK, UNIQUE, NOT NULL | Agendamento associado |
| data | DATE | NOT NULL | Data do atendimento |
| descricao_procedimento | TEXT | NOT NULL | Procedimento realizado |
| observacoes | TEXT | — | Observações adicionais |

## 🔗 Relacionamentos

| Origem | Destino | Tipo |
|---|---|---|
| id_cliente | clientes.id_cliente | Muitos para Um |
| id_agendamento | agendamentos.id_agendamento | Um para Um |

---

# 📋 Entidade: protocolos

## 📌 Descrição

Armazena protocolos de tratamento e avaliações estéticas dos clientes.

## 🧾 Estrutura

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| id_protocolo | INT | PK, AUTO_INCREMENT | Identificador |
| id_cliente | INT | FK, NOT NULL | Cliente avaliado |
| id_agendamento | INT | FK | Agendamento relacionado |
| descricao | TEXT | NOT NULL | Descrição do protocolo |
| etapas | TEXT | — | Etapas do tratamento |
| produtos_utilizados | TEXT | — | Produtos utilizados |
| prognostico | TEXT | NOT NULL | Prognóstico |
| recomendacoes | TEXT | — | Recomendações |
| quantidade_sessoes | INT | — | Quantidade de sessões |
| data_avaliacao | DATE | NOT NULL | Data da avaliação |

## 🔗 Relacionamentos

| Origem | Destino | Tipo |
|---|---|---|
| id_cliente | clientes.id_cliente | Muitos para Um |
| id_agendamento | agendamentos.id_agendamento | Muitos para Um |

---

# 🔄 Relacionamentos Gerais

| Entidade | Relacionamento |
|---|---|
| clientes → agendamentos | 1:N |
| usuarios → agendamentos | 1:N |
| clientes → atendimentos | 1:N |
| agendamentos → atendimentos | 1:1 |
| clientes → protocolos | 1:N |
| agendamentos → protocolos | 1:N |

---

# 🛡️ Regras de Integridade

## 🔑 Chaves Primárias

Todas as tabelas possuem chave primária do tipo:

```sql
INT AUTO_INCREMENT PRIMARY KEY
```

---

## 🔗 Chaves Estrangeiras

O banco utiliza Foreign Keys para garantir integridade referencial entre as entidades.

Exemplo:

```sql
FOREIGN KEY (id_cliente)
REFERENCES clientes(id_cliente)
```

---

# ⚙️ Script de Criação do Banco

```sql
USE beautech;
```

O banco é composto pelas tabelas:

- usuarios
- clientes
- agendamentos
- atendimentos
- protocolos

---

# 📌 Considerações Técnicas

- Banco de dados: MySQL
- Modelo: Relacional
- Integridade referencial com Foreign Keys
- Controle de duplicidade em agendamentos
- Utilização de ENUM para status e níveis de acesso

---

# 📊 Diagrama Entidade Relacionamento (DER)

O DER representa visualmente os relacionamentos entre:

- Clientes
- Usuários
- Agendamentos
- Atendimentos
- Protocolos

Conforme estrutura apresentada no projeto.
