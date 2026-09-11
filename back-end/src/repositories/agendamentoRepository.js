import { connection } from '../configs/Database.js';

const agendamentoRepository = {
    criar: async (agendamento) => {
        const [result] = await connection.execute(
            `INSERT INTO agendamentos
            (id_cliente, id_medico, data, hora, tipo_atendimento, id_procedimento, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                agendamento.idCliente,
                agendamento.idMedico,
                agendamento.data,
                agendamento.hora,
                agendamento.tipoAtendimento || 'Procedimento',
                agendamento.idProcedimento,
                agendamento.status
            ]
        );
        return result;
    },

    selecionarPorUsuario: async (usuario) => {
        const campo = usuario.tipo === 'medico' ? 'a.id_medico' : 'a.id_cliente';
        const [rows] = await connection.execute(
            `SELECT a.*, c.nome AS cliente, m.nome AS medico,
                    p.nome AS procedimento
             FROM agendamentos a
             INNER JOIN usuarios c ON c.id_usuario = a.id_cliente
             INNER JOIN usuarios m ON m.id_usuario = a.id_medico
             INNER JOIN procedimentos p ON p.id_procedimento = a.id_procedimento
             WHERE ${campo} = ?
             ORDER BY a.data, a.hora`,
            [usuario.id]
        );
        return rows;
    },

    buscarPorId: async (id) => {
        const [rows] = await connection.execute(
            `SELECT * FROM agendamentos WHERE id_agendamento = ? LIMIT 1`,
            [id]
        );
        return rows[0];
    },

    buscarConsultasDoMedico: async (idMedico) => {
        const [rows] = await connection.execute(
            `SELECT a.*, c.nome AS cliente, p.nome AS procedimento
             FROM agendamentos a
             INNER JOIN usuarios c ON c.id_usuario = a.id_cliente
             INNER JOIN procedimentos p ON p.id_procedimento = a.id_procedimento
             WHERE a.id_medico = ? ORDER BY a.data, a.hora`,
            [idMedico]
        );
        return rows;
    },

    buscarConsultasDoMedicoNaData: async (idMedico, data) => {
        const [rows] = await connection.execute(
            `SELECT id_agendamento, id_medico, data, hora, status
             FROM agendamentos
             WHERE id_medico = ? AND data = ?
             AND status IN ('pendente', 'aceito') ORDER BY hora`,
            [idMedico, data]
        );
        return rows;
    },

    atualizarStatus: async (id, status) => {
        const [result] = await connection.execute(
            `UPDATE agendamentos SET status = ? WHERE id_agendamento = ?`,
            [status, id]
        );
        return result;
    },

    atualizar: async (agendamento) => {
        const atual = await agendamentoRepository.buscarPorId(agendamento.id);
        if (!atual) throw new Error('Agendamento não encontrado');

        const [result] = await connection.execute(
            `UPDATE agendamentos SET data = ?, hora = ?, id_procedimento = ?, status = ?
             WHERE id_agendamento = ?`,
            [
                agendamento.data ?? atual.data,
                agendamento.hora ?? atual.hora,
                agendamento.idProcedimento ?? atual.id_procedimento,
                agendamento.status ?? atual.status,
                agendamento.id
            ]
        );
        return result;
    }
};

export default agendamentoRepository;
