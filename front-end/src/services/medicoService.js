import { api } from './api.js';

export async function listarMedicos() {
  const response = await api.get('/medicos');
  return response.data;
}

export async function buscarMedico(id) {
  const response = await api.get(`/medicos/${id}`);
  return response.data;
}

export async function atualizarMedico(id, dados) {
  const formData = new FormData();
  Object.entries(dados).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null) formData.append(chave, valor);
  });
  const response = await api.put(`/medicos/${id}`, formData);
  return response.data;
}

export async function listarProcedimentosMedico(id) {
  const response = await api.get(`/medicos/${id}/procedimentos`);
  return response.data;
}

export async function adicionarProcedimentoMedico(idMedico, idProcedimento) {
  const response = await api.post(`/medicos/${idMedico}/procedimentos`, {
    id_procedimento: idProcedimento
  });
  return response.data;
}


export async function removerProcedimentoMedico(idMedico, idProcedimento) {
  const response = await api.delete(`/medicos/${idMedico}/procedimentos/${idProcedimento}`);
  return response.data;
}

export function urlFoto(foto) {
  if (!foto) return '';
  if (foto.startsWith('http://') || foto.startsWith('https://')) return foto;
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return `${base}${foto.startsWith('/') ? '' : '/'}${foto}`;
}
