import { API_BASE } from './api.js';

export async function atualizarPerfil(id, dados) {
  const response = await fetch(`${API_BASE}/clientes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar perfil');
  }

  return response.json();
}