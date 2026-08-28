import express from 'express';
import agendamentoController from '../controllers/agendamentoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, agendamentoController.criar);
router.get('/', authMiddleware, agendamentoController.selecionar);
router.get('/agenda-medico', authMiddleware, agendamentoController.agendaMedico);

router.put('/:id/aceitar', authMiddleware, agendamentoController.aceitar);
router.put('/:id/recusar', authMiddleware, agendamentoController.recusar);
router.put('/:id/cancelar', authMiddleware, agendamentoController.cancelar);
router.put('/:id/realizar', authMiddleware, agendamentoController.realizar);

router.post('/:id/reagendar', authMiddleware, agendamentoController.reagendar);
router.put('/:id', authMiddleware, agendamentoController.editar);

export default router;