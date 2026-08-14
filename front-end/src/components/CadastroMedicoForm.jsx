import { useState } from 'react';

export default function CadastroMedicoForm({ onSubmit, loading, onVoltar }) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    crm: '',
    especializacao: '',
  });

  function alterar(event) {
    const { name, value } = event.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  function enviar(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={enviar}>
      <div className="mb-3">
        <label className="form-label">Nome completo</label>
        <input name="nome" className="form-control" value={form.nome} onChange={alterar} required />
      </div>

      <div className="mb-3">
        <label className="form-label">E-mail</label>
        <input name="email" type="email" className="form-control" value={form.email} onChange={alterar} required />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">CRM</label>
          <input name="crm" className="form-control" value={form.crm} onChange={alterar} required />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Especialização</label>
          <input name="especializacao" className="form-control" value={form.especializacao} onChange={alterar} required />
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label">Senha</label>
        <input name="senha" type="password" className="form-control" value={form.senha} onChange={alterar} minLength="6" required />
      </div>

      <button className="btn btn-primary w-100" disabled={loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar médico'}
      </button>

      <button type="button" className="btn btn-link w-100 mt-2" onClick={onVoltar}>
        Já tenho cadastro
      </button>
    </form>
  );
}
