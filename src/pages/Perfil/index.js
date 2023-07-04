import React, { useEffect, useState } from 'react';
import './perfil.css'
import axios from 'axios';

function Perfil(props) {

    const [values, setValues] = useState({usuario:{}})    
    useEffect(() => axios.get(process.env.REACT_APP_MELI_DOMAIN+"/auth/usuarios").then(response=>setValues({usuario:response.data})), [])

    const setUsuario = (event) => setValues({...values,usuario:{...values.usuario,[event.target.name]:event.target.value}})    
    const setImagemUsuario = (event) => setValues({...values, usuario:{...values.usuario, imagem:event.target.files[0]}})

    const enviar = (event) => {
        event.preventDefault();
        if(values.usuario.password !== values.usuario.comfirmPassword) return alert("Erro na confirmação da senha!!")
        var formData = new FormData(); 
        formData.append('files', values.usuario.imagem);   
        axios.post(process.env.REACT_APP_MELI_DOMAIN+'/imagem/imagem', formData).then(imagens => 
            axios.put(process.env.REACT_APP_MELI_DOMAIN+"/auth/usuarios", {...values.usuario, imagemPath:imagens.data[0]}).then(response=>
                localStorage.setItem("usuario", JSON.stringify(response.data))
            )
        )
    }

    return <form onSubmit={enviar}>
        <fieldset id="usuario" className="p-4 mb-2" style={{borderRadius:"0.3em"}}><legend>Informações de usuário ID {values.usuario.id}</legend>
            {(values.usuario.imagem||values.usuario.imagemPath)&&<img alt="Imagem de perfil" style={{width:"6em", height:"6em", borderRadius: "5px", display:"inline-block"}} src={values.usuario.imagemPath?process.env.REACT_APP_MELI_DOMAIN+values.usuario.imagemPath:URL.createObjectURL(values.usuario.imagem)}/>}
            <p>
                <label htmlFor='imagem' className="p-1" style={{backgroundColor: "#3498db", borderRadius: "5px", color: "#fff", cursor: "pointer"}}>📷 Foto</label>
                <input id='imagem' style={{display:"none"}} type="file" accept='image/*' name="imagem" onChange={setImagemUsuario}/>
            </p>
            <p>
                <label style={{whiteSpace:"nowrap", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor='nome'>Email : </label>     
                <input disabled id="email" value={values.usuario.email} style={{width:"75%"}} type="text" name="email"/>
            </p>
            <p>
                <label style={{whiteSpace:"nowrap", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor='nome'>Nome : </label>     
                <input id="nome" value={values.usuario.nome} style={{width:"75%"}} type="text" name="nome" onChange={setUsuario}/>
            </p>
            <p>
                <label style={{whiteSpace:"nowrap", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor='nome'>Senha : </label>     
                <input id="password" value={values.usuario.password} style={{width:"75%"}} type="password" name="password" onChange={setUsuario}/>
            </p>
            <p style={{width:"100%"}}>
                <label style={{width:"25%", fontWeight:"bold"}} className="p-1" htmlFor='nome'>Confirmar senha : </label>     
                <input id="comfirmPassword" style={{width:"75%"}} value={values.usuario.comfirmPassword} type="password" name="comfirmPassword" onChange={setUsuario}/>
            </p>
            <p><input type="submit" value="Enviar" className="btn btn-sm btn-success mt-2"/></p>
        </fieldset>
    </form>;
}

export default Perfil;