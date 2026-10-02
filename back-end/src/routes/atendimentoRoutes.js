import express from 'express';
import atendimentoController from '../controllers/atendimentoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router=express.Router();
router.get('/',authMiddleware,atendimentoController.selecionar);
router.get('/:id',authMiddleware,atendimentoController.buscarPorId);
router.delete('/:id',authMiddleware,atendimentoController.deletar);
export default router;
