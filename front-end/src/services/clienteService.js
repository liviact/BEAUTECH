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
  const formData = new FormData();
  Object.entries(dados).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null) formData.append(chave, valor);
  });
  const response = await api.put(`/clientes/${id}`, formData);
  return response.data;
}
