import authMiddleware from './authMiddleware.js';

export default function adminMiddleware(req, res, next) {
    authMiddleware(req, res, () => {
        if (req.user.tipo !== 'admin') {
            return res.status(403).json({ message: 'Acesso permitido somente ao administrador.' });
        }
        next();
    });
}
