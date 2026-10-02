import { api } from './api.js';

export async function listarNotificacoes(){ return (await api.get('/notificacoes')).data; }
export async function contarNotificacoes(){ return (await api.get('/notificacoes/nao-lidas')).data; }
export async function marcarNotificacaoLida(id){ return (await api.patch(`/notificacoes/${id}/lida`)).data; }
export async function marcarTodasNotificacoes(){ return (await api.patch('/notificacoes/lidas/todas')).data; }
