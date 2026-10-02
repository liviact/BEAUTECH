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
        'nome','email','senha','cpf','telefone','data_nascimento',
        'cep','logradouro','numero','bairro','cidade','uf'
    ];
    for (const campo of campos) {
        if (!dados[campo]) throw new Error(`O campo ${campo} é obrigatório.`);
    }
    if (dados.nivel_acesso !== 'cliente') throw new Error('Tipo de usuário inválido.');
    if (String(dados.senha).length < 6) throw new Error('A senha deve possuir pelo menos 6 caracteres.');
    const cpf = String(dados.cpf).replace(/\D/g,'');
    const cep = String(dados.cep).replace(/\D/g,'');
    if (cpf.length !== 11) throw new Error('O CPF deve possuir 11 números.');
    if (cep.length !== 8) throw new Error('O CEP deve possuir 8 números.');
    if (String(dados.uf).length !== 2) throw new Error('UF inválida.');
}

const authController = {
    login: async (req,res) => {
        try {
            const {email,senha} = req.body;
            if (!email || !senha) return res.status(400).json({message:'E-mail e senha são obrigatórios.'});
            const usuario = await usuarioRepository.buscarPorEmail(email);
            if (!usuario) return res.status(401).json({message:'E-mail ou senha inválidos.'});
            if (!usuario.ativo) return res.status(403).json({message:'Este usuário está inativo. Entre em contato com a clínica.'});
            const senhaValida = await bcrypt.compare(senha,usuario.senha);
            if (!senhaValida) return res.status(401).json({message:'E-mail ou senha inválidos.'});
            return res.json({token:criarToken(usuario),usuario:usuarioSeguro(usuario)});
        } catch(error) {
            console.error(error);
            return res.status(500).json({message:'Erro ao realizar login.'});
        }
    },

    cadastrar: async (req,res) => {
        try {
            validarCadastro(req.body);
            if (!req.file) return res.status(400).json({message:'A foto de perfil é obrigatória.'});
            const cpf=String(req.body.cpf).replace(/\D/g,'');
            const cep=String(req.body.cep).replace(/\D/g,'');
            if (await usuarioRepository.buscarPorEmail(req.body.email)) return res.status(400).json({message:'E-mail já cadastrado.'});
            if (await usuarioRepository.buscarPorCpf(cpf)) return res.status(400).json({message:'CPF já cadastrado.'});
            const senha=await bcrypt.hash(req.body.senha,10);
            const id=await usuarioRepository.criar({
                ...req.body,cpf,cep,senha,
                foto_perfil:`/uploads/perfil/${req.file.filename}`,
                nivel_acesso:'cliente',
                crm:null,especializacao:null,biografia:null
            });
            const usuario=await usuarioRepository.buscarPorId(id);
            return res.status(201).json({message:'Cadastro realizado com sucesso.',token:criarToken(usuario),usuario:usuarioSeguro(usuario)});
        } catch(error) {
            console.error(error);
            return res.status(400).json({message:error.message});
        }
    }
};

export default authController;
