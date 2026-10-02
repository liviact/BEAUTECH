import { Agendamento } from '../models/Agendamento.js';
import agendamentoRepository from '../repositories/agendamentoRepository.js';
import usuarioRepository from '../repositories/usuarioRepository.js';
import medicoRepository from '../repositories/medicoRepository.js';
import configuracaoRepository from '../repositories/configuracaoRepository.js';
import notificacaoRepository from '../repositories/notificacaoRepository.js';
import { connection } from '../configs/Database.js';

function criarDataHora(data,hora) {
    const [ano,mes,dia]=String(data).slice(0,10).split('-').map(Number);
    const [h,m]=String(hora).slice(0,5).split(':').map(Number);
    return new Date(ano,mes-1,dia,h,m,0,0);
}

function validarSlot(data,hora,config) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data)) || !/^\d{2}:\d{2}$/.test(String(hora))) {
        throw new Error('Data ou horário inválido.');
    }
    if (Number(String(hora).slice(3,5))!==0) throw new Error('Os horários devem ser reservados de 1 em 1 hora.');
    const quando=criarDataHora(data,hora);
    if (quando<=new Date()) throw new Error('A consulta deve ser marcada para uma data e horário futuros.');
    if (quando.getDay()===0) throw new Error('A clínica não funciona aos domingos.');

    const abertura=String(config.hora_abertura).slice(0,5);
    const fechamento=String(config.hora_fechamento).slice(0,5);
    if (String(hora)<abertura || String(hora)>=fechamento) throw new Error(`Escolha um horário entre ${abertura} e ${fechamento}.`);
    const minutos=(Number(String(hora).slice(0,2))*60)+Number(String(hora).slice(3,5));
    const fim=(Number(fechamento.slice(0,2))*60)+Number(fechamento.slice(3,5));
    if (minutos+60>fim) throw new Error('Esse horário não comporta uma consulta de 1 hora antes do fechamento.');
}

async function notificar(idUsuario,idAgendamento,tipo,titulo,mensagem) {
    try { await notificacaoRepository.criar({idUsuario,idAgendamento,tipo,titulo,mensagem}); }
    catch(error) { console.error('Falha ao criar notificação:',error.message); }
}

