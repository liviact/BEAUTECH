import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Navbar from '../components/layout/navbar.jsx';
import Card from '../components/shared/card.jsx';
import Input from '../components/shared/input.jsx';
import Button from '../components/shared/button.jsx';

import {
  buscarAgendamento,
  reagendarAgendamento
} from '../services/agendamentoService.js';

import { obterUsuario } from '../storage/usuario.storage.js';

function formatarData(data) {
  if (!data) return '';
  const texto = String(data).slice(0, 10);
  const [ano, mes, dia] = texto.split('-');
  return `${dia}/${mes}/${ano}`;
}

function formatarHora(hora) {
  return String(hora || '').slice(0, 5);
}

function dataHoje() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export default function ReagendarAgendamento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sessao = obterUsuario() || {};

  const [agendamento, setAgendamento] = useState(null);
  const [form, setForm] = useState({ data: '', hora: '' });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        const dados = await buscarAgendamento(id);

        if (sessao.tipo !== 'cliente') {
          setErro('Somente clientes podem reagendar consultas.');
          return;
        }

        setAgendamento(dados);
        setForm({
          data: String(dados.data).slice(0, 10),
          hora: formatarHora(dados.hora)
        });
      } catch (err) {
        setErro(
          err.response?.data?.message ||
          'Não foi possível carregar o agendamento.'
        );
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [id, sessao.tipo]);

  function handleChange(e) {
    setForm(atual => ({
      ...atual,
      [e.target.name]: e.target.value
    }));
    setErro('');
    setSucesso('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!form.data || !form.hora) {
      setErro('Informe a nova data e o novo horário.');
      return;
    }

    try {
      setSalvando(true);

      await reagendarAgendamento(id, {
        data: form.data,
        hora: form.hora
      });

      setSucesso('Consulta reagendada com sucesso.');

      setTimeout(() => {
        navigate('/agendamentos');
      }, 900);
    } catch (err) {
      setErro(
        err.response?.data?.message ||
        'Não foi possível reagendar a consulta.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="container reschedule-page">
        <div className="page-header">
          <div>
            <span className="eyebrow">BEAUTECH</span>
            <h1>Reagendar consulta</h1>
            <p className="muted">
              Escolha uma nova data e um novo horário para seu atendimento.
            </p>
          </div>
          <button type="button" className="btn-secondary page-back-button" onClick={() => navigate('/agendamentos')}>← Voltar aos agendamentos</button>
        </div>

        {erro && <div className="alert error">{erro}</div>}
        {sucesso && <div className="alert success">{sucesso}</div>}

        {carregando ? (
          <Card>
            <p>Carregando dados da consulta...</p>
          </Card>
        ) : agendamento ? (
          <div className="reschedule-layout">
            <Card className="appointment-summary">
              <span className="doctor-label">CONSULTA ATUAL</span>
              <h2>{agendamento.procedimento || agendamento.tipo_atendimento}</h2>

              <div className="appointment-summary-row">
                <span>📅</span>
                <div>
                  <small>Data atual</small>
                  <strong>{formatarData(agendamento.data)}</strong>
                </div>
              </div>

              <div className="appointment-summary-row">
                <span>🕐</span>
                <div>
                  <small>Horário atual</small>
                  <strong>{formatarHora(agendamento.hora)}</strong>
                </div>
              </div>

              <div className="appointment-summary-row">
                <span>👨‍⚕️</span>
                <div>
                  <small>Médico</small>
                  <strong>{agendamento.medico || 'Profissional BEAUTECH'}</strong>
                </div>
              </div>
            </Card>

            <Card>
              <h2>Escolha o novo horário</h2>
              <p className="muted">
                A nova data e horário serão validados conforme o funcionamento
                da clínica e a disponibilidade do médico.
              </p>

              <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="data">Nova data</label>
                <Input
                  id="data"
                  name="data"
                  type="date"
                  min={dataHoje()}
                  value={form.data}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="hora">Novo horário</label>
                <Input
                  id="hora"
                  name="hora"
                  type="time"
                  value={form.hora}
                  onChange={handleChange}
                  required
                />

                <div className="reschedule-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => navigate('/agendamentos')}
                    disabled={salvando}
                  >
                    Voltar
                  </button>

                  <Button type="submit" disabled={salvando}>
                    {salvando ? 'Salvando...' : 'Confirmar reagendamento'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        ) : null}
      </main>
    </>
  );
}
