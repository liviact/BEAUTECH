import { connection } from '../configs/Database.js';

const medicoRepository = {
    listarProcedimentos: async (idMedico) => {
        const [rows] = await connection.execute(
            `SELECT p.id_procedimento,p.nome,p.descricao,mp.preco
             FROM medico_procedimentos mp
             INNER JOIN procedimentos p ON p.id_procedimento=mp.id_procedimento
             WHERE mp.id_medico=? AND p.ativo=TRUE ORDER BY p.nome`,
            [idMedico]
        );
        return rows;
    },

    adicionarProcedimento: async (idMedico,idProcedimento,preco) => {
        const [result] = await connection.execute(
            `INSERT INTO medico_procedimentos(id_medico,id_procedimento,preco)
             VALUES(?,?,?)
             ON DUPLICATE KEY UPDATE preco=VALUES(preco)`,
            [idMedico,idProcedimento,Number(preco)]
        );
        return result;
    },

    atualizarPreco: async (idMedico,idProcedimento,preco) => {
        const [result] = await connection.execute(
            `UPDATE medico_procedimentos SET preco=? WHERE id_medico=? AND id_procedimento=?`,
            [Number(preco),idMedico,idProcedimento]
        );
        return result;
    },

    removerProcedimento: async (idMedico,idProcedimento) => {
        const [result] = await connection.execute(
            `DELETE FROM medico_procedimentos WHERE id_medico=? AND id_procedimento=?`,
            [idMedico,idProcedimento]
        );
        return result;
    }
};

export default medicoRepository;
