import express from 'express';
import agendamentoController from '../controllers/agendamentoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, agendamentoController.criar);

router.get('/', authMiddleware, agendamentoController.selecionar);

router.put('/:id', authMiddleware, agendamentoController.editar);

router.delete('/:id', authMiddleware, agendamentoController.deletar);

export default router;