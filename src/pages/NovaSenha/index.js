import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from '../../config/api/api';
import loader from "./../../assets/loadinfo.gif";
import './../Cadastro/login.css';

function NovaSenha(props) {
    const [values, setValues] = useState( {usuario:{}} )
    const { token } = useParams(props.location.search);
        
    const setUsuario = (event)=>
        setValues({...values,usuario:{...values.usuario,[event.target.name]:event.target.value}})    
    
    useEffect(() => {
        const input = document.getElementById('confirm');
        values.usuario.confirm!==values.usuario.password?
            input.setCustomValidity('As senhas não coincidem!'):input.setCustomValidity('');
    }, [values.usuario.password, values.usuario.confirm]); 

    const novoUsuario = (event) => {
        event.preventDefault();
        setValues({...values, load:true});        
        localStorage.setItem("token", "Bearer "+token);        
        axios.put('/auth/usuarios/password', {password:values.usuario.password}).then(response => {
            setValues({...values, load:false, ok:true, erro:false});
            setTimeout(() => props.history.replace("/login"), 2000);
        }).catch(r=>setValues({...values, load:false, ok:false, erro:true}));
    }

    const mostrarSenha = event => {
        event.stopPropagation();
        setValues({...values, [event.target.id]:!values[event.target.id]});
    }

    return (
        <>
            {values.load&&<div className='loader-produto'><img src={loader} alt="loading..."/></div>}
            <div className="conteudo-cadastro">
                <h1 style={{textAlign:"center", fontWeight:"bolder", padding:"5%"}}>Dibros</h1>
                {(values.ok||values.erro)&&<div style={{width: "100%", textAlign:"start", paddingBottom:"3%"}}>{values.ok?"✅ Senha cadastrada com sucesso":"❌ Erro ao cadastrar nova senha"}</div>}                
                <form onSubmit={novoUsuario}>
                    <fieldset style={{textAlign:"start"}}><legend>Nova senha</legend>                                
                        <div style={{position: "relative", textAlign:"start", margin: "auto"}}>
                            <input style={{width: "100%", textAlign:"center"}} minLength="8" required onChange={setUsuario} placeholder="Password" id="password" name="password" type={values.mostrarSenha?"text":"password"} />
                            {values.usuario.password&&<span id="mostrarSenha" style={{position: "absolute", transform: "translateY(-50%)", right: "10px", top: "50%", cursor:"pointer"}} onClick={mostrarSenha}>{values.mostrarSenha?'🙈':'👁️'}</span>}
                        </div>
                        
                        <div style={{position: "relative", textAlign:"start", margin: "auto"}}>
                            <input style={{width: "100%", textAlign:"center"}} minLength="8" required onChange={setUsuario} placeholder="Confirme Password" id="confirm" name="confirm" type={values.mostrarConfirmarSenha?"text":"password"} />
                            {values.usuario.confirm&&<span id="mostrarConfirmarSenha"  style={{position: "absolute", transform: "translateY(-50%)", right: "10px", top: "50%", cursor:"pointer"}} onClick={mostrarSenha}>{values.mostrarConfirmarSenha?'🙈':'👁️'}</span>}
                        </div>

                        <input style={{width: "100%", textAlign:"center"}} value="enviar" type="submit"/><br/>                                        
                    </fieldset>
                </form>
            </div>
        </>
    )
}

export default NovaSenha
