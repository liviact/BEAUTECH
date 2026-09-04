import express from 'express';
import procedimentoController from '../controllers/procedimentoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Pode ser acessada sem token para carregar os procedimentos no cadastro.
router.get('/', procedimentoController.listar);
// Continua protegida.
router.get('/:id', authMiddleware, procedimentoController.buscarPorId);

export default router;