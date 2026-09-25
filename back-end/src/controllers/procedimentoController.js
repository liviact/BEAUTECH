import procedimentoRepository from '../repositories/procedimentoRepository.js';

const procedimentoController = {
    listar: async (req, res) => {
        try {
            const procedimentos = await procedimentoRepository.listar();
            return res.json(procedimentos);
        } catch (error) {
            console.error('Erro ao listar procedimentos:', error);
            return res.status(500).json({
                message: 'Erro ao buscar procedimentos.',
                error: error.message
            });
        }
    },

    buscarPorId: async (req, res) => {
        try {
            const procedimento = await procedimentoRepository.buscarPorId(req.params.id);

            if (!procedimento) {
                return res.status(404).json({
                    message: 'Procedimento não encontrado.'
                });
            }

            return res.json(procedimento);
        } catch (error) {
            console.error('Erro ao buscar procedimento:', error);
            return res.status(500).json({
                message: 'Erro ao buscar procedimento.',
                error: error.message
            });
        }
    }
};

export default procedimentoController;
