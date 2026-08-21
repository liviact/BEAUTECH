import { connection } from "../configs/Database.js";

const clienteRepository = {

    criar: async (cliente) => {

        const [result] = await connection.execute(
            `INSERT INTO clientes
        (
            nome,
            telefone,
            cpf,
            senha,
            tipo_pele,
            endereco,
            data_cadastro
        )
        VALUES (?, ?, ?, ?, ?, ?, CURDATE())`,
            [
                cliente.nome,
                cliente.telefone,
                cliente.cpf,
                cliente.senha,
                cliente.tipo_pele,
                cliente.endereco
            ]
        );

        return result.insertId;
    },

    listar: async () => {

        const [rows] = await connection.execute(
            `SELECT *
            FROM clientes`
        );

        return rows;
    },

    buscarPorId: async (id) => {

        const [rows] = await connection.execute(
            `SELECT *
            FROM clientes
            WHERE id_cliente=?`,
            [id]
        );

        return rows[0];
    },

    buscarPorCpf: async (cpf) => {

        const [rows] = await connection.execute(
            `SELECT *
            FROM clientes
            WHERE cpf=?`,
            [cpf]
        );

        return rows[0];
    },

    atualizar: async (id, dados) => {

        const clienteAtual =
            await clienteRepository.buscarPorId(id);

        if (!clienteAtual) {
            throw new Error("Cliente não encontrado");
        }

        const [result] = await connection.execute(
            `UPDATE clientes
        SET
            nome=?,
            telefone=?,
            cpf=?,
            tipo_pele=?,
            endereco=?
        WHERE id_cliente=?`,
            [
                dados.nome ?? clienteAtual.nome,
                dados.telefone ?? clienteAtual.telefone,
                dados.cpf ?? clienteAtual.cpf,
                dados.tipo_pele ?? clienteAtual.tipo_pele,
                dados.endereco ?? clienteAtual.endereco,
                id
            ]
        );

        return result;
    },

    deletar: async (id) => {

        const [result] = await connection.execute(
            `DELETE FROM clientes
            WHERE id_cliente=?`,
            [id]
        );

        return result;
    }
};

export default clienteRepository;