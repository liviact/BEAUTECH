export class Atendimento {

    constructor(
        idCliente,
        idAgendamento,
        data,
        descricaoProcedimento,
        observacoes,
        id = null
    ) {
        this.id = id;
        this.idCliente = idCliente;
        this.idAgendamento = idAgendamento;
        this.data = data;
        this.descricaoProcedimento = descricaoProcedimento;
        this.observacoes = observacoes;
    }

    static criar(dados) {

        return new Atendimento(
            dados.id_cliente,
            dados.id_agendamento,
            dados.data,
            dados.descricao_procedimento,
            dados.observacoes
        );
    }
}