import { useEffect,useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import Card from '../components/shared/card.jsx';
import { listarAgendamentos,cancelarAgendamento,aceitarAgendamento,recusarAgendamento,realizarAgendamento } from '../services/agendamentoService.js';
import { obterUsuario } from '../storage/usuario.storage.js';

function formatarData(data){const [a,m,d]=String(data||'').slice(0,10).split('-');return a?`${d}/${m}/${a}`:'';}
function formatarHora(hora){return String(hora||'').slice(0,5);}
function horasAteConsulta(data,hora){const [a,m,d]=String(data).slice(0,10).split('-').map(Number);const [h,min]=String(hora).slice(0,5).split(':').map(Number);return (new Date(a,m-1,d,h,min)-Date.now())/3600000;}
function ehHistorico(item){return ['cancelado','recusado','concluido'].includes(item.status)||horasAteConsulta(item.data,item.hora)<0;}

export default function Agendamentos(){
 const navigate=useNavigate();const sessao=obterUsuario()||{};const [agendamentos,setAgendamentos]=useState([]);const [aba,setAba]=useState('proximas');const [erro,setErro]=useState('');const [carregando,setCarregando]=useState(true);const [concluindo,setConcluindo]=useState(null);
 const [prontuario,setProntuario]=useState({processo_realizado:'',produtos_utilizados:'',valor_consulta:'',observacoes:''});
 async function carregar(){try{setCarregando(true);const dados=await listarAgendamentos();setAgendamentos(dados);}catch(err){setErro(err.response?.data?.message||'Erro ao buscar agendamentos.')}finally{setCarregando(false);}}
 useEffect(()=>{carregar();},[]);
 async function acao(fn,id){try{await fn(id);await carregar();}catch(err){setErro(err.response?.data?.message||'Não foi possível atualizar a consulta.');}}
 async function concluir(id){
   if(!prontuario.processo_realizado.trim()){setErro('Escreva o processo realizado antes de concluir.');return;}
   try{await realizarAgendamento(id,{...prontuario,valor_consulta:prontuario.valor_consulta||undefined});setConcluindo(null);setProntuario({processo_realizado:'',produtos_utilizados:'',valor_consulta:'',observacoes:''});await carregar();}
   catch(err){setErro(err.response?.data?.message||'Não foi possível concluir a consulta.');}
 }
 function podeCancelar(item){return ['pendente','aceito'].includes(item.status)&&horasAteConsulta(item.data,item.hora)>=24;}
 function textoStatus(s){return {pendente:'Aguardando análise',aceito:'Consulta aceita',recusado:'Consulta recusada',cancelado:'Consulta cancelada',concluido:'Consulta concluída'}[s]||s;}
 const exibidos=agendamentos.filter(item=>aba==='historico'?ehHistorico(item):!ehHistorico(item));
 return <><Navbar/><main className="container appointment-page">
   <div className="page-header"><div><span className="eyebrow">AGENDA BEAUTECH</span><h1>{sessao.tipo==='medico'?'Agenda do Médico':'Meus Agendamentos'}</h1><p className="muted">Consulte suas próximas consultas e o histórico de atendimentos.</p></div><div className="page-header-actions">{sessao.tipo==='cliente'&&<Link to="/agendamentos/novo" className="btn-link compact">Novo agendamento</Link>}<button className="btn-secondary page-back-button" onClick={()=>navigate('/dashboard')}>← Voltar</button></div></div>
   {erro&&<div className="alert error">{erro}</div>}
   <div className="appointment-tabs"><button className={aba==='proximas'?'active':''} onClick={()=>setAba('proximas')}>Próximas consultas</button><button className={aba==='historico'?'active':''} onClick={()=>setAba('historico')}>Histórico</button></div>
   {carregando?<Card><p>Carregando agendamentos...</p></Card>:exibidos.length===0?<Card><p>{aba==='historico'?'Nenhum atendimento no histórico.':'Nenhuma consulta próxima.'}</p></Card>:exibidos.map(a=><Card key={a.id_agendamento} className="appointment-card">
     <div className="appointment"><div><span className="doctor-label">{a.procedimento||a.tipo_atendimento}</span><h3>{sessao.tipo==='medico'?`Cliente: ${a.cliente}`:`Médico: ${a.medico}`}</h3><p><strong>Data:</strong> {formatarData(a.data)} &nbsp; <strong>Hora:</strong> {formatarHora(a.hora)}</p><p className="appointment-price"><strong>Valor:</strong> R$ {Number(a.valor_consulta||0).toFixed(2).replace('.',',')}</p></div>
       <div className="appointment-actions"><div className="appointment-status-actions"><span className={`status status-${a.status}`}>{textoStatus(a.status)}</span>
       {sessao.tipo==='cliente'&&podeCancelar(a)&&<div className="action-row"><button className="btn-danger-small" onClick={()=>acao(cancelarAgendamento,a.id_agendamento)}>Cancelar</button><button className="btn-reagendar" onClick={()=>navigate(`/agendamentos/${a.id_agendamento}/reagendar`)}>Reagendar</button></div>}</div>
       {sessao.tipo==='medico'&&a.status==='pendente'&&<div className="action-row"><button className="btn" onClick={()=>acao(aceitarAgendamento,a.id_agendamento)}>Aceitar</button><button className="btn-danger-small" onClick={()=>acao(recusarAgendamento,a.id_agendamento)}>Recusar</button></div>}
       {sessao.tipo==='medico'&&a.status==='aceito'&&<button className="btn" onClick={()=>{setConcluindo(a.id_agendamento);setProntuario({processo_realizado:'',produtos_utilizados:'',valor_consulta:Number(a.valor_consulta||0).toFixed(2),observacoes:''});}}>Concluir + prontuário</button>}
       {sessao.tipo==='cliente'&&a.status==='concluido'&&<button className="btn-link" onClick={()=>navigate('/prontuarios')}>Ver prontuário</button>}
       </div></div>
       {concluindo===a.id_agendamento&&<div className="completion-form"><h3>Prontuário do atendimento</h3><p className="muted">Preencha o processo antes de marcar a consulta como concluída. Essas informações ficarão disponíveis para o cliente.</p><label>Processo realizado *</label><textarea className="input" rows="4" value={prontuario.processo_realizado} onChange={e=>setProntuario(p=>({...p,processo_realizado:e.target.value}))} placeholder="Descreva como o atendimento foi realizado..." required/>
         <label>Produtos utilizados</label><textarea className="input" rows="3" value={prontuario.produtos_utilizados} onChange={e=>setProntuario(p=>({...p,produtos_utilizados:e.target.value}))} placeholder="Liste os produtos utilizados..."/>
         <label>Quanto ficou a consulta (R$)</label><input className="input" type="number" min="0" step="0.01" value={prontuario.valor_consulta} onChange={e=>setProntuario(p=>({...p,valor_consulta:e.target.value}))}/>
         <label>Observações</label><textarea className="input" rows="3" value={prontuario.observacoes} onChange={e=>setProntuario(p=>({...p,observacoes:e.target.value}))}/>
         <div className="action-row"><button type="button" className="btn-secondary" onClick={()=>setConcluindo(null)}>Voltar</button><button type="button" className="btn" onClick={()=>concluir(a.id_agendamento)}>Salvar prontuário e concluir</button></div>
       </div>}
   </Card>)}
 </main></>;
}
