import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../../config/api/api";



function AnuncioComentarios(props){

     const [values, setValues] = useState({})    
     const host = process.env.REACT_APP_URL;

    useEffect(() =>{
        axios.get("/loja/anuncios/comentarios/"+(localStorage.getItem("token")?props.id:"public/"+props.id)).then(res=>setValues({comentarios:res.data, resposta:'', usuario:JSON.parse(localStorage.getItem("usuario"))}));
    }, [props.id]); 
    
    const postComentario = (event) => {
        event.preventDefault();
        axios.post("/loja/anuncios/comentarios", {idAnuncio:props.id, texto:values.resposta}).then(r=>setValues({...values, resposta:'', comentarios:[{id:r.data, texto:values.resposta, usuarioDTO:values.usuario, idAnuncio:props.id}].concat(values.comentarios)}))
    }
    
    const deleteComentario = (event, id) => {
        event.preventDefault();
        event.stopPropagation();
        axios.delete("/loja/anuncios/comentarios/"+id).then(r=>{
            document.getElementById(id).close();
            setValues({...values, comentarios:values.comentarios.filter(x=> x.id!==id)})            
        });
    }

    const postLikeComentario = (event, id) => {
        event.preventDefault();
        event.stopPropagation();
        axios.post("/loja/anuncios/comentarios/like/"+id).then(r=>{
            setValues({...values, comentarios:values.comentarios.map(x=>x.id===id?{...x, isLike:true, likesQTD:x.likesQTD+1}:x)})
        })
    }
    
    const deleteLikeComentario = (event, id) => {
        event.preventDefault();
        event.stopPropagation();
        axios.delete("/loja/anuncios/comentarios/like/"+id).then(r=>setValues({...values, comentarios:values.comentarios.map(c=>c.id===id?{...c, isLike:false, likesQTD:c.likesQTD-1}:c)}));
    }

    
    const expandComentario = (event, index) => {
        event.preventDefault();
        const comentarios = values.comentarios;
        comentarios[index] = {...comentarios[index], expand:!comentarios[index].expand}
        setValues({...values, comentarios});
    }

    return<>
        {values.comentarios&&values.comentarios.map((x, index)=> 
            <div style={{fontSize:"10pt", width:'100%', paddingBottom:"4%"}} key={index}> 
                <Link style={{display:'inline', verticalAlign:'top'}} to={"/perfil/"+x.usuarioDTO.id}><img alt="Imagem perfil user" src={x.usuarioDTO.imagemPath?host+x.usuarioDTO.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"} style={{borderRadius: "50%", width:"2.7em", height:"2.7em"}}/></Link>                                      
                
                {values.usuario&&x.usuarioDTO.id===values.usuario.id&&<div style={{fontWeight:"bolder", float:"right", cursor:"pointer", paddingLeft:"3%"}} onClick={event=>{event.preventDefault();document.getElementById(x.id).showModal();}}>⋮</div>}
                
                <dialog onClick={event=>{event.preventDefault();document.getElementById(x.id).close();}} id={x.id} style={{borderRadius:"0.5%", borderStyle:"none", width:"100%", top:'85%', textAlign:'center'}}>
                    <label style={{width:'100%', cursor:'pointer', padding:"0.5%"}} onClick={event=>{event.stopPropagation();}}>✏️ EDITAR</label><br/>
                    <label style={{width:'100%', cursor:'pointer', padding:"0.5%"}} onClick={event=>{deleteComentario(event, x.id);}}>❌ EXCLUIR</label>
                </dialog>

                {values.usuario&&x.isLike?
                    <p onClick={event=>deleteLikeComentario(event, x.id)} style={{float:"right", paddingRight:"3%", cursor:"pointer"}} >{x.likesQTD} ❤️</p>:
                    <p onClick={event=>postLikeComentario(event, x.id)} style={{float:"right", paddingRight:"3%", cursor:"pointer"}}>{x.likesQTD} 🤍</p>}                                                
                <div style={{display:'inline-block', width:'80%'}}><Link to={"/perfil/"+x.usuarioDTO.id}><p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{x.usuarioDTO.nome||x.usuarioDTO.email}</p></Link><p style={{whiteSpace:'break-spaces', lineHeight:'normal'}}>{x.texto}</p></div>
                
                <div>
                    <p style={{margin:"0 4% 0 2.3em", display:"inline-block"}}>{x.likesQTD} curtidas</p>{values.usuario&&<label style={{cursor:"pointer", textDecoration:"underline"}} onClick={event=>expandComentario(event, index)}>Responder</label>}  
                </div>

                {x.expand&&<>
                    <input id={x.id+"comentario"} value={x.inputComentario} style={{width:"88%", border:"none", margin:"0 0 2% 2%"}} placeholder="comentario" onChange={event=>setValues({...values, comentarios:values.comentarios.map((x, indexC)=>indexC===index?{...x, inputResposta:event.target.value}:x)})} type="text"/>
                    <button style={{width:"8%", background:"none", border:"none", padding:"0"}} onClick={event=>postComentario(event)} disabled={true}>➡️</button>
                </>}                      
                
                {x.respostasQTD>0&&<p style={{marginBottom:"0", marginLeft:"2.3em", cursor:"pointer"}} onClick={event=>{event.preventDefault();setValues({...values, comentarios:values.comentarios.map((c, indexC)=>indexC===index?{...c, expandRespostas:!c.expandRespostas}:c)})}}>⎯ Ver mais {x.respostasQTD} respostas</p>}
                
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
            <input value={values.resposta} style={{width:"88%", border:"none", margin:"0 0 2% 2%"}} placeholder="comentario" onChange={event=>setValues({...values, resposta:event.target.value})} type="text"/>
            <button style={{width:"8%", background:"none", border:"none", padding:"0", cursor:'pointer'}} onClick={postComentario} disabled={!values.resposta}>➡️</button>
        </>}
    </>
}

export default AnuncioComentarios