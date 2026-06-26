import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../../config/api/api";
import './loja-comentario.css'



function LojaComentarios(props){

     const [values, setValues] = useState({})    
     const host = process.env.REACT_APP_URL;
     const history = useHistory();

    useEffect(() =>{
        axios.get("/loja/loja/comentarios/"+props.id).then(res=>setValues({comentarios:res.data, comentario:'', usuario:JSON.parse(localStorage.getItem("usuario"))}));
    }, [props.id]); 
    
    const postComentario = (event) => axios.post("/loja/loja/comentarios", {idLoja:props.id, texto:values.comentario}).then(r=>setValues({...values, comentario:'', comentarios:[{id:r.data, texto:values.comentario, usuarioDTO:values.usuario, idLoja:props.id}].concat(values.comentarios)}))
    
    
    const deleteComentario = (event, id) => {
        event.preventDefault();
        event.stopPropagation();
        axios.delete("/loja/loja/comentarios/"+id).then(r=>{
            document.getElementById(id).close();
            setValues({...values, comentarios:values.comentarios.filter(x=> x.id!==id)})            
        });
    }

    const postLikeComentario = (event, id) => {
        event.preventDefault();
        event.stopPropagation();
        axios.post("/loja/loja/comentario/like/"+id).then(r=>{
            setValues({...values, comentarios:values.comentarios.map(x=>x.id===id?{...x, isLike:true, likesQTD:x.likesQTD+1}:x)})
        })
    }
    
    const deleteLikeComentario = (event, id) => {
        event.preventDefault();
        event.stopPropagation();
        axios.delete("/loja/loja/comentario/like/"+id).then(r=>setValues({...values, comentarios:values.comentarios.map(c=>c.id===id?{...c, isLike:false, likesQTD:c.likesQTD-1}:c)}));
    }
    
    const expandComentario = (event, index) => {
        event.preventDefault();
        const comentarios = values.comentarios;
        comentarios[index] = {...comentarios[index], expand:!comentarios[index].expand}
        setValues({...values, comentarios});
    }

    const irPerfil = id => history.push("/perfil/"+id); 
    const onError = ({ currentTarget })=>{currentTarget.onError=null; currentTarget.src='https://freesvg.org/img/abstract-user-flat-3.png'}
    const opcoes = (id) => document.getElementById(id).showModal();
    const responder = (event, index) => setValues({...values, comentarios:values.comentarios.map((x, indexC)=>indexC===index?{...x, inputResposta:event.target.value}:x)})
    const postResposta = (event) => null;
    const expandResposta = (index) => setValues({...values, comentarios:values.comentarios.map((c, indexC)=>indexC===index?{...c, expandRespostas:!c.expandRespostas}:c)});

    
    return<>
        {values.comentarios&&values.comentarios.map((x, index)=> 
            <div className="comentario-conteudo" key={index}> 
                <img className="comentario-usuario-imagem" alt="Imagem perfil user" onClick={event=>irPerfil(x.usuarioDTO.id)} onError={onError} src={x.usuarioDTO.imagemPath?host+x.usuarioDTO.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"}/>
                <div className="nome-texto">
                    <p className="nome-perfil" onClick={event=>irPerfil(x.usuarioDTO.id)}>{x.usuarioDTO.nome||x.usuarioDTO.email}</p>
                    <p className="comentario-texto">{x.texto}</p>
                    {values.usuario&&x.isLike?
                        <p className="comentario-like" onClick={event=>deleteLikeComentario(event, x.id)}>❤️ {x.likesQTD}</p>:
                        <p className="comentario-like" onClick={event=>postLikeComentario(event, x.id)}>🤍 {x.likesQTD}</p>}
                    {values.usuario&&<label style={{cursor:"pointer", textDecoration:"underline", float: "right"}} onClick={event=>expandComentario(event, index)}>Responder</label>}
                </div>

                {values.usuario&&x.usuarioDTO.id===values.usuario.id&&<div className="opcoes" onClick={event=>opcoes(x.id)}>⋮</div>}
                <dialog onClick={event=>document.getElementById(x.id).close()} id={x.id}>
                    <label onClick={event=>{event.stopPropagation();}}>✏️ EDITAR</label><br/>
                    <label onClick={event=>deleteComentario(event, x.id)}>❌ EXCLUIR</label>
                </dialog>            

                {x.expand&&<div style={{width:"100%", position:"relative"}}>
                    <textarea id={x.id+"comentario"} value={x.inputComentario} className="responder-input" placeholder="comentario" onChange={event=>responder(event, index)} type="text"/>
                    <button className="responder-botao" onClick={postResposta} disabled={!values.resposta}>➡️</button>
                </div>}                      
                
                {x.respostasQTD>0&&<p className="expand-resposta" onClick={event=>expandResposta(index)}>⎯ Ver mais {x.respostasQTD} respostas</p>}
                
                {/* {x.expandRespostas&&x.comentariosDTO.map((cc, i)=>                             
                    <div style={{marginLeft:"2.3em"}}>                   
                        <div style={{height:"100%", position:"absolute", float:"left"}}>
                            <img alt="Imagem perfil user" src={host+cc.usuarioDTO.imagemPath} style={{borderRadius: "50%", width:"2em", height:"2em"}}/>                                      
                        </div>             
                        <div style={{fontWeight:"bolder", float:"right", cursor:"pointer", paddingRight:"3%", paddingLeft:"3%"}} onClick={event=>{event.preventDefault();document.getElementById(cc.id+'-'+i).showModal();}}>⋮</div>                                
                        <dialog onClick={event=>{event.preventDefault();document.getElementById(cc.id+'-'+i).close();}} id={cc.id+'-'+i} style={{borderRadius:"0.5%", borderStyle:"none", width:"100%", top:'85%', textAlign:'center'}}>
                            <label style={{width:'100%', cursor:'pointer', padding:"0.5%"}} onClick={event=>{event.stopPropagation();}}>✏️ EDITAR</label><br/>
                            <label style={{width:'100%', cursor:'pointer', padding:"0.5%"}} onClick={event=>{deleteComentario(event, anuncio, x);document.getElementById(cc.id+'-'+i).close();event.stopPropagation();}}>❌ EXCLUIR</label>
                        </dialog>
                        {cc.likeComentariosDTO.filter(lc=>lc.idUsuario===values.usuario.id).length?
                        <p onClick={event=>deleteLikeComentario(event, anuncio, cc)} style={{float:"right", paddingRight:"3%", cursor:"pointer"}} >❤️</p>:
                        <p onClick={event=>postLikeComentario(event, anuncio, cc)} style={{float:"right", paddingRight:"3%", cursor:"pointer"}}>🤍</p>}                        
                        <div style={{margin:"0 2% 0 2.3em"}}><p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{cc.usuarioDTO.nome||cc.usuarioDTO.email}</p>{cc.texto}</div>
                    </div>
                )} */}
            </div>
        )}
        {values.usuario&&<>
            <input value={values.comentario} style={{width:"88%", border:"none", margin:"0 0 2% 2%"}} placeholder="comentario" onChange={event=>setValues({...values, comentario:event.target.value})} type="text"/>
            <button style={{width:"8%", background:"none", border:"none", padding:"0", cursor:'pointer'}} onClick={postComentario} disabled={!values.comentario}>➡️</button>
        </>}
    </>
}

export default LojaComentarios