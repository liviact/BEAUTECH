import { api } from './api.js';

export async function loginCliente(cpf, senha) {
  const response = await api.post('/login/cliente', {
    cpf,
    senha
  });

  return response.data;
}

export async function cadastrarCliente(dados) {
  const response = await api.post('/clientes', dados);

  return response.data;
}