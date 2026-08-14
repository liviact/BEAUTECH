export function salvarUsuario(usuario) {
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

export function obterUsuario() {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
}

export function removerUsuario() {
  localStorage.removeItem('usuario');
  localStorage.removeItem('token');
  localStorage.removeItem('tokenMedico');
}

export function decodificarToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

export function salvarSessao(token) {
  const dados = decodificarToken(token);
  if (!dados) return null;

  localStorage.removeItem('token');
  localStorage.removeItem('tokenMedico');

  const usuario = {
    id: dados.id,
    tipo: dados.tipo,
    token,
  };

  localStorage.setItem(dados.tipo === 'medico' ? 'tokenMedico' : 'token', token);
  salvarUsuario(usuario);
  return usuario;
}
