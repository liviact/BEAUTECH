import { connection } from '../configs/Database.js';

const configuracaoRepository = {
    buscar: async () => {
        const [rows] = await connection.execute(
            `SELECT id_configuracao,TIME_FORMAT(hora_abertura,'%H:%i') AS hora_abertura,
                    TIME_FORMAT(hora_fechamento,'%H:%i') AS hora_fechamento,
                    intervalo_minutos,atualizado_em
             FROM configuracoes_clinica WHERE id_configuracao=1`
        );
        return rows[0];
    },

    atualizar: async (abertura,fechamento,adminId) => {
        const [result]=await connection.execute(
            `UPDATE configuracoes_clinica
             SET hora_abertura=?,hora_fechamento=?,intervalo_minutos=60,atualizado_por=?
             WHERE id_configuracao=1`,
            [abertura,fechamento,adminId]
        );
        return result;
    }
};

export default configuracaoRepository;
