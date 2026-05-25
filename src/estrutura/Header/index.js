import React, { useEffect, useState } from 'react';
import './header.css';
import logo from './logo.png';
import { Link } from 'react-router-dom';
import axios from '../../config/api/api';
import Carrinho from './Carrinho';
import Notificacao from './Notificacao';
import Mensagem from './Mensagem';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Header(){
    const [values, setValues] = useState({})
    const host = process.env.REACT_APP_URL;
    const history = useHistory();

    useEffect(() => 
        localStorage.getItem('token')?
            axios.get("/auth/usuarios").then(response=> {
                localStorage.setItem("usuario", JSON.stringify(response.data))
                setValues({userMenu:"none", usuario:response.data, carrinho:JSON.parse(localStorage.getItem("carrinho"))})  
            }):''        
    , [])     

    const home = (event) => history.location.pathname==="/"?history.go(0):history.push("/")

    return (
        <header className="header-app">
            <img onClick={home} className="logo" alt="" src={logo}/>
            <img className="login" alt="Foto perfil user" src={values.usuario&&values.usuario.imagemPath?
                host+values.usuario.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"} onClick={event=>{event.preventDefault();event.stopPropagation();document.getElementById("user-menu").style.display=document.getElementById("user-menu").style.display!=="inline-block"?"inline-block":"none"}}/>                                                
            {values.usuario&&
                <>               
                    <Notificacao/>                    
                    <Carrinho/>
                    <Mensagem/>                    
                </>
            }
            <div id="user-menu" className='user-menu'>
                {values.usuario&&<><Link to={'/perfil/editar/'+values.usuario.id}>Olá : {values.usuario.nome?values.usuario.nome:values.usuario.email} ✏️</Link><br/></>}
                <Link to='/login' onClick={(event)=>localStorage.clear()}>Sair</Link>                
            </div>
        </header>
    )
}
export default Header
