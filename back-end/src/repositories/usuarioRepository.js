import { connection } from '../configs/Database.js';

const usuarioRepository = {
    criar: async (usuario) => {
        const [result] = await connection.execute(
            `INSERT INTO usuarios
            (nome, email, senha, cpf, telefone, data_nascimento, endereco,
             foto_perfil, data_cadastro, nivel_acesso, ativo, tipo_pele, crm, especializacao)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, TRUE, ?, ?, ?)`,
            [
                usuario.nome,
                usuario.email,
                usuario.senha,
                usuario.cpf,
                usuario.telefone,
                usuario.data_nascimento,
                usuario.endereco,
                usuario.foto_perfil,
                usuario.nivel_acesso,
                usuario.tipo_pele ?? null,
                usuario.crm ?? null,
                usuario.especializacao ?? null
            ]
        );
        return result.insertId;
    },

    buscarPorId: async (id) => {
        const [rows] = await connection.execute(
            `SELECT * FROM usuarios WHERE id_usuario = ? LIMIT 1`,
            [id]
        );
        return rows[0];
    },

    buscarPorEmail: async (email) => {
        const [rows] = await connection.execute(
            `SELECT * FROM usuarios WHERE email = ? LIMIT 1`,
            [email]
        );
        return rows[0];
    },

    buscarPorCpf: async (cpf) => {
        const [rows] = await connection.execute(
            `SELECT * FROM usuarios WHERE cpf = ? LIMIT 1`,
            [cpf]
        );
        return rows[0];
    },

    buscarPorCrm: async (crm) => {
        const [rows] = await connection.execute(
            `SELECT * FROM usuarios WHERE crm = ? LIMIT 1`,
            [crm]
        );
        return rows[0];
    },

    listarClientes: async () => {
        const [rows] = await connection.execute(
            `SELECT id_usuario, nome, email, cpf, telefone, data_nascimento,
                    endereco, foto_perfil, data_cadastro, ativo, tipo_pele
             FROM usuarios
             WHERE nivel_acesso = 'cliente'
             ORDER BY nome`
        );
        return rows;
    },

    listarMedicos: async () => {
        const [rows] = await connection.execute(
            `SELECT u.id_usuario, u.nome, u.email, u.cpf, u.telefone, u.data_nascimento,
                    u.endereco, u.foto_perfil, u.data_cadastro, u.ativo, u.crm, u.especializacao,
                    GROUP_CONCAT(p.nome ORDER BY p.nome SEPARATOR '||') AS procedimentos_nomes
             FROM usuarios u
             LEFT JOIN medico_procedimentos mp ON mp.id_medico = u.id_usuario
             LEFT JOIN procedimentos p ON p.id_procedimento = mp.id_procedimento
             WHERE u.nivel_acesso = 'medico' AND u.ativo = TRUE
             GROUP BY u.id_usuario, u.nome, u.email, u.cpf, u.telefone, u.data_nascimento,
                      u.endereco, u.foto_perfil, u.data_cadastro, u.ativo, u.crm, u.especializacao
             ORDER BY u.nome`
        );
        return rows;
    },

    atualizarCliente: async (id, dados) => {
        const atual = await usuarioRepository.buscarPorId(id);
        if (!atual) throw new Error('Usuário não encontrado');

        const [result] = await connection.execute(
            `UPDATE usuarios SET
                nome = ?, email = ?, cpf = ?, telefone = ?, data_nascimento = ?,
                endereco = ?, tipo_pele = ?, foto_perfil = ?
             WHERE id_usuario = ? AND nivel_acesso = 'cliente'`,
            [
                dados.nome ?? atual.nome,
                dados.email ?? atual.email,
                dados.cpf ?? atual.cpf,
                dados.telefone ?? atual.telefone,
                dados.data_nascimento ?? atual.data_nascimento,
                dados.endereco ?? atual.endereco,
                dados.tipo_pele ?? atual.tipo_pele,
                dados.foto_perfil ?? atual.foto_perfil,
                id
            ]
        );
        return result;
    },

    atualizarMedico: async (id, dados) => {
        const atual = await usuarioRepository.buscarPorId(id);
        if (!atual) throw new Error('Usuário não encontrado');

        const [result] = await connection.execute(
            `UPDATE usuarios SET
                nome = ?, email = ?, cpf = ?, telefone = ?, data_nascimento = ?,
                endereco = ?, crm = ?, especializacao = ?, foto_perfil = ?
             WHERE id_usuario = ? AND nivel_acesso = 'medico'`,
            [
                dados.nome ?? atual.nome,
                dados.email ?? atual.email,
                dados.cpf ?? atual.cpf,
                dados.telefone ?? atual.telefone,
                dados.data_nascimento ?? atual.data_nascimento,
                dados.endereco ?? atual.endereco,
                dados.crm ?? atual.crm,
                dados.especializacao ?? atual.especializacao,
                dados.foto_perfil ?? atual.foto_perfil,
                id
            ]
        );
        return result;
    },

    alterarAtivo: async (id, ativo) => {
        const [result] = await connection.execute(
            `UPDATE usuarios SET ativo = ? WHERE id_usuario = ?`,
            [ativo ? 1 : 0, id]
        );
        return result;
    }
};

export default usuarioRepository;
