import express from 'express';
import clienteController from '../controllers/clienteController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import uploadPerfil from '../middlewares/uploadImage.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, clienteController.listar);
router.get('/:id', authMiddleware, clienteController.buscarPorId);
router.put('/:id', authMiddleware, uploadPerfil, clienteController.atualizar);
router.put('/:id/inativar', authMiddleware, clienteController.desativar);

export default router;
