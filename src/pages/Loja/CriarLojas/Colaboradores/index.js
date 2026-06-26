import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from '../../../../config/api/api';
import loader from "./../../../../assets/loadinfo.gif";

function Colaboradores(props) {
    
    const [values, setValues] = useState({loader:true, colabEmail:""})
    const host = process.env.REACT_APP_URL;

    useEffect(() =>{
        setValues({loader:true})
        return props.loja?
            axios.get(`/loja/lojas/usuarios/${props.loja.id}?page=${0}&size=${10}`)
                .then(res => setValues({usuarioLojas:res.data, loader:false, colabEmail:""})):""
    }, [props.loja]);

    const convidarUsuario = event => axios.post('/loja/lojas/usuarios', {idLoja:props.loja.id, idUsuario:values.colaborador.usuarioDTO.id, admin:false})
        .then(r=>setValues({...values, usuarioLojas:[{...values.colaborador, idLoja:props.loja.id, idUsuario:values.colaborador.usuarioDTO.id, criacao:new Date().toLocaleString()}].concat(values.usuarioLojas), colaborador:undefined}))

    return(         
        <div style={{width:'98%', height:'100%', padding:'1%'}} onClick={event=>event.stopPropagation()}>
            
            {values.loader&&<img style={{height:"5em", top:"50%"}} src={loader} alt="loading..."/>}
            
            {props.loja&&<fieldset style={{margin:'0', border:'solid 1px', marginBottom:'3%'}}>
                <div style={{textAlign:'left'}}>
                    <form onSubmit={async event=>{event.preventDefault();setValues({...values, colaborador:(await axios.get('/loja/lojas/usuarios/email?email='+values.colabEmail+'&idLoja='+props.loja.id)).data})}}>
                        <input type="email" required placeholder="email do novo colaborador" value={values.colabEmail||''} onChange={event=>setValues({...values, colabEmail:event.target.value})} style={{width:'90%'}}/><input value='🔍' type="submit" style={{width:'10%', cursor:'pointer'}}/>
                    </form>
                </div>

                {values.colaborador&&<div>
                    <div style={{textAlign:'left', width:'100%'}}>
                        <img alt="Imagem perfil user" src={values.colaborador.usuarioDTO.imagemPath?host+values.colaborador.usuarioDTO.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"} style={{display:'inline', verticalAlign:'top', borderRadius: "50%", width:"1.8em", height:"1.8em"}}/>                                     
                        <div style={{display:'inline-block', width:'40%'}}>
                            {values.colaborador.usuarioDTO.nome&&<p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{values.colaborador.usuarioDTO.nome}</p>}
                            {values.colaborador.usuarioDTO.email&&<p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{values.colaborador.usuarioDTO.email}</p>}
                        </div>  
                        <div style={{display: 'inline-block', width:'40%'}}>
                            <input type="checkbox" id="admin" onChange={event=>setValues({...values, colaborador:{...values.colaborador, admin:!values.colaborador.admin}})}/><label htmlFor="admin">adm</label>  
                            <button style={{cursor:'pointer', display:'block'}} onClick={convidarUsuario} disabled={values.colaborador.conviteAceito!==null}>
                                {values.colaborador.conviteAceito===null?'convidar':values.colaborador.conviteAceito?'colaborador':'aguardando'}
                            </button>                                
                        </div>
                        <hr></hr>
                    </div>
                </div>}
            </fieldset>}

            {values.usuarioLojas&&values.usuarioLojas.map(userLoja=>
                <div style={{textAlign:'left'}} key={userLoja.idUsuario+''+userLoja.idLoja}>
                    <Link style={{display:'inline', verticalAlign:'top'}} to={"/perfil/"+userLoja.usuarioDTO.id}><img alt="Imagem perfil user" src={userLoja.usuarioDTO.imagemPath?host+userLoja.usuarioDTO.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"} style={{borderRadius: "50%", width:"2.7em", height:"2.7em"}}/></Link>                                      
                    <div style={{display:'inline-block', width:'80%'}}>
                        <Link to={"/perfil/"+userLoja.usuarioDTO.id} style={{display:'inline-block'}}>
                            {userLoja.usuarioDTO.nome&&<p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{userLoja.usuarioDTO.nome}</p>}
                            {userLoja.usuarioDTO.email&&<p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{userLoja.usuarioDTO.email}</p>}
                        </Link>
                        <p style={{whiteSpace:'break-spaces', lineHeight:'normal'}}></p>
                        <button style={{display:'inline-block', width:'47%'}} disabled>{userLoja.conviteAceito?'colaborador':'aguardando'}</button>
                        {(props.loja.usuarioDTO.id===JSON.parse(localStorage.getItem("usuario")).id||(props.loja.usuarioLojasDTO&&props.loja.usuarioLojasDTO[0].admin))&&<button onClick={event=> axios.delete(`/loja/lojas/usuarios/${userLoja.idUsuario}/${userLoja.idLoja}`).then(r=>setValues({...values, colaboradores:values.colaboradores.filter(x=>x.idUsuario!==userLoja.idUsuario)}))} style={{display:'inline-block', color:'white', backgroundColor:'rgba(255, 0, 0, 0.70)', width:'47%', cursor:'pointer'}}>{userLoja.conviteAceito?'excluir':'cancelar'}</button>}
                    </div>            
                    <hr></hr>
                </div>
            )}
            
        </div>)

}export default Colaboradores;