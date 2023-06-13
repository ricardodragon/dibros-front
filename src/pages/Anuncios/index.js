import { useEffect, useState } from 'react';


import "./anuncios.css"
import axios from 'axios';

function Anuncios(){
         
    const [values, setValues] = useState({anuncios:[]})    
    
    useEffect(() => 
        axios.get(process.env.REACT_APP_MELI_DOMAIN+"/loja/anuncio").then(res => setValues({...values, anuncios:res.data}))
    , []);

    return (        
        values.anuncios.map(anuncio =>            
            <section className="card-anuncio">  
                <header style={{padding: "2%"}}>
                    <img src={process.env.REACT_APP_MELI_DOMAIN+anuncio.lojaDTO.imagemPath} style={{borderRadius: "50%", width:"2em", height:"2em"}}/>
                    <h3 style={{display: "inline", fontSize:"11pt", paddingLeft:'2%'}}>{anuncio.lojaDTO.nome}</h3>                             
                </header>
                <h2 style={{textAlign:"center"}}>{anuncio.legenda}</h2>                                    
                
                <img src={process.env.REACT_APP_MELI_DOMAIN+anuncio.imagemPath} className='img-anuncio' alt="Anúncio"/>
                {/* {anuncio.anuncioProdutosDTO.concat({imagemPath:anuncio.imagemPath}).map(ap=>
                    <img src={process.env.REACT_APP_MELI_DOMAIN+ap.imagemPath} style={{display:"block"}} className='img-anuncio' alt="Anúncio"/>
                )} */}
                
                <div style={{borderTop:"1px solid rgba(0, 0 , 0, 0.1)", textAlign:"center", fontSize:"11pt", padding:"2%"}}>
                    <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap"}}><a href="/home" style={{textDecoration:"none"}}>👍 Like</a></div>                    
                    <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "14ch", overflow: "hidden", whiteSpace: "nowrap"}}><a href="/home" style={{textDecoration:"none"}}>💬 Comentarios</a></div>
                    <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap"}}><a href="/home" style={{textDecoration:"none"}}>🛒 Comprar</a></div>
                </div>
                {/* <div>
                    <img src={perfil} style={{borderRadius: "50%", display: "inline", width:"2em", height:"2em"}}/>
                    <label style={{fontWeight:"bolder", paddingRight:"2%"}}>ricardibro:</label><span>É original?</span>
                </div> */}
            </section>            
        )
    )
}

export default Anuncios