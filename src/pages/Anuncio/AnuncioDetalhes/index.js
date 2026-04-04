import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "../../../config/api/api";
import "./anuncioDetalhes.css"
import { Link, useHistory } from "react-router-dom";

function AnuncioDetalhes(props){

    const [values, setValues] = useState({anuncio:{lojaDTO:{}, usuarioDTO:{}, qtd:0}});
    const host = process.env.REACT_APP_URL;
    const { id } = useParams();
    const history = useHistory();  

    useEffect(() => {
            axios.get("/loja/anuncios/public/"+id).then(res => {
                var anuncio=res.data;
                anuncio.produtoQTD?axios.get("/loja/produtos/anuncio/"+id).then(r=>
                    setValues({anuncio, produtos:r.data, qtd:0, cesta:r.data.map(x=>{return {...x, qtd:0}})})
                ):setValues({anuncio, qtd:0})
            })
        },[id]
    )

    const addProduto = index => setValues({...values, cesta:values.cesta.map((x, i)=>i===index&&values.cesta[i].qtd<=values.produtos[i].quantidade?{...values.cesta[i], qtd:values.cesta[i].qtd+1}:x)})    
    
    const removeProduto = index => setValues({...values, cesta:values.cesta.map((x, i)=>i===index&&x.qtd>0?{...values.cesta[i], qtd:values.cesta[i].qtd-1}:x)})

    const comprar = index => {      
        const items = values.anuncio.idLoja?
            [{idLoja: values.anuncio.idLoja, idAnuncio: values.anuncio.id, qtd:values.qtd}]:
            [{idVendedor: values.anuncio.idUsuario, idAnuncio: values.anuncio.id, qtd:values.qtd}]
        const carrinho = JSON.parse(localStorage.getItem("carrinho"));
        if(!carrinho){
            localStorage.setItem("carrinho", JSON.stringify(items))
            history.push("/carrinho");
        }else if(items[0].idVendedor!==carrinho[0].idVendedor||items[0].idLoja!==carrinho[0].idLoja)
            console.log("limpar carrinho")
        else{
            localStorage.setItem("carrinho", JSON.stringify(carrinho.concat(items)));
            history.push("/carrinho");
        }
    }

    const addCarrinho = index => {  
        var items = values.cesta.filter(x=>x.qtd>0).map(x=>{return {idLoja: values.anuncio.idLoja, idAnuncio: values.anuncio.id, idProduto: x.id, qtd:x.qtd}})
        const carrinho = JSON.parse(localStorage.getItem("carrinho"));
        if(!carrinho){
            localStorage.setItem("carrinho", JSON.stringify(items))
            history.push("/carrinho");
        }else if(carrinho[0].idVendedor||carrinho[0].idLoja!==values.anuncio.idLoja)
            console.log("limpar carrinho");
        else{ 
            localStorage.setItem("carrinho", JSON.stringify(carrinho.concat(items)))
            history.push("/carrinho");
        }
    }
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
                
            {!values.produtos&&values.qtd!==undefined&&
                <div>
                    <input type="button" disabled={values.qtd===0} style={{fontSize: "15pt", padding: "0 3%", backgroundColor:"red"}} value="-" onClick={event=>{event.preventDefault();setValues({...values, qtd:values.qtd-1})}}/> 
                    <input value={values.qtd} type="number" maxLength="3" disabled style={{width:"20%", textAlign:"center", boxSizing:"border-box"}}/>
                    <input type="button" disabled={values.anuncio.quantidade===values.qtd} style={{fontSize: "15pt", backgroundColor:"red", padding: "0 3%"}} value="+" onClick={event=>{event.preventDefault();setValues({...values, qtd:values.qtd+1})}}/>
                    <input type="button" value="Comprar" onClick={comprar}/>
                </div>
            }
            <form>
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
                            {values.produtos.map((p, index)=><tr key={p.id}>
                                <td><img  style={{width:"2em", height:"2em", display:"inline"}} alt={"Foto do produto : "} src={host+p.imagemPath}/></td>
                                <td>{p.titulo}</td>
                                <td>{p.preco}</td>
                                <td>
                                    <input type="button" style={{fontSize: "15pt", padding: "0 3%", backgroundColor:"red"}} value="-" onClick={event=>{event.preventDefault();removeProduto(index)}}/> 
                                    <input value={values.cesta[index].qtd} type="number" maxLength="3" disabled style={{width:"20%", textAlign:"center", boxSizing:"border-box"}}/>
                                    <input type="button" style={{fontSize: "15pt", backgroundColor:"red", padding: "0 3%"}} value="+" onClick={event=>{event.preventDefault();addProduto(index)}}/>
                                </td>
                            </tr>)}
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>total: R$ {values.cesta.length&&parseFloat(values.cesta.reduce((total, p) => total + p.preco*p.qtd, 0)).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <input type="button" value="Adicionar carrinho" onClick={addCarrinho} disabled={values.produtos.length>0&&values.cesta.reduce((total, p)=> total+p.qtd, 0)===0}/>
                </div>}        
            </form>    

        </div>
    );
}

export default AnuncioDetalhes
