import React, { useState } from 'react';
import './login.css'
import Button from '@material-ui/core/Button';
import { AiOutlineFacebook, AiOutlineGoogle } from "react-icons/ai";
import TextField from '@material-ui/core/TextField';
import { yellow } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
import bandeirasCartoes from './bandeiras-cartoes.jpg';

const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(yellow[500]),
      backgroundColor: yellow[500],
      '&:hover': {
        backgroundColor: yellow[700],
      },
    },
}))(Button);

function Login(props) {
    const [values, setValues] = useState( {} )
    
    const setUsuario = (event)=>
        setValues({...values,usuario:{...values.usuario,[event.target.name]:event.target.value}})    
    //const dominio = "http://flex-connection.ddns.net:3030"
    const dominio = process.env.REACT_APP_MELI_DOMAIN;
    
    const login = (event) => {
        event.preventDefault();
        axios.post(dominio+'/auth/login', values.usuario)
            .then(response => {
                localStorage.setItem("token", response.headers['authorization']);                
                axios.get(dominio+"/auth/usuarios").then(response =>{
                    localStorage.setItem("usuario", JSON.stringify(response.data));
                    props.history.replace("/");
                })
            });        
    }

    return (
        <div className="background">
            <div className="conteudo-login">
                <h1 className="titulo-login">Login</h1>
                <Button variant="contained" color="primary">
                    <AiOutlineFacebook size={25}/>
                    &nbsp;&nbsp;Entrar com facebook
                </Button>
                <br/><br/><br/>
                
                <Button variant="contained" color="secondary" >
                    &nbsp;&nbsp;<AiOutlineGoogle size={25}/>
                    &nbsp;&nbsp;Entrar com google&nbsp;&nbsp;
                </Button>
                <br/><br/><br/>
                
                <p>OU</p>
                <form onSubmit={login}>
                    <div className="form-input">
                        <TextField onChange={setUsuario} label="E-mail" id="username" name="username" />
                        <TextField onChange={setUsuario} label="Password" id="password" name="password" type="password" />
                    </div>
                    <div className="btn-entrar">
                        <ColorButton variant="contained" type="submit" color="default">Entrar</ColorButton>
                    </div>
                    <div className="footer-login">
                        Não possui conta?<Link to="/registrar">Registre-se aqui</Link>
                    </div>
                </form>
                <img alt="" height="50" width="100" src={bandeirasCartoes} />
            </div>
        </div>
    )
}

export default Login