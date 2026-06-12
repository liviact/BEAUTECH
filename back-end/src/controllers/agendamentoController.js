import { Agendamento } from "../models/Agendamento.js";
import agendamentoRepository from "../repositories/agendamentoRepository.js";

const agendamentoController = {

    criar: async(req,res)=>{

        try{

            const agendamento =
            Agendamento.criar(req.body);

            const result =
            await agendamentoRepository.criar(
                agendamento
            );

            res.status(201).json(result);

        }catch(error){

            res.status(500).json({
                error:error.message
            });
        }
    },

    selecionar: async(req,res)=>{

        const result =
        await agendamentoRepository.selecionar();

        res.json(result);
    },

    editar: async(req,res)=>{

        const agendamento =
        Agendamento.alterar(
            req.body,
            req.params.id
        );

        const result =
        await agendamentoRepository.atualizar(
            agendamento
        );

        res.json(result);
    },

    deletar: async(req,res)=>{

        const result =
        await agendamentoRepository.deletar(
            req.params.id
        );

        res.json(result);
    }
};

export default agendamentoController;
