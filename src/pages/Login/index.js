import { useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from '../../config/api/api';
import './login.css';


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
            history.push("/")
        }).catch(error=>setValues({...values, erro:JSON.stringify(error.response&&error.response.data?error.response.data.message?error.response.data.message:error.response.data:"Erro inesperado"), ok:false, load:false}));        
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
            </div>}

            <div className="conteudo-login">
                {(values.ok||values.erro)&&<div style={{width: "100%", textAlign:"center"}}>{values.ok?"✅ Link enviado com sucesso":"❌ Erro: "+values.erro}</div>}                
                <h1>Login</h1>                
                <form onSubmit={login}>
                    <input style={{width: "80%", textAlign:"center"}} required onChange={setUsuario} id="email" name="email" placeholder='e-mail' type='email'/>
                    <input style={{width: "80%", textAlign:"center"}} required onChange={setUsuario} id="password" name="password" type="password" placeholder='senha'/>
                    <input style={{width:"80%"}} type="submit" value={"Entrar"}/>                    
                </form>
                <form onSubmit={enviaLink}>                      
                <input style={{width:"80%"}} type='button' value="Esqueceu a senha?" onClick={event=>{event.preventDefault();setValues({...values, registro:false, email:"", esqueceu:!values.esqueceu})}}/>
                    {values.esqueceu&&<>
                        <input style={{width:"60%"}} required onChange={event => setValues({...values, email:event.target.value})} id="emailEsqueci" name="email" type='email' placeholder='digite seu email para recuperar a senha'/>
                        <input style={{width:"20%"}} type='submit' value="Enviar link"/>
                    </>}
                </form>
                <form onSubmit={enviaLink}>
                    <input type="button" style={{width:"80%"}} onClick={event=>{event.preventDefault();setValues({...values, registro:!values.registro, esqueceu:false})}} value="Registre-se"/>
                    {values.registro&&<>
                        <input style={{width:"60%"}} required onChange={event =>{event.preventDefault(); setValues({...values, email:event.target.value})}} type='email' id="emailNovo" name="email" placeholder='digite seu email para receber o link'/>
                        <input style={{width:"20%"}} type='submit' value="Enviar" />
                    </>}
                </form>
            </div>    
        </div>
    )
}

export default Login
