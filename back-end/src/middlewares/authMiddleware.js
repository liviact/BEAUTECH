import jwt from 'jsonwebtoken';
import usuarioRepository from '../repositories/usuarioRepository.js';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não enviado.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await usuarioRepository.buscarPorId(decoded.id);

        if (!usuario || !usuario.ativo || usuario.nivel_acesso !== decoded.tipo) {
            return res.status(401).json({ message: 'Usuário inativo ou sessão inválida.' });
        }

        req.user = {
            id: usuario.id_usuario,
            tipo: usuario.nivel_acesso
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
};

export default authMiddleware;
