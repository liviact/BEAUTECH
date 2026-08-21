import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import medicoRepository from '../repositories/medicoRepository.js';

const medicoController = {

    criar: async (req,res)=>{

        try{

            const {
                nome,
                email,
                senha,
                crm,
                especializacao
            } = req.body;

            const existe =
            await medicoRepository.buscarPorEmail(email);

            if(existe){
                return res.status(400).json({
                    message:'Email já cadastrado'
                });
            }

            const hash =
            await bcrypt.hash(senha,10);

            const id =
            await medicoRepository.criar({
                nome,
                email,
                senha:hash,
                crm,
                especializacao
            });

            const token = jwt.sign(
                {
                    id,
                    tipo:'medico'
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:'1d'
                }
            );

            return res.status(201).json({
                message:'Médico cadastrado',
                token
            });

        }catch(error){
            res.status(500).json({
                error:error.message
            });
        }
    },

    listar: async(req,res)=>{

        const result =
        await medicoRepository.listar();

        res.json(result);
    },

    buscarPorId: async(req,res)=>{

        const result =
        await medicoRepository.buscarPorId(
            req.params.id
        );

        res.json(result);
    },

    atualizar: async(req,res)=>{

        await medicoRepository.atualizar(
            req.params.id,
            req.body
        );

        res.json({
            message:'Atualizado'
        });
    },

    deletar: async(req,res)=>{

        await medicoRepository.deletar(
            req.params.id
        );

        res.json({
            message:'Removido'
        });
    }
};

export default medicoController;
