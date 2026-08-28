import express from 'express';
import procedimentoController from '../controllers/procedimentoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, procedimentoController.listar);
router.get('/:id', authMiddleware, procedimentoController.buscarPorId);

export default router;
