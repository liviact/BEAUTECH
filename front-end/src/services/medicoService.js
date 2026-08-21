import { api } from './api';

export async function loginMedico(dados) {
  const response = await api.post('/login/medico', dados);
  return response.data;
}

export async function cadastrarMedico(dados) {
  const response = await api.post('/medicos', dados);
  return response.data;
}
