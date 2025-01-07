import React, { useEffect, useState } from 'react';
import './header.css';
import logo from './logo.png';
import { Link } from 'react-router-dom';
import axios from '../../config/api/api';
import Stomp from 'stompjs'
import SockJS from 'sockjs-client';

function Header(){
    const [values, setValues] = useState({userMenu:"none", checked:false})    
    const host = process.env.REACT_APP_URL;
    const notificationIcon = "m13.497 4.898.053.8.694.4C15.596 6.878 16.5 8.334 16.5 10v2.892c0 .997.27 1.975.784 2.83L18.35 17.5H5.649l1.067-1.778c.513-.855.784-1.833.784-2.83V10c0-1.666.904-3.122 2.256-3.902l.694-.4.053-.8c.052-.78.703-1.398 1.497-1.398.794 0 1.445.618 1.497 1.398ZM6 10c0-2.224 1.21-4.165 3.007-5.201C9.11 3.236 10.41 2 12 2c1.59 0 2.89 1.236 2.993 2.799C16.79 5.835 18 7.776 18 10v2.892c0 .725.197 1.436.57 2.058l1.521 2.535c.4.667-.08 1.515-.857 1.515H15c0 .796-.316 1.559-.879 2.121-.562.563-1.325.879-2.121.879s-1.559-.316-2.121-.879C9.316 20.56 9 19.796 9 19H4.766c-.777 0-1.257-.848-.857-1.515L5.43 14.95c.373-.622.57-1.333.57-2.058V10Zm4.5 9c0 .398.158.78.44 1.06.28.282.662.44 1.06.44s.78-.158 1.06-.44c.282-.28.44-.662.44-1.06h-3Z";
    
    useEffect(() => {  
        const client = {};      
        // const client = Stomp.over(new SockJS(process.env.REACT_APP_URL+"/loja/ws", null, {
        //     headers: {
        //       "Authorization":  localStorage.getItem("token")
        //     }
        //   }));

        // client.connect(
        //     {"Authorizathion": localStorage.getItem("token")}, 
        //     ()=>client.subscribe('/topico/notificacoes', (payload)=>console.log("PAILOAD LEGAL: "+payload), {"Authorizathion": localStorage.getItem("token")})
        // )
        
        if(localStorage.getItem("usuario"))
            axios.get("/loja/notificacoes/quantidade").then(notificacao =>
                setValues({userMenu:"none", checked:false, notificacaoQtd:notificacao.data, client, usuario:JSON.parse(localStorage.getItem("usuario"))})         
            )
        else 
            setValues({userMenu:"none", checked:false}) 
                
        // return () => client.disconnect();
    }, [])

    const getNotificacoes = () => {
        if(!values.checked)
            axios.get("/loja/notificacoes").then(notificacoes => 
                setValues({...values, checked:true, notificacaoQtd:0}))
        else
            setValues({...values, checked:false})
    }

    return (
        <header className="header-app" onClick={event=>{event.stopPropagation();document.getElementById("user-menu").style.display="none"}}>
            <Link to="/"><img className="logo" alt="" src={logo} /></Link> 
            {/* <button onClick={event=>values.client?values.client.send('/app/seguidor', {"Authorizathion": localStorage.getItem("token")}, "oi"):console.log("deu ruim")}>Socket Test</button> */}
            <img className="login" alt="Foto perfil user" src={values.usuario&&values.usuario.imagemPath?
                host+values.usuario.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"} onClick={event=>{event.preventDefault();event.stopPropagation();document.getElementById("user-menu").style.display=document.getElementById("user-menu").style.display!=="inline-block"?"inline-block":"none"}}/>                                    

            {values.usuario&&<label className="notificacao-botao" htmlFor="notificacao-check">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" focusable="false" aria-hidden="true" style={{borderRadius:'50%', backgroundColor:'#858080'}}>
                    <path d={notificationIcon}></path>
                </svg>      
                {values.notificacaoQtd!==undefined&&values.notificacaoQtd>0&&
                    <div>
                        {values.notificacaoQtd}
                    </div>
                }
            </label>}
            
            <input type="checkbox" className="notificacao-check" checked={values.checked} id="notificacao-check" onChange={getNotificacoes}/>  
            <div id="notificacao-menu">
                                              
            </div>

            <div id="user-menu" className='user-menu'>
                {values.usuario&&<><Link to='/perfil'>Olá : {values.usuario.nome?values.usuario.nome:values.usuario.email} ✏️</Link><br/></>}
                <Link to='/login' onClick={(event)=>localStorage.removeItem("token")}>Sair</Link>                
            </div>
        </header>
    )
}

export default Header
