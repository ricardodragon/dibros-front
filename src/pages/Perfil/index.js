import React, { useEffect, useState } from 'react';
import './perfil.css'
import axios from 'axios';

function Perfil(props) {

    const [values, setValues] = useState({usuario:{}})    
    const host = "http://" + window.location.hostname+":7080";
    useEffect(() => axios.get(host+"/auth/usuarios").then(response=>setValues({usuario:response.data})), [host])

    const setUsuario = (event) => setValues({...values,usuario:{...values.usuario,[event.target.name]:event.target.value}})    
    const setImagemUsuario = (event) => setValues({...values, usuario:{...values.usuario, imagem:event.target.files[0], imagemPath:undefined}})

    const enviar = (event) => {
        event.preventDefault();        
        var formData = new FormData(); 
        formData.append('files', values.usuario.imagem);   
        axios.post(host+'/imagem/imagem', formData).then(imagens => 
            axios.post(host+"/auth/usuarios", {...values.usuario, imagemPath:imagens.data[0]}).then(response=>
                localStorage.setItem("usuario", JSON.stringify(response.data))
            )
        )
    }

    return <form onSubmit={enviar}>
        <fieldset id="usuario" className="p-4 mb-2" style={{borderRadius:"0.3em"}}><legend>Informações de usuário ID {values.usuario.id}</legend>
            {(values.usuario.imagem||values.usuario.imagemPath)&&
                <img alt="Imagem de perfil" style={{width:"6em", height:"6em", borderRadius: "5px", display:"inline-block"}} src={values.usuario.imagemPath?host+values.usuario.imagemPath:URL.createObjectURL(values.usuario.imagem)}/>}
            <p>
                <label htmlFor='imagem' className="p-1" style={{backgroundColor: "#3498db", borderRadius: "5px", color: "#fff", cursor: "pointer"}}>📷 Foto</label>
                <input id='imagem' style={{display:"none"}} type="file" accept='image/*' name="imagem" onChange={setImagemUsuario}/>
            </p>

            <p>
                <label style={{whiteSpace:"nowrap", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor='nome'>Nome : </label>     
                <input id="nome" required="true" value={values.usuario.nome} style={{width:"75%"}} type="text" name="nome" onChange={setUsuario}/>
            </p>            
            <p><input type="submit" value="Enviar" className="btn btn-sm btn-success mt-2"/></p>
        </fieldset>
    </form>;
}

export default Perfil;
