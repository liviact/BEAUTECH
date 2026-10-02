import express from 'express';
import configuracaoController from '../controllers/configuracaoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
const router=express.Router();
router.get('/',authMiddleware,configuracaoController.buscar);
router.put('/',adminMiddleware,configuracaoController.atualizar);
export default router;
