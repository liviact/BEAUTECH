import { Agendamento } from "../models/Agendamento.js";
import agendamentoRepository from "../repositories/agendamentoRepository.js";

const agendamentoController = {
    // Criar agendamento
    criar: async (req, res) => {
        try {
            const {
                id_cliente,
                id_medico,
                data,
                hora,
                id_procedimento
            } = req.body;

            // Verificações de acesso
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

            // Validações da Model
            const agendamento = Agendamento.criar({
                id_cliente,
                id_medico,
                data,
                hora,
                id_procedimento
            });

            // Busca conflitos no banco
            const consultasExistentes = await agendamentoRepository
                .buscarConsultasDoMedicoNaData(id_medico, data);

            // Verifica intervalo mínimo
            Agendamento.validarIntervaloEntreConsultas(
                data,
                hora,
                consultasExistentes
            );

            // Salva
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
            return res.status(400).json({
                message: error.message
            });
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
            return res.status(400).json({
                message: error.message
            });
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

            // A Model verifica as 24 horas
            agendamento.cancelar();

            await agendamentoRepository.atualizarStatus(
                id,
                agendamento.status
            );

            return res.json({
                message: 'Consulta cancelada com sucesso.'
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
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
            return res.status(400).json({
                message: error.message
            });
        }
    }
};

export default agendamentoController;