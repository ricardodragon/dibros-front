import { useEffect, useState } from "react";
import axios from "../../../../config/api/api";
import "./anunciosTabela.css"
function AnunciosTabela(props){
         
    const [values, setValues] = useState({})    
    const host = process.env.REACT_APP_URL;

    //No mundo perfeito não existem blocos de chaves !{...}! lambidinha
    useEffect(() => 
        axios.get(props.url+'page=0&size=99').then(anuncios => setValues({
            anuncios:anuncios.data, 
            page:0, 
            usuario:JSON.parse(localStorage.getItem('usuario')), 
            load:false
        })).catch(error=> console.log(error))
    , [props.url])    

    return ( 
        <div style={{with:"100%", height:"100%", overflowY: "scroll"}}>
            {values.anuncios&&values.anuncios.filter(x=>x.legenda!=="vai me perder").map((anuncio, index) =>
                <div style={{backgroundImage:"url("+host+anuncio.imagemPath+")", backgroundRepeat:"no-repeat", backgroundSize:"cover"}} alt="Anúncio" className='img-anuncio-tabela'></div>                 
            )}            
        </div>
    )
}

export default AnunciosTabela