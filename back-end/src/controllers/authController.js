import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import medicoRepository from '../repositories/medicoRepository.js';
import clienteRepository from '../repositories/clienteRepository.js';

const authController = {

    loginMedico: async (req, res) => {

        const { email, senha } = req.body;

        const medico =
            await medicoRepository.buscarPorEmail(email);

        if (!medico) {
            return res.status(401).json({
                message: 'Médico não encontrado'
            });
        }

        const valid =
            await bcrypt.compare(
                senha,
                medico.senha
            );

        if (!valid) {
            return res.status(401).json({
                message: 'Senha inválida'
            });
        }

        const token = jwt.sign(
            {
                id: medico.id_usuario,
                tipo: 'medico'
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        res.json({ token });
    },

    loginCliente: async (req, res) => {

        const { cpf, senha } = req.body;

        const cliente =
            await clienteRepository.buscarPorCpf(cpf);

        if (!cliente) {

            return res.status(401).json({
                message: 'Cliente não encontrado'
            });
        }

        const senhaValida =
            await bcrypt.compare(
                senha,
                cliente.senha
            );

        if (!senhaValida) {

            return res.status(401).json({
                message: 'Senha inválida'
            });
        }

        const token = jwt.sign(
            {
                id: cliente.id_cliente,
                tipo: 'cliente'
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        res.json({
            token
        });
    }
};

export default authController;