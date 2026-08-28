import { api } from './api';

export async function loginMedico(dados) {
    const response =
        await api.post('/login/medico', dados);
    return response.data;
}

export async function cadastrarMedico(dados) {
    const response =
        await api.post('/medicos',dados);
    return response.data;
}

export async function listarProcedimentosMedico(idMedico) {
    const response =
        await api.get(`/medicos/${idMedico}/procedimentos`);
    return response.data;
}

export async function adicionarProcedimentoMedico(idMedico, idProcedimento) {
    const response =
        await api.post(`/medicos/${idMedico}/procedimentos`,
            {
                id_procedimento:
                    idProcedimento
            }
        );
    return response.data;
}