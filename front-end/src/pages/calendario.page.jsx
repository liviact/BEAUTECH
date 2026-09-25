import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import Card from '../components/shared/card.jsx';
import { listarAgendamentos } from '../services/agendamentoService.js';
import { obterUsuario } from '../storage/usuario.storage.js';

const nomesMeses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const nomesDias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

function chaveData(data) { return String(data || '').slice(0, 10); }
function formatarHora(hora) { return String(hora || '').slice(0, 5); }
function formatarData(data) {
  const [ano, mes, dia] = chaveData(data).split('-');
  return ano ? `${dia}/${mes}/${ano}` : '';
}

function inicioDoMes(data) { return new Date(data.getFullYear(), data.getMonth(), 1); }
function diasNoMes(data) { return new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate(); }

export default function Calendario() {
  const navigate = useNavigate();
  const sessao = obterUsuario() || {};
  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(inicioDoMes(hoje));
  const [agendamentos, setAgendamentos] = useState([]);
  const [selecionada, setSelecionada] = useState(chaveData(hoje.toISOString().slice(0, 10)));
  const [erro, setErro] = useState('');

  useEffect(() => {
    listarAgendamentos()
      .then(setAgendamentos)
      .catch(err => setErro(err.response?.data?.message || 'Não foi possível carregar o calendário.'));
  }, []);

  const porDia = useMemo(() => {
    const mapa = {};
    agendamentos.forEach(item => {
      const dia = chaveData(item.data);
      if (!mapa[dia]) mapa[dia] = [];
      mapa[dia].push(item);
    });
    Object.values(mapa).forEach(lista => lista.sort((a, b) => String(a.hora).localeCompare(String(b.hora))));
    return mapa;
  }, [agendamentos]);

  const dias = useMemo(() => {
    const primeiro = inicioDoMes(mesAtual).getDay();
    const total = diasNoMes(mesAtual);
    return [...Array(primeiro).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  }, [mesAtual]);

  const detalhes = porDia[selecionada] || [];

  function mudarMes(delta) {
    setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + delta, 1));
  }

  return (
    <>
      <Navbar />
      <main className="container calendar-page">
        <div className="page-header">
          <div>
            <span className="eyebrow">AGENDA BEAUTECH</span>
            <h1>Calendário de consultas</h1>
            <p className="muted">Visualize seus atendimentos por data e consulte os detalhes de cada horário.</p>
          </div>
          <button type="button" className="btn-secondary page-back-button" onClick={() => navigate('/dashboard')}>← Voltar</button>
        </div>

        {erro && <div className="alert error">{erro}</div>}

        <div className="calendar-layout">
          <Card className="calendar-card">
            <div className="calendar-heading">
              <button className="calendar-nav" onClick={() => mudarMes(-1)} aria-label="Mês anterior">‹</button>
              <h2>{nomesMeses[mesAtual.getMonth()]} {mesAtual.getFullYear()}</h2>
              <button className="calendar-nav" onClick={() => mudarMes(1)} aria-label="Próximo mês">›</button>
            </div>
            <div className="calendar-weekdays">
              {nomesDias.map(dia => <strong key={dia}>{dia}</strong>)}
            </div>
            <div className="calendar-grid">
              {dias.map((dia, index) => {
                if (!dia) return <div className="calendar-day empty" key={`empty-${index}`} />;
                const chave = `${mesAtual.getFullYear()}-${String(mesAtual.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
                const eventos = porDia[chave] || [];
                const ativo = chave === selecionada;
                const hojeChave = chaveData(`${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,'0')}-${String(hoje.getDate()).padStart(2,'0')}`);
                return (
                  <button key={chave} type="button" className={`calendar-day ${ativo ? 'selected' : ''} ${chave === hojeChave ? 'today' : ''}`} onClick={() => setSelecionada(chave)}>
                    <span>{dia}</span>
                    {eventos.length > 0 && <small>{eventos.length} {eventos.length === 1 ? 'consulta' : 'consultas'}</small>}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="calendar-details">
            <span className="eyebrow">DIA SELECIONADO</span>
            <h2>{formatarData(selecionada)}</h2>
            {detalhes.length === 0 ? (
              <p className="muted">Nenhuma consulta registrada para esta data.</p>
            ) : (
              <div className="calendar-events">
                {detalhes.map(item => (
                  <div className="calendar-event" key={item.id_agendamento}>
                    <div className="calendar-event-time">{formatarHora(item.hora)}</div>
                    <div>
                      <strong>{item.procedimento || item.tipo_atendimento}</strong>
                      <span>{sessao.tipo === 'medico' ? `Cliente: ${item.cliente}` : `Médico: ${item.medico}`}</span>
                      <small className={`status status-${item.status}`}>{item.status}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="btn-link calendar-all-button" onClick={() => navigate('/agendamentos')}>Ver histórico e agendamentos</button>
          </Card>
        </div>
      </main>
    </>
  );
}
