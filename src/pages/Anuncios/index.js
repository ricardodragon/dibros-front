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

    return (        
        values.anuncios.map(anuncio =>            
            <section className="card-anuncio">  
                <header style={{padding: "2%"}}>
                    <img src={process.env.REACT_APP_MELI_DOMAIN+anuncio.lojaDTO.imagemPath} style={{borderRadius: "50%", width:"3em", height:"3em"}}/>
                    <h3 style={{display: "inline", fontSize:"11pt", paddingLeft:'2%'}}>{anuncio.lojaDTO.nome}</h3>                             
                </header>
                <h2 style={{paddingLeft: "2.5%", fontSize:"12pt"}}>{anuncio.legenda}</h2>                                                    
                <img src={process.env.REACT_APP_MELI_DOMAIN+anuncio.imagemPath} className='img-anuncio' alt="Anúncio"/>                
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
                
                
                {anuncio.expandComentario&&anuncio.comentariosDTO.map(x=> 
                    <div style={{fontSize:"10pt", padding:"2%", width:"100%"}}> 
                        <img src={process.env.REACT_APP_MELI_DOMAIN+x.usuarioDTO.imagemPath} style={{borderRadius: "50%", display: "inline", width:"2em", height:"2em"}}/>                                      
                        <label style={{fontWeight:"bolder", textOverflow: "ellipsis", paddingRight:"2%"}}>{x.usuarioDTO.nome||x.usuarioDTO.email} :</label><span>{x.texto}</span>                        
                    </div>
                )}
                {anuncio.expandComentario&&<><input id={anuncio.id+"comentario"} style={{width:"80%"}} placeholder="comentario" onChange={event=>console.log(event.target.value)} type="text"/><button style={{width:"20%", background:"none", border:"none"}}>➡️</button></>}
            </section>            
        )
    )
}

export default Anuncios