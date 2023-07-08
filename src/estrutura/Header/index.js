import React, { useEffect, useState } from 'react';
import './header.css';
import logo from './logo.png';
import { Link } from 'react-router-dom';

function Header(){
    const [values, setValues] = useState({anchorEl:false, usuario:{imagemPath:""}, userMenu:"none"})    
    
    const host = window.location.protocol+ "//" + window.location.hostname+":7080";

    useEffect(() => setValues({userMenu:"none", anchorEl:false, usuario:JSON.parse(localStorage.getItem("usuario"))?JSON.parse(localStorage.getItem("usuario")):{imagemPath:""}}), []);

    const sair = () => {localStorage.removeItem("token");localStorage.removeItem("usuario");};

    return (
        <header className="header-app" onClick={event=>{event.preventDefault();event.stopPropagation();document.getElementById("user-menu").style.display="none"}}>
            <div className="logo">
                <Link to="/"> 
                    <img alt="" height="50" width="100" src={logo} />
                </Link> 
            </div>
                                           
            <img className="login" alt="Foto perfil user" src={values.usuario.imagemPath?
                host+values.usuario.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"} onClick={event=>{event.preventDefault();event.stopPropagation();document.getElementById("user-menu").style.display=document.getElementById("user-menu").style.display==="none"?"inline-block":"none"}}/>                        

            <div id="user-menu" style={{borderRadius:"5%", textAlign:'center', padding:"2%", backgroundColor:"white", display:values.userMenu, float:"right", position:"relative"}}>
                <Link to='/perfil'>Olá : {values.usuario.nome?values.usuario.nome:values.usuario.email} ✏️</Link><br/>
                <Link to='/login' onClick={sair}>Sair</Link>                
            </div>            
        </header>
    )
}

export default Header
