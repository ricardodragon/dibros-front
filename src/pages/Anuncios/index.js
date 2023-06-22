import { useEffect, useState } from 'react';


import "./anuncios.css"
import axios from 'axios';

function Anuncios(){
         
    const [values, setValues] = useState({anuncios:[]})    
    
    useEffect(() => 
        axios.get(process.env.REACT_APP_MELI_DOMAIN+"/loja/anuncio").then(res => setValues({...values, anuncios:res.data}))
    , []);

    const likeAnuncio = (event, anuncio) => {
        event.preventDefault();
        axios.post(process.env.REACT_APP_MELI_DOMAIN+"/loja/like/"+anuncio.id).then(r=>setValues({...values, anuncios:values.anuncios.map(x=>{return x.id==anuncio.id?{...x, likeAnunciosDTO:x.likeAnunciosDTO.concat({idUsuario:r.data.idUsuario})}:x})}))
    }

    const deleteLikeAnuncio = (event, anuncio) => {
        event.preventDefault();
        axios.delete(process.env.REACT_APP_MELI_DOMAIN+"/loja/like/"+anuncio.id).then(r=>setValues({...values, anuncios:values.anuncios.map(x=>{return x.id==anuncio.id?{...x, likeAnunciosDTO:x.likeAnunciosDTO.filter(l=>l.idUsuario!=r.data)}:x})}))
    }

    const postComentario = (event, anuncio) => {
        event.preventDefault();
        axios.post(process.env.REACT_APP_MELI_DOMAIN+"/loja/comentario", {idAnuncio:anuncio.id, texto:anuncio.inputComentario}).then(r=>setValues({...values, anuncios:values.anuncios.map(x=> x.id===anuncio.id?{...x, inputComentario:"", comentariosDTO:x.comentariosDTO.concat({...r.data, usuarioDTO:JSON.parse(localStorage.getItem("usuario"))})}:x)}))
    }

    const postLikeComentario = (event, anuncio, comentario) => {
        event.preventDefault();
        axios.post(process.env.REACT_APP_MELI_DOMAIN+"/loja/comentario/"+comentario.id).then(r=>setValues({...values, anuncios:values.anuncios.map(x=> x.id===anuncio.id?{...x, inputComentario:"", comentariosDTO:x.comentariosDTO.map(c=>{ 
            if(c.id===comentario.id) return {...c, likeComentariosDTO:c.likeComentariosDTO.concat({idUsuario:JSON.parse(localStorage.getItem("usuario")).id, idComentario:c.id})}
            else if(c.comentariosDTO.filter(cc=>cc.id===comentario.id).length) return {...c, comentariosDTO:c.comentariosDTO.map(cc=>cc.id===comentario.id? {...cc, likeComentariosDTO:cc.likeComentariosDTO.concat({idUsuario:JSON.parse(localStorage.getItem("usuario")).id, idComentario:c.id})}:cc)}                
            else return c})}:x)}));
    }
    
    const deleteLikeComentario = (event, anuncio, comentario) => {
        event.preventDefault();
        axios.delete(process.env.REACT_APP_MELI_DOMAIN+"/loja/comentario/like/"+comentario.id).then(r=>setValues({...values, anuncios:values.anuncios.map(x=> x.id===anuncio.id?{...x, inputComentario:"", comentariosDTO:x.comentariosDTO.map(c=>c.id==comentario.id?{...c, likeComentariosDTO:c.likeComentariosDTO.filter(lc=>lc.idUsuario!=r.data)}:c)}:x)}));
    }

    return (        
        values.anuncios.map(anuncio =>            
            <section className="card-anuncio">  
                <header style={{padding: "2%"}}>
                    <img src={process.env.REACT_APP_MELI_DOMAIN+anuncio.lojaDTO.imagemPath} style={{borderRadius: "50%", width:"3em", height:"3em"}}/>
                    <h3 style={{display: "inline", fontSize:"11pt", paddingLeft:'2%'}}>{anuncio.lojaDTO.nome}</h3>                             
                    <div style={{fontWeight:"bolder", float:"right", cursor:"pointer"}}>⋮</div>
                </header>
                <h2 style={{paddingLeft: "2.5%", fontSize:"12pt"}}>{anuncio.legenda}</h2>                                                    
                                    
                <img src={process.env.REACT_APP_MELI_DOMAIN+anuncio.imagemPath} style={{cursor:"pointer"}} className='img-anuncio' alt="Anúncio" onClick={event=>{event.preventDefault();setValues({...values, anuncios:values.anuncios.map(x=>{ return x.id==anuncio.id?{...x, expandFotos:true}:x})})}}/>                                
                
                {/* <div style={{backgroundColor:"black", left:0, top:0, overflowY: "scroll", position:"absolute", boxSizing:"border-box", width:"100%", height:"100%", display:anuncio.expandFotos?"initial":"none"}}>
                    <div style={{position:"relative", float:"right", top:0}} onClick={event=>{event.preventDefault();setValues({...values, anuncios:values.anuncios.map(x=>{ return x.id==anuncio.id?{...x, expandFotos:false}:x})})}}>X</div>
                    <img src={process.env.REACT_APP_MELI_DOMAIN+anuncio.imagemPath} style={{width:"100%", height:"100%"}} alt="Anúncio"/>                
                    {anuncio}
                </div> */}

                <div style={{fontSize:"10pt", width:"100%", padding:"1%"}}>
                    <div style={{display:"inline-block", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}}>{anuncio.likeAnunciosDTO.length} likes</div>
                    <div style={{float:"right", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}} onClick={event=>{event.preventDefault();setValues({...values, anuncios:values.anuncios.map(x=>{return x.id===anuncio.id?{...x, expandComentario:!x.expandComentario}:x})})}}>{anuncio.comentariosDTO.length} comentarios</div>
                </div>
                <div style={{borderTop:"1px solid rgba(0, 0 , 0, 0.1)", textAlign:"center", fontSize:"11pt", padding:"1%", width:"100%"}}>
                    {anuncio.likeAnunciosDTO.filter(x=>x.idUsuario===JSON.parse(localStorage.getItem("usuario")).id).length?
                    <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}} onClick={event=>deleteLikeAnuncio(event, anuncio)}><a>❤️</a></div>: 
                    <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}} onClick={event=>likeAnuncio(event, anuncio)}><a>🤍</a></div>}                     
                    <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "14ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}}><a onClick={event=>{event.preventDefault();setValues({...values, anuncios:values.anuncios.map(x=>{return x.id===anuncio.id?{...x, expandComentario:!x.expandComentario}:x})})}}>💬</a></div>
                    <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}}><a>🛒</a></div>
                </div>
                
                
                {anuncio.expandComentario&&anuncio.comentariosDTO.filter(x=>!x.idComentario).map(x=> 
                    <div style={{fontSize:"10pt", width:"100%", paddingLeft:"2%", paddingBottom:"4%"}}> 
                        <div style={{height:"100%", position:"absolute", float:"left"}}>
                            <img src={process.env.REACT_APP_MELI_DOMAIN+x.usuarioDTO.imagemPath} style={{borderRadius: "50%", width:"2em", height:"2em"}}/>                                      
                        </div>
                        {x.likeComentariosDTO.filter(lc=>lc.idUsuario===JSON.parse(localStorage.getItem("usuario")).id).length?
                            <p onClick={event=>deleteLikeComentario(event, anuncio, x)} style={{float:"right", paddingRight:"2%", cursor:"pointer"}} >❤️</p>:
                            <p onClick={event=>postLikeComentario(event, anuncio, x)} style={{float:"right", paddingRight:"2%", cursor:"pointer"}}>🤍</p>}                        
                        <p style={{margin:"0 2% 0 2.3em"}}><p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{x.usuarioDTO.nome||x.usuarioDTO.email}</p>{x.texto}</p>
                        <p style={{margin:"0 4% 0 2.3em", display:"inline-block"}}>{x.likeComentariosDTO.length} curtidas</p>Responder
                        {x.comentariosDTO.length>0&&<p style={{marginBottom:"0", marginLeft:"2.3em"}}>⎯ Ver mais {x.comentariosDTO.length} respostas</p>}
                        {x.comentariosDTO.map(cc=> 
                            <div style={{marginLeft:"2.3em"}}>
                                <img src={process.env.REACT_APP_MELI_DOMAIN+x.usuarioDTO.imagemPath} style={{borderRadius: "50%", float:"left", width:"2em", height:"2em"}}/>
                                {cc.likeComentariosDTO.filter(lc=>lc.idUsuario===JSON.parse(localStorage.getItem("usuario")).id).length?
                                <p onClick={event=>deleteLikeComentario(event, anuncio, cc)} style={{float:"right", paddingRight:"2%", cursor:"pointer"}} >❤️</p>:
                                <p onClick={event=>postLikeComentario(event, anuncio, cc)} style={{float:"right", paddingRight:"2%", cursor:"pointer"}}>🤍</p>}                        
                                <p style={{margin:"0 2% 0 2.3em"}}><p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{cc.usuarioDTO.nome||cc.usuarioDTO.email}</p>{cc.texto}</p>
                            </div>
                        )}
                    </div>
                )}
                {anuncio.expandComentario&&<>
                    <input id={anuncio.id+"comentario"} value={anuncio.inputComentario} style={{width:"80%"}} placeholder="comentario" onChange={event=>setValues({...values, anuncios:values.anuncios.map(x=> x.id===anuncio.id?{...x, inputComentario:event.target.value}:x)})} type="text"/>
                    <button style={{width:"20%", background:"none", border:"none"}} onClick={event=>postComentario(event, anuncio)} disabled={!anuncio.inputComentario}>➡️</button>
                </>}
            </section>            
        )
    )
}

export default Anuncios