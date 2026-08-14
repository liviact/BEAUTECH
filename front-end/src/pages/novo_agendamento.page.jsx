import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import Card from '../components/shared/card.jsx';
import Input from '../components/shared/input.jsx';
import Button from '../components/shared/button.jsx';
import { criarAgendamento, listarMedicos } from '../services/agendamentoService.js';
import { obterUsuario } from '../storage/usuario.storage.js';

export default function NovoAgendamento() {
  const navigate = useNavigate();
  const sessao = obterUsuario() || {};
  const [medicos, setMedicos] = useState([]);
  const [form, setForm] = useState({ id_medico: '', data: '', hora: '', tipo_atendimento: '' });
  const [erro, setErro] = useState('');

  useEffect(() => {
    listarMedicos().then(setMedicos).catch((err) => setErro(err.response?.data?.message || 'Não foi possível carregar os médicos.'));
  }, []);

  function handleChange(e) { setForm((atual) => ({ ...atual, [e.target.name]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault(); setErro('');
    if (sessao.tipo !== 'cliente') { setErro('A criação de agendamentos por esta tela é destinada ao cliente.'); return; }
    try {
      await criarAgendamento({ id_cliente: sessao.id, id_medico: form.id_medico, data: form.data, hora: form.hora, tipo_atendimento: form.tipo_atendimento, status: 'agendado' });
      navigate('/agendamentos');
    } catch (err) { setErro(err.response?.data?.message || err.response?.data?.error || 'Erro ao criar agendamento.'); }
  }

  return <><Navbar /><div className="container"><Card><h1>Novo Agendamento</h1><p className="muted">Escolha o profissional, data e horário.</p>{erro && <div className="alert error">{erro}</div>}
    <form onSubmit={handleSubmit} className="form">
      <label>Médico</label><select name="id_medico" value={form.id_medico} onChange={handleChange} required><option value="">Selecione</option>{medicos.map((m) => <option key={m.id_usuario} value={m.id_usuario}>{m.nome} — {m.especializacao || 'Especialista'}</option>)}</select>
      <label>Tipo de atendimento</label><Input name="tipo_atendimento" value={form.tipo_atendimento} onChange={handleChange} placeholder="Ex.: avaliação facial" required />
      <label>Data</label><Input name="data" type="date" value={form.data} onChange={handleChange} required />
      <label>Hora</label><Input name="hora" type="time" value={form.hora} onChange={handleChange} required />
      <Button type="submit">Confirmar agendamento</Button>
    </form>
  </Card></div></>;
}