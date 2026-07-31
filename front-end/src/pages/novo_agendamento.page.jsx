import { Navbar, setupNavbar } from '../components/layout/navbar.jsx';
import { Button } from '../components/shared/button.jsx';
import { criarAgendamento } from '../service/agendamento.api.js';

export function NovoAgendamentoPage() {
  return `
    ${Navbar()}

    <div class="container">
      <h1>Novo Agendamento</h1>

      <form id="agendamento-form" class="form">
        <select id="procedimento" required class="input">
          <option value="">Selecione</option>
          <option>Limpeza de pele</option>
          <option>Botox</option>
          <option>Preenchimento</option>
        </select>

        <input type="date" id="data" class="input" required />
        <input type="time" id="hora" class="input" required />

        <textarea id="obs" class="input" placeholder="Observações"></textarea>

        ${Button({
          text: 'Agendar',
          type: 'submit'
        })}
      </form>
    </div>
  `;
}

export function setupNovoAgendamento() {
  setupNavbar();

  document.getElementById('agendamento-form')
    .addEventListener('submit', async (e) => {
      e.preventDefault();

      await criarAgendamento({
        procedimento: document.getElementById('procedimento').value,
        data: document.getElementById('data').value,
        hora: document.getElementById('hora').value,
        observacoes: document.getElementById('obs').value
      });

      alert('Agendamento realizado!');
      window.location.hash = '#/agendamentos';
    });
}