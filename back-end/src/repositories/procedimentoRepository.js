import { connection } from "../configs/Database.js";

const procedimentoRepository = {
    listar: async () => {
        const [rows] = await connection.execute(`
            SELECT
                id_procedimento,
                nome,
                descricao
            FROM procedimentos
            ORDER BY nome
        `);

        return rows;
    },

    buscarPorId: async (id) => {
        const [rows] = await connection.execute(
            `SELECT id_procedimento, nome, descricao
             FROM procedimentos
             WHERE id_procedimento = ?`,
            [id]
        );

        return rows[0];
    }
};

export default procedimentoRepository;
