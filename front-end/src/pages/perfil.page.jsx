import { Navbar, setupNavbar } from '../components/layout/navbar.jsx';
import { Card } from '../components/shared/card.jsx';
import { Button } from '../components/shared/button.jsx';
import { obterUsuario } from '../storage/usuario.storage.js';

export function PerfilPage() {
  const usuario = obterUsuario() || {};

  return `
    ${Navbar()}

    <div class="container">
      <h1>Meu Perfil</h1>

      ${Card(`
        <p><strong>Nome:</strong> ${usuario.nome || ''}</p>
        <p><strong>Email:</strong> ${usuario.email || ''}</p>
        <p><strong>Telefone:</strong> ${usuario.telefone || ''}</p>
        <br/>
        <a href="#/perfil/editar" class="btn btn-primary">Editar Perfil</a>
      `)}
    </div>
  `;
}

export function setupPerfil() {
  setupNavbar();
}