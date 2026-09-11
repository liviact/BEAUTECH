import express from 'express';
import medicoController from '../controllers/medicoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import uploadPerfil from '../middlewares/uploadImage.middleware.js';

const router = express.Router();

router.get('/', medicoController.listar);
router.get('/:id', medicoController.buscarPorId);
router.get('/:id/procedimentos', medicoController.listarProcedimentos);
router.post('/:id/procedimentos', authMiddleware, medicoController.adicionarProcedimento);
router.delete('/:id/procedimentos/:id_procedimento', authMiddleware, medicoController.removerProcedimento);
router.put('/:id', authMiddleware, uploadPerfil, medicoController.atualizar);

export default router;
