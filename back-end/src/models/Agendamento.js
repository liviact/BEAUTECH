export class Agendamento {

    #id;
    #idCliente;
    #idMedico;
    #data;
    #hora;
    #tipoAtendimento;
    #status;

    constructor(
        idCliente,
        idMedico,
        data,
        hora,
        tipoAtendimento,
        status = 'agendado',
        id = null
    ) {
        this.id = id;
        this.idCliente = idCliente;
        this.idMedico = idMedico;
        this.data = data;
        this.hora = hora;
        this.tipoAtendimento = tipoAtendimento;
        this.status = status;
    }

    static criar(dados) {
        return new Agendamento(
            dados.id_cliente,
            dados.id_medico,
            dados.data,
            dados.hora,
            dados.tipo_atendimento,
            dados.status
        );
    }

    static alterar(dados, id) {
        return new Agendamento(
            dados.id_cliente,
            dados.id_medico,
            dados.data,
            dados.hora,
            dados.tipo_atendimento,
            dados.status,
            id
        );
    }
}