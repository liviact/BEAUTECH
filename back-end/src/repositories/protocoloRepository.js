import { connection } from "../configs/Database.js";

const protocoloRepository = {

    criar: async (protocolo) => {

        const [result] = await connection.execute(
            `INSERT INTO protocolos
            (
                id_cliente,
                id_agendamento,
                descricao,
                etapas,
                produtos_utilizados,
                prognostico,
                recomendacoes,
                quantidade_sessoes,
                data_avaliacao
            )
            VALUES(?,?,?,?,?,?,?,?,?)`,
            [
                protocolo.idCliente,
                protocolo.idAgendamento,
                protocolo.descricao,
                protocolo.etapas,
                protocolo.produtosUtilizados,
                protocolo.prognostico,
                protocolo.recomendacoes,
                protocolo.quantidadeSessoes,
                protocolo.dataAvaliacao
            ]
        );

        return result;
    },

    selecionar: async () => {

        const [rows] = await connection.execute(
            `SELECT * FROM protocolos`
        );

        return rows;
    },

    buscarPorId: async (id) => {

        const [rows] = await connection.execute(
            `SELECT
            p.*,
            c.nome AS cliente,
            a.tipo_atendimento
        FROM protocolos p
        INNER JOIN clientes c
            ON c.id_cliente = p.id_cliente
        INNER JOIN agendamentos a
            ON a.id_agendamento = p.id_agendamento
        WHERE p.id_protocolo=?`,
            [id]
        );

        return rows[0];
    },

    atualizar: async (protocolo) => {

        const protocoloAtual =
            await protocoloRepository.buscarPorId(
                protocolo.id
            );

        if (!protocoloAtual) {
            throw new Error("Protocolo não encontrado");
        }

        const [result] = await connection.execute(
            `UPDATE protocolos
        SET
            descricao=?,
            etapas=?,
            produtos_utilizados=?,
            prognostico=?,
            recomendacoes=?,
            quantidade_sessoes=?,
            data_avaliacao=?
        WHERE id_protocolo=?`,
            [
                protocolo.descricao ?? protocoloAtual.descricao,
                protocolo.etapas ?? protocoloAtual.etapas,
                protocolo.produtosUtilizados ?? protocoloAtual.produtos_utilizados,
                protocolo.prognostico ?? protocoloAtual.prognostico,
                protocolo.recomendacoes ?? protocoloAtual.recomendacoes,
                protocolo.quantidadeSessoes ?? protocoloAtual.quantidade_sessoes,
                protocolo.dataAvaliacao ?? protocoloAtual.data_avaliacao,
                protocolo.id
            ]
        );

        return result;
    },

    deletar: async (id) => {

        const [result] = await connection.execute(
            `DELETE FROM protocolos
            WHERE id_protocolo=?`,
            [id]
        );

        return result;
    }
};

export default protocoloRepository;