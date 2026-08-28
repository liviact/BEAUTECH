import { connection } from "../configs/Database.js";

const agendamentoRepository = {

    criar: async (agendamento) => {

        const [result] = await connection.execute(
            `INSERT INTO agendamentos
            (
                id_cliente,
                id_medico,
                data,
                hora,
                tipo_atendimento,
                status
            )
            VALUES(?,?,?,?,?,?)`,
            [
                agendamento.idCliente,
                agendamento.idMedico,
                agendamento.data,
                agendamento.hora,
                agendamento.tipoAtendimento,
                agendamento.status
            ]
        );

        return result;
    },

    selecionar: async () => {

        const [rows] = await connection.execute(`
            SELECT
                a.*,
                c.nome as cliente,
                u.nome as medico
            FROM agendamentos a
            INNER JOIN clientes c
                ON c.id_cliente = a.id_cliente
            INNER JOIN usuarios u
                ON u.id_usuario = a.id_medico
        `);

        return rows;
    },

    buscarPorId: async (id) => {

        const [rows] = await connection.execute(
            `SELECT *
         FROM agendamentos
         WHERE id_agendamento = ?`,
            [id]
        );

        return rows[0];
    },

    atualizar: async (agendamento) => {

        const atual = await agendamentoRepository.buscarPorId(agendamento.id);

        if (!atual) {
            throw new Error("Agendamento não encontrado");
        }

        const [result] = await connection.execute(
            `UPDATE agendamentos
        SET
            data=?,
            hora=?,
            tipo_atendimento=?,
            status=?
        WHERE id_agendamento=?`,
            [
                agendamento.data ?? atual.data,
                agendamento.hora ?? atual.hora,
                agendamento.tipoAtendimento ?? atual.tipo_atendimento,
                agendamento.status ?? atual.status,
                agendamento.id
            ]
        );

        return result;
    },

    deletar: async (id) => {

        const [result] = await connection.execute(
            `DELETE FROM agendamentos
            WHERE id_agendamento=?`,
            [id]
        );

        return result;
    },

    buscarConsultasDoMedicoNaData: async (idMedico, data) => {
        const [rows] = await connection.execute(
            `
        SELECT
            id_agendamento,
            id_medico,
            data,
            hora,
            status
        FROM agendamentos
        WHERE id_medico = ?
        AND data = ?
        AND status IN ('pendente', 'aceito')
        ORDER BY hora
        `,
            [idMedico, data]
        );

        return rows;
    }
};

export default agendamentoRepository;