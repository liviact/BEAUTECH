export class Atendimento {

    constructor(
        idCliente,
        idAgendamento,
        data,
        descricaoProcedimento,
        observacoes,
        id = null
    ){
        this.id = id;
        this.idCliente = idCliente;
        this.idAgendamento = idAgendamento;
        this.data = data;
        this.descricaoProcedimento = descricaoProcedimento;
        this.observacoes = observacoes;
    }

    static criar(dados){

        return new Atendimento(
            dados.idCliente,
            dados.idAgendamento,
            dados.data,
            dados.descricaoProcedimento,
            dados.observacoes
        );
    }
}