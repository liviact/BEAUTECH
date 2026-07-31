export function salvarUsuario(usuario) {
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

export function obterUsuario() {
  return JSON.parse(localStorage.getItem('usuario'));
}

export function removerUsuario() {
  localStorage.removeItem('usuario');
}