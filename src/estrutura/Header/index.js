import React, { useEffect, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import './header.css';
import logo from './logo.png';
import { Link } from 'react-router-dom';

function Header(){
    const [values, setValues] = useState({anchorEl:false, usuario:{}})    
    
    useEffect(() => setValues({...values, usuario:JSON.parse(localStorage.getItem("usuario"))}), []);

    const handleClick = (event) => setValues({...values, anchorEl:event.currentTarget});    

    const handleClose = () => setValues({...values, anchorEl:null});

    const sair = () => {localStorage.removeItem("token");localStorage.removeItem("usuario");};

    return (
        <header className="header-app">
            <div className="logo">
                <Link to="/"> 
                    <img alt="" height="90" width="150" src={logo} />
                </Link> 
            </div>
                               
            <img className="login" src={process.env.REACT_APP_MELI_DOMAIN+values.usuario.imagemPath} onClick={handleClick}/>
            
            <Menu className="user-menu" anchorEl={values.anchorEl} keepMounted open={Boolean(values.anchorEl)} onClose={handleClose}>
                <Link to='/perfil'><MenuItem>Olá : {values.usuario.nome?values.usuario.nome:values.usuario.email} ✏️</MenuItem></Link>
                <Link to='/login' onClick={sair}><MenuItem>Sair</MenuItem></Link>
            </Menu>
        </header>
    )
}

export default Header
