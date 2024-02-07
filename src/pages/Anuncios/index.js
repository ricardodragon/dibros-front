import { useEffect, useState } from 'react';

import "./anuncios.css"
import axios from '../../config/api/api';
import { Link } from "react-router-dom";
import loader from "./../../assets/loadinfo.gif";
import Template from '../../estrutura/Template';

function Anuncios(props){
         
    const [values, setValues] = useState({anuncios:[]})    
    const host =process.env.REACT_APP_URL;

    useEffect(() => 
        axios.get(`/loja/anuncios?page=${0}&size=${10}`).then(res =>     
            axios.get(process.env.REACT_APP_URL+"/auth/usuarios").then(r=>
                setValues({anuncios:res.data, usuario:r.data, total:res.headers['total']})            
            )
        )
    , []);
    
    useEffect(() => 
        axios.get(`/loja/anuncios?page=${0}&size=${10}`).then(res =>     
            setValues({anuncios:res.data, total:res.headers['total']})            
        )
    , []);
    
    
    const handlerScroll = (event) => {       
        if((event.target.scrollHeight - event.target.scrollTop)-10<=event.target.clientHeight&&values.anuncios.length<values.total){                           
            axios.get(`/loja/anuncios?page=${values.anuncios.length/10}&size=${10}`).then(res =>{ 
                setValues({...values, anuncios:values.anuncios.concat(res.data)})
            })       
        }
    }


    const likeAnuncio = (event, anuncio) => {
        event.preventDefault();
        axios.post("/loja/like/"+anuncio.id).then(r=>setValues({...values, anuncios:values.anuncios.map(x=>{return x.id===anuncio.id?{...x, likeAnunciosDTO:x.likeAnunciosDTO.concat({idUsuario:r.data.idUsuario})}:x})}))
    }

    const deleteLikeAnuncio = (event, anuncio) => {
        event.preventDefault();
        axios.delete("/loja/like/"+anuncio.id).then(r=>setValues({...values, anuncios:values.anuncios.map(x=>{return x.id===anuncio.id?{...x, likeAnunciosDTO:x.likeAnunciosDTO.filter(l=>l.idUsuario!==r.data)}:x})}))
    }

    const postComentario = (event, anuncio) => {
        event.preventDefault();
        axios.post("/loja/comentario", {idAnuncio:anuncio.id, texto:anuncio.inputComentario}).then(r=>setValues({...values, anuncios:values.anuncios.map(x=> x.id===anuncio.id?{...x, inputComentario:"", comentariosDTO:x.comentariosDTO.concat({...r.data, usuarioDTO:values.usuario})}:x)}))
    }

    const postLikeComentario = (event, anuncio, comentario) => {
        event.preventDefault();
        axios.post("/loja/comentario/"+comentario.id).then(r=>setValues({...values, anuncios:values.anuncios.map(x=> x.id===anuncio.id?{...x, inputComentario:"", comentariosDTO:x.comentariosDTO.map(c=>{ 
            if(c.id===comentario.id) return {...c, likeComentariosDTO:c.likeComentariosDTO.concat({idUsuario:values.usuario.id, idComentario:c.id})}
            else if(c.comentariosDTO.filter(cc=>cc.id===comentario.id).length) return {...c, comentariosDTO:c.comentariosDTO.map(cc=>cc.id===comentario.id? {...cc, likeComentariosDTO:cc.likeComentariosDTO.concat({idUsuario:values.usuario.id, idComentario:c.id})}:cc)}                
            else return c})}:x)}));
    }
    
    const deleteLikeComentario = (event, anuncio, comentario) => {
        event.preventDefault();
        axios.delete("/loja/comentario/like/"+comentario.id).then(r=>setValues({...values, anuncios:values.anuncios.map(x=> x.id===anuncio.id?{...x, inputComentario:"", comentariosDTO:x.comentariosDTO.map(c=>c.id===comentario.id?{...c, likeComentariosDTO:c.likeComentariosDTO.filter(lc=>lc.idUsuario!==r.data)}:c)}:x)}));
    }

    const deleteComentario = (event, anuncio, comentario) => {
        event.preventDefault();
        axios.delete("/loja/comentario/"+comentario.id).then(r=>setValues({...values, anuncios:values.anuncios.map(x=> x.id===anuncio.id?{...x, comentariosDTO:x.comentariosDTO.filter(c=>c.id!==comentario.id)}:x)}));
    }
    
    const expandComentario = (event, indexAnuncio, indexComentario) => {
        event.preventDefault();
        var anuncios = values.anuncios;        
        anuncios[indexAnuncio].comentariosDTO.filter(x=>!x.idComentario)[indexComentario].expandComentario = !anuncios[indexAnuncio].comentariosDTO.filter(x=>!x.idComentario)[indexComentario].expandComentario;
        setValues({...values, anuncios});
    }

    return (
        <Template>            
            <div className="anuncios-conteudo" onScroll={handlerScroll} >
                {values.anuncios.map((anuncio, indexAnuncio) =>            
                    <section className="card-anuncio">                  
                        <header style={{padding: "2%"}}>
                            <img alt={"Fot anuncio : " +anuncio.legenda} src={host+anuncio.lojaDTO.imagemPath} style={{borderRadius: "50%", width:"3em", height:"3em"}}/>
                            <h3 style={{display: "inline", fontSize:"11pt", paddingLeft:'2%'}}>{anuncio.lojaDTO.nome}</h3>                             
                            <div style={{fontWeight:"bolder", float:"right", cursor:"pointer"}}>⋮</div>
                        </header>
                        <h2 style={{paddingLeft: "2.5%", fontSize:"12pt"}}>{anuncio.legenda}</h2>                                                                    
                        
                        <p className="teste">
                            <img src={host+anuncio.imagemPath} alt="Anúncio" id={{}} className='img-anuncio' />                                                         
                            {anuncio.anuncioProdutosDTO.filter(x=>x.imagemPath).map(x=><img src={host+x.imagemPath} className='img-anuncio' alt="Anúncio"/>)}
                        </p>
                        
                        <div style={{fontSize:"10pt", width:"100%", padding:"1%"}}>
                            <div style={{display:"inline-block", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}}>{anuncio.likeAnunciosDTO.length} likes</div>
                            <div style={{float:"right", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}} onClick={event=>{event.preventDefault();setValues({...values, anuncios:values.anuncios.map(x=>{return x.id===anuncio.id?{...x, expandComentario:!x.expandComentario}:x})})}}>{anuncio.comentariosDTO.length} comentarios</div>
                        </div>
                        
                        <div style={{borderTop:"1px solid rgba(0, 0 , 0, 0.1)", textAlign:"center", fontSize:"11pt", padding:"1%", width:"100%"}}>
                            {values.usuario&&anuncio.likeAnunciosDTO.filter(x=>x.idUsuario===values.usuario.id).length?
                            <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}} onClick={event=>deleteLikeAnuncio(event, anuncio)}><Link to={""} style={{textDecoration:'none'}}>❤️</Link></div>: 
                            <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}} onClick={event=>likeAnuncio(event, anuncio)}><Link to={""} style={{textDecoration:'none'}}>🤍</Link></div>}                     
                            <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "14ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}}><Link style={{textDecoration:'none'}} to={""} onClick={event=>{event.preventDefault();setValues({...values, anuncios:values.anuncios.map(x=>{return x.id===anuncio.id?{...x, expandComentario:!x.expandComentario}:x})})}}>💬</Link></div>
                            <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}}><Link style={{textDecoration:'none'}} to={"/anuncio-detalhes/"+anuncio.id}>🛒</Link></div>
                        </div>
                        
                        
                        {anuncio.expandComentario&&anuncio.comentariosDTO.filter(x=>!x.idComentario).map((x, index)=> 
                            <div style={{fontSize:"10pt", width:"100%", paddingLeft:"2%", paddingBottom:"4%"}} key={index}> 
                                <div style={{height:"100%", position:"absolute", float:"left"}}>
                                    <img alt="Imagem perfil user" src={x.usuarioDTO.imagemPath?host+x.usuarioDTO.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"} style={{borderRadius: "50%", width:"2em", height:"2em"}}/>                                      
                                </div>
                                {values.usuario&&x.idUsuario===values.usuario.id&&<div style={{fontWeight:"bolder", float:"right", cursor:"pointer", paddingRight:"3%", paddingLeft:"3%"}} onClick={event=>{event.preventDefault();document.getElementById(x.id+'-'+index).showModal();}}>⋮</div>}
                                
                                <dialog onClick={event=>{event.preventDefault();document.getElementById(x.id+'-'+index).close();}} id={x.id+'-'+index} style={{borderRadius:"0.5%", borderStyle:"none", width:"100%", top:'85%', textAlign:'center'}}>
                                    <label style={{width:'100%', cursor:'pointer', padding:"0.5%"}} onClick={event=>{event.stopPropagation();}}>✏️ EDITAR</label><br/>
                                    <label style={{width:'100%', cursor:'pointer', padding:"0.5%"}} onClick={event=>{deleteComentario(event, anuncio, x);document.getElementById(x.id+'-'+index).close();event.stopPropagation();}}>❌ EXCLUIR</label>
                                </dialog>

                                {values.usuario&&x.likeComentariosDTO.filter(lc=>lc.idUsuario===values.usuario.id).length?
                                    <p onClick={event=>deleteLikeComentario(event, anuncio, x)} style={{float:"right", paddingRight:"3%", cursor:"pointer"}} >❤️</p>:
                                    <p onClick={event=>postLikeComentario(event, anuncio, x)} style={{float:"right", paddingRight:"3%", cursor:"pointer"}}>🤍</p>}                                                
                                <div style={{margin:"0 2% 0 2.3em"}}><p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{x.usuarioDTO.nome||x.usuarioDTO.email}</p>{x.texto}</div>
                                <p style={{margin:"0 4% 0 2.3em", display:"inline-block"}}>{x.likeComentariosDTO.length} curtidas</p><label style={{cursor:"pointer", textDecoration:"underline"}} onClick={event=>expandComentario(event, indexAnuncio, index)}>Responder</label>  
                                
                                {x.expandComentario&&<>
                                    <input id={x.id+"comentario"} value={x.inputComentario} style={{width:"88%", border:"none", margin:"0 0 2% 2%"}} placeholder="comentario" onChange={event=>setValues({...values, anuncios:values.anuncios.map(a=> a.id===anuncio.id?{...a, comentariosDTO:a.comentariosDTO.map(c=>c.id===x.id?{...c, inputComentario:event.target.value}:c)}:a)})} type="text"/>
                                    <button style={{width:"8%", background:"none", border:"none", padding:"0"}} onClick={event=>postComentario(event, anuncio)} disabled={true}>➡️</button>
                                </>}                      
                                
                                {x.comentariosDTO&&x.comentariosDTO.length>0&&<p style={{marginBottom:"0", marginLeft:"2.3em", cursor:"pointer"}} onClick={event=>{event.preventDefault();setValues({...values, anuncios:values.anuncios.map(a=>a.id===anuncio.id?{...a, comentariosDTO:a.comentariosDTO.map(c=>c.id===x.id?{...c, expandRespostas:!c.expandRespostas}:c)}:a)})}}>⎯ Ver mais {x.comentariosDTO.length} respostas</p>}
                                
                                {x.expandRespostas&&x.comentariosDTO.map((cc, i)=>                             
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
                                )}
                            </div>
                        )}
                        {anuncio.expandComentario&&<>
                            <input id={anuncio.id+"comentario"} value={anuncio.inputComentario?anuncio.inputComentario:""} style={{width:"88%", border:"none", margin:"0 0 2% 2%"}} placeholder="comentario" onChange={event=>setValues({...values, anuncios:values.anuncios.map(x=> x.id===anuncio.id?{...x, inputComentario:event.target.value}:x)})} type="text"/>
                            <button style={{width:"8%", background:"none", border:"none", padding:"0"}} onClick={event=>postComentario(event, anuncio)} disabled={!anuncio.inputComentario}>➡️</button>
                        </>}                
                    </section>            
                )}
                <div style={{textAlign:"center"}}>{values.total&&values.anuncios.length>=values.total?"fim dos anuncios":<img style={{height:"5em"}} src={loader} alt="loading..."/>}</div>
            </div>        
        </Template>
    )
}

export default Anuncios
