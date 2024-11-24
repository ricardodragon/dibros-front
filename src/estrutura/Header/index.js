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
            <Link to="/"><img className="logo" alt="" src={logo} /></Link> 

            <img className="login" alt="Foto perfil user" src={values.usuario.imagemPath?
                host+values.usuario.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"} onClick={event=>{event.preventDefault();event.stopPropagation();document.getElementById("user-menu").style.display=document.getElementById("user-menu").style.display==="none"?"inline-block":"none"}}/>                                    
            <span>🔔</span>  
                                       
            <div id="user-menu" className='user-menu'>
                <Link to='/perfil'>Olá : {values.usuario.nome?values.usuario.nome:values.usuario.email} ✏️</Link><br/>
                <Link to='/login' onClick={(event)=>localStorage.removeItem("token")}>Sair</Link>                
            </div>            
        </header>
    )
}

export default Header
