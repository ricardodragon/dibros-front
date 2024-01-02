import React, { useState } from 'react';
import './login.css'
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { Link } from '@material-ui/core';


function Login(props) {
    const [values, setValues] = useState( {} )
    const host = "https://dibros.ddns.net:7080"; 
    const setUsuario = (event)=>
        setValues({...values,usuario:{...values.usuario,[event.target.name]:event.target.value}})    
        
    const login = (event) => {
        event.preventDefault();        
        axios.post(host+'/auth/login', values.usuario).then(response => {
            localStorage.setItem("token", response.headers['authorization']);                
            axios.get(host+"/auth/usuarios").then(response =>{
                localStorage.setItem("usuario", JSON.stringify(response.data));
                props.history.replace("/");
            })
        });        
    }

    const enviaLink = event=>{event.preventDefault();axios.post(host+"/auth/usuarios/email-token?email="+values.email+"&esqueci=true", null)};
    
    return (
        <div className="background">
            <div className="conteudo-login">
                <h1 className="titulo-login">Login</h1>                
                <form onSubmit={login}>
                    <div className="form-input">
                        <TextField onChange={setUsuario} label="E-mail" id="email" name="email" />
                        <TextField onChange={setUsuario} label="Password" id="password" name="password" type="password" />
                    </div>                    
                    <input className='btn btn-dark btn-sm mt-3' type="submit" color="black" value={"Entrar"}/><br/>
                    <Link style={{display:"block", cursor:"pointer"}} onClick={event=>{event.preventDefault();setValues({...values, registro:false, email:"", esqueceu:!values.esqueceu})}}>Esqueceu a senha?</Link>
                    {values.esqueceu&&<div style={{display:"block"}}>
                        <div><TextField onChange={event => setValues({...values, email:event.target.value})} label="E-mail" id="email" name="email"/></div>
                        <div className="btn btn-success btn-sm mt-3" onClick={enviaLink}>Enviar link</div>
                    </div>}
                    <div className="btn btn-primary btn-sm mt-3" onClick={event=>{event.preventDefault();setValues({...values, registro:!values.registro, esqueceu:false})}}>Registre-se</div>
                    {values.registro&&<div style={{display:"block"}}>
                        <div><TextField onChange={event => setValues({...values, email:event.target.value})} label="E-mail" id="email" name="email"/></div>
                        <div className="btn btn-success btn-sm mt-3" onClick={enviaLink}>Enviar link</div>
                    </div>}
                </form>
            </div>
        </div>
    )
}

export default Login
