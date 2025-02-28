import React, { useEffect, useState } from 'react';
import './../header.css';
import axios from '../../../config/api/api';
import { Link } from 'react-router-dom';

function Colaborador(props){
    const [values, setValues] = useState({});
    const host = process.env.REACT_APP_URL;

    useEffect(() => 
        axios.get("/loja/lojas/"+props.id).then(loja => setValues({loja:loja.data}))
    , [props.id])



    return values.loja?
        <div style={{padding:'1%', textAlign:'left'}}>
            <Link style={{display:'inline', verticalAlign:'top', width:'50%'}} to={"/perfil/"+values.loja.id}><img alt="Imagem perfil user" src={values.loja.imagemPath?host+values.loja.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"} style={{borderRadius: "50%", width:"2.7em", height:"2.7em"}}/></Link>                                      
            <div style={{display:'inline-block', width:'50%'}}><Link to={"/perfil/"+values.loja.id}><p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{values.loja.nome}</p></Link><p style={{whiteSpace:'break-spaces', lineHeight:'normal'}}>te convidou para ser colaborador</p></div>            
            <button style={{display:'inline', backgroundColor:'#858080', color:'white', borderRadius:'7%', cursor:'pointer'}} onClick={event=>{event.preventDefault();axios.put("/loja/seguidores/"+values.usuario.id).then(props.setNotificacao(props.index))}}>aceitar</button>
            <button style={{display:'inline', backgroundColor:'#858080', color:'white', borderRadius:'7%', cursor:'pointer'}} onClick={event=>axios.delete("/loja/seguidores/"+values.usuario.id).then(props.removeNotificacao(props.index))}>recusar</button>
            <hr/>
        </div>:
        <></>;
}
export default Colaborador