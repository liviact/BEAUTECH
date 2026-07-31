import { Navbar, setupNavbar } from '../components/layout/navbar.jsx';
import { Input } from '../components/shared/input.jsx';
import { Button } from '../components/shared/button.jsx';
import { obterUsuario, salvarUsuario } from '../storage/usuario.storage.js';
import { atualizarPerfil } from '../service/usuario.api.js';

export function EditarPerfilPage() {
  const usuario = obterUsuario();

  return `
    ${Navbar()}

    <div class="container">
      <h1>Editar Perfil</h1>

      <form id="editar-form" class="form">
        ${Input({
          id: 'nome',
          value: usuario.nome
        })}

        ${Input({
          id: 'email',
          type: 'email',
          value: usuario.email
        })}

        ${Input({
          id: 'telefone',
          value: usuario.telefone || ''
        })}

        ${Button({
          text: 'Salvar Alterações',
          type: 'submit'
        })}
      </form>
    </div>
  `;
}

export function setupEditarPerfil() {
  setupNavbar();

  document.getElementById('editar-form')
    .addEventListener('submit', async (e) => {
      e.preventDefault();

      const usuario = obterUsuario();

      const atualizado = await atualizarPerfil(usuario.id, {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value
      });

      salvarUsuario(atualizado);

      alert('Perfil atualizado!');
      window.location.hash = '#/perfil';
    });
}