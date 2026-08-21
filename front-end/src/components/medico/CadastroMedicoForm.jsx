import { useState } from 'react';

export default function CadastroMedicoForm({ onSubmit, loading, onVoltar }) {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', crm: '', especializacao: '' });
  function alterar(event) { setForm((atual) => ({ ...atual, [event.target.name]: event.target.value })); }
  function enviar(event) { event.preventDefault(); onSubmit(form); }

  return <form onSubmit={enviar} className="form grid-form">
    <div><label>Nome completo</label><input name="nome" className="input" value={form.nome} onChange={alterar} required /></div>
    <div><label>E-mail</label><input name="email" type="email" className="input" value={form.email} onChange={alterar} required /></div>
    <div><label>CRM</label><input name="crm" className="input" value={form.crm} onChange={alterar} required /></div>
    <div><label>Especialização</label><input name="especializacao" className="input" value={form.especializacao} onChange={alterar} required /></div>
    <div className="full"><label>Senha</label><input name="senha" type="password" className="input" value={form.senha} onChange={alterar} minLength={6} required /></div>
    <button className="btn" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar médico'}</button>
    <button type="button" className="btn-link" onClick={onVoltar}>Já tenho cadastro</button>
  </form>;
}
