import { Navbar, setupNavbar } from '../components/layout/navbar.jsx';
import { Card } from '../components/shared/card.jsx';
import { listarAgendamentos } from '../service/agendamento.api.js';

export async function AgendamentosPage() {
  const agendamentos = await listarAgendamentos();

  return `
    ${Navbar()}

    <div class="container">
      <h1>Meus Agendamentos</h1>

      <a href="#/agendamentos/novo" class="btn btn-primary">
        Novo Agendamento
      </a>

      ${agendamentos.map(a =>
        Card(`
          <h3>${a.procedimento}</h3>
          <p>📅 ${a.data}</p>
          <p>🕒 ${a.hora}</p>
        `)
      ).join('')}
    </div>
  `;
}

export function setupAgendamentos() {
  setupNavbar();
}