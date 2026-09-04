import { Agendamento } from "../models/Agendamento.js";
import agendamentoRepository from "../repositories/agendamentoRepository.js";

const agendamentoController = {
    // Criar agendamento
    criar: async (req, res) => {
        try {
            const { id_cliente, id_medico, data, hora, id_procedimento } = req.body;

            if (req.user.tipo !== 'cliente') {
                return res.status(403).json({
                    message: 'Somente clientes podem realizar agendamentos.'
                });
            }

            if (Number(req.user.id) !== Number(id_cliente)) {
                return res.status(403).json({
                    message: 'Você não pode criar agendamento para outro cliente.'
                });
            }

            const agendamento = Agendamento.criar({
                id_cliente,
                id_medico,
                data,
                hora,
                id_procedimento
            });

            const consultasExistentes = await agendamentoRepository
                .buscarConsultasDoMedicoNaData(id_medico, data);

            Agendamento.validarIntervaloEntreConsultas(
                data,
                hora,
                consultasExistentes
            );

            const resultado = await agendamentoRepository.criar(agendamento);

            return res.status(201).json({
                message: 'Solicitação de agendamento enviada para análise do médico.',
                id_agendamento: resultado.insertId
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                message: error.message
            });
        }
    },

    // Listar
    selecionar: async (req, res) => {
        try {
            const agendamentos = await agendamentoRepository.selecionar();
            return res.json(agendamentos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao buscar agendamentos.'
            });
        }
    },

    // Agenda do médico
    agendaMedico: async (req, res) => {
        try {
            if (req.user.tipo !== 'medico') {
                return res.status(403).json({
                    message: 'Somente médicos podem acessar a agenda.'
                });
            }

            const agendamentos = await agendamentoRepository
                .buscarConsultasDoMedico(req.user.id);

            return res.json(agendamentos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao buscar agenda do médico.'
            });
        }
    },

    // Aceitar
    aceitar: async (req, res) => {
        try {
            if (req.user.tipo !== 'medico') {
                return res.status(403).json({
                    message: 'Somente médicos podem aceitar consultas.'
                });
            }

            const id = req.params.id;
            const dados = await agendamentoRepository.buscarPorId(id);

            if (!dados) {
                return res.status(404).json({
                    message: 'Agendamento não encontrado.'
                });
            }

            if (Number(dados.id_medico) !== Number(req.user.id)) {
                return res.status(403).json({
                    message: 'Você não pode alterar essa consulta.'
                });
            }

            const agendamento = Agendamento.criarExistente(dados);
            agendamento.aceitar();

            await agendamentoRepository.atualizarStatus(
                id,
                agendamento.status
            );

            return res.json({
                message: 'Consulta aceita com sucesso.'
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },

    // Recusar
    recusar: async (req, res) => {
        try {
            if (req.user.tipo !== 'medico') {
                return res.status(403).json({
                    message: 'Somente médicos podem recusar consultas.'
                });
            }

            const id = req.params.id;
            const dados = await agendamentoRepository.buscarPorId(id);

            if (!dados) {
                return res.status(404).json({
                    message: 'Agendamento não encontrado.'
                });
            }

            if (Number(dados.id_medico) !== Number(req.user.id)) {
                return res.status(403).json({
                    message: 'Você não pode alterar essa consulta.'
                });
            }

            const agendamento = Agendamento.criarExistente(dados);
            agendamento.recusar();

            await agendamentoRepository.atualizarStatus(
                id,
                agendamento.status
            );

            return res.json({
                message: 'Consulta recusada.'
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },

    // Cancelar
    cancelar: async (req, res) => {
        try {
            if (req.user.tipo !== 'cliente') {
                return res.status(403).json({
                    message: 'Somente clientes podem cancelar consultas.'
                });
            }

            const id = req.params.id;
            const dados = await agendamentoRepository.buscarPorId(id);

            if (!dados) {
                return res.status(404).json({
                    message: 'Agendamento não encontrado.'
                });
            }

            if (Number(dados.id_cliente) !== Number(req.user.id)) {
                return res.status(403).json({
                    message: 'Você não pode cancelar essa consulta.'
                });
            }

            const agendamento = Agendamento.criarExistente(dados);
            agendamento.cancelar();

            await agendamentoRepository.atualizarStatus(
                id,
                agendamento.status
            );

            return res.json({
                message: 'Consulta cancelada com sucesso.'
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },

    // Realizar
    realizar: async (req, res) => {
        try {
            if (req.user.tipo !== 'medico') {
                return res.status(403).json({
                    message: 'Somente médicos podem concluir consultas.'
                });
            }

            const id = req.params.id;
            const dados = await agendamentoRepository.buscarPorId(id);

            if (!dados) {
                return res.status(404).json({
                    message: 'Agendamento não encontrado.'
                });
            }

            if (Number(dados.id_medico) !== Number(req.user.id)) {
                return res.status(403).json({
                    message: 'Você não pode concluir essa consulta.'
                });
            }

            const agendamento = Agendamento.criarExistente(dados);
            agendamento.realizar();

            await agendamentoRepository.atualizarStatus(
                id,
                agendamento.status
            );

            return res.json({
                message: 'Consulta marcada como realizada.'
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },

    // Reagendar
    reagendar: async (req, res) => {
        try {
            if (req.user.tipo !== 'cliente') {
                return res.status(403).json({
                    message: 'Somente clientes podem reagendar consultas.'
                });
            }

            const id = req.params.id;
            const dados = await agendamentoRepository.buscarPorId(id);

            if (!dados) {
                return res.status(404).json({
                    message: 'Agendamento não encontrado.'
                });
            }

            if (Number(dados.id_cliente) !== Number(req.user.id)) {
                return res.status(403).json({
                    message: 'Você não pode reagendar essa consulta.'
                });
            }

            const { data, hora } = req.body;

            const agendamento = Agendamento.criarExistente(dados);
            agendamento.validarReagendamento();

            if (!data || !hora) {
                return res.status(400).json({
                    message: 'Data e horário são obrigatórios.'
                });
            }

            const consultasExistentes = await agendamentoRepository
                .buscarConsultasDoMedicoNaData(dados.id_medico, data);

            Agendamento.validarIntervaloEntreConsultas(
                data,
                hora,
                consultasExistentes
            );

            agendamento.data = data;
            agendamento.hora = hora;

            await agendamentoRepository.atualizar(agendamento);

            return res.json({
                message: 'Consulta reagendada com sucesso.'
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },

    // Editar
    editar: async (req, res) => {
        try {
            const id = req.params.id;
            const dados = await agendamentoRepository.buscarPorId(id);

            if (!dados) {
                return res.status(404).json({
                    message: 'Agendamento não encontrado.'
                });
            }

            if (
                req.user.tipo === 'cliente' &&
                Number(dados.id_cliente) !== Number(req.user.id)
            ) {
                return res.status(403).json({
                    message: 'Você não pode editar essa consulta.'
                });
            }

            if (
                req.user.tipo === 'medico' &&
                Number(dados.id_medico) !== Number(req.user.id)
            ) {
                return res.status(403).json({
                    message: 'Você não pode editar essa consulta.'
                });
            }

            const agendamento = Agendamento.criarExistente(dados);

            if (req.body.data) {
                agendamento.data = req.body.data;
            }

            if (req.body.hora) {
                agendamento.hora = req.body.hora;
            }

            await agendamentoRepository.atualizar(agendamento);

            return res.json({
                message: 'Agendamento atualizado com sucesso.'
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
};

export default agendamentoController;