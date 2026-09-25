# Banco de dados BEAUTECH

A versão atual utiliza uma única tabela `usuarios` para clientes e médicos.

## Tabelas

- `usuarios`: dados comuns, foto de perfil, `nivel_acesso` (`cliente`/`medico`) e `ativo`.
- `procedimentos`: catálogo de procedimentos.
- `medico_procedimentos`: relação entre médicos e procedimentos.
- `agendamentos`: consultas/agendamentos.
- `atendimentos`: registro do atendimento realizado.
- `protocolos`: protocolos estéticos vinculados a cliente e agendamento.

## Regra de usuários

Todo usuário possui:

- nome
- e-mail
- senha
- CPF
- telefone
- data de nascimento
- endereço
- foto de perfil
- data de cadastro
- nível de acesso
- status ativo/inativo

Médicos também possuem CRM e especialização.
Clientes podem possuir tipo de pele.

A foto não é armazenada como BLOB. O MySQL guarda o caminho em `foto_perfil` e o arquivo é salvo em `back-end/uploads/perfil`.

A criação e manutenção da estrutura deve ser feita pelo arquivo `database.sql` na raiz do projeto.
