import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/shared/input.jsx';
import Button from '../components/shared/button.jsx';
import { cadastrarCliente } from '../services/authService.js';
import { salvarSessao } from '../storage/usuario.storage.js';

export default function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', telefone: '', cpf: '', senha: '', tipo_pele: '', endereco: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    setForm((atual) => ({ ...atual, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await cadastrarCliente({ ...form, cpf: form.cpf.replace(/\D/g, '') });
      salvarSessao(resposta.token);
      navigate('/dashboard');
    } catch (err) {
      setErro(err.response?.data?.message || err.response?.data?.error || 'Erro ao cadastrar cliente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container wide">
        <div className="brand"><strong>BEAUTECH</strong><span>Crie sua conta</span></div>
        <h1>Cadastro</h1>
        <p className="muted">Preencha seus dados para começar.</p>
        {erro && <div className="alert error">{erro}</div>}

        <form onSubmit={handleSubmit} className="form grid-form">
          <div><label>Nome</label><Input name="nome" value={form.nome} onChange={handleChange} required /></div>
          <div><label>Telefone</label><Input name="telefone" value={form.telefone} onChange={handleChange} required /></div>
          <div><label>CPF</label><Input name="cpf" value={form.cpf} onChange={handleChange} maxLength={14} required /></div>
          <div><label>Senha</label><Input name="senha" type="password" value={form.senha} onChange={handleChange} minLength={6} required /></div>
          <div><label>Tipo de pele</label><Input name="tipo_pele" value={form.tipo_pele} onChange={handleChange} placeholder="Ex.: seca, oleosa..." /></div>
          <div><label>Endereço</label><Input name="endereco" value={form.endereco} onChange={handleChange} /></div>
          <Button type="submit" disabled={carregando}>{carregando ? 'Cadastrando...' : 'Cadastrar'}</Button>
        </form>

        <p className="auth-links">Já possui conta? <Link to="/">Entrar</Link></p>
      </div>
    </div>
  );
}
