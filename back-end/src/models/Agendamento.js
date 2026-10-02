export class Agendamento {
    constructor(idCliente,idMedico,data,hora,idProcedimento,status='pendente',id=null,tipoAtendimento='Procedimento') {
        this.id=id; this.idCliente=idCliente; this.idMedico=idMedico; this.data=data; this.hora=hora;
        this.idProcedimento=idProcedimento; this.status=status; this.tipoAtendimento=tipoAtendimento;
    }

    static criar(dados) {
        const agendamento=new Agendamento(
            dados.id_cliente,dados.id_medico,dados.data,dados.hora,dados.id_procedimento,
            'pendente',null,dados.tipo_atendimento||'Procedimento'
        );
        agendamento.validarCriacao();
        return agendamento;
    }

    static criarExistente(dados) {
        return new Agendamento(
            dados.id_cliente,dados.id_medico,dados.data,dados.hora,dados.id_procedimento,
            dados.status,dados.id_agendamento,dados.tipo_atendimento||'Procedimento'
        );
    }

    validarDataFutura() {
        if (Agendamento.criarDataHora(this.data,this.hora)<=new Date()) {
            throw new Error('A consulta deve ser marcada para uma data e horário futuros.');
        }
        return true;
    }

    validarHorarioFuncionamento() {
        if (!/^\d{2}:\d{2}$/.test(String(this.hora)) || Number(String(this.hora).slice(3,5))!==0) {
            throw new Error('Os horários devem ser reservados de 1 em 1 hora.');
        }
        return true;
    }

    validarCriacao() {
        if (!this.idCliente) throw new Error('O cliente é obrigatório.');
        if (!this.idMedico) throw new Error('O médico é obrigatório.');
        if (!this.idProcedimento) throw new Error('O procedimento é obrigatório.');
        if (!this.data) throw new Error('A data da consulta é obrigatória.');
        if (!this.hora) throw new Error('O horário da consulta é obrigatório.');
        this.validarDataFutura();
        this.validarHorarioFuncionamento();
        return true;
    }

    validarNovoHorario(data,hora) {
        const novo=new Agendamento(this.idCliente,this.idMedico,data,hora,this.idProcedimento,this.status,this.id,this.tipoAtendimento);
        novo.validarDataFutura(); novo.validarHorarioFuncionamento(); return true;
    }

    validarCancelamento() {
        if (!['pendente','aceito'].includes(this.status)) throw new Error('Essa consulta não pode ser cancelada.');
        const diferenca=(Agendamento.criarDataHora(this.data,this.hora).getTime()-Date.now())/(1000*60*60);
        if (diferenca<24) throw new Error('O cancelamento só pode ser realizado com pelo menos 24 horas de antecedência.');
        return true;
    }

    validarReagendamento() {
        if (!['pendente','aceito'].includes(this.status)) throw new Error('Essa consulta não pode ser reagendada.');
        const diferenca=(Agendamento.criarDataHora(this.data,this.hora).getTime()-Date.now())/(1000*60*60);
        if (diferenca<24) throw new Error('O reagendamento só pode ser solicitado com pelo menos 24 horas de antecedência.');
        return true;
    }

    static criarDataHora(data,hora) {
        const [ano,mes,dia]=String(data).slice(0,10).split('-').map(Number);
        const [horas,minutos]=String(hora).slice(0,5).split(':').map(Number);
        return new Date(ano,mes-1,dia,horas,minutos,0,0);
    }
}
