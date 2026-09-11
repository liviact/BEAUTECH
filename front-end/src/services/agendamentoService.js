import { api } from './api.js';

export async function listarAgendamentos() {
  const response = await api.get('/agendamentos');

  return response.data;
}


export async function buscarAgendamento(id) {
  const response = await api.get(`/agendamentos/${id}`);
  return response.data;
}

export async function listarAgendaMedico() {
  const response = await api.get('/agendamentos/agenda-medico');

  return response.data;
}

export async function criarAgendamento(dados) {
  const response = await api.post('/agendamentos', dados);

  return response.data;
}

export async function aceitarAgendamento(id) {
  const response = await api.put(`/agendamentos/${id}/aceitar`);

  return response.data;
}

export async function recusarAgendamento(id) {
  const response = await api.put(`/agendamentos/${id}/recusar`);

  return response.data;
}

export async function cancelarAgendamento(id) {
  const response = await api.put(`/agendamentos/${id}/cancelar`);

  return response.data;
}

export async function realizarAgendamento(id) {
  const response = await api.put(`/agendamentos/${id}/realizar`);

  return response.data;
}

export async function reagendarAgendamento(id, dados) {
    const response = await api.post(`/agendamentos/${id}/reagendar`, dados);

    return response.data;
}

export async function atualizarAgendamento(id, dados) {
  const response = await api.put(`/agendamentos/${id}`, dados);

  return response.data;
}