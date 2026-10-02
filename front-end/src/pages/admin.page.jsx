import { useEffect, useState } from 'react';
import Navbar from '../components/layout/navbar.jsx';
import { api } from '../services/api.js';
import EnderecoFields from '../components/shared/EnderecoFields.jsx';
import { buscarFuncionamento, atualizarFuncionamento } from '../services/configuracaoService.js';

const inicial = { nome:'', email:'', senha:'', cpf:'', telefone:'', data_nascimento:'', cep:'', logradouro:'', numero:'', complemento:'', bairro:'', cidade:'', uf:'', crm:'', especializacao:'', foto:null };

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState([]); const [form, setForm] = useState(inicial); const [erro,setErro]=useState(''); const [ok,setOk]=useState(''); const [carregando,setCarregando]=useState(false);
  const [funcionamento,setFuncionamento]=useState({hora_abertura:'07:00',hora_fechamento:'18:00'}); const [salvandoHorario,setSalvandoHorario]=useState(false);

  async function carregar(){ try { const {data}=await api.get('/admin/usuarios'); setUsuarios(data); } catch(e){ setErro(e.response?.data?.message || 'Não foi possível carregar.'); } }
  useEffect(()=>{carregar(); buscarFuncionamento().then(setFuncionamento).catch(()=>{});},[]);
  function alterar(e){ const {name,value,files}=e.target; setForm(f=>({...f,[name]:name==='foto'?(files?.[0]||null):value})); }
  async function criar(e){ e.preventDefault(); setErro(''); setOk(''); setCarregando(true); try { const fd=new FormData(); Object.entries(form).forEach(([k,v])=>{if(v!==null&&v!=='')fd.append(k,v)}); await api.post('/admin/medicos',fd); setOk('Médico cadastrado.'); setForm(inicial); await carregar(); } catch(e){setErro(e.response?.data?.message||'Não foi possível cadastrar.')} finally{setCarregando(false)} }
  async function ativo(id, valor){ try{await api.patch(`/admin/usuarios/${id}/ativo`,{ativo:!valor}); carregar();}catch(e){setErro(e.response?.data?.message||'Não foi possível alterar.')} }
  const medicos=usuarios.filter(u=>u.nivel_acesso==='medico'), clientes=usuarios.filter(u=>u.nivel_acesso==='cliente');
  return <><Navbar/><main className="container admin-page"><section className="hero admin-hero"><span className="eyebrow">ADMINISTRAÇÃO</span><h1>Painel</h1><p>Gerencie médicos e usuários autorizados no sistema.</p></section>
    <section className="card admin-hours-card">
      <div className="section-heading"><div><span className="eyebrow">FUNCIONAMENTO</span><h2>Horário da clínica</h2></div></div>
      <p className="muted">Os horários dos agendamentos são gerados automaticamente de 1 em 1 hora dentro deste período.</p>
      <form className="admin-hours-form" onSubmit={async(e)=>{e.preventDefault();setSalvandoHorario(true);setErro('');setOk('');try{const r=await atualizarFuncionamento(funcionamento);setFuncionamento(r.configuracao);setOk('Horário de funcionamento atualizado.');}catch(err){setErro(err.response?.data?.message||'Não foi possível atualizar o horário.')}finally{setSalvandoHorario(false)}}}>
        <div><label>Abertura</label><input className="input" type="time" value={funcionamento.hora_abertura} onChange={e=>setFuncionamento(f=>({...f,hora_abertura:e.target.value}))} required/></div>
        <div><label>Fechamento</label><input className="input" type="time" value={funcionamento.hora_fechamento} onChange={e=>setFuncionamento(f=>({...f,hora_fechamento:e.target.value}))} required/></div>
        <button className="btn" disabled={salvandoHorario}>{salvandoHorario?'Salvando...':'Salvar horário'}</button>
      </form>
    </section>
    <section className="admin-grid">
      <div className="card admin-form-card"><div className="section-heading"><div><span className="eyebrow">EQUIPE</span><h2>Novo médico</h2></div></div>{erro&&<div className="alert error">{erro}</div>}{ok&&<div className="alert success">{ok}</div>}
        <form className="form" onSubmit={criar}><div className="grid-form"><div><label>Nome *</label><input className="input" name="nome" value={form.nome} onChange={alterar} required/></div><div><label>E-mail *</label><input className="input" name="email" type="email" value={form.email} onChange={alterar} required/></div><div><label>CPF *</label><input className="input" name="cpf" value={form.cpf} onChange={alterar} required/></div><div><label>Telefone *</label><input className="input" name="telefone" value={form.telefone} onChange={alterar} required/></div><div><label>Nascimento *</label><input className="input" name="data_nascimento" type="date" value={form.data_nascimento} onChange={alterar} required/></div><div><label>Senha *</label><input className="input" name="senha" type="password" value={form.senha} onChange={alterar} minLength={6} required/></div><div><label>CRM *</label><input className="input" name="crm" value={form.crm} onChange={alterar} required/></div><div><label>Especialização *</label><input className="input" name="especializacao" value={form.especializacao} onChange={alterar} required/></div><EnderecoFields form={form} setForm={setForm} /><div className="full"><label>Foto *</label><input className="input" name="foto" type="file" accept="image/png,image/jpeg,image/webp" onChange={alterar} required/></div></div><button className="btn" disabled={carregando}>{carregando?'Aguarde':'Salvar'}</button></form>
      </div>
      <div className="card admin-summary"><h2>Resumo</h2><div className="admin-stats"><strong>{medicos.length}<span>Médicos</span></strong><strong>{clientes.length}<span>Clientes</span></strong></div><p className="muted">O cadastro público cria somente clientes. Médicos são criados por este painel.</p></div>
    </section>
    <section className="card admin-list"><div className="section-heading"><div><span className="eyebrow">USUÁRIOS</span><h2>Contas</h2></div></div><div className="admin-users">{usuarios.map(u=><article className="admin-user" key={u.id_usuario}><div><strong>{u.nome}</strong><span>{u.email}</span><small>{u.nivel_acesso} • {u.ativo?'Ativo':'Inativo'}</small></div>{u.nivel_acesso!=='admin'&&<button className={u.ativo?'btn-danger-small':'btn-secondary'} onClick={()=>ativo(u.id_usuario,u.ativo)}>{u.ativo?'Inativar':'Ativar'}</button>}</article>)}</div></section>
  </main></>;
}
