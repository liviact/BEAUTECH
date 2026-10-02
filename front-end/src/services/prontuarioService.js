import { api } from './api.js';
export async function listarProntuarios(){ return (await api.get('/prontuarios')).data; }
export async function buscarProntuario(id){ return (await api.get(`/prontuarios/${id}`)).data; }
