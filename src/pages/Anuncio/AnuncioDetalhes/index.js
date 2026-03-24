import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "../../../config/api/api";
import "./anuncioDetalhes.css"
import { Link } from "react-router-dom";

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
                        <figcaption>
                            <h2>{"titulo : " + values.anuncio.legenda}</h2>
                            
                            {!values.anuncio.produtos&&<h2>{"preço : " + values.anuncio.preco}</h2>}
                            {values.anuncio.idLoja&&<h2>loja :  <Link style={{display:'inline'}} to={"/loja/"+values.anuncio.lojaDTO.id}>{values.anuncio.lojaDTO.nome}</Link></h2>}
                            {!values.anuncio.idLoja&&<h2>vendedor : <Link style={{display:'inline'}} to={"/perfil/"+values.anuncio.usuarioDTO}>{values.anuncio.usuarioDTO.nome}</Link></h2>}
                        </figcaption>
                    </figure>                                         
                </h1>  

                <div className="anuncio-estatisticas">
                    <h2 style={{paddingRight:"20%"}}><p style={{textAlign:"center"}}>0</p><p>vendas</p></h2>
                    <h2><p style={{textAlign:"center"}}>0</p><p>avaliações</p></h2>               
                </div> 
            </header>
                
            {!values.produtos&&<input type="button" value="Comprar"/>}

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
                            <td><img  style={{width:"2em", height:"2em", display:"inline"}} alt={"Foto do produto : "} src={host+p.imagemPath}/></td>
                            <td>{p.titulo}</td>
                            <td>{p.preco}</td>
                            <td><input type="button" style={{fontSize: "15pt", padding: "0 3%", backgroundColor:"red"}} value="-"/> {p.qtd?p.qtd:0} <input type="button" style={{fontSize: "15pt", backgroundColor:"red", padding: "0 3%"}} value="+"/></td>
                        </tr>)}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>total: 0</td>
                        </tr>
                    </tbody>
                </table>
                <input type="button" value="Adicionar carrinho"/>
            </div>}            

        </div>
    );
}

export default AnuncioDetalhes
