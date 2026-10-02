import configuracaoRepository from '../repositories/configuracaoRepository.js';

function validarHorario(abertura,fechamento) {
    if (!/^\d{2}:\d{2}$/.test(abertura) || !/^\d{2}:\d{2}$/.test(fechamento)) {
        throw new Error('Informe horários válidos.');
    }
    if (abertura >= fechamento) throw new Error('O horário de abertura deve ser anterior ao fechamento.');
}

const configuracaoController = {
    buscar: async (req,res) => {
        try { return res.json(await configuracaoRepository.buscar()); }
        catch(error) { return res.status(500).json({message:'Erro ao buscar o funcionamento da clínica.'}); }
    },

    atualizar: async (req,res) => {
        try {
            const {hora_abertura,hora_fechamento}=req.body;
            validarHorario(hora_abertura,hora_fechamento);
            await configuracaoRepository.atualizar(hora_abertura,hora_fechamento,req.user.id);
            return res.json({message:'Horário de funcionamento atualizado com sucesso.',configuracao:await configuracaoRepository.buscar()});
        } catch(error) { return res.status(400).json({message:error.message}); }
    }
};

export default configuracaoController;
