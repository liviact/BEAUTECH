import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import clienteRepository from '../repositories/clienteRepository.js';

const clienteController = {

    criar: async (req, res) => {

        try {

            const existe =
                await clienteRepository.buscarPorCpf(
                    req.body.cpf
                );

            if (existe) {
                return res.status(400).json({
                    message: 'CPF já cadastrado'
                });
            }

            const senhaHash =
                await bcrypt.hash(
                    req.body.senha,
                    10
                );

            const id =
                await clienteRepository.criar({
                    ...req.body,
                    senha: senhaHash
                });

            const token = jwt.sign(
                {
                    id,
                    tipo: 'cliente'
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '1d'
                }
            );

            res.status(201).json({
                message: 'Cliente criado',
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
            await clienteRepository.listar();

        res.json(result);
    },

    buscarPorId: async (req, res) => {

        const result =
            await clienteRepository.buscarPorId(
                req.params.id
            );

        res.json(result);
    },

    atualizar: async (req, res) => {

        // Somente o próprio cliente pode alterar o próprio perfil.
        if (
            !req.user ||
            req.user.tipo !== 'cliente' ||
            String(req.user.id) !== String(req.params.id)
        ) {
            return res.status(403).json({
                message: 'Você só pode editar o seu próprio perfil.'
            });
        }

        try {
            await clienteRepository.atualizar(
                req.params.id,
                req.body
            );

            res.json({
                message: 'Perfil atualizado com sucesso.'
            });
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    },

    deletar: async (req, res) => {

        await clienteRepository.deletar(
            req.params.id
        );

        res.json({
            message: 'Removido'
        });
    }
};

export default clienteController;