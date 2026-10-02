import notificacaoRepository from '../repositories/notificacaoRepository.js';

const notificacaoController = {
    listar: async (req,res) => {
        try { return res.json(await notificacaoRepository.listar(req.user.id)); }
        catch(error) { return res.status(500).json({message:'Erro ao buscar notificações.'}); }
    },
    contar: async (req,res) => {
        try { return res.json({total:await notificacaoRepository.contarNaoLidas(req.user.id)}); }
        catch(error) { return res.status(500).json({message:'Erro ao contar notificações.'}); }
    },
    ler: async (req,res) => {
        try { await notificacaoRepository.marcarLida(req.params.id,req.user.id); return res.json({message:'Notificação marcada como lida.'}); }
        catch(error) { return res.status(400).json({message:error.message}); }
    },
    lerTodas: async (req,res) => {
        try { await notificacaoRepository.marcarTodas(req.user.id); return res.json({message:'Notificações marcadas como lidas.'}); }
        catch(error) { return res.status(400).json({message:error.message}); }
    }
};

export default notificacaoController;
