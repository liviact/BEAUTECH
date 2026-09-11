import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Navbar from '../components/layout/navbar.jsx';
import Card from '../components/shared/card.jsx';
import Input from '../components/shared/input.jsx';
import Button from '../components/shared/button.jsx';

import {
  criarAgendamento
} from '../services/agendamentoService.js';

import {
  listarMedicos
} from '../services/medicoService.js';

import {
  listarProcedimentosMedico
} from '../services/medicoService.js';

import {
  obterUsuario
} from '../storage/usuario.storage.js';

export default function NovoAgendamento() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessao = obterUsuario() || {};
  const medicoSelecionado = searchParams.get('medico') || '';

  const [medicos, setMedicos] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [erro, setErro] = useState('');

  const [form, setForm] = useState({
    id_medico: medicoSelecionado,
    id_procedimento: '',
    data: '',
    hora: ''
  });

  useEffect(() => {
    if (medicoSelecionado) {
      setForm(atual => ({ ...atual, id_medico: medicoSelecionado }));
    }
  }, [medicoSelecionado]);

  // Carrega os médicos
  useEffect(() => {

    listarMedicos()
      .then(setMedicos)
      .catch(err =>
        setErro(
          err.response?.data?.message ||
          'Não foi possível carregar os médicos.'
        )
      );

  }, []);

  // Carrega somente os procedimentos vinculados ao médico selecionado
  useEffect(() => {
    setProcedimentos([]);
    setForm((atual) => ({ ...atual, id_procedimento: '' }));

    if (!form.id_medico) return;

    listarProcedimentosMedico(form.id_medico)
      .then(setProcedimentos)
      .catch(err =>
        setErro(
          err.response?.data?.message ||
          'Não foi possível carregar os procedimentos deste médico.'
        )
      );
  }, [form.id_medico]);

  function handleChange(e) {

    setForm(atual => ({
      ...atual,
      [e.target.name]: e.target.value
    }));

  }

  async function handleSubmit(e) {

    e.preventDefault();
    setErro('');

    if (sessao.tipo !== 'cliente') {
      setErro(
        'A criação de agendamentos é destinada ao cliente.'
      );
      return;
    }

    try {

      await criarAgendamento({
        id_cliente: sessao.id,
        id_medico: form.id_medico,
        id_procedimento: form.id_procedimento,
        data: form.data,
        hora: form.hora
      });

      navigate('/agendamentos');

    } catch (err) {

      setErro(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Erro ao criar agendamento.'
      );

    }
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="page-header">
          <div>
            <span className="eyebrow">BEAUTECH</span>
            <h1>Novo Agendamento</h1>
            <p className="muted">
              Escolha o profissional, procedimento, data e horário.
            </p>
          </div>
          <button type="button" className="btn-secondary page-back-button" onClick={() => navigate('/agendamentos')}>← Voltar aos agendamentos</button>
        </div>

        <Card>

          {erro && (
            <div className="alert error">
              {erro}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="form"
          >

            <label>Médico</label>

            {medicoSelecionado && (
              <div className="selected-doctor-hint">
                Médico selecionado no catálogo. Você pode trocar se desejar.
              </div>
            )}

            <select
              name="id_medico"
              value={form.id_medico}
              onChange={handleChange}
              required
            >

              <option value="">
                Selecione
              </option>

              {medicos.map(m => (

                <option
                  key={m.id_usuario}
                  value={m.id_usuario}
                >
                  {m.nome} — {m.especializacao || 'Especialista'}
                </option>

              ))}

            </select>

            <label>Procedimento</label>

            <select
              name="id_procedimento"
              value={form.id_procedimento}
              onChange={handleChange}
              disabled={!form.id_medico || procedimentos.length === 0}
              required
            >

              <option value="">
                {!form.id_medico
                  ? 'Selecione um médico primeiro'
                  : procedimentos.length > 0
                    ? 'Selecione'
                    : 'Este médico ainda não possui procedimentos'}
              </option>

              {procedimentos.map(p => (

                <option
                  key={p.id_procedimento}
                  value={p.id_procedimento}
                >
                  {p.nome}
                </option>

              ))}

            </select>

            <label>Data</label>

            <Input
              name="data"
              type="date"
              value={form.data}
              onChange={handleChange}
              required
            />

            <label>Hora</label>

            <Input
              name="hora"
              type="time"
              value={form.hora}
              onChange={handleChange}
              required
            />

            <Button type="submit">
              Confirmar agendamento
            </Button>

          </form>

        </Card>
      </div>
    </>
  );
}