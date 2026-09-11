import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { cadastrar, login } from '../services/authService.js';
import { salvarSessao } from '../storage/usuario.storage.js';

const inicial = {
  nome: '', email: '', senha: '', cpf: '', telefone: '',
  data_nascimento: '', endereco: '', tipo_pele: '', crm: '', especializacao: '', foto: null
};

function mascaraCpf(valor) {
  return valor.replace(/\D/g, '').slice(0, 11);
}

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [modo, setModo] = useState(searchParams.get('modo') === 'cadastro' ? 'cadastro' : 'login');
  const [tipo, setTipo] = useState(searchParams.get('tipo') === 'medico' ? 'medico' : 'cliente');
  const [form, setForm] = useState(inicial);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [preview, setPreview] = useState('');

  function trocarModo(novoModo) {
    setModo(novoModo);
    setErro('');
  }

  function trocarTipo(novoTipo) {
    setTipo(novoTipo);
    setErro('');
  }

  function alterar(e) {
    const { name, value, files } = e.target;
    if (name === 'foto') {
      const arquivo = files?.[0] || null;
      setForm((atual) => ({ ...atual, foto: arquivo }));
      setPreview(arquivo ? URL.createObjectURL(arquivo) : '');
      return;
    }
    setForm((atual) => ({
      ...atual,
      [name]: name === 'cpf' ? mascaraCpf(value) : value
    }));
  }

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      if (modo === 'login') {
        const resposta = await login({
          email: form.email,
          senha: form.senha,
          nivel_acesso: tipo
        });
        salvarSessao(resposta);
        navigate('/dashboard');
      } else {
        if (!form.foto) throw new Error('Selecione uma foto de perfil.');
        const resposta = await cadastrar({
          ...form,
          cpf: form.cpf.replace(/\D/g, ''),
          nivel_acesso: tipo
        });
        salvarSessao(resposta);
        navigate('/dashboard');
      }
    } catch (err) {
      setErro(err.response?.data?.message || err.message || 'Não foi possível concluir a operação.');
    } finally {
      setCarregando(false);
    }
  }

  const cadastro = modo === 'cadastro';

  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <div className="brand">
          <strong>BEAUTECH</strong>
          <span>Clínica de estética</span>
        </div>

        <div className="auth-title">
          <span className="eyebrow">ACESSO DIGITAL</span>
          <h1>{cadastro ? 'Crie sua conta' : 'Bem-vindo de volta'}</h1>
          <p>{cadastro ? 'Cadastre seus dados para utilizar a plataforma.' : 'Entre para acessar sua área da BEAUTECH.'}</p>
        </div>

        <div className="role-switch" aria-label="Tipo de acesso">
          <button className={tipo === 'cliente' ? 'active' : ''} onClick={() => trocarTipo('cliente')} type="button">Cliente</button>
          <button className={tipo === 'medico' ? 'active' : ''} onClick={() => trocarTipo('medico')} type="button">Médico</button>
        </div>

        <div className="mode-switch">
          <button className={modo === 'login' ? 'active' : ''} onClick={() => trocarModo('login')} type="button">Entrar</button>
          <button className={modo === 'cadastro' ? 'active' : ''} onClick={() => trocarModo('cadastro')} type="button">Cadastrar</button>
        </div>

        {erro && <div className="alert error">{erro}</div>}

        <form onSubmit={enviar} className="form auth-form">
          {cadastro ? (
            <>
              <div className="photo-upload">
                <div className="photo-preview">
                  {preview ? <img src={preview} alt="Pré-visualização" /> : <span>Foto</span>}
                </div>
                <div>
                  <label htmlFor="foto">Foto de perfil *</label>
                  <input id="foto" name="foto" type="file" accept="image/png,image/jpeg,image/webp" onChange={alterar} required />
                  <small>PNG, JPG ou WEBP. Máximo de 5 MB.</small>
                </div>
              </div>

              <div className="grid-form">
                <div><label>Nome completo *</label><input className="input" name="nome" value={form.nome} onChange={alterar} required /></div>
                <div><label>E-mail *</label><input className="input" name="email" type="email" value={form.email} onChange={alterar} required /></div>
                <div><label>CPF *</label><input className="input" name="cpf" value={form.cpf} onChange={alterar} inputMode="numeric" maxLength={11} required /></div>
                <div><label>Telefone *</label><input className="input" name="telefone" value={form.telefone} onChange={alterar} required /></div>
                <div><label>Data de nascimento *</label><input className="input" name="data_nascimento" type="date" value={form.data_nascimento} onChange={alterar} required /></div>
                <div><label>Senha *</label><input className="input" name="senha" type="password" minLength={6} value={form.senha} onChange={alterar} required /></div>
                <div className="full"><label>Endereço *</label><input className="input" name="endereco" value={form.endereco} onChange={alterar} required /></div>

                {tipo === 'cliente' ? (
                  <div className="full"><label>Tipo de pele</label><input className="input" name="tipo_pele" value={form.tipo_pele} onChange={alterar} placeholder="Ex.: seca, oleosa, mista..." /></div>
                ) : (
                  <>
                    <div><label>CRM *</label><input className="input" name="crm" value={form.crm} onChange={alterar} required /></div>
                    <div><label>Especialização *</label><input className="input" name="especializacao" value={form.especializacao} onChange={alterar} required /></div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <label>E-mail</label>
              <input className="input" name="email" type="email" value={form.email} onChange={alterar} placeholder="seuemail@email.com" required />
              <label>Senha</label>
              <input className="input" name="senha" type="password" value={form.senha} onChange={alterar} placeholder="Sua senha" required />
            </>
          )}

          <button className="btn" type="submit" disabled={carregando}>
            {carregando ? 'Aguarde...' : cadastro ? `Cadastrar como ${tipo}` : `Entrar como ${tipo}`}
          </button>
        </form>

        <button type="button" className="catalog-link" onClick={() => navigate('/medicos')}>
          Conheça nossos médicos →
        </button>
      </section>
    </main>
  );
}
