export class Agendamento {
    constructor(idCliente, idMedico, data, hora, idProcedimento, status = 'pendente', id = null, tipoAtendimento = 'Procedimento') {
        this.id = id;
        this.idCliente = idCliente;
        this.idMedico = idMedico;
        this.data = data;
        this.hora = hora;
        this.idProcedimento = idProcedimento;
        this.status = status;
        this.tipoAtendimento = tipoAtendimento;
    }

    // Criação do agendamento
    static criar(dados) {
        const agendamento = new Agendamento(
            dados.id_cliente,
            dados.id_medico,
            dados.data,
            dados.hora,
            dados.id_procedimento,
            'pendente',
            null,
            dados.tipo_atendimento || 'Procedimento'
        );
        agendamento.validarCriacao();
        return agendamento;
    }

    static criarExistente(dados) {

        return new Agendamento(

            dados.id_cliente,

            dados.id_medico,

            dados.data,

            dados.hora,

            dados.id_procedimento,

            dados.status,

            dados.id_agendamento,

            dados.tipo_atendimento || 'Procedimento'

        );
    }

    // Data e horário devem ser futuros
    validarDataFutura() {
        const dataHoraConsulta = Agendamento.criarDataHora(this.data, this.hora);
        const agora = new Date();

        if (dataHoraConsulta <= agora) {
            throw new Error('A consulta deve ser marcada para uma data e horário futuros.');
        }
        return true;
    }

    // Validação dos dados
    validarCriacao() {
        if (!this.idCliente) {
            throw new Error('O cliente é obrigatório.');
        }
        if (!this.idMedico) {
            throw new Error('O médico é obrigatório.');
        }
        if (!this.idProcedimento) {
            throw new Error('O procedimento é obrigatório.');
        }
        if (!this.data) {
            throw new Error('A data da consulta é obrigatória.');
        }
        if (!this.hora) {
            throw new Error('O horário da consulta é obrigatório.');
        }

        this.validarDataFutura();
        return true;
    }

    // Diferença entre horários
    static diferencaEmMinutos(data1, hora1, data2, hora2) {
        const primeiraData = Agendamento.criarDataHora(data1, hora1);
        const segundaData = Agendamento.criarDataHora(data2, hora2);
        const diferenca = Math.abs(
            primeiraData.getTime() - segundaData.getTime()
        );
        return diferenca / (1000 * 60);
    }

    // Consultas devem ter pelo menos 1 hora de intervalo
    static validarIntervaloEntreConsultas(data, hora, consultasExistentes) {
        for (const consulta of consultasExistentes) {
            const diferenca = Agendamento.diferencaEmMinutos(
                data,
                hora,
                consulta.data,
                consulta.hora
            );

            if (diferenca < 60) {
                throw new Error(
                    'Não é possível realizar o agendamento. O médico possui outra consulta a menos de 1 hora desse horário.'
                );
            }
        }
        return true;
    }

    // Cancelamento com pelo menos 24 horas de antecedência
    validarCancelamento() {
        if (!['pendente', 'aceito'].includes(this.status)) {
            throw new Error('Essa consulta não pode ser cancelada.');
        }

        const dataHoraConsulta = Agendamento.criarDataHora(this.data, this.hora);
        const agora = new Date();
        const diferenca = (
            dataHoraConsulta.getTime() - agora.getTime()
        ) / (1000 * 60 * 60);

        if (diferenca < 24) {
            throw new Error(
                'O cancelamento só pode ser realizado com pelo menos 24 horas de antecedência.'
            );
        }
        return true;
    }

    // Somente consultas pendentes podem ser aceitas ou recusadas
    validarAprovacao() {
        if (this.status !== 'pendente') {
            throw new Error(
                'Somente solicitações pendentes podem ser aceitas ou recusadas.'
            );
        }
        return true;
    }

    // Somente consultas aceitas podem ser realizadas
    validarRealizacao() {
        if (this.status !== 'aceito') {
            throw new Error(
                'Somente consultas aceitas podem ser marcadas como realizadas.'
            );
        }
        return true;
    }

    // Reagendamento com pelo menos 24 horas de antecedência
    validarReagendamento() {
        if (!['pendente', 'aceito'].includes(this.status)) {
            throw new Error('Essa consulta não pode ser reagendada.');
        }

        const dataHoraConsulta = Agendamento.criarDataHora(this.data, this.hora);
        const agora = new Date();
        const diferenca = (
            dataHoraConsulta.getTime() - agora.getTime()
        ) / (1000 * 60 * 60);

        if (diferenca < 24) {
            throw new Error(
                'O reagendamento só pode ser solicitado com pelo menos 24 horas de antecedência.'
            );
        }
        return true;
    }

    // Alteração do status
    aceitar() {
        this.validarAprovacao();
        this.status = 'aceito';
        return this;
    }

    recusar() {
        this.validarAprovacao();
        this.status = 'recusado';
        return this;
    }

    cancelar() {
        this.validarCancelamento();
        this.status = 'cancelado';
        return this;
    }

    realizar() {
        this.validarRealizacao();
        this.status = 'realizado';
        return this;
    }

    // Criação da data e hora
    static criarDataHora(data, hora) {
        const [ano, mes, dia] = String(data)
            .slice(0, 10)
            .split('-')
            .map(Number);
        const [horas, minutos] = String(hora)
            .slice(0, 5)
            .split(':')
            .map(Number);

        return new Date(ano, mes - 1, dia, horas, minutos, 0, 0);
    }
}