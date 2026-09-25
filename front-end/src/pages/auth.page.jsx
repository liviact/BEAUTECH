import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import { cadastrar, login } from '../services/authService.js';
import { salvarSessao } from '../storage/usuario.storage.js';

const inicial = { nome: '', email: '', senha: '', cpf: '', telefone: '', data_nascimento: '', endereco: '', tipo_pele: '', foto: null };

function mascaraCpf(valor) { return valor.replace(/\D/g, '').slice(0, 11); }

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [modo, setModo] = useState(searchParams.get('modo') === 'cadastro' ? 'cadastro' : 'login');
  const [form, setForm] = useState(inicial);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [preview, setPreview] = useState('');

  function alterar(e) {
    const { name, value, files } = e.target;
    if (name === 'foto') {
      const arquivo = files?.[0] || null;
      setForm((atual) => ({ ...atual, foto: arquivo }));
      setPreview(arquivo ? URL.createObjectURL(arquivo) : '');
      return;
    }
    setForm((atual) => ({ ...atual, [name]: name === 'cpf' ? mascaraCpf(value) : value }));
  }

  async function enviar(e) {
    e.preventDefault(); setErro(''); setCarregando(true);
    try {
      if (modo === 'login') {
        const resposta = await login({ email: form.email, senha: form.senha });
        salvarSessao(resposta);
        navigate(resposta.usuario?.tipo === 'admin' ? '/admin' : '/dashboard');
      } else {
        if (!form.foto) throw new Error('Selecione uma foto.');
        const resposta = await cadastrar({ ...form, cpf: form.cpf.replace(/\D/g, ''), nivel_acesso: 'cliente' });
        salvarSessao(resposta); navigate('/dashboard');
      }
    } catch (err) {
      setErro(err.response?.data?.message || err.message || 'Não foi possível concluir.');
    } finally { setCarregando(false); }
  }

  const cadastro = modo === 'cadastro';
  return (
    <>
      <Navbar publicOnly />
      <main className="auth-page">
        <section className="auth-panel">
          <div className="brand"><strong>BEAUTECH</strong><span>{cadastro ? 'Cadastro de cliente' : 'Acesso'}</span></div>
          <div className="mode-switch">
            <button type="button" className={!cadastro ? 'active' : ''} onClick={() => { setModo('login'); setErro(''); }}>Entrar</button>
            <button type="button" className={cadastro ? 'active' : ''} onClick={() => { setModo('cadastro'); setErro(''); }}>Cadastrar</button>
          </div>
          <div className="auth-title"><span className="eyebrow">{cadastro ? 'NOVA CONTA' : 'BEM-VINDO'}</span><h1>{cadastro ? 'Crie sua conta' : 'Entre na BEAUTECH'}</h1><p>{cadastro ? 'Cadastre-se para cuidar da sua pele com mais praticidade.' : 'Use seu e-mail e senha para acessar sua área.'}</p></div>
          {erro && <div className="alert error">{erro}</div>}
          <form onSubmit={enviar} className="form auth-form">
            {cadastro ? <>
              <div className="photo-upload"><div className="photo-preview">{preview ? <img src={preview} alt="Prévia" /> : <span>Foto</span>}</div><div><label htmlFor="foto">Foto *</label><input id="foto" name="foto" type="file" accept="image/png,image/jpeg,image/webp" onChange={alterar} required /></div></div>
              <div className="grid-form">
                <div><label>Nome *</label><input className="input" name="nome" value={form.nome} onChange={alterar} required /></div>
                <div><label>E-mail *</label><input className="input" name="email" type="email" value={form.email} onChange={alterar} required /></div>
                <div><label>CPF *</label><input className="input" name="cpf" value={form.cpf} onChange={alterar} maxLength={11} required /></div>
                <div><label>Telefone *</label><input className="input" name="telefone" value={form.telefone} onChange={alterar} required /></div>
                <div><label>Nascimento *</label><input className="input" name="data_nascimento" type="date" value={form.data_nascimento} onChange={alterar} required /></div>
                <div><label>Senha *</label><input className="input" name="senha" type="password" minLength={6} value={form.senha} onChange={alterar} required /></div>
                <div className="full"><label>Endereço *</label><input className="input" name="endereco" value={form.endereco} onChange={alterar} required /></div>
                <div className="full"><label>Tipo de pele</label><input className="input" name="tipo_pele" value={form.tipo_pele} onChange={alterar} /></div>
              </div>
            </> : <>
              <label>E-mail</label><input className="input" name="email" type="email" value={form.email} onChange={alterar} required />
              <label>Senha</label><input className="input" name="senha" type="password" value={form.senha} onChange={alterar} required />
            </>}
            <button className="btn" type="submit" disabled={carregando}>{carregando ? 'Aguarde' : cadastro ? 'Cadastrar' : 'Entrar'}</button>
          </form>
          <Link to="/" className="auth-home-link">Início</Link>
        </section>
      </main>
    </>
  );
}
