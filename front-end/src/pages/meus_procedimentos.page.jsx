import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import Card from '../components/shared/card.jsx';
import { listarProcedimentos } from '../services/procedimentoService.js';
import { listarProcedimentosMedico, adicionarProcedimentoMedico, removerProcedimentoMedico } from '../services/medicoService.js';
import { obterUsuario } from '../storage/usuario.storage.js';

export default function MeusProcedimentos(){
  const navigate=useNavigate(); const sessao=obterUsuario()||{};
  const [procedimentos,setProcedimentos]=useState([]); const [selecionados,setSelecionados]=useState({});
  const [busca,setBusca]=useState(''); const [erro,setErro]=useState(''); const [sucesso,setSucesso]=useState('');
  const [carregando,setCarregando]=useState(true); const [salvando,setSalvando]=useState(false);

  useEffect(()=>{
    if(sessao.tipo!=='medico') return;
    Promise.all([listarProcedimentos(),listarProcedimentosMedico(sessao.id)])
      .then(([todos,vinculados])=>{
        const mapa={}; vinculados.forEach(item=>{mapa[Number(item.id_procedimento)]=Number(item.preco||0).toFixed(2);});
        setProcedimentos(todos); setSelecionados(mapa);
      })
      .catch(err=>setErro(err.response?.data?.message||'Não foi possível carregar os procedimentos.'))
      .finally(()=>setCarregando(false));
  },[sessao.id,sessao.tipo]);

  function alternar(id){
    setSelecionados(atual=>{
      const novo={...atual}; if(Object.prototype.hasOwnProperty.call(novo,id)) delete novo[id]; else novo[id]='0.00'; return novo;
    });
    setErro('');setSucesso('');
  }
  function alterarPreco(id,valor){ setSelecionados(atual=>({...atual,[id]:valor.replace(',','.')})); }

  async function salvar(){
    const ids=Object.keys(selecionados).map(Number);
    for(const id of ids){ if(!Number.isFinite(Number(selecionados[id]))||Number(selecionados[id])<0){setErro('Todos os preços precisam ser válidos.');return;} }
    setSalvando(true);setErro('');setSucesso('');
    try{
      const anteriores=await listarProcedimentosMedico(sessao.id);
      const antes=new Map(anteriores.map(p=>[Number(p.id_procedimento),Number(p.preco)]));
      const promessas=[];
      for(const id of ids){
        const preco=Number(selecionados[id]).toFixed(2);
        if(!antes.has(id)||Number(antes.get(id)).toFixed(2)!==preco) promessas.push(adicionarProcedimentoMedico(sessao.id,id,preco));
      }
      for(const id of antes.keys()) if(!Object.prototype.hasOwnProperty.call(selecionados,id)) promessas.push(removerProcedimentoMedico(sessao.id,id));
      await Promise.all(promessas);
      setSucesso('Procedimentos e preços atualizados com sucesso.');
      navigate('/dashboard');
    }catch(err){setErro(err.response?.data?.message||'Não foi possível salvar os procedimentos.')}
    finally{setSalvando(false);}
  }

  if(sessao.tipo!=='medico') return null;
  const filtrados=procedimentos.filter(p=>{const t=busca.trim().toLowerCase();return !t||p.nome?.toLowerCase().includes(t)||p.descricao?.toLowerCase().includes(t);});

  return <><Navbar/><main className="container procedures-page">
    <div className="page-header"><div><span className="eyebrow">ÁREA PROFISSIONAL</span><h1>Meus procedimentos</h1><p className="muted">Escolha o que você realiza e defina o seu preço para cada procedimento.</p></div><button className="btn-secondary page-back-button" onClick={()=>navigate('/dashboard')}>← Voltar ao dashboard</button></div>
    {erro&&<div className="alert error">{erro}</div>}{sucesso&&<div className="alert success">{sucesso}</div>}
    <Card>{carregando?<p>Carregando procedimentos...</p>:<>
      <div className="procedure-search"><label>Buscar</label><input className="input" type="search" value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Digite o nome do procedimento"/></div>
      <div className="procedure-selection-grid">{filtrados.map(p=>{
        const marcado=Object.prototype.hasOwnProperty.call(selecionados,Number(p.id_procedimento));
        return <div key={p.id_procedimento} className={`procedure-option procedure-price-option ${marcado?'selected':''}`}>
          <label className="procedure-check"><input type="checkbox" checked={marcado} onChange={()=>alternar(Number(p.id_procedimento))}/><span><strong>{p.nome}</strong>{p.descricao&&<small>{p.descricao}</small>}</span></label>
          {marcado&&<div className="price-field"><label>Seu preço (R$)</label><input className="input" type="number" min="0" step="0.01" value={selecionados[Number(p.id_procedimento)]} onChange={e=>alterarPreco(Number(p.id_procedimento),e.target.value)}/></div>}
        </div>;
      })}</div>
      <div className="procedure-selection-actions"><button className="btn-secondary" onClick={()=>navigate('/dashboard')}>Voltar</button><button className="btn" onClick={salvar} disabled={salvando}>{salvando?'Salvando...':'Salvar procedimentos'}</button></div>
    </>}</Card>
  </main></>;
}
