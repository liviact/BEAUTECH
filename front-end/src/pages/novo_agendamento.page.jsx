import { useEffect, useMemo, useState } from 'react';
import { useNavigate,useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import Card from '../components/shared/card.jsx';
import Button from '../components/shared/button.jsx';
import { criarAgendamento,listarDisponibilidade } from '../services/agendamentoService.js';
import { listarMedicos,listarProcedimentosMedico } from '../services/medicoService.js';
import { obterUsuario } from '../storage/usuario.storage.js';

const meses=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const semanas=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

function dataLocal(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function inicioMes(d){return new Date(d.getFullYear(),d.getMonth(),1);}
function diasMes(d){return new Date(d.getFullYear(),d.getMonth()+1,0).getDate();}

export default function NovoAgendamento(){
  const navigate=useNavigate(); const [searchParams]=useSearchParams(); const sessao=obterUsuario()||{};
  const medicoInicial=searchParams.get('medico')||'';
  const dataInicial=searchParams.get('data')||dataLocal();
  const [medicos,setMedicos]=useState([]); const [procedimentos,setProcedimentos]=useState([]);
  const [mes,setMes]=useState(inicioMes(new Date(dataInicial+'T12:00:00'))); const [data,setData]=useState(dataInicial);
  const [hora,setHora]=useState(''); const [idMedico,setIdMedico]=useState(medicoInicial); const [idProcedimento,setIdProcedimento]=useState('');
  const [horarios,setHorarios]=useState([]); const [erro,setErro]=useState(''); const [carregandoHorarios,setCarregandoHorarios]=useState(false); const [salvando,setSalvando]=useState(false);

  useEffect(()=>{listarMedicos().then(setMedicos).catch(err=>setErro(err.response?.data?.message||'Não foi possível carregar os médicos.'));},[]);
  useEffect(()=>{
    setProcedimentos([]);setIdProcedimento('');setHora('');
    if(idMedico) listarProcedimentosMedico(idMedico).then(setProcedimentos).catch(err=>setErro(err.response?.data?.message||'Não foi possível carregar os procedimentos.'));
  },[idMedico]);
  useEffect(()=>{
    if(!idMedico||!data) return;
    setCarregandoHorarios(true);setHora('');
    listarDisponibilidade(idMedico,data).then(r=>setHorarios(r.horarios||[])).catch(err=>setErro(err.response?.data?.message||'Não foi possível carregar os horários.')).finally(()=>setCarregandoHorarios(false));
  },[idMedico,data]);

  const dias=useMemo(()=>{
    const inicio=inicioMes(mes); return [...Array(inicio.getDay()).fill(null),...Array.from({length:diasMes(mes)},(_,i)=>i+1)];
  },[mes]);

  function escolherDia(dia){
    if(!dia) return;
    const chave=`${mes.getFullYear()}-${String(mes.getMonth()+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
    if(chave<dataLocal()) return;
    const obj=new Date(mes.getFullYear(),mes.getMonth(),dia); if(obj.getDay()===0) return;
    setData(chave);setErro('');
  }

  async function enviar(e){
    e.preventDefault();setErro('');
    if(!idMedico||!idProcedimento||!data||!hora){setErro('Selecione médico, procedimento, dia e horário.');return;}
    try{setSalvando(true);await criarAgendamento({id_cliente:sessao.id,id_medico:idMedico,id_procedimento:idProcedimento,data,hora});navigate('/agendamentos');}
    catch(err){setErro(err.response?.data?.message||'Erro ao criar agendamento.');}
    finally{setSalvando(false);}
  }

  const procedimentoEscolhido=procedimentos.find(p=>Number(p.id_procedimento)===Number(idProcedimento));

  return <><Navbar/><main className="container booking-page">
    <div className="page-header"><div><span className="eyebrow">AGENDA BEAUTECH</span><h1>Novo Agendamento</h1><p className="muted">Escolha o profissional, procedimento, dia e um horário livre de 1 em 1 hora.</p></div><button className="btn-secondary page-back-button" onClick={()=>navigate('/agendamentos')}>← Voltar</button></div>
    {erro&&<div className="alert error">{erro}</div>}
    <form onSubmit={enviar} className="booking-layout">
      <Card>
        <h2>1. Profissional</h2>
        <select className="input" value={idMedico} onChange={e=>setIdMedico(e.target.value)} required>
          <option value="">Selecione um médico</option>{medicos.map(m=><option key={m.id_usuario} value={m.id_usuario}>{m.nome} — {m.especializacao||'Especialista'}</option>)}
        </select>
        <h2 className="booking-section-title">2. Procedimento</h2>
        <select className="input" value={idProcedimento} onChange={e=>setIdProcedimento(e.target.value)} disabled={!idMedico} required>
          <option value="">{!idMedico?'Selecione um médico primeiro':'Selecione um procedimento'}</option>
          {procedimentos.map(p=><option key={p.id_procedimento} value={p.id_procedimento}>{p.nome} — R$ {Number(p.preco||0).toFixed(2).replace('.',',')}</option>)}
        </select>
        {procedimentoEscolhido&&<div className="booking-price"><span>Valor informado pelo médico</span><strong>R$ {Number(procedimentoEscolhido.preco||0).toFixed(2).replace('.',',')}</strong></div>}
      </Card>

      <Card className="booking-calendar-card">
        <h2>3. Escolha o dia</h2>
        <div className="calendar-heading"><button type="button" className="calendar-nav" onClick={()=>setMes(new Date(mes.getFullYear(),mes.getMonth()-1,1))}>‹</button><h2>{meses[mes.getMonth()]} {mes.getFullYear()}</h2><button type="button" className="calendar-nav" onClick={()=>setMes(new Date(mes.getFullYear(),mes.getMonth()+1,1))}>›</button></div>
        <div className="calendar-weekdays">{semanas.map(d=><strong key={d}>{d}</strong>)}</div>
        <div className="calendar-grid booking-calendar-grid">{dias.map((dia,i)=>{
          if(!dia)return <div className="calendar-day empty" key={i}/>;
          const chave=`${mes.getFullYear()}-${String(mes.getMonth()+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
          const domingo=new Date(mes.getFullYear(),mes.getMonth(),dia).getDay()===0;
          const passado=chave<dataLocal();
          return <button type="button" key={chave} disabled={domingo||passado} className={`calendar-day ${chave===data?'selected':''}`} onClick={()=>escolherDia(dia)}><span>{dia}</span>{domingo&&<small>Fechado</small>}</button>;
        })}</div>
        <p className="selected-date-label">Dia escolhido: <strong>{data.split('-').reverse().join('/')}</strong></p>
      </Card>

      <Card className="booking-times-card">
        <h2>4. Escolha o horário</h2>
        <p className="muted">Cada horário dura 1 hora. Quando reservado, ele fica indisponível para os demais clientes.</p>
        {carregandoHorarios?<p>Carregando horários...</p>:!idMedico?<p className="muted">Selecione um médico para ver a disponibilidade.</p>:horarios.length===0?<p className="muted">Não há horários disponíveis para este dia.</p>:
        <div className="time-slot-grid">{horarios.map(slot=><button type="button" key={slot.hora} disabled={!slot.disponivel} className={`time-slot ${hora===slot.hora?'selected':''}`} onClick={()=>setHora(slot.hora)}>{slot.hora}</button>)}</div>}
        <div className="booking-confirm"><span>{hora?`Horário escolhido: ${hora}`:'Nenhum horário escolhido'}</span><Button type="submit" disabled={salvando||!hora||!idProcedimento}>{salvando?'Enviando...':'Solicitar consulta'}</Button></div>
      </Card>
    </form>
  </main></>;
}
