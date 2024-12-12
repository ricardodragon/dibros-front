import { useEffect, useState } from 'react';

import "./anuncios.css"
import axios from '../../../config/api/api';
import { Link } from "react-router-dom";
import loader from "./../../../assets/loadinfo.gif";


function ListarAnuncios(props){
         
    const [values, setValues] = useState({})    
    const host = process.env.REACT_APP_URL;

    useEffect(() => 
        axios.get(`${props.id?'/loja/anuncios/usuario/'+props.id:'/loja/anuncios/public'}?page=${0}&size=${10}`).then(anuncios =>     
            setValues({anuncios:anuncios.data, total:anuncios.headers['total'], usuario:JSON.parse(localStorage.getItem('usuario'))})            
        )
    , [props.id])    

    const handlerScroll = (event) => {
        if((event.target.scrollHeight - event.target.scrollTop)-10<=event.target.clientHeight&&values.anuncios&&values.total&&values.anuncios.length<values.total)  
            axios.get(`${props.id?'/loja/anuncios/usuario/'+props.id:'/loja/anuncios/public'}?page=${values.anuncios.length/10}&size=${10}`).then(anuncios =>{ 
                setValues({...values, anuncios:values.anuncios.concat(anuncios.data), total:anuncios.headers.total})
            });
        if(props.onScroll)props.onScroll(event);
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
        <div className="anuncios-conteudo" onScroll={handlerScroll}>
            {values.anuncios&&values.anuncios.filter(x=>x.legenda!=="vai me perder").map((anuncio, indexAnuncio) =>            
                <div className="card-anuncio" key={"anuncio-"+indexAnuncio}>                  
                    <header style={{padding: "2%"}}>
                        <Link style={{display:'inline'}} to={anuncio.lojaDTO?"":"/perfil/"+anuncio.usuarioDTO}><img alt={"Foto anuncio : " +anuncio.legenda} src={host+(anuncio.lojaDTO?anuncio.lojaDTO.imagemPath:anuncio.usuarioDTO.imagemPath)} style={{borderRadius: "50%", width:"3em", height:"3em"}}/></Link>
                        <div style={{fontWeight:"bolder", float:"right", cursor:"pointer"}}>⋮</div>
                        <h3 style={{display: "inline", fontSize:"11pt", verticalAlign:'top', whiteSpace:'break-spaces'}}>{anuncio.lojaDTO?anuncio.lojaDTO.nome:anuncio.usuarioDTO.nome}</h3>                             
                    </header>
                    <h2 style={{paddingLeft: "2.5%", fontSize:"12pt", whiteSpace:'break-spaces'}}>{anuncio.legenda}</h2>                                                                    
                    
                    <p className="teste">
                        <img src={host+anuncio.imagemPath} alt="Anúncio" className='img-anuncio' />                                                         
                        {anuncio.anuncioProdutosDTO.filter(x=>x.imagemPath).map(x=><img src={host+x.imagemPath} className='img-anuncio' alt="Anúncio"/>)}
                    </p>
                    <div style={{fontWeight:"bolder", textAlign:"center", fontSize:"10pt", padding:"1%"}}>
                        R$ {anuncio.preco},00
                    </div>
                    <div style={{fontSize:"10pt", padding:"1%"}}>
                        <div style={{display:"inline-block", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}}>{anuncio.likeAnunciosDTO.length} curtidas</div>
                        <div style={{float:"right", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}} onClick={event=>{event.preventDefault();setValues({...values, anuncios:values.anuncios.map(x=>{return x.id===anuncio.id?{...x, expandComentario:!x.expandComentario}:x})})}}>{anuncio.comentariosDTO.length} comentarios</div>
                    </div>
                    
                    <div style={{borderTop:"1px solid rgba(0, 0 , 0, 0.1)", textAlign:"center", fontSize:"11pt", padding:"1%"}}>
                        {values.usuario&&anuncio.likeAnunciosDTO.filter(x=>x.idUsuario===values.usuario.id).length?
                        <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}} onClick={event=>deleteLikeAnuncio(event, anuncio)}><Link to={""} style={{textDecoration:'none'}}>❤️</Link></div>: 
                        <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}} onClick={event=>likeAnuncio(event, anuncio)}><Link to={""} style={{textDecoration:'none'}}>🤍</Link></div>}                     
                        <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "14ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}}><Link style={{textDecoration:'none'}} to={""} onClick={event=>{event.preventDefault();setValues({...values, anuncios:values.anuncios.map(x=>{return x.id===anuncio.id?{...x, expandComentario:!x.expandComentario}:x})})}}>💬</Link></div>
                        <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}}><Link style={{textDecoration:'none'}} to={"/anuncio-detalhes/"+anuncio.id}>🛒</Link></div>
                    </div>
                    
                    
                    {anuncio.expandComentario&&anuncio.comentariosDTO.filter(x=>!x.idComentario).map((x, index)=> 
                        <div style={{fontSize:"10pt", width:'100%', paddingBottom:"4%"}} key={index}> 
                            <Link style={{display:'inline', verticalAlign:'top'}} to={"/perfil/"+x.usuarioDTO.id}><img alt="Imagem perfil user" src={x.usuarioDTO.imagemPath?host+x.usuarioDTO.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"} style={{borderRadius: "50%", width:"2.7em", height:"2.7em"}}/></Link>                                      
                            
                            {values.usuario&&x.idUsuario===values.usuario.id&&<div style={{fontWeight:"bolder", float:"right", cursor:"pointer", paddingLeft:"3%"}} onClick={event=>{event.preventDefault();document.getElementById(x.id+'-'+index).showModal();}}>⋮</div>}
                            
                            <dialog onClick={event=>{event.preventDefault();document.getElementById(x.id+'-'+index).close();}} id={x.id+'-'+index} style={{borderRadius:"0.5%", borderStyle:"none", width:"100%", top:'85%', textAlign:'center'}}>
                                <label style={{width:'100%', cursor:'pointer', padding:"0.5%"}} onClick={event=>{event.stopPropagation();}}>✏️ EDITAR</label><br/>
                                <label style={{width:'100%', cursor:'pointer', padding:"0.5%"}} onClick={event=>{deleteComentario(event, anuncio, x);document.getElementById(x.id+'-'+index).close();event.stopPropagation();}}>❌ EXCLUIR</label>
                            </dialog>

                            {values.usuario&&x.likeComentariosDTO.filter(lc=>lc.idUsuario===values.usuario.id).length?
                                <p onClick={event=>deleteLikeComentario(event, anuncio, x)} style={{float:"right", paddingRight:"3%", cursor:"pointer"}} >❤️</p>:
                                <p onClick={event=>postLikeComentario(event, anuncio, x)} style={{float:"right", paddingRight:"3%", cursor:"pointer"}}>🤍</p>}                                                
                            <div style={{display:'inline-block', width:'80%'}}><Link to={"/perfil/"+x.usuarioDTO.id}><p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{x.usuarioDTO.nome||x.usuarioDTO.email}</p></Link><p style={{whiteSpace:'break-spaces', lineHeight:'normal'}}>{x.texto}</p></div>
                            
                            <div>
                                <p style={{margin:"0 4% 0 2.3em", display:"inline-block"}}>{x.likeComentariosDTO.length} curtidas</p><label style={{cursor:"pointer", textDecoration:"underline"}} onClick={event=>expandComentario(event, indexAnuncio, index)}>Responder</label>  
                            </div>

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
                </div>            
            )}
            <div style={{textAlign:"center"}}>{values.total&&values.anuncios.length>=values.total?"fim dos anuncios":<img style={{height:"5em"}} src={loader} alt="loading..."/>}</div>
        </div>                
    )
}

export default ListarAnuncios
