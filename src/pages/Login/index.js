import React, { useState } from 'react';
import './login.css'
import axios from 'axios';
import { Link } from '@material-ui/core';
import { FcCheckmark, FcHighPriority } from 'react-icons/fc';


function Login(props) {
    const [values, setValues] = useState( {usuario:{email:"", password:""}} )
    const host = process.env.REACT_APP_URL; 
    const setUsuario = (event)=>
        setValues({...values,usuario:{...values.usuario,[event.target.name]:event.target.value}})    
        
    const login = (event) => {
        event.preventDefault();        
        axios.post(host+'/auth/login', values.usuario).then(response => {
            localStorage.setItem("token", response.headers['authorization']);                
            props.history.replace("/");
        }).catch(error=>setValues({...values, erro:error.response.data, ok:false}));        
    }

    const enviaLink = event=>{
        event.preventDefault();
        axios.post(host+"/auth/usuarios/email-token?email="+values.email+"&esqueci=true", null).then(r=>
            setValues({...values, ok:true, erro:false})
        ).catch(error=> setValues({...values, erro:"Erro ao enviar link", ok:false}))
    };
    
    return (
        <div className="background">
            <div className="conteudo-login">
                <div className={"alert alert-success "+(values.ok?"":"visually-hidden")} role="alert"><FcCheckmark/>Link enviado com sucesso</div>
                <div className={"alert alert-danger "+(values.erro?"":"visually-hidden")} role="alert"><FcHighPriority/>Erro: {values.erro}</div>
                <h1 className='mb-2'>Login</h1>                
                <form onSubmit={login}>
                    <input required onChange={setUsuario} id="email" name="email" className='w-100 mb-2' placeholder='e-mail'/>
                    <input required onChange={setUsuario} id="password" name="password" type="password" className='w-100 mb-2' placeholder='senha'/>
                    <input className='btn btn-dark btn-sm mt-3 w-100 mb-2' type="submit" value={"Entrar"}/>
                </form>
                <form onSubmit={enviaLink}>
                    <Link style={{display:"block", cursor:"pointer"}} className='mb-2' onClick={event=>{event.preventDefault();setValues({...values, registro:false, email:"", esqueceu:!values.esqueceu})}}>Esqueceu a senha?</Link>
                    {values.esqueceu&&<>
                        <input required onChange={event => setValues({...values, email:event.target.value})} id="emailEsqueci" name="email" className='w-100 mb-2' placeholder='digite seu email para recuperar a senha'/>
                        <input className="btn btn-success btn-sm mt-3 w-100 mb-2" type='submit' value="Enviar link"/>
                    </>}
                </form>
                <form onSubmit={enviaLink}>
                    <input type="button" className="btn btn-primary btn-sm mt-3 w-100 mb-2" onClick={event=>{event.preventDefault();setValues({...values, registro:!values.registro, esqueceu:false})}} value="Registre-se"/>
                    {values.registro&&<>
                        <input required onChange={event => setValues({...values, email:event.target.value})} id="emailNovo" name="email" placeholder='digite seu email para receber o link' className='w-100'/>
                        <input className="btn btn-success btn-sm mt-3 w-100 mb-2" type='submit' value="Enviar link" />
                    </>}
                </form>
            </div>
            
        </div>
    )
}

export default Login
