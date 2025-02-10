import { useEffect, useState } from 'react';

import "./anuncios.css"
import axios from '../../../config/api/api';
import { Link } from "react-router-dom";
import loader from "./../../../assets/loadinfo.gif";
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import AnuncioComentarios from '../AnuncioComentarios';


function ListarAnuncios(props){
         
    const [values, setValues] = useState({})    
    const host = process.env.REACT_APP_URL;
    const { id } = useParams();

    //No mundo perfeito não existem blocos de chaves !{...}!
    useEffect(() => 
        axios.get('/loja/anuncios'+(localStorage.getItem("token")?(id?'?idUsuario='+id+'&':'?'):'/public?')+'page=0').then(anuncios =>     
            setValues({anuncios:anuncios.data, page:0, usuario:JSON.parse(localStorage.getItem('usuario')), load:false})            
        )
    , [id])    

    const handlerScroll = (event) => {
        if(!values.load&&(event.target.scrollHeight - event.target.scrollTop)-10<=event.target.clientHeight&&values.anuncios!==undefined){  
            setValues({...values, load:true});  
            const page = values.page+1; 
            axios.get('/loja/anuncios'+(localStorage.getItem("token")?`?idUsuario=${id?id:0}&`:'/public?')+`page=${page}&size=10`).then(anuncios =>
                setValues({...values, page, loader:anuncios.data.length, anuncios:values.anuncios.concat(anuncios.data), load:false})
            );
        }
        // if(props.onScroll)props.onScroll(event);
    }

    const likeAnuncio = (event, anuncio) => {
        event.preventDefault();
        axios.post("/loja/anuncios/like/"+anuncio.id).then(r=>setValues({...values, anuncios:values.anuncios.map(x=>{return x.id===anuncio.id?{...x, isLike:true, likeQTD:x.likeQTD+1}:x})}))
    }

    const deleteLikeAnuncio = (event, anuncio) => {
        event.preventDefault();
        axios.delete("/loja/anuncios/like/"+anuncio.id).then(r=>setValues({...values, anuncios:values.anuncios.map(x=>{return x.id===anuncio.id?{...x, isLike:false, likeQTD:x.likeQTD-1}:x})}))
    }

    return (        
        <div className="anuncios-conteudo" onScroll={handlerScroll}>
            {values.anuncios&&values.anuncios.filter(x=>x.legenda!=="vai me perder").map((anuncio, index) =>            
                <div className="card-anuncio" key={"anuncio-"+index}>                  
                    <header style={{padding: "2%"}}>
                        <Link style={{display:'inline'}} to={anuncio.lojaDTO?"":"/perfil/"+anuncio.usuarioDTO}><img alt={"Foto anuncio : " +anuncio.legenda} src={host+(anuncio.lojaDTO.imagemPath?anuncio.lojaDTO.imagemPath:anuncio.usuarioDTO.imagemPath)} style={{borderRadius: "50%", width:"3em", height:"3em"}}/></Link>
                        <div style={{fontWeight:"bolder", float:"right", cursor:"pointer"}}>⋮</div>
                        <h3 style={{display: "inline", fontSize:"11pt", verticalAlign:'top', whiteSpace:'break-spaces'}}>{anuncio.lojaDTO.nome?anuncio.lojaDTO.nome:anuncio.usuarioDTO.nome}</h3>                             
                    </header>
                    <h2 style={{paddingLeft: "2.5%", fontSize:"12pt", whiteSpace:'break-spaces'}}>{anuncio.legenda}</h2>                                                                    

                    <p className="teste">
                        <img src={host+anuncio.imagemPath} alt="Anúncio" className='img-anuncio' />                                                         
                        {/* {anuncio.anuncioProdutosDTO.filter(x=>x.imagemPath).map(x=><img src={host+x.imagemPath} className='img-anuncio' alt="Anúncio"/>)} */}
                    </p>
                    <div style={{fontWeight:"bolder", textAlign:"center", fontSize:"10pt", padding:"1%"}}>
                        R$ {anuncio.preco},00
                    </div>
                    <div style={{fontSize:"10pt", padding:"1%"}} onClick={event=>setValues({...values, anuncios:values.anuncios.map((x, indexA)=>indexA===index?{...x, expand:!x.expand}:x)})}>
                        <div style={{display:"inline-block", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}}>{anuncio.likeQTD} curtidas</div>
                        <div style={{float:"right", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}}>{anuncio.comentarioQTD} comentarios</div>
                    </div>
                    
                    <div style={{borderTop:"1px solid rgba(0, 0 , 0, 0.1)", textAlign:"center", fontSize:"11pt", padding:"1%"}}>                        
                        <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}} onClick={event=>anuncio.isLike?deleteLikeAnuncio(event, anuncio):likeAnuncio(event, anuncio)}><Link to={""} style={{textDecoration:'none'}}>{anuncio.isLike?'❤️':'🤍'}</Link></div>
                        <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "14ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}}><Link style={{textDecoration:'none'}} to={""} onClick={event=>{event.preventDefault();setValues({...values, anuncios:values.anuncios.map(x=>{return x.id===anuncio.id?{...x, expandComentario:!x.expandComentario}:x})})}}>💬</Link></div>
                        <div style={{display:"inline-block", width: "33%", textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}}><Link style={{textDecoration:'none'}} to={"/anuncio-detalhes/"+anuncio.id}>🛒</Link></div>
                    </div>
                    
                    {values.usuario&&anuncio.expand&&<AnuncioComentarios id={anuncio.id}/>}                    
                </div>            
            )}
            <div style={{textAlign:"center"}}>{values.loader?<img style={{height:"5em"}} src={loader} alt="loading..."/>:"fim dos anuncios"}</div>
        </div>                
    )
}

export default ListarAnuncios
