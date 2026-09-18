import bcrypt from 'bcrypt';
import usuarioRepository from '../repositories/usuarioRepository.js';

function usuarioSemSenha(usuario) {
    if (!usuario) return usuario;
    const { senha, ...dados } = usuario;
    void senha;
    return dados;
}

function validarMedico(dados) {
    const campos = ['nome', 'email', 'senha', 'cpf', 'telefone', 'data_nascimento', 'endereco', 'crm', 'especializacao'];
    for (const campo of campos) {
        if (!dados[campo]) throw new Error(`O campo ${campo} é obrigatório.`);
    }
    const cpf = String(dados.cpf).replace(/\D/g, '');
    if (cpf.length !== 11) throw new Error('O CPF deve possuir 11 números.');
    if (String(dados.senha).length < 6) throw new Error('A senha deve possuir pelo menos 6 caracteres.');
}

const adminController = {
    listarUsuarios: async (req, res) => {
        try {
            const usuarios = await usuarioRepository.listarTodos();
            return res.json(usuarios.map(usuarioSemSenha));
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    criarMedico: async (req, res) => {
        try {
            validarMedico(req.body);
            if (!req.file) return res.status(400).json({ message: 'A foto de perfil é obrigatória.' });

            const cpf = String(req.body.cpf).replace(/\D/g, '');
            if (await usuarioRepository.buscarPorEmail(req.body.email)) {
                return res.status(400).json({ message: 'E-mail já cadastrado.' });
            }
            if (await usuarioRepository.buscarPorCpf(cpf)) {
                return res.status(400).json({ message: 'CPF já cadastrado.' });
            }
            if (await usuarioRepository.buscarPorCrm(req.body.crm)) {
                return res.status(400).json({ message: 'CRM já cadastrado.' });
            }

            const senha = await bcrypt.hash(req.body.senha, 10);
            const id = await usuarioRepository.criar({
                ...req.body,
                cpf,
                senha,
                foto_perfil: `/uploads/perfil/${req.file.filename}`,
                nivel_acesso: 'medico',
                crm: req.body.crm,
                especializacao: req.body.especializacao
            });

            return res.status(201).json({ message: 'Médico cadastrado.', usuario: usuarioSemSenha(await usuarioRepository.buscarPorId(id)) });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },

    alterarAtivo: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const usuario = await usuarioRepository.buscarPorId(id);
            if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado.' });
            if (usuario.nivel_acesso === 'admin') return res.status(400).json({ message: 'O administrador não pode ser alterado por esta tela.' });

            const ativo = req.body.ativo === true || req.body.ativo === 1 || req.body.ativo === 'true' || req.body.ativo === '1';
            await usuarioRepository.alterarAtivo(id, ativo);
            return res.json({ message: ativo ? 'Usuário ativado.' : 'Usuário inativado.' });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
};

export default adminController;
