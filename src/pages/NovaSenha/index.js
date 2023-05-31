import React, { useState } from 'react';
import './login.css'
import queryString from 'query-string';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';


function NovaSenha(props) {
    const [values, setValues] = useState( {} )
    const { token } = queryString.parse(props.location.search);

    const setUsuario = (event)=>
        setValues({...values,usuario:{...values.usuario,[event.target.name]:event.target.value}})    
    
    const login = (event) => {
        event.preventDefault();
        axios.post(process.env.REACT_APP_MELI_DOMAIN+'/auth/usuarios/cadastro', {...values.usuario, token}).then(response => 
            axios.post(process.env.REACT_APP_MELI_DOMAIN+'/auth/login', {...values.usuario, username:response.username}).then(res => {
                localStorage.setItem("token", res.headers['authorization']);                
                axios.get(process.env.REACT_APP_MELI_DOMAIN+"/auth/usuarios").then(res =>{
                    localStorage.setItem("usuario", JSON.stringify(res.data));
                    props.history.replace("/");
                })
            })
        );        
    }

    return (
        <div className="background">
            <div className="conteudo-login">
                <h1 className="titulo-login">Login</h1>                
                <form onSubmit={login}>
                    <div className="form-input">
                        <TextField onChange={setUsuario} label="Password" id="password" name="password" type="password" />
                        <TextField onChange={setUsuario} label="Confirme Password" id="confirm" name="confirm" />
                    </div>                    
                    <div className='btn btn-success btn-sm mt-3' type="submit">Entrar</div><br/>                                        
                </form>
            </div>
        </div>
    )
}

export default NovaSenha
