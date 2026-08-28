import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import Card from '../components/shared/card.jsx';
import Input from '../components/shared/input.jsx';
import Button from '../components/shared/button.jsx';
import { criarAgendamento, listarMedicos } from '../services/agendamentoService.js';
import { listarProcedimentosMedico } from '../services/medicoService.js';
import { obterUsuario } from '../storage/usuario.storage.js';

export default function NovoAgendamento() {
  const navigate = useNavigate();
  const sessao = obterUsuario() || {};
  const [medicos, setMedicos] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [form, setForm] = useState({
    id_medico: '',
    id_procedimento: '',
    data: '',
    hora: ''
  });

  const [erro, setErro] = useState('');

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

  // Carrega os procedimentos do médico
  useEffect(() => {

    if (!form.id_medico) {
      setProcedimentos([]);
      return;
    }

    listarProcedimentosMedico(form.id_medico)
      .then(setProcedimentos)
      .catch(err =>
        setErro(
          err.response?.data?.message ||
          'Não foi possível carregar os procedimentos.'
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

    if (sessao.tipo !== 'cliente') {setErro('A criação de agendamentos é destinada ao cliente.');
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

        <Card>

          <h1>Novo Agendamento</h1>

          <p className="muted">
            Escolha o profissional, procedimento, data e horário.
          </p>

          {erro && (
            <div className="alert error">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form">

            <label>Médico</label>

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

                <option key={m.id_usuario}value={m.id_usuario}>
                  {m.nome} — {m.especializacao || 'Especialista'}
                </option>

              ))}

            </select>

            <label>Procedimento</label>
{/*O campo fica desabilitado enquanto nenhum médico estiver selecionado*/}
            <select
              name="id_procedimento"
              value={form.id_procedimento}
              onChange={handleChange}
              disabled={!form.id_medico}
              required
            >

              <option value="">
                {form.id_medico
                  ? 'Selecione'
                  : 'Selecione primeiro o médico'}
              </option>

{/* Mostra somente os procedimentos retornados para o médico selecionado */}
              {procedimentos.map(p => ( 
                <option key={p.id_procedimento} value={p.id_procedimento}>
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
            <Button type="submit">Confirmar agendamento</Button>
          </form>
        </Card>
      </div>
    </>
  );
}