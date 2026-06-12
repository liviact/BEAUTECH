export class Protocolo {

    constructor(
        idCliente,
        idAgendamento,
        descricao,
        etapas,
        produtosUtilizados,
        prognostico,
        recomendacoes,
        quantidadeSessoes,
        dataAvaliacao,
        id = null
    ) {
        this.id = id;
        this.idCliente = idCliente;
        this.idAgendamento = idAgendamento;
        this.descricao = descricao;
        this.etapas = etapas;
        this.produtosUtilizados = produtosUtilizados;
        this.prognostico = prognostico;
        this.recomendacoes = recomendacoes;
        this.quantidadeSessoes = quantidadeSessoes;
        this.dataAvaliacao = dataAvaliacao;
    }

    static criar(dados) {

        return new Protocolo(
            dados.idCliente,
            dados.idAgendamento,
            dados.descricao,
            dados.etapas,
            dados.produtosUtilizados,
            dados.prognostico,
            dados.recomendacoes,
            dados.quantidadeSessoes,
            dados.dataAvaliacao
        );


    }

    static alterar(dados, id) {

        return {
            id,
            idCliente: dados.idCliente,
            idAgendamento: dados.idAgendamento,
            descricao: dados.descricao,
            etapas: dados.etapas,
            produtosUtilizados: dados.produtosUtilizados,
            prognostico: dados.prognostico,
            recomendacoes: dados.recomendacoes,
            quantidadeSessoes: dados.quantidadeSessoes,
            dataAvaliacao: dados.dataAvaliacao
        };
    }
}