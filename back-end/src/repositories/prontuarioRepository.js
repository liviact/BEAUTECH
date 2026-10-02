import { connection } from '../configs/Database.js';

const prontuarioRepository = {
    listarPorUsuario: async (usuario) => {
        const campo=usuario.tipo==='medico'?'p.id_medico':'p.id_cliente';
        const [rows]=await connection.execute(
            `SELECT p.*,c.nome AS cliente,m.nome AS medico,a.data,a.hora,proc.nome AS procedimento
             FROM prontuarios p
             INNER JOIN usuarios c ON c.id_usuario=p.id_cliente
             INNER JOIN usuarios m ON m.id_usuario=p.id_medico
             INNER JOIN agendamentos a ON a.id_agendamento=p.id_agendamento
             INNER JOIN procedimentos proc ON proc.id_procedimento=a.id_procedimento
             WHERE ${campo}=?
             ORDER BY p.data_atendimento DESC,p.id_prontuario DESC`,
            [usuario.id]
        );
        return rows;
    },

    buscarPorId: async (id) => {
        const [rows]=await connection.execute(
            `SELECT p.*,c.nome AS cliente,m.nome AS medico,a.data,a.hora,proc.nome AS procedimento
             FROM prontuarios p
             INNER JOIN usuarios c ON c.id_usuario=p.id_cliente
             INNER JOIN usuarios m ON m.id_usuario=p.id_medico
             INNER JOIN agendamentos a ON a.id_agendamento=p.id_agendamento
             INNER JOIN procedimentos proc ON proc.id_procedimento=a.id_procedimento
             WHERE p.id_prontuario=?`,
            [id]
        );
        return rows[0];
    }
};

export default prontuarioRepository;
