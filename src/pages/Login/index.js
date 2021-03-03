import React, { useState } from 'react';
import './style.css'
import Button from '@material-ui/core/Button';
import { AiOutlineFacebook, AiOutlineGoogle } from "react-icons/ai";
import TextField from '@material-ui/core/TextField';
import { yellow } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
    const [usuario, setUsuario] = useState( { usernameOrEmail: '', senha: ''} )
    
    function handleUsuario(event){
        usuario[event.target.name] = event.target.value;
        setUsuario({...usuario});
    }
    function login(event){
        event.preventDefault();
        axios.post('http://localhost:8080/auth/login', {username: usuario.usernameOrEmail, password: usuario.senha})
            .then(response => {
                localStorage.setItem("token", response.headers['authorization']);
                axios.get("http://localhost:8080/usuario").then(response =>{
                    localStorage.setItem("usuario", JSON.stringify(response.data));
                    props.history.replace("/usuarios");
                })
            });
        
    }

    return (
        <div className="background">
            <div className="conteudo-login">
                <h1>Login</h1>
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
                        <TextField onChange={handleUsuario} label="E-mail" id="usernameOrEmail" name="usernameOrEmail" />
                        <TextField onChange={handleUsuario} label="Password" id="password" name="senha" type="password" />
                    </div>
                    <div className="btn-entrar">
                        <ColorButton variant="contained" type="submit" color="default">Entrar</ColorButton>
                    </div>
                    <div className="footer-login">
                        Não possui conta?<Link to="/registrar">Registre-se aqui</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login