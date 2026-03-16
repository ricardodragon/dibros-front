import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "../../../config/api/api";
import "./anuncioDetalhes.css"

function AnuncioDetalhes(props){

    const [values, setValues] = useState({anuncio:{lojaDTO:{}, usuarioDTO:{}}});
    const host = process.env.REACT_APP_URL;
    const { id } = useParams();

    useEffect(() => {
            axios.get("/loja/anuncios/public/"+id).then(res => {
                var anuncio=res.data;
                anuncio.produtoQTD?axios.get("/loja/produtos/anuncio/"+id).then(r=>
                    setValues({anuncio, produtos:r.data})
                ):setValues({anuncio})
            })
        },[id]
    )
    // const getLocation = () => 
    //     navigator.geolocation?navigator.geolocation.getCurrentPosition(position=>{
    //         var a = Math.sin((position.coords.latitude-values.anuncio.latitude)/2)**2 + Math.cos(values.anuncio.latitude) * Math.cos(position.coords.latitude) * Math.sin((position.coords.longitude-values.anuncio.longitude)/2)**2
    //         return values.anuncio.valorFrete * 6373 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    //         setValues({...values, loja:{...values.loja, latitude:position.coords.latitude, longitude:position.coords.longitude}})
    //     }):"Geolocation is not supported by this browser.";
    

    return (
        <div className="anuncio-conteudo">

            <header className='anuncio-header'>
                <h1>
                    <figure>
                        <img alt={"Foto do perfil : "} src={host+(values.anuncio.lojaDTO.imagemPath?values.anuncio.lojaDTO.imagemPath:values.anuncio.usuarioDTO.imagemPath)}/>
                        <figcaption style={{width:'70%'}}>{values.anuncio.lojaDTO.nome?values.anuncio.lojaDTO.nome:values.anuncio.usuarioDTO.nome}</figcaption>
                    </figure>
                </h1>     
            </header>

            <nav className="menu-anuncio">
                <ul>                    
                    <div style={{width:'33.33%', height: "100%", display:'inline-block'}}><li>{values.anuncio.legenda}</li></div>
                    <div style={{width:'33.33%', height: "100%", display:'inline-block'}}><li>{values.anuncio.preco}</li></div>
                    <div style={{width:'33.33%', height: "100%", display:'inline-block'}}><li>{values.anuncio.isLike?'❤️':'🤍'}<span style={{paddingRight:"10%"}}>{values.anuncio.likeQTD}</span>💬<span>{values.anuncio.comentarioQTD}</span></li></div>
                </ul>
            </nav>
            <img src={host+values.anuncio.imagemPath} alt="" style={{display:"inline-block", paddingRight:"10%", width:"40%"}}/>
            {values.produtos&&<div style={{display:"inline-block", verticalAlign:"top", width:"50%"}}>
                <h2 >Produtos: </h2>
                <table style={{borderCollapse: "collapse"}}>
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Título</th>
                            <th scope="col">Preco</th>
                            <th scope="col"></th>
                        </tr>
                        <tbody>
                            {values.produtos.map(p=><tr>
                                <td><img src={p.imagemPath}/></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>)}
                        </tbody>
                    </thead>
                </table>
            </div>}
        </div>
    );
}

export default AnuncioDetalhes
