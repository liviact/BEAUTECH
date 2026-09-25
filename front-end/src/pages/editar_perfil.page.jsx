import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import Card from '../components/shared/card.jsx';
import { obterUsuario } from '../storage/usuario.storage.js';
import { buscarCliente, atualizarCliente } from '../services/clienteService.js';
import { buscarMedico, atualizarMedico } from '../services/medicoService.js';

export default function EditarPerfil() {
  const navigate = useNavigate();
  const sessao = obterUsuario() || {};
  const medico = sessao.tipo === 'medico';
  const [form, setForm] = useState({ nome:'', email:'', cpf:'', telefone:'', data_nascimento:'', endereco:'', tipo_pele:'', crm:'', especializacao:'', foto:null });
  const [preview, setPreview] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!sessao.id) { navigate('/', { replace: true }); return; }
    const carregar = async () => {
      try {
        const dados = medico ? await buscarMedico(sessao.id) : await buscarCliente(sessao.id);
        setForm({
          nome: dados.nome || '', email: dados.email || '', cpf: dados.cpf || '', telefone: dados.telefone || '',
          data_nascimento: dados.data_nascimento ? String(dados.data_nascimento).slice(0,10) : '',
          endereco: dados.endereco || '', tipo_pele: dados.tipo_pele || '', crm: dados.crm || '', especializacao: dados.especializacao || '', foto: null
        });
      } catch (err) { setErro(err.response?.data?.message || 'Erro ao carregar o perfil.'); }
      finally { setCarregando(false); }
    };
    carregar();
  }, [sessao.id, medico, navigate]);

  function alterar(e) {
    const { name, value, files } = e.target;
    if (name === 'foto') {
      const arquivo = files?.[0] || null;
      setForm((atual) => ({ ...atual, foto: arquivo }));
      if (arquivo) setPreview(URL.createObjectURL(arquivo));
    } else {
      setForm((atual) => ({ ...atual, [name]: name === 'cpf' ? value.replace(/\D/g,'') : value }));
    }
  }

  async function enviar(e) {
    e.preventDefault(); setErro(''); setMensagem(''); setSalvando(true);
    try {
      const dados = { ...form, cpf: form.cpf.replace(/\D/g,'') };
      if (medico) await atualizarMedico(sessao.id, dados);
      else await atualizarCliente(sessao.id, dados);
      setMensagem('Perfil atualizado com sucesso!');
      setTimeout(() => navigate('/perfil'), 700);
    } catch (err) { setErro(err.response?.data?.message || err.response?.data?.error || 'Erro ao atualizar perfil.'); }
    finally { setSalvando(false); }
  }

  if (carregando) return <><Navbar /><div className="container"><Card><p>Carregando seus dados...</p></Card></div></>;

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <div>
            <span className="eyebrow">MINHA CONTA</span>
            <h1>Editar Perfil</h1>
            <p className="muted">Atualize seus dados pessoais.</p>
          </div>
          <button type="button" className="btn-secondary page-back-button" onClick={() => navigate('/perfil')}>← Voltar ao perfil</button>
        </div>
        <Card>
          {mensagem && <div className="alert success">{mensagem}</div>}
          {erro && <div className="alert error">{erro}</div>}
          <form onSubmit={enviar} className="form grid-form">
            <div><label>Nome</label><input className="input" name="nome" value={form.nome} onChange={alterar} required /></div>
            <div><label>E-mail</label><input className="input" name="email" type="email" value={form.email} onChange={alterar} required /></div>
            <div><label>CPF</label><input className="input" name="cpf" value={form.cpf} onChange={alterar} required /></div>
            <div><label>Telefone</label><input className="input" name="telefone" value={form.telefone} onChange={alterar} required /></div>
            <div><label>Data de nascimento</label><input className="input" name="data_nascimento" type="date" value={form.data_nascimento} onChange={alterar} required /></div>
            <div><label>Nova foto de perfil</label><input className="input" name="foto" type="file" accept="image/png,image/jpeg,image/webp" onChange={alterar} /></div>
            <div className="full"><label>Endereço</label><input className="input" name="endereco" value={form.endereco} onChange={alterar} required /></div>
            {medico ? <><div><label>CRM</label><input className="input" name="crm" value={form.crm} onChange={alterar} required /></div><div><label>Especialização</label><input className="input" name="especializacao" value={form.especializacao} onChange={alterar} required /></div></> : <div className="full"><label>Tipo de pele</label><input className="input" name="tipo_pele" value={form.tipo_pele} onChange={alterar} /></div>}
            {preview && <div className="full"><img className="profile-photo edit-preview" src={preview} alt="Nova foto" /></div>}
            <button className="btn" type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar alterações'}</button>
            <button type="button" className="btn-link btn-cancelar" onClick={() => navigate('/perfil')}>Cancelar</button>
          </form>
        </Card>
      </div>
    </>
  );
}
