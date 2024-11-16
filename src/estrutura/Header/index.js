import React, { useEffect, useState } from 'react';
import './header.css';
import logo from './logo.png';
import { Link } from 'react-router-dom';
import axios from '../../config/api/api';

function Header(){
    const [values, setValues] = useState({usuario:{imagemPath:""}, userMenu:"none"})    
    const host =process.env.REACT_APP_URL;

    useEffect(() => 
        axios.get("/auth/usuarios")
            .then(response =>setValues({userMenu:"none", usuario:response.data})         
    ), [])

    return (
        <header className="header-app" onClick={event=>{event.preventDefault();event.stopPropagation();document.getElementById("user-menu").style.display="none"}}>
            <div className="logo">
                <Link to="/"><img alt="" height="47" width="60" src={logo} /></Link> 
            </div>
            
            <img className="login" alt="Foto perfil user" src={values.usuario.imagemPath?
                host+values.usuario.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"} onClick={event=>{event.preventDefault();event.stopPropagation();document.getElementById("user-menu").style.display=document.getElementById("user-menu").style.display==="none"?"inline-block":"none"}}/>                        
            <p className="login">🔔</p>                 

            <div id="user-menu" style={{borderRadius:"1%", textAlign:'center', padding:"2%", backgroundColor:"white", display:values.userMenu, float:"right", position:"relative"}}>
                <Link to='/perfil'>Olá : {values.usuario.nome?values.usuario.nome:values.usuario.email} ✏️</Link><br/>
                <Link to='/login' onClick={(event)=>localStorage.removeItem("token")}>Sair</Link>                
            </div>            
        </header>
    )
}

export default Header
