import prontuarioRepository from '../repositories/prontuarioRepository.js';

const prontuarioController = {
    listar: async (req,res) => {
        try { return res.json(await prontuarioRepository.listarPorUsuario(req.user)); }
        catch(error) { return res.status(500).json({message:'Erro ao buscar prontuários.'}); }
    },

    buscarPorId: async (req,res) => {
        try {
            const p=await prontuarioRepository.buscarPorId(req.params.id);
            if(!p) return res.status(404).json({message:'Prontuário não encontrado.'});
            const permitido=(req.user.tipo==='cliente'&&Number(p.id_cliente)===Number(req.user.id))
                || (req.user.tipo==='medico'&&Number(p.id_medico)===Number(req.user.id));
            if(!permitido) return res.status(403).json({message:'Você não pode acessar este prontuário.'});
            return res.json(p);
        } catch(error) { return res.status(500).json({message:'Erro ao buscar prontuário.'}); }
    }
};
export default prontuarioController;
