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

    atualizar: async (id,dados) => {

        const [result] = await connection.execute(
            `UPDATE usuarios
            SET
                nome=?,
                email=?,
                crm=?,
                especializacao=?
            WHERE id_usuario=?`,
            [
                dados.nome,
                dados.email,
                dados.crm,
                dados.especializacao,
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
    }
};

export default medicoRepository;