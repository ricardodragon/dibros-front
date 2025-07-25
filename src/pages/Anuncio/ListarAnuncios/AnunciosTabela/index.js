import { useEffect, useState } from "react";
import axios from "../../../../config/api/api";
import "./anunciosTabela.css"
function AnunciosTabela(props){
         
    const [values, setValues] = useState({})    
    const host = process.env.REACT_APP_URL;

    //No mundo perfeito não existem blocos de chaves !{...}! lambidinha
    useEffect(() => 
        axios.get(props.url+'page=1').then(anuncios => setValues({
            anuncios:anuncios.data, 
            page:0, 
            usuario:JSON.parse(localStorage.getItem('usuario')), 
            load:false
        })).catch(error=> console.log(error))
    , [props.url])    

    // const handlerScroll = (event) => {
    //     if(!values.load&&(event.target.scrollHeight - event.target.scrollTop)-10<=event.target.clientHeight&&values.anuncios!==undefined){  
    //         setValues({...values, load:true});  
    //         const page = values.page+1; 
    //         axios.get(props.url+`page=${page}&size=10`).then(anuncios =>
    //             setValues({...values, page, loader:anuncios.data.length, anuncios:values.anuncios.concat(anuncios.data), load:false})
    //         );
    //     }
    //     // if(props.onScroll)props.onScroll(event);
    // }

    // const likeAnuncio = (event, anuncio) => {
    //     event.preventDefault();
    //     axios.post("/loja/anuncios/like/"+anuncio.id).then(r=>setValues({...values, anuncios:values.anuncios.map(x=>{return x.id===anuncio.id?{...x, isLike:true, likeQTD:x.likeQTD+1}:x})}))
    // }

    // const deleteLikeAnuncio = (event, anuncio) => {
    //     event.preventDefault();
    //     axios.delete("/loja/anuncios/like/"+anuncio.id).then(r=>setValues({...values, anuncios:values.anuncios.map(x=>{return x.id===anuncio.id?{...x, isLike:false, likeQTD:x.likeQTD-1}:x})}))
    // }

    return ( 
        <div className="anuncio-tabela">
            {values.anuncios&&values.anuncios.filter(x=>x.legenda!=="vai me perder").map((anuncio, index) =>
                <img src={host+anuncio.imagemPath} alt="Anúncio" className='img-anuncio-tabela' />                 
            )}
        </div>
    )
}

export default AnunciosTabela