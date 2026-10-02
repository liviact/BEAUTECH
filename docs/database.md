# Banco de dados BEAUTECH

A estrutura vigente está no arquivo `../database.sql`.

Principais entidades:
- `usuarios`: clientes, médicos e administrador, com endereço estruturado e biografia.
- `procedimentos`: catálogo.
- `medico_procedimentos`: relação médico/procedimento com preço individual.
- `configuracoes_clinica`: abertura, fechamento e intervalo de 60 minutos.
- `agendamentos`: solicitações, disponibilidade, status e valor da consulta.
- `prontuarios`: registro obrigatório no encerramento do atendimento.
- `notificacoes`: notificações internas.
- `atendimentos` e `protocolos`: estruturas mantidas para compatibilidade com as funcionalidades anteriores.

Para recriar o banco, execute `database.sql` no MySQL.
