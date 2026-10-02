import { useEffect,useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { obterUsuario,removerUsuario } from '../../storage/usuario.storage.js';
import ThemeToggle from '../shared/ThemeToggle.jsx';
import { contarNotificacoes,listarNotificacoes,marcarNotificacaoLida,marcarTodasNotificacoes } from '../../services/notificacaoService.js';

export default function Navbar({publicOnly=false}){
 const navigate=useNavigate();const usuario=publicOnly?null:obterUsuario();const [menuAberto,setMenuAberto]=useState(false);const [notificacoes,setNotificacoes]=useState([]);const [abertas,setAbertas]=useState(false);const [naoLidas,setNaoLidas]=useState(0);
 useEffect(()=>{
   if(!usuario)return;
   let ativo=true;
   async function carregar(){try{const [lista,contagem]=await Promise.all([listarNotificacoes(),contarNotificacoes()]);if(ativo){setNotificacoes(lista);setNaoLidas(contagem.total||0);}}catch{setNaoLidas(0)}}
   carregar();const timer=setInterval(carregar,30000);return()=>{ativo=false;clearInterval(timer);}
 },[usuario?.id]);
 async function abrirNotificacoes(){setAbertas(v=>!v);if(!abertas){try{setNotificacoes(await listarNotificacoes());}catch{setNaoLidas(0)}}}
 async function ler(id){try{await marcarNotificacaoLida(id);setNotificacoes(n=>n.map(x=>x.id_notificacao===id?{...x,lida:1}:x));setNaoLidas(n=>Math.max(0,n-1));}catch{setNaoLidas(0)}}
 async function lerTodas(){try{await marcarTodasNotificacoes();setNotificacoes(n=>n.map(x=>({...x,lida:1})));setNaoLidas(0);}catch{setNaoLidas(0)}}
 function sair(){removerUsuario();setMenuAberto(false);navigate('/');}
 return <nav className="navbar">
   <Link to={usuario?(usuario.tipo==='admin'?'/admin':'/dashboard'):'/'} className="logo" onClick={()=>setMenuAberto(false)}>BEAUTECH</Link>
   <button type="button" className="navbar-hamburger" aria-label={menuAberto?'Fechar menu':'Abrir menu'} aria-expanded={menuAberto} onClick={()=>setMenuAberto(v=>!v)}><span></span><span></span><span></span></button>
   <div className={`links ${menuAberto?'menu-aberto':''}`}>
    {usuario?<>{usuario.tipo==='admin'?<><Link to="/admin" onClick={()=>setMenuAberto(false)}>Painel</Link><Link to="/medicos" onClick={()=>setMenuAberto(false)}>Médicos</Link></>:<>
      <Link to="/dashboard" onClick={()=>setMenuAberto(false)}>Início</Link><Link to="/agendamentos" onClick={()=>setMenuAberto(false)}>Agenda</Link><Link to="/calendario" onClick={()=>setMenuAberto(false)}>Calendário</Link><Link to="/medicos" onClick={()=>setMenuAberto(false)}>Médicos</Link>{usuario.tipo==='medico'&&<Link to="/meus-procedimentos" onClick={()=>setMenuAberto(false)}>Procedimentos</Link>}<Link to="/prontuarios" onClick={()=>setMenuAberto(false)}>Prontuários</Link><Link to="/perfil" onClick={()=>setMenuAberto(false)}>Perfil</Link>
    </>}
    <div className="notification-wrap"><button className="notification-button" type="button" onClick={abrirNotificacoes} aria-label="Notificações">🔔{naoLidas>0&&<span className="notification-badge">{naoLidas>9?'9+':naoLidas}</span>}</button>
      {abertas&&<div className="notification-panel"><div className="notification-panel-header"><strong>Notificações</strong><button onClick={lerTodas}>Marcar todas como lidas</button></div>{notificacoes.length===0?<p className="muted">Nenhuma notificação.</p>:notificacoes.map(n=><button key={n.id_notificacao} className={`notification-item ${n.lida?'read':''}`} onClick={()=>ler(n.id_notificacao)}><strong>{n.titulo}</strong><span>{n.mensagem}</span><small>{new Date(n.criada_em).toLocaleString('pt-BR')}</small></button>)}</div>}
    </div>
    <span className="role">{usuario.tipo}</span><ThemeToggle/><button onClick={sair} className="btn-sair">Sair</button>
   </>:<><Link to="/medicos" onClick={()=>setMenuAberto(false)}>Médicos</Link><Link to="/login" onClick={()=>setMenuAberto(false)}>Entrar</Link><Link to="/cadastro" className="nav-cta" onClick={()=>setMenuAberto(false)}>Criar</Link><ThemeToggle/></>}
   </div>
 </nav>;
}
