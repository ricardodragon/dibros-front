import React, { useState } from 'react';
import './login.css'
import TextField from '@material-ui/core/TextField';
import axios from 'axios';


function Login(props) {
    const [values, setValues] = useState( {} )
    
    const setUsuario = (event)=>
        setValues({...values,usuario:{...values.usuario,[event.target.name]:event.target.value}})    
        
    const login = (event) => {
        event.preventDefault();
        axios.post(process.env.REACT_APP_MELI_DOMAIN+'/auth/login', values.usuario).then(response => {
            localStorage.setItem("token", response.headers['authorization']);                
            axios.get(process.env.REACT_APP_MELI_DOMAIN+"/auth/usuarios").then(response =>{
                localStorage.setItem("usuario", JSON.stringify(response.data));
                props.history.replace("/");
            })
        });        
    }

    const enviaLink = event=>{event.preventDefault();axios.post(process.env.REACT_APP_MELI_DOMAIN+"/auth/usuarios/email-token?email="+values.email, null)};
    
    return (
        <div className="background">
            <div className="conteudo-login">
                <h1 className="titulo-login">Login</h1>
                
                <form onSubmit={login}>
                    <div className="form-input">
                        <TextField onChange={setUsuario} label="E-mail" id="username" name="username" />
                        <TextField onChange={setUsuario} label="Password" id="password" name="password" type="password" />
                    </div>                    
                    <input className='btn btn-dark btn-sm mt-3' type="submit" color="black" value={"Entrar"}/><br/>
                    <div className="btn btn-primary btn-sm mt-3" onClick={event=>{event.preventDefault();setValues({...values, registro:!values.registro})}}>Registre-se</div>
                    {values.registro&&<>
                        <div><TextField onChange={event => setValues({...values, email:event.target.value})} label="E-mail" id="email" name="email"/></div>
                        <div className="btn btn-success btn-sm mt-3" onClick={enviaLink}>Enviar link</div>
                    </>}
                </form>
            </div>
        </div>
    )
}

export default Login
