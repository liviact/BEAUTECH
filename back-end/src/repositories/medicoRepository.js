import { connection } from "../configs/Database.js";

const medicoRepository = {

    criar: async (medico) => {

        const [result] = await connection.execute(
            `INSERT INTO usuarios
            (
                nome,
                email,
                senha,
                nivel_acesso,
                crm,
                especializacao
            )
            VALUES (?, ?, ?, 'medico', ?, ?)`,
            [
                medico.nome,
                medico.email,
                medico.senha,
                medico.crm,
                medico.especializacao
            ]
        );

        return result.insertId;
    },

    listar: async () => {

        const [rows] = await connection.execute(
            `SELECT
                id_usuario,
                nome,
                email,
                crm,
                especializacao
            FROM usuarios
            WHERE nivel_acesso='medico'`
        );

        return rows;
    },

    buscarPorId: async (id) => {

        const [rows] = await connection.execute(
            `SELECT *
            FROM usuarios
            WHERE id_usuario=?`,
            [id]
        );

        return rows[0];
    },

    buscarPorEmail: async (email) => {

        const [rows] = await connection.execute(
            `SELECT *
            FROM usuarios
            WHERE email=?`,
            [email]
        );

        return rows[0];
    },

    atualizar: async (id, dados) => {

        const medicoAtual = await medicoRepository.buscarPorId(id);

        if (!medicoAtual) {
            throw new Error("Médico não encontrado");
        }

        const [result] = await connection.execute(
            `UPDATE usuarios
        SET
            nome=?,
            email=?,
            crm=?,
            especializacao=?
        WHERE id_usuario=?`,
            [
                dados.nome ?? medicoAtual.nome,
                dados.email ?? medicoAtual.email,
                dados.crm ?? medicoAtual.crm,
                dados.especializacao ?? medicoAtual.especializacao,
                id
            ]
        );

        return result;
    },

    deletar: async (id) => {

        const [result] = await connection.execute(
            `DELETE FROM usuarios
            WHERE id_usuario=?`,
            [id]
        );

        return result;
    },
listarProcedimentos: async (idMedico) => {
    const [rows] = await connection.execute(
        `
        SELECT
            p.id_procedimento,
            p.nome,
            p.descricao
        FROM procedimentos p
        INNER JOIN medico_procedimentos mp
            ON mp.id_procedimento = p.id_procedimento
        WHERE mp.id_medico = ?
        ORDER BY p.nome
        `,
        [idMedico]
    );

    return rows;
},

    adicionarProcedimento: async (idMedico, idProcedimento) => {
    const [result] = await connection.execute(
        `
        INSERT INTO medico_procedimentos
        (
            id_medico,
            id_procedimento
        )
        SELECT ?, ?
        WHERE NOT EXISTS (
            SELECT 1
            FROM medico_procedimentos
            WHERE id_medico = ?
            AND id_procedimento = ?
        )
        `,
        [
            idMedico,
            idProcedimento,
            idMedico,
            idProcedimento
        ]
    );

    return result;
}
};

export default medicoRepository;