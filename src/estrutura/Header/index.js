import React, { useState } from 'react';
import { VscAccount } from "react-icons/vsc";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import './header.css';
import logo from './logo.png';
import { Link } from 'react-router-dom';

function Header(){
    const [anchorEl, setAnchorEl] = useState(null);
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };    

    const handleClose = () => {
      setAnchorEl(null);
    };

    const sair = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");        
    };

    return (
        <header className="header-app">
            <div className="logo">
            <Link to="/home"> 
                <img alt="" height="90" width="150" src={logo} />
            </Link> 
            </div>
            
            <div className="login">        
                <VscAccount className="user-cursor" size={60} onClick={handleClick}/>
            </div>

            <Menu className="user-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem>Olá : {usuario?usuario.username:""}</MenuItem>
                <Link to='/login' onClick={sair}><MenuItem>Sair</MenuItem></Link>
            </Menu>
        </header>
    )
}

export default Header
