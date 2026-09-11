import { connection } from '../configs/Database.js';

const protocoloRepository = {
    criar: async (protocolo) => {
        const [result] = await connection.execute(
            `INSERT INTO protocolos
             (id_cliente, id_agendamento, descricao, etapas, produtos_utilizados,
              prognostico, recomendacoes, quantidade_sessoes, data_avaliacao)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                protocolo.idCliente,
                protocolo.idAgendamento,
                protocolo.descricao,
                protocolo.etapas,
                protocolo.produtosUtilizados,
                protocolo.prognostico,
                protocolo.recomendacoes,
                protocolo.quantidadeSessoes,
                protocolo.dataAvaliacao
            ]
        );
        return result;
    },

    selecionar: async () => {
        const [rows] = await connection.execute(`
            SELECT p.*, c.nome AS cliente, a.tipo_atendimento
            FROM protocolos p
            INNER JOIN usuarios c ON c.id_usuario = p.id_cliente
            INNER JOIN agendamentos a ON a.id_agendamento = p.id_agendamento
            ORDER BY p.data_avaliacao DESC, p.id_protocolo DESC
        `);
        return rows;
    },

    buscarPorId: async (id) => {
        const [rows] = await connection.execute(
            `SELECT p.*, c.nome AS cliente, a.tipo_atendimento
             FROM protocolos p
             INNER JOIN usuarios c ON c.id_usuario = p.id_cliente
             INNER JOIN agendamentos a ON a.id_agendamento = p.id_agendamento
             WHERE p.id_protocolo = ?`,
            [id]
        );
        return rows[0];
    },

    atualizar: async (protocolo) => {
        const atual = await protocoloRepository.buscarPorId(protocolo.id);
        if (!atual) throw new Error('Protocolo não encontrado');

        const [result] = await connection.execute(
            `UPDATE protocolos SET
                descricao = ?, etapas = ?, produtos_utilizados = ?, prognostico = ?,
                recomendacoes = ?, quantidade_sessoes = ?, data_avaliacao = ?
             WHERE id_protocolo = ?`,
            [
                protocolo.descricao ?? atual.descricao,
                protocolo.etapas ?? atual.etapas,
                protocolo.produtosUtilizados ?? atual.produtos_utilizados,
                protocolo.prognostico ?? atual.prognostico,
                protocolo.recomendacoes ?? atual.recomendacoes,
                protocolo.quantidadeSessoes ?? atual.quantidade_sessoes,
                protocolo.dataAvaliacao ?? atual.data_avaliacao,
                protocolo.id
            ]
        );
        return result;
    },

    deletar: async (id) => {
        const [result] = await connection.execute(
            `DELETE FROM protocolos WHERE id_protocolo = ?`,
            [id]
        );
        return result;
    }
};

export default protocoloRepository;
