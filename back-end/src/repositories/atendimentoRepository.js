import { connection } from '../configs/Database.js';

const atendimentoRepository = {
    criar: async (atendimento) => {
        const [result] = await connection.execute(
            `INSERT INTO atendimentos
             (id_cliente, id_agendamento, data, descricao_procedimento, observacoes)
             VALUES (?, ?, ?, ?, ?)`,
            [atendimento.idCliente, atendimento.idAgendamento, atendimento.data, atendimento.descricaoProcedimento, atendimento.observacoes]
        );

        await connection.execute(
            `UPDATE agendamentos SET status = 'concluido' WHERE id_agendamento = ?`,
            [atendimento.idAgendamento]
        );
        return result;
    },

    selecionar: async () => {
        const [rows] = await connection.execute(`
            SELECT at.*, c.nome AS cliente
            FROM atendimentos at
            INNER JOIN usuarios c ON c.id_usuario = at.id_cliente
            ORDER BY at.data DESC, at.id_atendimento DESC
        `);
        return rows;
    },

    buscarPorId: async (id) => {
        const [rows] = await connection.execute(
            `SELECT at.*, c.nome AS cliente
             FROM atendimentos at
             INNER JOIN usuarios c ON c.id_usuario = at.id_cliente
             WHERE at.id_atendimento = ?`,
            [id]
        );
        return rows[0];
    },

    deletar: async (id) => {
        const [result] = await connection.execute(
            `DELETE FROM atendimentos WHERE id_atendimento = ?`,
            [id]
        );
        return result;
    }
};

export default atendimentoRepository;
