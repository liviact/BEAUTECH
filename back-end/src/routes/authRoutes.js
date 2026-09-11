import express from 'express';
import authController from '../controllers/authController.js';
import uploadPerfil from '../middlewares/uploadImage.middleware.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/cadastro', uploadPerfil, authController.cadastrar);

export default router;
