import usuarioRepository from '../repositories/usuarioRepository.js';

function semSenha(usuario) {
    if (!usuario) return usuario;
    const { senha, ...dados } = usuario;
    void senha;
    return dados;
}

const clienteController = {
    listar: async (req, res) => {
        try {
            return res.json(await usuarioRepository.listarClientes());
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    buscarPorId: async (req, res) => {
        try {
            const usuario = await usuarioRepository.buscarPorId(req.params.id);
            if (!usuario || usuario.nivel_acesso !== 'cliente') {
                return res.status(404).json({ message: 'Cliente não encontrado.' });
            }
            return res.json(semSenha(usuario));
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    atualizar: async (req, res) => {
        if (req.user.tipo !== 'cliente' || Number(req.user.id) !== Number(req.params.id)) {
            return res.status(403).json({ message: 'Você só pode editar o seu próprio perfil.' });
        }
        try {
            const dados = { ...req.body };
            if (req.file) dados.foto_perfil = `/uploads/perfil/${req.file.filename}`;
            if (dados.cpf) dados.cpf = String(dados.cpf).replace(/\D/g, '');
            await usuarioRepository.atualizarCliente(req.params.id, dados);
            return res.json({ message: 'Perfil atualizado com sucesso.' });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },

    desativar: async (req, res) => {
        if (req.user.tipo !== 'cliente' || Number(req.user.id) !== Number(req.params.id)) {
            return res.status(403).json({ message: 'Você não pode alterar este usuário.' });
        }
        await usuarioRepository.alterarAtivo(req.params.id, false);
        return res.json({ message: 'Usuário desativado com sucesso.' });
    }
};

export default clienteController;