const agendamentoController = {
    disponibilidade: async (req,res) => {
        try {
            const medico=await usuarioRepository.buscarPorId(req.query.medico);
            if (!medico || medico.nivel_acesso!=='medico' || !medico.ativo) return res.status(404).json({message:'Médico não encontrado.'});
            const data=req.query.data;
            if (!data) return res.status(400).json({message:'Informe a data.'});
            return res.json({
                data,
                horarios:await agendamentoRepository.buscarDisponibilidade(req.query.medico,data)
            });
        } catch(error) { return res.status(400).json({message:error.message}); }
    },

    criar: async (req,res) => {
        try {
            if (req.user.tipo!=='cliente') return res.status(403).json({message:'Somente clientes podem criar agendamentos.'});
            const {id_medico,id_procedimento,data,hora}=req.body;
            const medico=await usuarioRepository.buscarPorId(id_medico);
            const cliente=await usuarioRepository.buscarPorId(req.user.id);
            if (!cliente || cliente.nivel_acesso!=='cliente' || !cliente.ativo) return res.status(400).json({message:'Cliente inválido ou inativo.'});
            if (!medico || medico.nivel_acesso!=='medico' || !medico.ativo) return res.status(400).json({message:'Médico inválido ou inativo.'});

            const [vinculo]=await connection.execute(
                `SELECT preco FROM medico_procedimentos WHERE id_medico=? AND id_procedimento=? LIMIT 1`,
                [id_medico,id_procedimento]
            );
            if (!vinculo.length) return res.status(400).json({message:'O procedimento selecionado não está disponível para este médico.'});

            const config=await configuracaoRepository.buscar();
            validarSlot(data,hora,config);
            const agendamento=Agendamento.criar({id_cliente:req.user.id,id_medico,id_procedimento,data,hora});
            const resultado=await agendamentoRepository.criarComDisponibilidade({
                idCliente:req.user.id,idMedico:id_medico,idProcedimento:id_procedimento,
                data,hora,valorConsulta:Number(vinculo[0].preco)
            });
            await notificar(
                id_medico,resultado.insertId,'nova_consulta','Nova solicitação de consulta',
                `${cliente.nome} solicitou ${await nomeProcedimento(id_procedimento)} para ${String(data).split('-').reverse().join('/')} às ${String(hora).slice(0,5)}.`
            );
            return res.status(201).json({message:'Solicitação de agendamento enviada para análise do médico.',id_agendamento:resultado.insertId});
        } catch(error) { console.error(error); return res.status(400).json({message:error.message}); }
    },

    buscarPorId: async (req,res) => {
        try {
            await agendamentoRepository.limparPendentesExpirados();
            const dados=await agendamentoRepository.buscarPorId(req.params.id);
            if (!dados) return res.status(404).json({message:'Agendamento não encontrado.'});
            const pertence=(req.user.tipo==='cliente'&&Number(dados.id_cliente)===Number(req.user.id))
                || (req.user.tipo==='medico'&&Number(dados.id_medico)===Number(req.user.id));
            if (!pertence) return res.status(403).json({message:'Você não pode acessar essa consulta.'});
            return res.json(dados);
        } catch(error) { return res.status(500).json({message:'Erro ao buscar o agendamento.'}); }
    },

    selecionar: async (req,res) => {
        try { return res.json(await agendamentoRepository.selecionarPorUsuario(req.user)); }
        catch(error) { return res.status(500).json({message:'Erro ao buscar agendamentos.'}); }
    },

    agendaMedico: async (req,res) => {
        if(req.user.tipo!=='medico') return res.status(403).json({message:'Somente médicos podem acessar a agenda.'});
        try { return res.json(await agendamentoRepository.buscarConsultasDoMedico(req.user.id)); }
        catch(error) { return res.status(500).json({message:'Erro ao buscar agenda do médico.'}); }
    },

    aceitar: async (req,res) => {
        try {
            if(req.user.tipo!=='medico') return res.status(403).json({message:'Somente médicos podem aceitar consultas.'});
            const dados=await agendamentoRepository.buscarPorId(req.params.id);
            if(!dados || Number(dados.id_medico)!==Number(req.user.id)) return res.status(404).json({message:'Agendamento não encontrado.'});
            if(dados.status!=='pendente') return res.status(400).json({message:'Somente solicitações pendentes podem ser aceitas.'});
            if(criarDataHora(dados.data,dados.hora)<=new Date()) {
                await agendamentoRepository.excluir(dados.id_agendamento);
                return res.status(400).json({message:'O horário da consulta já passou e a solicitação foi removida.'});
            }
            await agendamentoRepository.atualizarStatus(dados.id_agendamento,'aceito');
            await notificar(dados.id_cliente,dados.id_agendamento,'consulta_aceita','Consulta aceita',`Sua consulta com ${dados.medico} foi aceita para ${String(dados.data).slice(0,10).split('-').reverse().join('/')} às ${String(dados.hora).slice(0,5)}.`);
            return res.json({message:'Consulta aceita com sucesso.'});
        } catch(error) { return res.status(400).json({message:error.message}); }
    },

    recusar: async (req,res) => {
        try {
            if(req.user.tipo!=='medico') return res.status(403).json({message:'Somente médicos podem recusar consultas.'});
            const dados=await agendamentoRepository.buscarPorId(req.params.id);
            if(!dados || Number(dados.id_medico)!==Number(req.user.id)) return res.status(404).json({message:'Agendamento não encontrado.'});
            if(dados.status!=='pendente') return res.status(400).json({message:'Somente solicitações pendentes podem ser recusadas.'});
            await agendamentoRepository.atualizarStatus(dados.id_agendamento,'recusado');
            await notificar(dados.id_cliente,dados.id_agendamento,'consulta_recusada','Consulta recusada',`Sua solicitação para ${String(dados.data).slice(0,10).split('-').reverse().join('/')} às ${String(dados.hora).slice(0,5)} foi recusada pelo médico.`);
            return res.json({message:'Consulta recusada.'});
        } catch(error) { return res.status(400).json({message:error.message}); }
    },

    cancelar: async (req,res) => {
        try {
            const dados=await agendamentoRepository.buscarPorId(req.params.id);
            if(!dados || (req.user.tipo==='cliente'&&Number(dados.id_cliente)!==Number(req.user.id)) || (req.user.tipo==='medico'&&Number(dados.id_medico)!==Number(req.user.id))) {
                return res.status(404).json({message:'Agendamento não encontrado.'});
            }
            const ag=Agendamento.criarExistente(dados);
            ag.validarCancelamento();
            await agendamentoRepository.atualizarStatus(ag.id,'cancelado');
            const destino=req.user.tipo==='cliente'?dados.id_medico:dados.id_cliente;
            await notificar(destino,dados.id_agendamento,'consulta_cancelada','Consulta cancelada','Uma consulta da sua agenda foi cancelada.');
            return res.json({message:'Consulta cancelada.'});
        } catch(error) { return res.status(400).json({message:error.message}); }
    },

    realizar: async (req,res) => {
        try {
            if(req.user.tipo!=='medico') return res.status(403).json({message:'Somente médicos podem concluir consultas.'});
            const dados=await agendamentoRepository.buscarPorId(req.params.id);
            if(!dados || Number(dados.id_medico)!==Number(req.user.id)) return res.status(404).json({message:'Agendamento não encontrado.'});
            if(dados.status!=='aceito') return res.status(400).json({message:'Somente consultas aceitas podem ser concluídas.'});
            const {processo_realizado,produtos_utilizados,valor_consulta,observacoes}=req.body;
            if(!processo_realizado?.trim()) return res.status(400).json({message:'Descreva o processo realizado antes de concluir a consulta.'});
            const resultado=await agendamentoRepository.concluirComProntuario({
                idAgendamento:req.params.id,
                processo:processo_realizado.trim(),
                produtos:produtos_utilizados?.trim(),
                valor:valor_consulta,
                observacoes:observacoes?.trim()
            });
            await notificar(dados.id_cliente,dados.id_agendamento,'prontuario','Prontuário disponível',`O prontuário da sua consulta com ${dados.medico} já está disponível no seu histórico.`);
            return res.json({message:'Consulta concluída e prontuário enviado ao cliente.',resultado});
        } catch(error) { return res.status(400).json({message:error.message}); }
    },

    reagendar: async (req,res) => {
        try {
            if(req.user.tipo!=='cliente') return res.status(403).json({message:'Somente clientes podem reagendar consultas.'});
            const dados=await agendamentoRepository.buscarPorId(req.params.id);
            if(!dados || Number(dados.id_cliente)!==Number(req.user.id)) return res.status(404).json({message:'Agendamento não encontrado.'});
            const ag=Agendamento.criarExistente(dados);
            ag.validarReagendamento();
            const config=await configuracaoRepository.buscar();
            validarSlot(req.body.data,req.body.hora,config);
            const disponibilidade=await agendamentoRepository.buscarDisponibilidade(dados.id_medico,req.body.data);
            const slot=disponibilidade.find(x=>x.hora===req.body.hora);
            if(!slot?.disponivel) return res.status(400).json({message:'O novo horário não está disponível.'});
            await agendamentoRepository.reagendar(dados.id_agendamento,req.body.data,req.body.hora);
            await notificar(dados.id_medico,dados.id_agendamento,'nova_consulta','Consulta reagendada',`O cliente ${dados.cliente} solicitou um novo horário. A solicitação precisa ser aceita novamente.`);
            return res.json({message:'Reagendamento enviado para análise do médico.'});
        } catch(error) { return res.status(400).json({message:error.message}); }
    }
};

async function nomeProcedimento(id) {
    const [rows]=await connection.execute(
        `SELECT nome FROM procedimentos WHERE id_procedimento=?`,[id]
    );
    return rows[0]?.nome || 'procedimento';
}

export default agendamentoController;
