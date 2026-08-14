import express from 'express';
import protocoloController from '../controllers/protocoloController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, protocoloController.criar);

router.get('/', authMiddleware, protocoloController.selecionar);

router.get('/:id', authMiddleware, protocoloController.buscarPorId);

router.put('/:id', authMiddleware, protocoloController.atualizar);

router.delete('/:id', authMiddleware, protocoloController.deletar);

export default router;