import React, { useState } from 'react';
import { VscAccount } from "react-icons/vsc";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import './style.css';
import logo from './logo.png';
import { Link } from 'react-router-dom';

function Header(){
    const [anchorEl, setAnchorEl] = useState(null);
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const handleClose = () => {
      setAnchorEl(null);
    };

    const sair = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");        
    };

    return (
        <header>
            <div className="logo">
                <img alt="" height="50" width="100" src={logo} />
            </div>
            
            <div className="login">        
                {usuario?capitalizeFirstLetter(usuario.username):""}<VscAccount size={40} onClick={handleClick}/>
            </div>

            <Menu style={{margin: "2% 2% 0 0"}} anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <Link to='/login' onClick={sair}><MenuItem>Sair</MenuItem></Link>
            </Menu>
        </header>
    )
}

export default Header
