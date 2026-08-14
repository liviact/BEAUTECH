import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import Card from '../components/shared/card.jsx';
import { listarAgendamentos, excluirAgendamento } from '../services/agendamentoService.js';
import { obterUsuario } from '../storage/usuario.storage.js';

export default function Agendamentos() {
  const sessao = obterUsuario() || {};
  const [agendamentos, setAgendamentos] = useState([]);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      const dados = await listarAgendamentos();
      const meus = sessao.tipo === 'cliente' ? dados.filter((item) => Number(item.id_cliente) === Number(sessao.id)) : dados.filter((item) => Number(item.id_medico) === Number(sessao.id));
      setAgendamentos(meus);
    } catch (err) { setErro(err.response?.data?.message || 'Erro ao buscar agendamentos.'); }
  }

  useEffect(() => { carregar(); }, []);

  async function excluir(id) {
    if (!window.confirm('Deseja realmente excluir este agendamento?')) return;
    try { await excluirAgendamento(id); carregar(); } catch (err) { setErro(err.response?.data?.message || 'Erro ao excluir agendamento.'); }
  }

  return <><Navbar /><div className="container"><div className="page-header"><div><h1>Meus Agendamentos</h1><p className="muted">Acompanhe seus horários na BEAUTECH.</p></div><Link to="/agendamentos/novo" className="btn-link compact">Novo agendamento</Link></div>
    {erro && <div className="alert error">{erro}</div>}
    {agendamentos.length === 0 ? <Card><p>Nenhum agendamento encontrado.</p></Card> : agendamentos.map((a) => <Card key={a.id_agendamento}><div className="appointment"><div><strong>{a.tipo_atendimento}</strong><p>Data: {new Date(a.data).toLocaleDateString('pt-BR')}</p><p>Hora: {String(a.hora).slice(0,5)}</p><p>Médico: {a.medico}</p></div><div><span className="status">{a.status}</span><button className="btn-danger-small" onClick={() => excluir(a.id_agendamento)}>Excluir</button></div></div></Card>)}
  </div></>;
}
