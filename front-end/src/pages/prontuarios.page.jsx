import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import Card from '../components/shared/card.jsx';
import { listarProntuarios } from '../services/prontuarioService.js';
import { obterUsuario } from '../storage/usuario.storage.js';

function data(v){const [a,m,d]=String(v||'').slice(0,10).split('-');return a?`${d}/${m}/${a}`:'';}
export default function Prontuarios(){
 const navigate=useNavigate();const sessao=obterUsuario()||{};const [lista,setLista]=useState([]);const [erro,setErro]=useState('');const [aberto,setAberto]=useState(null);
 useEffect(()=>{listarProntuarios().then(setLista).catch(e=>setErro(e.response?.data?.message||'Não foi possível carregar os prontuários.'));},[]);
 return <><Navbar/><main className="container">
   <div className="page-header"><div><span className="eyebrow">HISTÓRICO CLÍNICO</span><h1>{sessao.tipo==='medico'?'Prontuários dos atendimentos':'Meus Prontuários'}</h1><p className="muted">Os registros concluídos ficam disponíveis aqui.</p></div><button className="btn-secondary page-back-button" onClick={()=>navigate('/dashboard')}>← Voltar</button></div>
   {erro&&<div className="alert error">{erro}</div>}
   {lista.length===0?<Card><p>Nenhum prontuário disponível.</p></Card>:lista.map(p=><Card key={p.id_prontuario} className="record-card">
     <div className="record-header"><div><span className="doctor-label">{p.procedimento}</span><h3>{sessao.tipo==='cliente'?`Atendido por ${p.medico}`:`Cliente: ${p.cliente}`}</h3><p>{data(p.data_atendimento)} às {String(p.hora).slice(0,5)}</p></div><strong>R$ {Number(p.valor_consulta||0).toFixed(2).replace('.',',')}</strong></div>
     <button className="btn-link" onClick={()=>setAberto(aberto===p.id_prontuario?null:p.id_prontuario)}>{aberto===p.id_prontuario?'Ocultar detalhes':'Ver prontuário'}</button>
     {aberto===p.id_prontuario&&<div className="record-details"><p><strong>Processo realizado</strong>{p.processo_realizado}</p><p><strong>Produtos utilizados</strong>{p.produtos_utilizados||'Não informado.'}</p><p><strong>Observações</strong>{p.observacoes||'Nenhuma observação.'}</p></div>}
   </Card>)}
 </main></>;
}
