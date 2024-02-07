import { useEffect, useState } from "react";
import Template from "../../estrutura/Template";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";

function AnuncioCompra(props){

    const [values, setValues] = useState({anuncio:{}});
    const host = process.env.REACT_APP_URL;
    const { id } = useParams();

    useEffect(() => 
        axios.get("/loja/anuncios/"+id).then(res => setValues({anuncio:res.data}))
    , [host, id]);

    return (
        <Template load={props.load}>
        <div style={{textAlign:"center"}}>
            
            <img src={host+values.anuncio.imagemPath} alt="" style={{width:"100%", height:"29em"}}/>            
            <div>
                <h1>Capinha para celulares iphone</h1>
                <div style={{display:"inline-flex", width:"100%", overflowX:"scroll"}}>
                    {values.anuncio.anuncioProdutosDTO&&values.anuncio.anuncioProdutosDTO.map(x=><img src={host+x.produtoDTO.imagemPath} style={{padding:"0 0.3em 0 0.3em", width:"5em", height:"5em"}} alt="Anúncio"/>)}                    
                </div>                
                Preço : 15,99                
            </div>
        </div>
        </Template>
    );
}

export default AnuncioCompra
