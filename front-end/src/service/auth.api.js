import { API_BASE } from './api'

export async function login(email, senha) {
  const response = await fetch(`${API_BASE}/login/cliente`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, senha })
  })

  if (!response.ok) {
    throw new Error('Email ou senha inválidos')
  }

  return response.json()
}

export async function cadastrar(dados) {
  const response = await fetch(`${API_BASE}/clientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  })

  if (!response.ok) {
    throw new Error('Erro ao cadastrar usuário')
  }

  return response.json()
}