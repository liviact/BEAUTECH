import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/login/medico', authController.loginMedico);

router.post('/login/cliente', authController.loginCliente);

export default router;