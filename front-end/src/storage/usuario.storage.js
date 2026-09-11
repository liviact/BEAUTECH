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
}

export function salvarSessao(resposta) {
  if (!resposta?.token) return null;

  const usuario = resposta.usuario || decodificarToken(resposta.token);
  if (!usuario) return null;

  const sessao = {
    ...usuario,
    id: usuario.id ?? usuario.id_usuario,
    tipo: usuario.tipo ?? usuario.nivel_acesso,
    token: resposta.token
  };

  localStorage.setItem('token', resposta.token);
  salvarUsuario(sessao);
  return sessao;
}

export function decodificarToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}
