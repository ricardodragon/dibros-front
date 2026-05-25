import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import AnuncioComentarios from "../../AnuncioComentarios";
import loader from "./../../../../assets/loadinfo.gif";
import axios from "../../../../config/api/api";
import './anunciosFeed.css';


function AnunciosFeed(props){
         
    const [values, setValues] = useState({})    
    const host = process.env.REACT_APP_URL;
    const anuncioNotFound = "https://thumbs.dreamstime.com/b/%C3%ADcone-de-imagem-sem-foto-ou-em-branco-carregamento-imagens-aus%C3%AAncia-marca-n%C3%A3o-dispon%C3%ADvel-sinal-breve-silhueta-natureza-simples-215973362.jpg"
    const history = useHistory();

    //No mundo perfeito não existem blocos de chaves !{...}! lambidinha
    useEffect(() => {   
        axios.get(props.url+'page=0&size=10').then(anuncios => setValues({
            anuncios:anuncios.data, 
            page:0, 
            usuario:JSON.parse(localStorage.getItem('usuario')), 
            load:false
        })).catch(error=> console.log(error))
    }, [props.url])    

    const handlerScroll = (event) => {
        if(!values.load&&(event.target.scrollHeight - event.target.scrollTop)-10<=event.target.clientHeight&&values.anuncios!==undefined){  
            setValues({...values, load:true});  
            const page = values.page+1; 
            axios.get(props.url+`page=${page}&size=10`).then(anuncios =>
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

    const onError = ({ currentTarget })=>{currentTarget.onError=null; currentTarget.src='https://freesvg.org/img/abstract-user-flat-3.png'}

    return (        
        <div className="anuncios-conteudo" onScroll={handlerScroll}>
            {values.anuncios&&values.anuncios.filter(x=>x.legenda!=="vai me perder").map((anuncio, index) =>            
                <div className="card-anuncio" key={"anuncio-"+index}>                  
                    <header className="card-anuncio-header" onClick={event=>history.push(anuncio.lojaDTO.id?"/loja/"+anuncio.lojaDTO.id:"/perfil/"+anuncio.usuarioDTO.id)}>                        
                        <img alt={"Foto anuncio : " +anuncio.legenda} onError={onError} src={host+(anuncio.lojaDTO.imagemPath?anuncio.lojaDTO.imagemPath:anuncio.usuarioDTO.imagemPath)}/>
                        <h3>{anuncio.lojaDTO.nome?anuncio.lojaDTO.nome:anuncio.usuarioDTO.nome}</h3>
                    </header>
                    <div className="anuncio-opcoes">⋮</div>
                    <h2>{anuncio.legenda}</h2>                                                                    
                    
                    <img onError={({ currentTarget })=>{currentTarget.onError=null; currentTarget.src=anuncioNotFound}} src={anuncio.imagemPath?host+anuncio.imagemPath:anuncioNotFound} alt="Anúncio" className='img-anuncio'/>                                                         
                    {/* {anuncio.anuncioProdutosDTO.filter(x=>x.imagemPath).map(x=><img src={host+x.imagemPath} className='img-anuncio' alt="Anúncio"/>)} */}
                    <div className="anuncio-preco">R$ {anuncio.preco},00</div>

                    <div className="anuncio-curtidas">{anuncio.likeQTD} curtidas</div>
                    <div className="anuncio-curtidas" style={{textAlign: "end"}} onClick={event=>setValues({...values, anuncios:values.anuncios.map(x=>{return x.id===anuncio.id?{...x, expandComentarios:!x.expandComentarios}:x})})}>{anuncio.comentarioQTD} comentarios</div>
                    
                    <div className="like-container">                        
                        <div className="anuncio-like" onClick={event=>anuncio.isLike?deleteLikeAnuncio(event, anuncio):likeAnuncio(event, anuncio)}><Link to={""} style={{textDecoration:'none'}}>{anuncio.isLike?'❤️':'🤍'}</Link></div>
                        <div className="anuncio-like"><Link style={{textDecoration:'none'}} to={"/anuncio-detalhes/"+anuncio.id}>🛒</Link></div>
                        <div className="anuncio-like"><Link style={{textDecoration:'none'}} to={""} onClick={event=>{event.preventDefault();setValues({...values, anuncios:values.anuncios.map(x=>{return x.id===anuncio.id?{...x, expandComentarios:!x.expandComentarios}:x})})}}>💬</Link></div>
                    </div>
                    
                    {values.usuario&&anuncio.expandComentarios&&<AnuncioComentarios id={anuncio.id}/>}                    
                </div>            
            )}
            <div style={{textAlign:"center"}}>{values.loader?<img style={{height:"5em"}} src={loader} alt="loading..."/>:"fim dos anuncios"}</div>
        </div>                
    )
}

export default AnunciosFeed