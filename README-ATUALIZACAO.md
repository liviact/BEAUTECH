# BEAUTECH — atualização das novas funções

Esta versão mantém a identidade visual existente e adiciona:

- Endereço completo por CEP, com consulta automática ao ViaCEP, número e complemento.
- Endereço estruturado para clientes e médicos.
- Calendário visual no novo agendamento para escolher o dia.
- Horários fixos de 1 em 1 hora.
- Reserva concorrente de horário: uma solicitação pendente ou aceita bloqueia o mesmo slot para os demais.
- Horário de funcionamento configurável pelo administrador.
- Preço individual por médico para cada procedimento.
- Valor do procedimento salvo no agendamento e ajustável no encerramento.
- Notificações internas para nova solicitação, aceite, recusa, cancelamento, reagendamento e prontuário disponível.
- Expiração automática de solicitações pendentes após 48 horas ou quando o horário da consulta já passou.
- Prontuário obrigatório antes de concluir uma consulta, contendo processo realizado, produtos utilizados, valor e observações.
- Prontuário disponível para o cliente após a conclusão.
- Biografia do médico no perfil público.
- Cards refinados sem trocar a identidade visual.
- Botões de voltar alinhados à esquerda.
- Menu de notificações no cabeçalho.

## Banco de dados

O arquivo `database.sql` é o script completo da nova versão. Ele recria o banco `beautech` do zero.

Depois de executar o SQL, configure o `.env` do backend normalmente. Ao iniciar o servidor, o `ensureAdmin` cria o administrador padrão caso ele ainda não exista.

## Funcionamento dos horários

O administrador define abertura e fechamento no painel. Os horários disponíveis são gerados automaticamente de 1 em 1 hora. Uma clínica configurada de 08:00 a 18:00, por exemplo, oferece 08:00, 09:00, ..., 17:00.

Domingos continuam fechados, como na versão anterior.

## CEP

O frontend consulta:

`https://viacep.com.br/ws/{CEP}/json/`

O usuário pode corrigir manualmente os campos retornados pelo serviço.

## Execução

Backend:

```bash
cd back-end
npm install
npm run dev
```

Frontend:

```bash
cd front-end
npm install
npm run dev
```

O frontend usa `VITE_API_URL` quando configurado; caso contrário, utiliza `http://localhost:8000`.

## Observação

A limpeza automática das solicitações pendentes é executada periodicamente pelo backend e também antes das consultas de disponibilidade/listagem. Assim, uma solicitação vencida não continua ocupando o horário.
