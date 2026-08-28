import { api } from './api.js';

export async function buscarCliente(id) {
  const response = await api.get(`/clientes/${id}`);

  return response.data;
}

export async function listarClientes() {
  const response = await api.get('/clientes');

  return response.data;
}

export async function atualizarCliente(id, dados) {
  const response = await api.put(`/clientes/${id}`, dados);

  return response.data;
}

export async function excluirCliente(id) {
  const response = await api.delete(`/clientes/${id}`);

  return response.data;
}