import { useEffect, useState } from 'react';

import { listarProcedimentos } from '../../services/procedimentoService.js';

export default function CadastroMedicoForm({ onSubmit, loading, onVoltar }) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    crm: '',
    especializacao: ''
  });

  const [procedimentos, setProcedimentos] = useState([]);
  const [procedimentosSelecionados, setProcedimentosSelecionados] = useState([]);
  const [erroProcedimentos, setErroProcedimentos] = useState('');
  const [carregandoProcedimentos, setCarregandoProcedimentos] = useState(true);

  useEffect(() => {
    async function carregarProcedimentos() {
      try {
        const dados = await listarProcedimentos();
        setProcedimentos(dados);
      } catch (error) {
        setErroProcedimentos(
          error.response?.data?.message ||
          'Não foi possível carregar os procedimentos.'
        );
      } finally {
        setCarregandoProcedimentos(false);
      }
    }

    carregarProcedimentos();
  }, []);

  function alterar(event) {
    setForm(atual => ({
      ...atual,
      [event.target.name]: event.target.value
    }));
  }

  function alterarProcedimentos(event) {
    const valores = Array.from(
      event.target.selectedOptions,
      option => Number(option.value)
    );

    setProcedimentosSelecionados(valores);
  }

  function enviar(event) {
    event.preventDefault();

    if (procedimentosSelecionados.length === 0) {
      setErroProcedimentos(
        'Selecione pelo menos um procedimento.'
      );
      return;
    }

    onSubmit({
      ...form,
      procedimentos: procedimentosSelecionados
    });
  }

  return (
    <form onSubmit={enviar} className="form grid-form">
      <div>
        <label>Nome completo</label>

        <input
          name="nome"
          className="input"
          value={form.nome}
          onChange={alterar}
          required
        />
      </div>

      <div>
        <label>E-mail</label>

        <input
          name="email"
          type="email"
          className="input"
          value={form.email}
          onChange={alterar}
          required
        />
      </div>

      <div>
        <label>CRM</label>

        <input
          name="crm"
          className="input"
          value={form.crm}
          onChange={alterar}
          required
        />
      </div>

      <div>
        <label>Especialização</label>

        <input
          name="especializacao"
          className="input"
          value={form.especializacao}
          onChange={alterar}
          required
        />
      </div>

      <div className="full">
        <label>Procedimentos realizados</label>

        {erroProcedimentos && (
          <div className="alert error">
            {erroProcedimentos}
          </div>
        )}

        {carregandoProcedimentos ? (
          <p className="muted">
            Carregando procedimentos...
          </p>
        ) : (
          <select
            className="input"
            multiple
            value={procedimentosSelecionados.map(String)}
            onChange={alterarProcedimentos}
            required
          >
            {procedimentos.map(procedimento => (
              <option
                key={procedimento.id_procedimento}
                value={procedimento.id_procedimento}
              >
                {procedimento.nome}
              </option>
            ))}
          </select>
        )}

        <small className="muted">
          Segure Ctrl ou Command para selecionar mais de um procedimento.
        </small>
      </div>

      <div className="full">
        <label>Senha</label>

        <input
          name="senha"
          type="password"
          className="input"
          value={form.senha}
          onChange={alterar}
          minLength={6}
          required
        />
      </div>

      <button
        className="btn"
        disabled={loading || carregandoProcedimentos}
      >
        {loading ? 'Cadastrando...' : 'Cadastrar médico'}
      </button>

      <button
        type="button"
        className="btn-link"
        onClick={onVoltar}
      >
        Já tenho cadastro
      </button>
    </form>
  );
}