import { API_BASE } from './api.js';

export async function listarAgendamentos() {
  const response = await fetch(`${API_BASE}/agendamentos`);

  if (!response.ok) {
    throw new Error('Erro ao buscar agendamentos');
  }

  return response.json();
}

export async function criarAgendamento(dados) {
  const response = await fetch(`${API_BASE}/agendamentos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });

  if (!response.ok) {
    throw new Error('Erro ao criar agendamento');
  }

  return response.json();
}