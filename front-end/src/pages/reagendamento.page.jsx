import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Navbar from '../components/layout/navbar.jsx';
import Input from '../components/shared/input.jsx';
import Button from '../components/shared/button.jsx';
import Card from '../components/shared/card.jsx';

import {
  reagendarAgendamento,
  listarAgendamentos
} from '../services/agendamentoService.js';

import { obterUsuario } from '../storage/usuario.storage.js';

function formatarData(data) {
  if (!data) return '';

  return String(data).slice(0, 10);
}

function formatarHora(hora) {
  if (!hora) return '';

  return String(hora).slice(0, 5);
}

function obterDataMinima() {
  const data = new Date();

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

export default function Reagendamento() {
  const navigate = useNavigate();
  const { id } = useParams();
  const sessao = obterUsuario() || {};

  const [agendamento, setAgendamento] = useState(null);

  const [form, setForm] = useState({
    data: '',
    hora: ''
  });

  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!sessao.id || sessao.tipo !== 'cliente') {
      navigate('/agendamentos', { replace: true });
      return;
    }

    async function carregarAgendamento() {
      try {
        const dados = await listarAgendamentos();

        const encontrado = dados.find(
          item =>
            Number(item.id_agendamento) === Number(id) &&
            Number(item.id_cliente) === Number(sessao.id)
        );

        if (!encontrado) {
          setErro('Agendamento não encontrado.');
          return;
        }

        if (!['pendente', 'aceito'].includes(encontrado.status)) {
          setErro('Essa consulta não pode ser reagendada.');
          return;
        }

        setAgendamento(encontrado);

        setForm({
          data: formatarData(encontrado.data),
          hora: formatarHora(encontrado.hora)
        });
      } catch (err) {
        setErro(
          err.response?.data?.message ||
          'Erro ao carregar o agendamento.'
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarAgendamento();
  }, [id, sessao.id, sessao.tipo, navigate]);

  function handleChange(e) {
    setForm(atual => ({
      ...atual,
      [e.target.name]: e.target.value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErro('');
    setMensagem('');
    setSalvando(true);

    try {
      await reagendarAgendamento(id, {
        data: form.data,
        hora: form.hora
      });

      setMensagem('Consulta reagendada com sucesso!');

      setTimeout(() => {
        navigate('/agendamentos');
      }, 700);
    } catch (err) {
      setErro(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Não foi possível reagendar a consulta.'
      );
    } finally {
      setSalvando(false);
    }
  }

  if (sessao.tipo !== 'cliente') {
    return null;
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="page-header">
          <div>
            <h1>Reagendar Consulta</h1>

            <p className="muted">
              Escolha uma nova data e horário para sua consulta.
            </p>
          </div>
        </div>

        <Card>
          {mensagem && (
            <div className="alert success">
              {mensagem}
            </div>
          )}

          {erro && (
            <div className="alert error">
              {erro}
            </div>
          )}

          {carregando ? (
            <p className="muted">
              Carregando agendamento...
            </p>
          ) : agendamento && !erro ? (
            <form onSubmit={handleSubmit} className="form">
              <p>
                <strong>Médico:</strong>{' '}
                {agendamento.medico}
              </p>

              <p>
                <strong>Procedimento:</strong>{' '}
                {agendamento.procedimento || agendamento.tipo_atendimento}
              </p>

              <label htmlFor="data">
                Nova data
              </label>

              <Input
                id="data"
                name="data"
                type="date"
                value={form.data}
                min={obterDataMinima()}
                onChange={handleChange}
                required
              />

              <label htmlFor="hora">
                Novo horário
              </label>

              <Input
                id="hora"
                name="hora"
                type="time"
                value={form.hora}
                min="07:00"
                max="17:00"
                onChange={handleChange}
                required
              />

              <Button type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Confirmar reagendamento'}
              </Button>

              <button
                type="button"
                className="btn-link btn-cancelar"
                onClick={() => navigate('/agendamentos')}
              >
                Cancelar
              </button>
            </form>
          ) : null}
        </Card>
      </div>
    </>
  );
}