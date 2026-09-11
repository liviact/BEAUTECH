import { Agendamento } from "../models/Agendamento.js";
import agendamentoRepository from "../repositories/agendamentoRepository.js";
import { connection } from "../configs/Database.js";

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

            const [usuarios] = await connection.execute(
                `SELECT id_usuario, nivel_acesso, ativo
                 FROM usuarios
                 WHERE id_usuario IN (?, ?)`,
                [id_cliente, id_medico]
            );

            const cliente = usuarios.find((usuario) => Number(usuario.id_usuario) === Number(id_cliente));
            const medico = usuarios.find((usuario) => Number(usuario.id_usuario) === Number(id_medico));

            if (!cliente || cliente.nivel_acesso !== 'cliente' || !cliente.ativo) {
                return res.status(400).json({ message: 'Cliente inválido ou inativo.' });
            }

            if (!medico || medico.nivel_acesso !== 'medico' || !medico.ativo) {
                return res.status(400).json({ message: 'Médico inválido ou inativo.' });
            }

            const [vinculo] = await connection.execute(
                `SELECT 1 FROM medico_procedimentos
                 WHERE id_medico = ? AND id_procedimento = ? LIMIT 1`,
                [id_medico, id_procedimento]
            );

            if (!vinculo.length) {
                return res.status(400).json({
                    message: 'O procedimento selecionado não está disponível para este médico.'
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

    // Buscar um agendamento específico
    buscarPorId: async (req, res) => {
        try {
            const dados = await agendamentoRepository.buscarPorId(req.params.id);

            if (!dados) {
                return res.status(404).json({
                    message: 'Agendamento não encontrado.'
                });
            }

            const usuarioId = Number(req.user.id);

            const pertenceAoUsuario =
                (req.user.tipo === 'cliente' && Number(dados.id_cliente) === usuarioId) ||
                (req.user.tipo === 'medico' && Number(dados.id_medico) === usuarioId);

            if (!pertenceAoUsuario) {
                return res.status(403).json({
                    message: 'Você não pode acessar essa consulta.'
                });
            }

            const [dadosComNomes] = await connection.execute(
                `SELECT a.*, c.nome AS cliente, m.nome AS medico, p.nome AS procedimento
                 FROM agendamentos a
                 INNER JOIN usuarios c ON c.id_usuario = a.id_cliente
                 INNER JOIN usuarios m ON m.id_usuario = a.id_medico
                 INNER JOIN procedimentos p ON p.id_procedimento = a.id_procedimento
                 WHERE a.id_agendamento = ? LIMIT 1`,
                [req.params.id]
            );

            return res.json(dadosComNomes[0] || dados);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao buscar o agendamento.'
            });
        }
    },

    // Listar
    selecionar: async (req, res) => {
        try {
            const agendamentos = await agendamentoRepository.selecionarPorUsuario(req.user);
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

            if (!data || !hora) {
                return res.status(400).json({
                    message: 'Data e horário são obrigatórios.'
                });
            }

            const agendamento = Agendamento.criarExistente(dados);

            // Valida se a consulta atual pode ser reagendada.
            agendamento.validarReagendamento();

            // Valida data, dia e horário do novo agendamento.
            agendamento.validarNovoHorario(data, hora);

            const consultasExistentes = await agendamentoRepository
                .buscarConsultasDoMedicoNaData(dados.id_medico, data);

            // Ignora a própria consulta durante a validação.
            Agendamento.validarIntervaloEntreConsultas(
                data,
                hora,
                consultasExistentes,
                id
            );

            agendamento.data = data;
            agendamento.hora = hora;

            await agendamentoRepository.atualizar(agendamento);

            return res.json({
                message: 'Consulta reagendada com sucesso.'
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                message: error.message
            });
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

            const novaData = req.body.data || agendamento.data;
            const novaHora = req.body.hora || agendamento.hora;

            // Valida data, dia e horário.
            agendamento.validarNovoHorario(novaData, novaHora);

            const consultasExistentes = await agendamentoRepository
                .buscarConsultasDoMedicoNaData(
                    agendamento.idMedico,
                    novaData
                );

            Agendamento.validarIntervaloEntreConsultas(
                novaData,
                novaHora,
                consultasExistentes,
                id
            );

            agendamento.data = novaData;
            agendamento.hora = novaHora;

            await agendamentoRepository.atualizar(agendamento);

            return res.json({
                message: 'Agendamento atualizado com sucesso.'
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                message: error.message
            });
        }
    }
};

export default agendamentoController;