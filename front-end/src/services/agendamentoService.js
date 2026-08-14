import { api } from './api';

export async function listarAgendamentos() {
  const response = await api.get('/agendamentos');
  return response.data;
}

export async function criarAgendamento(dados) {
  const response = await api.post('/agendamentos', dados);
  return response.data;
}

export async function excluirAgendamento(id) {
  const response = await api.delete(`/agendamentos/${id}`);
  return response.data;
}

export async function atualizarAgendamento(id, dados) {
  const response = await api.put(`/agendamentos/${id}`, dados);
  return response.data;
}

export async function listarMedicos() {
  const response = await api.get('/medicos');
  return response.data;
}
