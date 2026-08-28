import { api } from './api.js';

export async function listarProcedimentos() {
  const response = await api.get('/procedimentos');
  return response.data;
}

export async function buscarProcedimento(id) {
  const response = await api.get(`/procedimentos/${id}`);
  return response.data;
}
