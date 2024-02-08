import { useEffect, useState } from "react";
import Template from "../../estrutura/Template";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "../../config/api/api";

function AnuncioDetalhes(props){

    const [values, setValues] = useState({anuncio:{lojaDTO:{}}});
    const host = process.env.REACT_APP_URL;
    const { id } = useParams();

    useEffect(() => axios.get("/loja/anuncios/"+id).then(res => setValues({anuncio:res.data})), [id]);

    return (
        <Template load={props.load}>
            <div  className="anuncios-conteudo">
                <div style={{fontSize:"10pt", width:"100%", paddingLeft:"2%", cursor:"pointer"}}>
                    <img  alt={"Foto da loja : " +values.anuncio.lojaDTO.nome} src={host+values.anuncio.lojaDTO.imagemPath} style={{borderRadius: "50%", width:"2.5em", height:"2.5em"}}/>                                      
                    <p style={{fontSize:"8pt", fontWeight:"bolder", overflow:"hidden", marginBottom:"0", display:"inline"}}>{values.anuncio.lojaDTO.nome}</p>
                </div>
                <h1 style={{paddingLeft: "2.5%", fontSize:"12pt"}}>{values.anuncio.legenda}</h1>
                <img src={host+values.anuncio.imagemPath} alt="" style={{width:"100%", height:"29em"}}/>            
                <div style={{display:"inline-flex", width:"100%", overflowX:"scroll", cursor:"pointer"}}>
                    {values.anuncio.anuncioProdutosDTO&&values.anuncio.anuncioProdutosDTO.map(x=><img key={"produtoDTO_"+x.idProduto} src={host+x.produtoDTO.imagemPath} style={{width:"5em", height:"5em"}} alt="Anúncio"/>)}                    
                </div>                
                Preço : {values.anuncio.preco}
            </div>
        </Template>
    );
}

export default AnuncioDetalhes
