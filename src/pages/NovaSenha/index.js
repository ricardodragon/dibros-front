import { useState } from 'react';
import { useParams } from "react-router-dom";
import axios from '../../config/api/api';
import './login.css';

function NovaSenha(props) {
    const [values, setValues] = useState( {usuario:{}, esqueci:new URLSearchParams((props.location.search)).get('esqueci')==="true"} )
    const { token } = useParams(props.location.search);

        
    const setUsuario = (event)=>
        setValues({...values,usuario:{...values.usuario,[event.target.name]:event.target.value}})    
    
    const novoUsuario = (event) => {
        event.preventDefault();
        if(values.usuario.password !== values.usuario.confirm) return alert("Erro na confirmação da senha!!")
        localStorage.setItem("token", "Bearer "+token);        
        var formData = new FormData();   
        formData.append('files', values.usuario.imagem);                  
        // axios.post('/imagem/imagem', formData).then(imagens => 
            axios.post('/auth/usuarios', {...values.usuario, imagemPath:"imagens.data[0]"}).then(response =>{
                localStorage.removeItem("token"); 
                axios.post('/auth/login', {password:values.usuario.password, email:response.data.email}).then(res => {
                    localStorage.setItem("token", res.headers['authorization']);                
                    axios.get("/auth/usuarios").then(res =>{
                        localStorage.setItem("usuario", JSON.stringify(res.data));
                        props.history.replace("/");
                    })
                })
            });
        // ); 
    }

    return (
        <div className="background">    
            <div className="conteudo-login">
                {(values.ok||values.erro)&&<div style={{width: "100%", textAlign:"center"}}>{values.ok?"✅ Link enviado com sucesso":"❌ Erro: "+values.erro}</div>}                
                <form onSubmit={novoUsuario}>
                    <fieldset><legend>Cadastro de {values.esqueci?'nova senha':'ususario'}</legend>                                    
                        {!values.esqueci&&<>
                            {values.usuario.imagem&&<img alt="imagem de perfil" style={{width:"3em", height:"3em", borderRadius: "5px"}} src={URL.createObjectURL(values.usuario.imagem)}/>}<br/>
                            <label htmlFor='imagem' style={{backgroundColor: "#3498db", borderRadius: "5px", color: "#fff", cursor: "pointer", width:"80%", display:"block", position:"relative", left:"10%"}}>📷 Foto</label>
                            <input id='imagem' name="imagem" style={{display:"none"}} type="file" accept='image/*' onChange={event=>setValues({...values, usuario:{...values.usuario, imagem:event.target.files[0]}})}/>                        
                            <input style={{width: "80%", textAlign:"center"}} required onChange={setUsuario} placeholder="Nome" id="nome" name="nome" type="text"/>                        
                        </>}
                        <input style={{width: "80%", textAlign:"center"}} required onChange={setUsuario} placeholder="Password" id="password" name="password" type="password" />
                        <input style={{width: "80%", textAlign:"center"}} required onChange={setUsuario} placeholder="Confirme Password" id="confirm" name="confirm" type="password"/>
                        <input style={{width: "80%", textAlign:"center"}} value="Entrar" type="submit"/><br/>                                        
                    </fieldset>
                </form>
            </div>
        </div>
    )
}

export default NovaSenha
