import { Atendimento } from "../models/Atendimento.js";
import atendimentoRepository from "../repositories/atendimentoRepository.js";

const atendimentoController = {

    criar: async (req, res) => {

        try {

            const atendimento =
                Atendimento.criar(req.body);

            const result =
                await atendimentoRepository.criar(
                    atendimento
                );

            res.status(201).json({
                message: "Atendimento criado com sucesso",
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
                await atendimentoRepository.selecionar();

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
                await atendimentoRepository.buscarPorId(
                    req.params.id
                );

            if (!result) {

                return res.status(404).json({
                    message: "Atendimento não encontrado"
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

    deletar: async (req, res) => {

        try {

            await atendimentoRepository.deletar(
                req.params.id
            );

            res.status(200).json({
                message: "Atendimento removido com sucesso"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: error.message
            });
        }
    }
};

export default atendimentoController;