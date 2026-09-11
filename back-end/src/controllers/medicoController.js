import usuarioRepository from '../repositories/usuarioRepository.js';
import { connection } from '../configs/Database.js';

function semSenha(usuario) {
    if (!usuario) return usuario;
    const { senha, ...dados } = usuario;
    void senha;
    return dados;
}

const medicoController = {
    listar: async (req, res) => {
        try {
            const medicos = await usuarioRepository.listarMedicos();
            return res.json(medicos.map((medico) => ({
                ...medico,
                procedimentos: medico.procedimentos_nomes
                    ? medico.procedimentos_nomes.split('||').filter(Boolean)
                    : []
            })));
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    buscarPorId: async (req, res) => {
        try {
            const usuario = await usuarioRepository.buscarPorId(req.params.id);
            if (!usuario || usuario.nivel_acesso !== 'medico' || !usuario.ativo) {
                return res.status(404).json({ message: 'Médico não encontrado.' });
            }
            return res.json(semSenha(usuario));
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    atualizar: async (req, res) => {
        if (req.user.tipo !== 'medico' || Number(req.user.id) !== Number(req.params.id)) {
            return res.status(403).json({ message: 'Você só pode editar o seu próprio perfil.' });
        }
        try {
            const dados = { ...req.body };
            if (req.file) dados.foto_perfil = `/uploads/perfil/${req.file.filename}`;
            if (dados.cpf) dados.cpf = String(dados.cpf).replace(/\D/g, '');
            await usuarioRepository.atualizarMedico(req.params.id, dados);
            return res.json({ message: 'Perfil atualizado com sucesso.' });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },

    listarProcedimentos: async (req, res) => {
        try {
            const [rows] = await connection.execute(
                `SELECT p.id_procedimento, p.nome, p.descricao
                 FROM procedimentos p
                 INNER JOIN medico_procedimentos mp ON mp.id_procedimento = p.id_procedimento
                 WHERE mp.id_medico = ? ORDER BY p.nome`,
                [req.params.id]
            );
            return res.json(rows);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    adicionarProcedimento: async (req, res) => {
        try {
            if (req.user.tipo !== 'medico' || Number(req.user.id) !== Number(req.params.id)) {
                return res.status(403).json({ message: 'Você não pode alterar os procedimentos de outro médico.' });
            }
            const { id_procedimento } = req.body;
            if (!id_procedimento) return res.status(400).json({ message: 'Informe o procedimento.' });

            const [procedimento] = await connection.execute(
                `SELECT id_procedimento FROM procedimentos WHERE id_procedimento = ? LIMIT 1`,
                [id_procedimento]
            );
            if (!procedimento.length) {
                return res.status(404).json({ message: 'Procedimento não encontrado.' });
            }

            await connection.execute(
                `INSERT INTO medico_procedimentos (id_medico, id_procedimento) VALUES (?, ?)`,
                [req.params.id, id_procedimento]
            );
            return res.status(201).json({ message: 'Procedimento adicionado ao médico.' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Este procedimento já está associado ao médico.' });
            return res.status(500).json({ error: error.message });
        }
    },

    removerProcedimento: async (req, res) => {
        try {
            if (req.user.tipo !== 'medico' || Number(req.user.id) !== Number(req.params.id)) {
                return res.status(403).json({ message: 'Você não pode alterar os procedimentos de outro médico.' });
            }

            await connection.execute(
                `DELETE FROM medico_procedimentos
                 WHERE id_medico = ? AND id_procedimento = ?`,
                [req.params.id, req.params.id_procedimento]
            );

            return res.json({ message: 'Procedimento removido do médico.' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export default medicoController;
