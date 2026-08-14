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
            dados.id_cliente,
            dados.id_agendamento,
            dados.descricao,
            dados.etapas,
            dados.produtos_utilizados,
            dados.prognostico,
            dados.recomendacoes,
            dados.quantidade_sessoes,
            dados.data_avaliacao
        );
    }

    static alterar(dados, id) {

        return {
            id,
            idCliente: dados.id_cliente,
            idAgendamento: dados.id_agendamento,
            descricao: dados.descricao,
            etapas: dados.etapas,
            produtosUtilizados: dados.produtos_utilizados,
            prognostico: dados.prognostico,
            recomendacoes: dados.recomendacoes,
            quantidadeSessoes: dados.quantidade_sessoes,
            dataAvaliacao: dados.data_avaliacao
        };
    }
}