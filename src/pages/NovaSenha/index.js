import React, { useState } from 'react';
import './login.css'
import axios from 'axios';
import {useParams} from "react-router-dom";

function NovaSenha(props) {
    const [values, setValues] = useState( {usuario:{}} )
    const { token } = useParams(props.location.search);

    const setUsuario = (event)=>
        setValues({...values,usuario:{...values.usuario,[event.target.name]:event.target.value}})    
    
    const novoUsuario = (event) => {
        event.preventDefault();
        if(values.usuario.password !== values.usuario.confirm) return alert("Erro na confirmação da senha!!")
        localStorage.setItem("token", "Bearer "+token);        
        var formData = new FormData();   
        formData.append('files', values.usuario.imagem);          
        axios.post(process.env.REACT_APP_MELI_DOMAIN+'/imagem/imagem', formData).then(imagens => 
            axios.post(process.env.REACT_APP_MELI_DOMAIN+'/auth/usuarios/cadastro', {...values.usuario, imagemPath:imagens.data[0]}).then(response =>{
                localStorage.removeItem("token"); 
                axios.post(process.env.REACT_APP_MELI_DOMAIN+'/auth/login', {password:values.usuario.password, email:response.data.email}).then(res => {
                    localStorage.setItem("token", res.headers['authorization']);                
                    axios.get(process.env.REACT_APP_MELI_DOMAIN+"/auth/usuarios").then(res =>{
                        localStorage.setItem("usuario", JSON.stringify(res.data));
                        props.history.replace("/");
                    })
                })
            })
        ); 
    }

    return (
        <div className="background">
            <div className="conteudo-login">
                <form onSubmit={novoUsuario}>
                    <fieldset id="loja" className="p-1 mb-2" style={{borderRadius:"0.3em"}}><legend>Cadastro de ususario</legend>                                    
                        {values.usuario.imagem&&<img alt="imagem de perfil" style={{width:"3em", height:"3em", borderRadius: "5px", display:"inline-block"}} src={URL.createObjectURL(values.usuario.imagem)}/>}<br/>
                        <label htmlFor='imagem' className="p-1" style={{backgroundColor: "#3498db", borderRadius: "5px", color: "#fff", cursor: "pointer"}}>📷 Foto</label>
                        <input id='imagem' name="imagem" style={{display:"none"}} type="file" accept='image/*' onChange={event=>setValues({...values, usuario:{...values.usuario, imagem:event.target.files[0]}})}/>                        
                        <input className="m-2" required onChange={setUsuario} placeholder="Nome" id="nome" name="nome" type="text"/>                        
                        <input className="m-2" required onChange={setUsuario} placeholder="Password" id="password" name="password" type="password" />
                        <input className="m-2" required onChange={setUsuario} placeholder="Confirme Password" id="confirm" name="confirm" type="password"/>
                        <input className='btn btn-success btn-sm mt-3' value="Entrar" type="submit"/><br/>                                        
                    </fieldset>
                </form>
            </div>
        </div>
    )
}

export default NovaSenha
