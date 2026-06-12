import { Protocolo } from "../models/Protocolo.js";
import protocoloRepository from "../repositories/protocoloRepository.js";

const protocoloController = {

    criar: async (req, res) => {

        try {

            const protocolo =
                Protocolo.criar(req.body);

            const result =
                await protocoloRepository.criar(
                    protocolo
                );

            res.status(201).json({
                message: "Protocolo criado com sucesso",
                result
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: error.message
            });
        }
    },

    selecionar: async (req, res) => {

        try {

            const result =
                await protocoloRepository.selecionar();

            res.status(200).json(result);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: error.message
            });
        }
    },

    buscarPorId: async (req, res) => {

        try {

            const result =
                await protocoloRepository.buscarPorId(
                    req.params.id
                );

            if (!result) {

                return res.status(404).json({
                    message: "Protocolo não encontrado"
                });
            }

            res.status(200).json(result);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: error.message
            });
        }
    },

    atualizar: async (req, res) => {

        try {

            const protocolo =
                Protocolo.alterar(
                    req.body,
                    req.params.id
                );

            const result =
                await protocoloRepository.atualizar(
                    protocolo
                );

            res.status(200).json({
                message: "Protocolo atualizado com sucesso",
                result
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: error.message
            });
        }
    },

    deletar: async (req, res) => {

        try {

            await protocoloRepository.deletar(
                req.params.id
            );

            res.status(200).json({
                message: "Protocolo removido com sucesso"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: error.message
            });
        }
    }
};

export default protocoloController;