import { useEffect, useState } from 'react';
import axios from '../../../config/api/api';
import './../header.css';
import loader from "./../../../assets/loadinfo.gif";
import Seguido from './Seguido';
import Seguidor from './Seguidor';
import Colaborador from '../Colaborador';

function Notificacao(props){
    const [values, setValues] = useState({})
    const [notificacoesQTD, setNotificacoesQTD] = useState(0);
    const host = process.env.REACT_APP_URL;

    useEffect(() => 
        axios.get("/loja/notificacoes/quantidade").then(notificacao => setValues({notificacaoQtd:notificacao.data}))
    , [host]) 

    useEffect(() => {        
        if(localStorage.getItem("token")!==null){
            const eventSource = new EventSource(`${host}/loja/notificacoes/ws?Authorization=${localStorage.getItem("token")}`);
            eventSource.onmessage = (event) => setNotificacoesQTD(notificacoesQTD+1)
            eventSource.onerror = (error) => eventSource.close();  
            return () => eventSource.close();        
        }
    }, [notificacoesQTD, host]) 

    const getNotificacoes = (event) => {
        document.getElementById("mensagem-check").checked = false;
        document.getElementById("carrinho-check").checked = false;
        if(event.target.checked&&!values.loader){
            setValues({...values, loader:true, notificacoes:undefined});
            axios.get(`/loja/notificacoes?page=${0}&size=10`).then(notificacoes => 
                axios.post('/loja/notificacoes').then(response=>{
                    setValues({...values, notificacoes:notificacoes.data, notificacaoQtd:0, loader:false});
                    setNotificacoesQTD(0);
                })              
            )        
        }
        else
            setValues({...values, loader:false, notificacoes:undefined});        
    }
    
    const setNotificacao=index=>
        setValues({...values, notificacoes:values.notificacoes.map((x,i)=>index===i?{...x, tipo:'SEGUIDO_ACEITO'}:x)})
    

    const removeNotificacao=index=>setValues({...values, notificacoes:values.notificacoes.filter((x,i)=>index!==i)})

    return(
        <div onClick={event=>{event.stopPropagation()}} style={{display:"inline"}}>
            <label className="notificacao-botao" htmlFor="notificacao-check" onClick={event=>event.stopPropagation()}>
                🔔
                {(values.notificacaoQtd>0||notificacoesQTD>0)&&<div className='notificacao-qtd'>{values.notificacaoQtd+notificacoesQTD}</div>}                                    
            </label>
            <input type="checkbox" className="notificacao-check" id="notificacao-check" onChange={getNotificacoes}/>
            
            <div id="notificacao-menu">
                {values.notificacoes&&values.notificacoes.map((n, index)=>{
                    if(n.tipo==='SEGUIDO') return <Seguidor key={index} index={index} setNotificacao={setNotificacao} removeNotificacao={removeNotificacao} id={n.id}/>;
                    if(n.tipo==='SEGUIDO_ACEITO') return <Seguido key={index} id={n.id} />;
                    if(n.tipo==='SEGUIDOR_ACEITO') return <Seguido key={index} id={n.id}/>;
                    if(n.tipo==='LOJA') return <Colaborador key={index} id={n.id}/>;
                    else return '';
                })}
                <div style={{textAlign:"center"}}>
                    {values.loader&&<img style={{height:"5em", top:"50%"}} src={loader} alt="loading..."/>}
                    {values.notificacoes&&!values.notificacoes.length&&<p>sem notificações</p>}
                </div>
            </div>
        </div>
    )
}
export default Notificacao