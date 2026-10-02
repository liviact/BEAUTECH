import { api } from './api.js';
export async function buscarFuncionamento(){ return (await api.get('/configuracoes/clinica')).data; }
export async function atualizarFuncionamento(dados){ return (await api.put('/configuracoes/clinica',dados)).data; }
