import { connection } from '../configs/Database.js';

const camposEndereco = `
    cep, logradouro, numero, complemento, bairro, cidade, uf
`;

const usuarioRepository = {
    criar: async (usuario) => {
        const [result] = await connection.execute(
            `INSERT INTO usuarios
            (nome,email,senha,cpf,telefone,data_nascimento,cep,logradouro,numero,complemento,bairro,cidade,uf,
             foto_perfil,nivel_acesso,ativo,tipo_pele,crm,especializacao,biografia)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,TRUE,?,NULLIF(?,''),NULLIF(?,''),?)`,
            [
                usuario.nome, usuario.email, usuario.senha, usuario.cpf, usuario.telefone,
                usuario.data_nascimento, usuario.cep, usuario.logradouro, usuario.numero,
                usuario.complemento || null, usuario.bairro, usuario.cidade, usuario.uf,
                usuario.foto_perfil || null, usuario.nivel_acesso, usuario.tipo_pele || null,
                usuario.crm || null, usuario.especializacao || null, usuario.biografia || null
            ]
        );
        return result.insertId;
    },

    buscarPorId: async (id) => {
        const [rows] = await connection.execute(`SELECT * FROM usuarios WHERE id_usuario = ? LIMIT 1`, [id]);
        return rows[0];
    },

    buscarPorEmail: async (email) => {
        const [rows] = await connection.execute(`SELECT * FROM usuarios WHERE email = ? LIMIT 1`, [email]);
        return rows[0];
    },

    buscarPorCpf: async (cpf) => {
        const [rows] = await connection.execute(`SELECT * FROM usuarios WHERE cpf = ? LIMIT 1`, [cpf]);
        return rows[0];
    },

    buscarPorCrm: async (crm) => {
        const [rows] = await connection.execute(`SELECT * FROM usuarios WHERE crm = ? LIMIT 1`, [crm]);
        return rows[0];
    },

    listarTodos: async () => {
        const [rows] = await connection.execute(
            `SELECT id_usuario,nome,email,cpf,telefone,data_nascimento,${camposEndereco},
                    foto_perfil,data_cadastro,nivel_acesso,ativo,tipo_pele,crm,especializacao,biografia
             FROM usuarios ORDER BY nivel_acesso,nome`
        );
        return rows;
    },

    listarClientes: async () => {
        const [rows] = await connection.execute(
            `SELECT id_usuario,nome,email,cpf,telefone,data_nascimento,${camposEndereco},
                    foto_perfil,data_cadastro,ativo,tipo_pele
             FROM usuarios WHERE nivel_acesso='cliente' ORDER BY nome`
        );
        return rows;
    },

    listarMedicos: async () => {
        const [rows] = await connection.execute(
            `SELECT u.id_usuario,u.nome,u.email,u.cpf,u.telefone,u.data_nascimento,
                    u.cep,u.logradouro,u.numero,u.complemento,u.bairro,u.cidade,u.uf,
                    u.endereco,u.foto_perfil,u.data_cadastro,u.ativo,u.crm,u.especializacao,u.biografia,
                    GROUP_CONCAT(CONCAT(p.nome,'||',mp.preco) ORDER BY p.nome SEPARATOR ';;;') AS procedimentos_info
             FROM usuarios u
             LEFT JOIN medico_procedimentos mp ON mp.id_medico=u.id_usuario
             LEFT JOIN procedimentos p ON p.id_procedimento=mp.id_procedimento AND p.ativo=TRUE
             WHERE u.nivel_acesso='medico' AND u.ativo=TRUE
             GROUP BY u.id_usuario
             ORDER BY u.nome`
        );
        return rows;
    },

    atualizarCliente: async (id, dados) => {
        const atual = await usuarioRepository.buscarPorId(id);
        if (!atual) throw new Error('Usuário não encontrado.');
        const [result] = await connection.execute(
            `UPDATE usuarios SET nome=?,email=?,cpf=?,telefone=?,data_nascimento=?,
             cep=?,logradouro=?,numero=?,complemento=?,bairro=?,cidade=?,uf=?,tipo_pele=?,foto_perfil=?
             WHERE id_usuario=? AND nivel_acesso='cliente'`,
            [
                dados.nome ?? atual.nome, dados.email ?? atual.email, dados.cpf ?? atual.cpf,
                dados.telefone ?? atual.telefone, dados.data_nascimento ?? atual.data_nascimento,
                dados.cep ?? atual.cep, dados.logradouro ?? atual.logradouro, dados.numero ?? atual.numero,
                dados.complemento ?? atual.complemento, dados.bairro ?? atual.bairro,
                dados.cidade ?? atual.cidade, dados.uf ?? atual.uf, dados.tipo_pele ?? atual.tipo_pele,
                dados.foto_perfil ?? atual.foto_perfil, id
            ]
        );
        return result;
    },

    atualizarMedico: async (id, dados) => {
        const atual = await usuarioRepository.buscarPorId(id);
        if (!atual) throw new Error('Usuário não encontrado.');
        const [result] = await connection.execute(
            `UPDATE usuarios SET nome=?,email=?,cpf=?,telefone=?,data_nascimento=?,
             cep=?,logradouro=?,numero=?,complemento=?,bairro=?,cidade=?,uf=?,
             crm=?,especializacao=?,biografia=?,foto_perfil=?
             WHERE id_usuario=? AND nivel_acesso='medico'`,
            [
                dados.nome ?? atual.nome, dados.email ?? atual.email, dados.cpf ?? atual.cpf,
                dados.telefone ?? atual.telefone, dados.data_nascimento ?? atual.data_nascimento,
                dados.cep ?? atual.cep, dados.logradouro ?? atual.logradouro, dados.numero ?? atual.numero,
                dados.complemento ?? atual.complemento, dados.bairro ?? atual.bairro,
                dados.cidade ?? atual.cidade, dados.uf ?? atual.uf, dados.crm ?? atual.crm,
                dados.especializacao ?? atual.especializacao, dados.biografia ?? atual.biografia,
                dados.foto_perfil ?? atual.foto_perfil, id
            ]
        );
        return result;
    },

    alterarAtivo: async (id, ativo) => {
        const [result] = await connection.execute(`UPDATE usuarios SET ativo=? WHERE id_usuario=?`, [ativo ? 1 : 0, id]);
        return result;
    }
};

export default usuarioRepository;
