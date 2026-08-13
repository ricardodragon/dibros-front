import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from '../../config/api/api';
import loader from "./../../assets/loadinfo.gif";
import './login.css';

function Cadastro(props) {
    const [values, setValues] = useState( {usuario:{}, esqueci:new URLSearchParams((props.location.search)).get('esqueci')==="true"} )
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
        const {imagem, ...usuario} = values.usuario;
        var formData = new FormData();   
        formData.append('usuarioPostDTO', new Blob([JSON.stringify(usuario)], { type: 'application/json' }));
        formData.append('imagem', imagem);                  
        axios.post('/auth/usuarios', formData).then(response => {
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
                {(values.ok||values.erro)&&<div style={{width: "100%", textAlign:"start", paddingBottom:"3%"}}>{values.ok?"✅ Cadastro realizado com sucesso":"❌ Erro ao cadastrar usuario"}</div>}                
                <form onSubmit={novoUsuario}>
                    <fieldset style={{textAlign:"start"}}><legend>Cadastro de ususario</legend>        
                        <fieldset className='cadastro-imagem'><legend>Foto</legend>
                            <img alt="imagem de perfil" style={{width:"3em", borderRadius: "5px", aspectRatio: "1 / 1", display: "inline-block", verticalAlign: "middle"}} src={values.usuario.imagem?URL.createObjectURL(values.usuario.imagem):"https://freesvg.org/img/abstract-user-flat-3.png"}/>
                            <label id="imagem-label" htmlFor='imagem' style={{cursor: "pointer",  padding:"1%"}}>✏️</label>
                            <input id='imagem' style={{opacity: 0}} required name="imagem" aria-labelledby="imagem-label" type="file" accept='image/*' onChange={event=>setValues({...values, usuario:{...values.usuario, imagem:event.target.files[0]}})}/>
                        </fieldset>
                        <fieldset className='cadastro-informacoes'><legend>Informações</legend>
                            <input style={{width: "100%", textAlign:"center"}} required onChange={setUsuario} placeholder="Nome" id="nome" name="nome" type="text"/>

                            <div style={{position: "relative", textAlign:"start", margin: "auto"}}>
                                <input style={{width: "100%", textAlign:"center"}} minLength="8" required onChange={setUsuario} placeholder="Password" id="password" name="password" type={values.mostrarSenha?"text":"password"} />
                                {values.usuario.password&&<span id="mostrarSenha" style={{position: "absolute", transform: "translateY(-50%)", right: "10px", top: "50%", cursor:"pointer"}} onClick={mostrarSenha}>{values.mostrarSenha?'🙈':'👁️'}</span>}
                            </div>
                            
                            <div style={{position: "relative", textAlign:"start", margin: "auto"}}>
                                <input style={{width: "100%", textAlign:"center"}} minLength="8" required onChange={setUsuario} placeholder="Confirme Password" id="confirm" name="confirm" type={values.mostrarConfirmarSenha?"text":"password"} />
                                {values.usuario.confirm&&<span id="mostrarConfirmarSenha"  style={{position: "absolute", transform: "translateY(-50%)", right: "10px", top: "50%", cursor:"pointer"}} onClick={mostrarSenha}>{values.mostrarConfirmarSenha?'🙈':'👁️'}</span>}
                            </div>
                        </fieldset>
                        <input style={{width: "100%", textAlign:"center"}} value="enviar" type="submit"/><br/>                                        
                    </fieldset>
                </form>
            </div>
        </>
    )
}

export default Cadastro
