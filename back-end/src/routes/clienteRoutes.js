import express from 'express';
import clienteController from '../controllers/clienteController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', clienteController.criar);

router.get('/', authMiddleware, clienteController.listar);

router.get('/:id', authMiddleware, clienteController.buscarPorId);

router.put('/:id', authMiddleware, clienteController.atualizar);

router.delete('/:id', authMiddleware, clienteController.deletar);

export default router;