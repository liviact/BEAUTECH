import express from 'express';

import authRoutes from './authRoutes.js';
import medicoRoutes from './medicoRoutes.js';
import clienteRoutes from './clienteRoutes.js';
import agendamentoRoutes from './agendamentoRoutes.js';
import atendimentoRoutes from './atendimentoRoutes.js';
import protocoloRoutes from './protocoloRoutes.js';

const router = express.Router();

router.use(authRoutes);

router.use('/medicos', medicoRoutes);

router.use('/clientes', clienteRoutes);

router.use('/agendamentos', agendamentoRoutes);

router.use('/atendimentos', atendimentoRoutes);

router.use('/protocolos', protocoloRoutes);

export default router;