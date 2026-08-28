import express from 'express';
import medicoController from '../controllers/medicoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', medicoController.criar);
router.get('/', authMiddleware, medicoController.listar);
router.get('/:id/procedimentos', authMiddleware, medicoController.listarProcedimentos);
router.post('/:id/procedimentos', authMiddleware, medicoController.adicionarProcedimento);
router.get('/:id', authMiddleware, medicoController.buscarPorId);
router.put('/:id', authMiddleware, medicoController.atualizar);
router.delete('/:id', authMiddleware, medicoController.deletar);

export default router;