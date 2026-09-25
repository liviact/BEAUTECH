import express from 'express';
import adminController from '../controllers/adminController.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import uploadPerfil from '../middlewares/uploadImage.middleware.js';

const router = express.Router();

router.use(adminMiddleware);
router.get('/usuarios', adminController.listarUsuarios);
router.post('/medicos', uploadPerfil, adminController.criarMedico);
router.patch('/usuarios/:id/ativo', adminController.alterarAtivo);

export default router;
