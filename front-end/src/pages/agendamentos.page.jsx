import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import Card from '../components/shared/card.jsx';
import { listarAgendamentos, cancelarAgendamento, aceitarAgendamento, recusarAgendamento, realizarAgendamento } from '../services/agendamentoService.js';
import { obterUsuario } from '../storage/usuario.storage.js';

function formatarData(data) {
  if (!data) return '';
  const [ano, mes, dia] = String(data).slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}
function formatarHora(hora) { return String(hora || '').slice(0, 5); }
function horasAteConsulta(data, hora) {
  const [ano, mes, dia] = String(data).slice(0, 10).split('-').map(Number);
  const [horas, minutos] = String(hora).slice(0, 5).split(':').map(Number);
  return (new Date(ano, mes - 1, dia, horas, minutos).getTime() - Date.now()) / (1000 * 60 * 60);
}
function ehHistorico(item) {
  if (['cancelado', 'recusado', 'realizado', 'concluido'].includes(item.status)) return true;
  return horasAteConsulta(item.data, item.hora) < 0;
}

export default function Agendamentos() {
  const navigate = useNavigate();
  const sessao = obterUsuario() || {};
  const [agendamentos, setAgendamentos] = useState([]);
  const [aba, setAba] = useState('proximas');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    try {
      setCarregando(true);
      const dados = await listarAgendamentos();
      const meus = dados.filter(item => sessao.tipo === 'cliente'
        ? Number(item.id_cliente) === Number(sessao.id)
        : Number(item.id_medico) === Number(sessao.id));
      setAgendamentos(meus);
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao buscar agendamentos.');
    } finally { setCarregando(false); }
  }
  useEffect(() => { carregar(); }, []);

  async function cancelar(id) {
    if (!window.confirm('Deseja cancelar esta consulta?')) return;
    try { await cancelarAgendamento(id); await carregar(); }
    catch (err) { setErro(err.response?.data?.message || 'Não foi possível cancelar a consulta.'); }
  }
  async function aceitar(id) {
    try { await aceitarAgendamento(id); await carregar(); }
    catch (err) { setErro(err.response?.data?.message || 'Erro ao aceitar consulta.'); }
  }
  async function recusar(id) {
    try { await recusarAgendamento(id); await carregar(); }
    catch (err) { setErro(err.response?.data?.message || 'Erro ao recusar consulta.'); }
  }
  async function realizar(id) {
    try { await realizarAgendamento(id); await carregar(); }
    catch (err) { setErro(err.response?.data?.message || 'Erro ao concluir consulta.'); }
  }
  function podeCancelar(item) { return ['pendente', 'aceito'].includes(item.status) && horasAteConsulta(item.data, item.hora) >= 24; }
  function textoStatus(status) {
    return { pendente: 'Aguardando análise', aceito: 'Consulta aceita', recusado: 'Consulta recusada', cancelado: 'Consulta cancelada', realizado: 'Consulta realizada', concluido: 'Consulta concluída' }[status] || status;
  }

  const exibidos = agendamentos.filter(item => aba === 'historico' ? ehHistorico(item) : !ehHistorico(item));

  return (
    <>
      <Navbar />
      <main className="container">
        <div className="page-header">
          <div>
            <span className="eyebrow">AGENDA BEAUTECH</span>
            <h1>{sessao.tipo === 'medico' ? 'Agenda do Médico' : 'Meus Agendamentos'}</h1>
            <p className="muted">Consulte suas próximas consultas e o histórico de atendimentos.</p>
          </div>
          <div className="page-header-actions">
            {sessao.tipo === 'cliente' && <Link to="/agendamentos/novo" className="btn-link compact">Novo agendamento</Link>}
            <button type="button" className="btn-secondary page-back-button" onClick={() => navigate('/dashboard')}>← Voltar</button>
          </div>
        </div>

        {erro && <div className="alert error">{erro}</div>}

        <div className="appointment-tabs" role="tablist">
          <button type="button" className={aba === 'proximas' ? 'active' : ''} onClick={() => setAba('proximas')}>Próximas consultas</button>
          <button type="button" className={aba === 'historico' ? 'active' : ''} onClick={() => setAba('historico')}>Histórico</button>
        </div>

        {carregando ? <Card><p>Carregando agendamentos...</p></Card> : exibidos.length === 0 ? (
          <Card className="empty-card"><p>{aba === 'historico' ? 'Nenhum atendimento no histórico.' : 'Nenhuma consulta próxima.'}</p></Card>
        ) : exibidos.map(agendamento => (
          <Card key={agendamento.id_agendamento} className="appointment-card">
            <div className="appointment">
              <div>
                <span className="doctor-label">{agendamento.procedimento || agendamento.tipo_atendimento}</span>
                <h3>{sessao.tipo === 'medico' ? `Cliente: ${agendamento.cliente}` : `Médico: ${agendamento.medico}`}</h3>
                <p><strong>Data:</strong> {formatarData(agendamento.data)} &nbsp; <strong>Hora:</strong> {formatarHora(agendamento.hora)}</p>
              </div>
              <div className="appointment-actions">
                <div className="appointment-status-actions"><span className={`status status-${agendamento.status}`}>{textoStatus(agendamento.status)}</span>{sessao.tipo === 'cliente' && podeCancelar(agendamento) && <div className="action-row"><button className="btn-danger-small" onClick={() => cancelar(agendamento.id_agendamento)}>Cancelar</button><button className="btn-reagendar" onClick={() => navigate(`/agendamentos/${agendamento.id_agendamento}/reagendar`)}>Reagendar</button></div>}</div>
                {sessao.tipo === 'cliente' && agendamento.status === 'aceito' && !podeCancelar(agendamento) && <small className="muted">O cancelamento não está disponível porque faltam menos de 24 horas.</small>}
                {sessao.tipo === 'medico' && agendamento.status === 'pendente' && <div className="action-row"><button className="btn" onClick={() => aceitar(agendamento.id_agendamento)}>Aceitar</button><button className="btn-danger-small" onClick={() => recusar(agendamento.id_agendamento)}>Recusar</button></div>}
                {sessao.tipo === 'medico' && agendamento.status === 'aceito' && <button className="btn" onClick={() => realizar(agendamento.id_agendamento)}>Marcar como realizada</button>}
              </div>
            </div>
          </Card>
        ))}
      </main>
    </>
  );
}
