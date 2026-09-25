import { api } from './api.js';

export async function login(dados) {
  const response = await api.post('/login', dados);
  return response.data;
}

export async function cadastrar(dados) {
  const formData = new FormData();

  Object.entries(dados).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null) {
      formData.append(chave, valor);
    }
  });

  const response = await api.post('/cadastro', formData);
  return response.data;
}
