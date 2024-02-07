import React, { useState } from 'react';
import './login.css'
import axios from '../../config/api/api';
import { Link } from '@material-ui/core';
import { FcCheckmark, FcHighPriority } from 'react-icons/fc';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


function Login(props) {
    const [values, setValues] = useState( {usuario:{email:"", password:""}} )
    const history = useHistory();

    const setUsuario = (event)=>
        setValues({...values,usuario:{...values.usuario,[event.target.name]:event.target.value}})    
        
    const login = (event) => {
        event.preventDefault();
        setValues({...values, load:true})        
        axios.post('/auth/login', values.usuario).then(response => {
            localStorage.setItem("token", response.headers['authorization']);  
            history.push("/");
        }).catch(error=>setValues({...values, erro:JSON.stringify(error.response.data.message?error.response.data.message:error.response.data), ok:false, load:false}));        
    }

    const enviaLink = event=>{
        event.preventDefault();
        setValues({...values, load:true})
        axios.post("/auth/usuarios/email-token?email="+values.email+"&esqueci=true", null).then(r=>
            setValues({...values, ok:true, erro:false, load:false})
        ).catch(error=> setValues({...values, erro:"Erro ao enviar link", ok:false, load:false}))
    };
    
    return (
        <div className="background">
            {values.load&&<div style={{position:"absolute", width:"100%", height:"100%", backgroundColor:"rgba(173, 181, 189, 50%)", zIndex:"1000" }}>
                <div className="spinner-border p-1" style={{width: "3rem",height: "3rem", margin:"30% 0 0 47%"}} role="status">                    
                </div>                 
            </div>}

            <div className="conteudo-login">
                <div className={"alert alert-success "+(values.ok?"":"visually-hidden")} role="alert"><FcCheckmark/>Link enviado com sucesso</div>
                <div className={"alert alert-danger "+(values.erro?"":"visually-hidden")} role="alert"><FcHighPriority/>Erro: {values.erro}</div>
                <h1 className='mb-2'>Login</h1>                
                <form onSubmit={login}>
                    <input required onChange={setUsuario} id="email" name="email" className='w-100 mb-2' placeholder='e-mail' type='email'/>
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
