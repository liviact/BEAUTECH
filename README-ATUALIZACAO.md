# BEAUTECH — atualização de autenticação e catálogo

## Banco
1. Abra o MySQL Workbench.
2. Execute `database.sql` inteiro.
3. Confira se o banco `beautech` possui as tabelas `usuarios`, `procedimentos`, `medico_procedimentos`, `agendamentos`, `atendimentos` e `protocolos`.

## Back-end
Entre em `back-end` e execute:

```bash
npm install
npm run dev
```

O upload de foto utiliza `multer` e salva as imagens em `back-end/uploads/perfil`.

## Front-end
Entre em `front-end` e execute:

```bash
npm install
npm run dev
```

O `.env` do front usa `VITE_API_URL=http://localhost:8000`.

## Autenticação
A tela inicial agora é única. Nela o usuário escolhe:
- Cliente ou Médico;
- Entrar ou Cadastrar.

No cadastro, cliente e médico possuem os mesmos dados básicos. Médico também informa CRM e especialização; cliente pode informar tipo de pele.

A foto de perfil é obrigatória no cadastro.

## Catálogo
`/medicos` é público e mostra somente médicos ativos, com foto, nome e especialização. Cada card permite abrir o perfil público do profissional.
