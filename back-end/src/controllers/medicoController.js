import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import medicoRepository from '../repositories/medicoRepository.js';

const medicoController = {

    criar: async (req, res) => {

        try {

            const {
                nome,
                email,
                senha,
                crm,
                especializacao
            } = req.body;

            const existe =
                await medicoRepository.buscarPorEmail(email);

            if (existe) {
                return res.status(400).json({
                    message: 'Email já cadastrado'
                });
            }

            const hash =
                await bcrypt.hash(senha, 10);

            const id =
                await medicoRepository.criar({
                    nome,
                    email,
                    senha: hash,
                    crm,
                    especializacao
                });

            const token = jwt.sign(
                {
                    id,
                    tipo: 'medico'
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '1d'
                }
            );

            return res.status(201).json({
                message: 'Médico cadastrado',
                token
            });

        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    },

    listar: async (req, res) => {

        const result =
            await medicoRepository.listar();

        res.json(result);
    },

    buscarPorId: async (req, res) => {

        const result =
            await medicoRepository.buscarPorId(
                req.params.id
            );

        res.json(result);
    },

    atualizar: async (req, res) => {

        await medicoRepository.atualizar(
            req.params.id,
            req.body
        );

        res.json({
            message: 'Atualizado'
        });
    },

    deletar: async (req, res) => {

        await medicoRepository.deletar(
            req.params.id
        );

        res.json({
            message: 'Removido'
        });
    },

    listarProcedimentos: async (req, res) => {
        try {
            const procedimentos = await medicoRepository.listarProcedimentos(
                req.params.id
            );

            return res.json(procedimentos);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    },

    adicionarProcedimento: async (req, res) => {
        try {
            if (req.user.tipo !== 'medico') {
                return res.status(403).json({
                    message: 'Somente médicos podem cadastrar procedimentos.'
                });
            }

            const idMedico = Number(req.params.id);

            if (idMedico !== Number(req.user.id)) {
                return res.status(403).json({
                    message: 'Você não pode alterar os procedimentos de outro médico.'
                });
            }

            const { id_procedimento } = req.body;

            if (!id_procedimento) {
                return res.status(400).json({
                    message: 'Informe o procedimento.'
                });
            }

            await medicoRepository.adicionarProcedimento(
                idMedico,
                id_procedimento
            );

            return res.status(201).json({
                message: 'Procedimento adicionado ao médico.'
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }
};

export default medicoController;
