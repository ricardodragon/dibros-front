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
                        <img alt={"Foto do anuncio : "} src={host+(values.anuncio.imagemPath)}/>
                        <figcaption style={{width:'70%'}}>{values.anuncio.legenda}</figcaption>
                    </figure>
                </h1>     
            </header>

            {!values.produtos&&<input type="button" value="Comprar"/>}
            <nav className="menu-anuncio">
                <ul>                    
                    <div style={{width:'33.33%', height: "100%", display:'inline-block'}}><li>{values.anuncio.legenda}</li></div>
                    <div style={{width:'33.33%', height: "100%", display:'inline-block'}}><li>{values.anuncio.preco}</li></div>
                    <div style={{width:'33.33%', height: "100%", display:'inline-block'}}><li>{values.anuncio.isLike?'❤️':'🤍'}<span style={{paddingRight:"10%"}}>{values.anuncio.likeQTD}</span>💬<span>{values.anuncio.comentarioQTD}</span></li></div>
                </ul>
            </nav>
            {values.produtos&&<div style={{textAlign:"center",width:"100%"}}>
                <table style={{width:"100%"}}>
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Título</th>
                            <th scope="col">Preco</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {values.produtos.map(p=><tr>
                            <td><img  style={{width:"2em", height:"2em", display:"inline"}} src={host+p.imagemPath}/></td>
                            <td>{p.titulo}</td>
                            <td>{p.preco}</td>
                            <td><input type="button" style={{fontSize: "15pt", padding: "0 3%", backgroundColor:"red"}} value="-"/> {p.qtd?p.qtd:0} <input type="button" style={{fontSize: "15pt", backgroundColor:"red", padding: "0 3%"}} value="+"/></td>
                        </tr>)}
                    </tbody>
                </table>
                <input type="button" value="Adicionar carrinho"/>
            </div>}            
            {/* <h1>
                <figure>
                    <img alt={"Foto do perfil : "} src={host+(values.anuncio.lojaDTO.imagemPath?values.anuncio.lojaDTO.imagemPath:values.anuncio.usuarioDTO.imagemPath)}/>
                    <figcaption style={{width:'70%'}}>{values.anuncio.lojaDTO.nome?values.anuncio.lojaDTO.nome:values.anuncio.usuarioDTO.nome}</figcaption>
                </figure>
            </h1>    */}
        </div>
    );
}

export default AnuncioDetalhes
