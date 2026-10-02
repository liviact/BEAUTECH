import { connection } from '../configs/Database.js';

const notificacaoRepository = {
    criar: async ({idUsuario,idAgendamento=null,tipo,titulo,mensagem}) => {
        const [result]=await connection.execute(
            `INSERT INTO notificacoes(id_usuario,id_agendamento,tipo,titulo,mensagem)
             VALUES(?,?,?,?,?)`,
            [idUsuario,idAgendamento,tipo,titulo,mensagem]
        );
        return result;
    },

    listar: async (idUsuario) => {
        const [rows]=await connection.execute(
            `SELECT id_notificacao,id_agendamento,tipo,titulo,mensagem,lida,criada_em
             FROM notificacoes WHERE id_usuario=? ORDER BY criada_em DESC LIMIT 30`,
            [idUsuario]
        );
        return rows;
    },

    contarNaoLidas: async (idUsuario) => {
        const [rows]=await connection.execute(
            `SELECT COUNT(*) AS total FROM notificacoes WHERE id_usuario=? AND lida=FALSE`,
            [idUsuario]
        );
        return Number(rows[0].total);
    },

    marcarLida: async (id,idUsuario) => {
        const [result]=await connection.execute(
            `UPDATE notificacoes SET lida=TRUE WHERE id_notificacao=? AND id_usuario=?`,
            [id,idUsuario]
        );
        return result;
    },

    marcarTodas: async (idUsuario) => {
        const [result]=await connection.execute(
            `UPDATE notificacoes SET lida=TRUE WHERE id_usuario=?`,
            [idUsuario]
        );
        return result;
    }
};

export default notificacaoRepository;
