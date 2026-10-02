import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import prontuarioController from '../controllers/prontuarioController.js';
const router=express.Router();
router.get('/',authMiddleware,prontuarioController.listar);
router.get('/:id',authMiddleware,prontuarioController.buscarPorId);
export default router;
