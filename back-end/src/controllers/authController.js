import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import usuarioRepository from '../repositories/usuarioRepository.js';

function criarToken(usuario) {
    return jwt.sign(
        { id: usuario.id_usuario, tipo: usuario.nivel_acesso },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

function usuarioSeguro(usuario) {
    return {
        id: usuario.id_usuario,
        tipo: usuario.nivel_acesso,
        nome: usuario.nome,
        email: usuario.email,
        foto_perfil: usuario.foto_perfil,
        ativo: Boolean(usuario.ativo)
    };
}

function validarCadastro(dados) {
    const campos = [
        'nome', 'email', 'senha', 'cpf', 'telefone',
        'data_nascimento', 'endereco', 'nivel_acesso'
    ];

    for (const campo of campos) {
        if (!dados[campo]) throw new Error(`O campo ${campo} é obrigatório.`);
    }

    if (!['cliente', 'medico'].includes(dados.nivel_acesso)) {
        throw new Error('Tipo de usuário inválido.');
    }

    if (String(dados.senha).length < 6) {
        throw new Error('A senha deve possuir pelo menos 6 caracteres.');
    }

    const cpf = String(dados.cpf).replace(/\D/g, '');
    if (cpf.length !== 11) throw new Error('O CPF deve possuir 11 números.');

    if (dados.nivel_acesso === 'medico') {
        if (!dados.crm) throw new Error('O CRM é obrigatório para médicos.');
        if (!dados.especializacao) throw new Error('A especialização é obrigatória para médicos.');
    }
}

const authController = {
    login: async (req, res) => {
        try {
            const { email, senha, nivel_acesso } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
            }

            if (nivel_acesso && !['cliente', 'medico'].includes(nivel_acesso)) {
                return res.status(400).json({ message: 'Tipo de acesso inválido.' });
            }

            const usuario = await usuarioRepository.buscarPorEmail(email);

            if (!usuario) {
                return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
            }

            if (nivel_acesso && usuario.nivel_acesso !== nivel_acesso) {
                return res.status(401).json({ message: 'O e-mail não pertence ao tipo de acesso selecionado.' });
            }

            if (!usuario.ativo) {
                return res.status(403).json({ message: 'Este usuário está inativo. Entre em contato com a clínica.' });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
            }

            const token = criarToken(usuario);
            return res.json({ token, usuario: usuarioSeguro(usuario) });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao realizar login.' });
        }
    },

    cadastrar: async (req, res) => {
        try {
            validarCadastro(req.body);

            if (!req.file) {
                return res.status(400).json({ message: 'A foto de perfil é obrigatória.' });
            }

            const cpf = String(req.body.cpf).replace(/\D/g, '');
            const emailExistente = await usuarioRepository.buscarPorEmail(req.body.email);
            if (emailExistente) return res.status(400).json({ message: 'E-mail já cadastrado.' });

            const cpfExistente = await usuarioRepository.buscarPorCpf(cpf);
            if (cpfExistente) return res.status(400).json({ message: 'CPF já cadastrado.' });

            if (req.body.nivel_acesso === 'medico') {
                const crmExistente = await usuarioRepository.buscarPorCrm(req.body.crm);
                if (crmExistente) return res.status(400).json({ message: 'CRM já cadastrado.' });
            }

            const senha = await bcrypt.hash(req.body.senha, 10);
            const foto = `/uploads/perfil/${req.file.filename}`;

            const id = await usuarioRepository.criar({
                ...req.body,
                cpf,
                senha,
                foto_perfil: foto
            });

            const usuario = await usuarioRepository.buscarPorId(id);
            const token = criarToken(usuario);

            return res.status(201).json({
                message: 'Cadastro realizado com sucesso.',
                token,
                usuario: usuarioSeguro(usuario)
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: error.message });
        }
    }
};

export default authController;
