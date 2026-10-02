import usuarioRepository from '../repositories/usuarioRepository.js';
import medicoRepository from '../repositories/medicoRepository.js';
import procedimentoRepository from '../repositories/procedimentoRepository.js';

function semSenha(usuario) {
    if (!usuario) return usuario;
    const {senha,...dados}=usuario;
    void senha;
    return dados;
}

function validarPreco(preco) {
    const numero=Number(preco);
    if (!Number.isFinite(numero) || numero<0) throw new Error('Informe um preço válido.');
    return numero.toFixed(2);
}

const medicoController = {
    listar: async (req,res) => {
        try {
            const medicos=await usuarioRepository.listarMedicos();
            return res.json(medicos.map(medico=>{
                const procedimentos=(medico.procedimentos_info||'').split(';;;').filter(Boolean).map(item=>{
                    const [nome,preco]=item.split('||');
                    return {nome,preco:Number(preco)};
                });
                const {procedimentos_info,...dados}=medico;
                return {...dados,procedimentos};
            }));
        } catch(error) { return res.status(500).json({message:error.message}); }
    },

    buscarPorId: async (req,res) => {
        try {
            const usuario=await usuarioRepository.buscarPorId(req.params.id);
            if(!usuario||usuario.nivel_acesso!=='medico'||!usuario.ativo) return res.status(404).json({message:'Médico não encontrado.'});
            return res.json(semSenha(usuario));
        } catch(error) { return res.status(500).json({message:error.message}); }
    },

    atualizar: async (req,res) => {
        if(req.user.tipo!=='medico'||Number(req.user.id)!==Number(req.params.id)) return res.status(403).json({message:'Você só pode editar o seu próprio perfil.'});
        try {
            const dados={...req.body};
            if(req.file) dados.foto_perfil=`/uploads/perfil/${req.file.filename}`;
            if(dados.cpf) dados.cpf=String(dados.cpf).replace(/\D/g,'');
            if(dados.cep) dados.cep=String(dados.cep).replace(/\D/g,'');
            await usuarioRepository.atualizarMedico(req.params.id,dados);
            return res.json({message:'Perfil atualizado com sucesso.'});
        } catch(error) { return res.status(400).json({message:error.message}); }
    },

    listarProcedimentos: async (req,res) => {
        try { return res.json(await medicoRepository.listarProcedimentos(req.params.id)); }
        catch(error) { return res.status(500).json({message:error.message}); }
    },

    adicionarProcedimento: async (req,res) => {
        try {
            if(req.user.tipo!=='medico'||Number(req.user.id)!==Number(req.params.id)) return res.status(403).json({message:'Você não pode alterar os procedimentos de outro médico.'});
            const {id_procedimento,preco}=req.body;
            if(!id_procedimento) return res.status(400).json({message:'Informe o procedimento.'});
            const procedimento=await procedimentoRepository.buscarPorId(id_procedimento);
            if(!procedimento) return res.status(404).json({message:'Procedimento não encontrado.'});
            const precoValido=validarPreco(preco);
            await medicoRepository.adicionarProcedimento(req.params.id,id_procedimento,precoValido);
            return res.status(201).json({message:'Procedimento e preço atualizados.'});
        } catch(error) { return res.status(400).json({message:error.message}); }
    },

    atualizarPreco: async (req,res) => {
        try {
            if(req.user.tipo!=='medico'||Number(req.user.id)!==Number(req.params.id)) return res.status(403).json({message:'Você não pode alterar outro médico.'});
            const preco=validarPreco(req.body.preco);
            const result=await medicoRepository.atualizarPreco(req.params.id,req.params.id_procedimento,preco);
            if(!result.affectedRows) return res.status(404).json({message:'Procedimento não associado ao médico.'});
            return res.json({message:'Preço atualizado com sucesso.'});
        } catch(error) { return res.status(400).json({message:error.message}); }
    },

    removerProcedimento: async (req,res) => {
        try {
            if(req.user.tipo!=='medico'||Number(req.user.id)!==Number(req.params.id)) return res.status(403).json({message:'Você não pode alterar outro médico.'});
            await medicoRepository.removerProcedimento(req.params.id,req.params.id_procedimento);
            return res.json({message:'Procedimento removido do médico.'});
        } catch(error) { return res.status(500).json({message:error.message}); }
    }
};

export default medicoController;
