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

    // Garante que duas solicitações simultâneas para o mesmo médico/data/hora
    // sejam processadas uma por vez. A primeira a reservar o slot vence.
    criarComDisponibilidade: async (agendamento) => {
        const conn = await connection.getConnection();
        const chave = `beautech:slot:${agendamento.idMedico}:${agendamento.data}:${String(agendamento.hora).slice(0, 5)}`;
        let bloqueio = false;

        try {
            const [lockRows] = await conn.execute(
                'SELECT GET_LOCK(?, 10) AS bloqueado',
                [chave]
            );

            if (Number(lockRows[0]?.bloqueado) !== 1) {
                throw new Error('Não foi possível reservar o horário. Tente novamente.');
            }
            bloqueio = true;

            const [ocupados] = await conn.execute(
                `SELECT id_agendamento
                 FROM agendamentos
                 WHERE id_medico = ? AND data = ? AND hora = ?
                 AND status IN ('pendente', 'aceito')
                 LIMIT 1`,
                [agendamento.idMedico, agendamento.data, agendamento.hora]
            );

            if (ocupados.length) {
                throw new Error('Este horário acabou de ser reservado por outro usuário. Escolha outro horário.');
            }

            await conn.beginTransaction();
            const [result] = await conn.execute(
                `INSERT INTO agendamentos
                (id_cliente, id_medico, data, hora, tipo_atendimento, id_procedimento, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    agendamento.idCliente, agendamento.idMedico, agendamento.data,
                    agendamento.hora, agendamento.tipoAtendimento || 'Procedimento',
                    agendamento.idProcedimento, agendamento.status
                ]
            );
            await conn.commit();
            return result;
        } catch (error) {
            try { await conn.rollback(); } catch {}
            throw error;
        } finally {
            if (bloqueio) {
                try { await conn.execute('SELECT RELEASE_LOCK(?)', [chave]); } catch {}
            }
            conn.release();
        }
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
