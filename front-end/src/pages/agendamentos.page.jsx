import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import Card from '../components/shared/card.jsx';
import {
  listarAgendamentos,
  cancelarAgendamento,
  aceitarAgendamento,
  recusarAgendamento,
  realizarAgendamento
} from '../services/agendamentoService.js';
import { obterUsuario } from '../storage/usuario.storage.js';

function formatarData(data) {
  if (!data) return '';

  const texto = String(data).slice(0, 10);
  const [ano, mes, dia] = texto.split('-');

  return `${dia}/${mes}/${ano}`;
}

function formatarHora(hora) {
  return String(hora).slice(0, 5);
}

// Calcula quantas horas faltam para a consulta
function horasAteConsulta(data, hora) {
  const [ano, mes, dia] = String(data)
    .slice(0, 10)
    .split('-')
    .map(Number);

  const [horas, minutos] = String(hora)
    .slice(0, 5)
    .split(':')
    .map(Number);

  const consulta = new Date(
    ano,
    mes - 1,
    dia,
    horas,
    minutos
  );

  return (consulta.getTime() - Date.now()) / (1000 * 60 * 60);
}

export default function Agendamentos() {
  const navigate = useNavigate();
  const sessao = obterUsuario() || {};

  const [agendamentos, setAgendamentos] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    try {
      setCarregando(true);
      setErro('');

      const dados = await listarAgendamentos();

      const meus = sessao.tipo === 'cliente'
        ? dados.filter(
            item =>
              Number(item.id_cliente) === Number(sessao.id)
          )
        : dados.filter(
            item =>
              Number(item.id_medico) === Number(sessao.id)
          );

      setAgendamentos(meus);
    } catch (err) {
      setErro(
        err.response?.data?.message ||
        'Erro ao buscar agendamentos.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function cancelar(id) {
    const confirmar = window.confirm(
      'Deseja cancelar esta consulta?'
    );

    if (!confirmar) return;

    try {
      await cancelarAgendamento(id);
      await carregar();
    } catch (err) {
      setErro(
        err.response?.data?.message ||
        'Não foi possível cancelar a consulta.'
      );
    }
  }

  // Abre a página de reagendamento
  function reagendar(agendamento) {
    navigate(
      `/agendamentos/reagendar/${agendamento.id_agendamento}`
    );
  }

  async function aceitar(id) {
    try {
      await aceitarAgendamento(id);
      await carregar();
    } catch (err) {
      setErro(
        err.response?.data?.message ||
        'Erro ao aceitar consulta.'
      );
    }
  }

  async function recusar(id) {
    try {
      await recusarAgendamento(id);
      await carregar();
    } catch (err) {
      setErro(
        err.response?.data?.message ||
        'Erro ao recusar consulta.'
      );
    }
  }

  async function realizar(id) {
    try {
      await realizarAgendamento(id);
      await carregar();
    } catch (err) {
      setErro(
        err.response?.data?.message ||
        'Erro ao concluir consulta.'
      );
    }
  }

  function podeCancelar(agendamento) {
    if (
      !['pendente', 'aceito'].includes(
        agendamento.status
      )
    ) {
      return false;
    }

    return horasAteConsulta(
      agendamento.data,
      agendamento.hora
    ) >= 24;
  }

  function textoStatus(status) {
    const nomes = {
      pendente: 'Aguardando análise',
      aceito: 'Consulta aceita',
      recusado: 'Consulta recusada',
      cancelado: 'Consulta cancelada',
      realizado: 'Consulta realizada'
    };

    return nomes[status] || status;
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="page-header">
          <div>
            <h1>
              {sessao.tipo === 'medico'
                ? 'Agenda do Médico'
                : 'Meus Agendamentos'}
            </h1>

            <p className="muted">
              Acompanhe suas consultas e solicitações.
            </p>
          </div>

          {sessao.tipo === 'cliente' && (
            <Link
              to="/agendamentos/novo"
              className="btn-link compact"
            >
              Novo agendamento
            </Link>
          )}
        </div>

        {erro && (
          <div className="alert error">
            {erro}
          </div>
        )}

        {carregando ? (
          <Card>
            <p>Carregando agendamentos...</p>
          </Card>
        ) : agendamentos.length === 0 ? (
          <Card>
            <p>Nenhum agendamento encontrado.</p>
          </Card>
        ) : (
          agendamentos.map(agendamento => (
            <Card key={agendamento.id_agendamento}>
              <div className="appointment">
                <div>
                  <strong>
                    {agendamento.tipo_atendimento}
                  </strong>

                  <p>
                    Data: {formatarData(agendamento.data)}
                  </p>

                  <p>
                    Hora: {formatarHora(agendamento.hora)}
                  </p>

                  <p>
                    Médico: {agendamento.medico}
                  </p>

                  {sessao.tipo === 'medico' && (
                    <p>
                      Cliente: {agendamento.cliente}
                    </p>
                  )}
                </div>

                <div>
                  <span className="status">
                    {textoStatus(agendamento.status)}
                  </span>

                  {sessao.tipo === 'cliente' &&
                    podeCancelar(agendamento) && (
                      <>
                        <button
                          className="btn-danger-small"
                          onClick={() =>
                            cancelar(
                              agendamento.id_agendamento
                            )
                          }
                        >
                          Cancelar
                        </button>

                        <button
                          className="btn-link compact"
                          onClick={() =>
                            reagendar(agendamento)
                          }
                        >
                          Reagendar
                        </button>
                      </>
                    )}

                  {sessao.tipo === 'cliente' &&
                    agendamento.status === 'aceito' &&
                    !podeCancelar(agendamento) && (
                      <p className="muted">
                        O cancelamento não está disponível
                        porque faltam menos de 24 horas.
                      </p>
                    )}

                  {sessao.tipo === 'medico' &&
                    agendamento.status === 'pendente' && (
                      <>
                        <button
                          className="btn"
                          onClick={() =>
                            aceitar(
                              agendamento.id_agendamento
                            )
                          }
                        >
                          Aceitar
                        </button>

                        <button
                          className="btn-danger-small"
                          onClick={() =>
                            recusar(
                              agendamento.id_agendamento
                            )
                          }
                        >
                          Recusar
                        </button>
                      </>
                    )}

                  {sessao.tipo === 'medico' &&
                    agendamento.status === 'aceito' && (
                      <button
                        className="btn"
                        onClick={() =>
                          realizar(
                            agendamento.id_agendamento
                          )
                        }
                      >
                        Marcar como realizada
                      </button>
                    )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}