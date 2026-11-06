
import { useEffect, useState } from 'react';
import './carrinho.css'
import api from '../../config/api/api';
import loader from "./../../assets/loadinfo.gif";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Helmet } from 'react-helmet-async';

function Carrinho(props){
    const [carrinho, setCarrinho] = useState(JSON.parse(localStorage.getItem("carrinho")));
    const [values, setValues] = useState({load:true});
    const history = useHistory();  
    const host = process.env.REACT_APP_URL;
    const id = new URLSearchParams(window.location.search).get("id");

    useEffect(()=>{
        if(id)
            api.get("/loja/produtos/public/"+id).then(r=>{  
                const produto = r.data;
                const carrinho = JSON.parse(localStorage.getItem("carrinho"))||[];        
                carrinho.length>0&&produto.idLoja!==carrinho[0].idLoja?
                    console.log("limpar carrinho"):
                    localStorage.setItem("carrinho", JSON.stringify(
                        carrinho.filter(x=>x.id===produto.id).length>0?
                            carrinho.map(x=>x.id===produto.id?{...x, qtd:1}:x):
                            [...carrinho, {...produto, qtd:1}]
                    ));      
                setCarrinho(JSON.parse(localStorage.getItem("carrinho")))
            })        
    }, [id]);

    useEffect(()=>{        
        if(!carrinho||carrinho.length<=0) return;
        if (carrinho[0].idLoja)
            api.get("/loja/lojas/public/"+carrinho[0].idLoja).then(res=> 
                api.get("/loja/lojas/endereco/public/"+carrinho[0].idLoja).then(enderecoLoja=>{
                    if(localStorage.getItem("token"))
                        api.get("/loja/endereco/selecionado").then(enderecoUsuario=>                            
                            api.get(`/loja/fretes/${carrinho[0].idLoja}?distancia=${distancia(enderecoLoja.data.latitude, enderecoLoja.data.longitude, enderecoUsuario.data.latitude, enderecoUsuario.data.longitude)}&peso=${parseFloat(carrinho.reduce((total, p) => total + p.peso*p.qtd, 0))}&comprimento=${parseFloat(carrinho.reduce((total, p) => total + p.comprimento*p.qtd, 0))}&largura=${parseFloat(carrinho.reduce((total, p) => total + p.largura*p.qtd, 0))}&altura=${parseFloat(carrinho.reduce((total, p) => total + p.altura*p.qtd, 0))}`).then(r=>
                                setValues({loja:res.data, load:false, enderecoUsuario:enderecoUsuario.data, enderecoLoja:enderecoLoja.data, frete:r.data, tipoFrete:"LOJA"})))
                    else                     
                        setValues({loja:res.data, load:false, enderecoLoja:enderecoLoja.data, tipoFrete:"LOJA"})
                    
                }
            ))
        const carrinhoFunction = (e) => setCarrinho(JSON.parse(localStorage.getItem("carrinho")));
        window.addEventListener('carrinho', carrinhoFunction);        
        return () => window.removeEventListener('carrinho', carrinhoFunction);        
    }, [carrinho, history])

    // const getEnderecoFrete = ()=> api.get("").then(r=>)

    const distancia = (lat1, lon1, lat2, lon2) => Math.ceil(Number(Math.sqrt(((lat2 - lat1) * 111.13)**2+((lon2 - lon1) * 111.13 * Math.cos(lat1 * Math.PI / 180))**2)||0));

    const addProduto = (event, index) => true

    const removeProduto = (event, index) => true

    const criarPedido = (event) => {
        setValues({...values, load:true});
        api.post("/loja/pedido", {produtoPedido:carrinho, idLoja:carrinho[0].idLoja, tipoFrete:values.tipoFrete, frete:values.frete}).then(r => {
            history.push("/pedido-detalhes/"+r.data);
            localStorage.removeItem("carrinho");
        })
    }
    
    const getFrete = () => values.frete&&values.tipoFrete!=="RETIRADA"&&distancia(values.enderecoLoja.latitude, values.enderecoLoja.longitude, values.enderecoUsuario.latitude, values.enderecoUsuario.longitude)*values.frete.valorKm;
    
    const getTotal = () => parseFloat(carrinho.reduce((total, p) => total + p.preco*p.qtd, 0))+getFrete();
    
    const convertNominatim = (endereco) => ({latitude:endereco.lat, longitude:endereco.lon, estado:endereco.address["ISO3166-2-lvl4"].split('-')[1], cidade:endereco.address.city, cep:endereco.address.postcode.replace(/\D/g, ""), bairro:endereco.address.suburb, rua:endereco.name})

    const getLocation = (event) => {
        event.preventDefault();
        setValues({...values, load:true});
        navigator.geolocation?navigator.geolocation.getCurrentPosition(position=>
            api.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=pt-BR`).then(r=>
                setValues({...values, enderecoUsuario:convertNominatim(r.data), load:false})),
            (error) => setValues({...values, erro:"erro ao buscar localização"}),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        ):console.log("Geolocation is not supported by this browser.");
    }

    return (<>                      
            {values.load&&<div className='loader-loja'><img src={loader} alt="loading..."/></div>}
            {carrinho&&values.loja&&<div className='carrinho-info' style={{overflowY:"scroll", height:"73vh", paddingBottom:"12vh"}}>
                <Helmet>
                    <title>Carrinho Produto {carrinho[0].titulo} - Dibros</title>
                    <meta name="description" content="Finalize a compra do seu produto no sistema Dibros" />
                </Helmet>  
                <h1 className='carrinho-titulo'>Finalizar pedido</h1>
                <label className='carrinho-label'>Seu pedido em</label>
                <a href={"/loja/"+values.loja.id}><h2 style={{textDecoration:"underline"}} className='carrinho-loja-nome'>{values.loja.nome}</h2></a>
                <h3>Tempo de preparação {values.loja.preparacaoValor + " " + values.loja.preparacaoUnidadeDTO}</h3>            
                <hr/>                 
                <h1>carrinho</h1>
                {carrinho.map((n, index)=> 
                    <div key={index} style={{padding:'1%', textAlign:'left'}}>
                        <img alt="Imagem item" src={`${host}/loja/produtos/imagem/${n.id}/${n.imagem}`} style={{width:"4em", height:"4em", paddingRight:"2%"}}/>                    
                        
                        <div style={{display:'inline-block', width:'50%', verticalAlign:"top"}}>
                            <p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{n.legenda?n.legenda:n.titulo}</p>                            
                            <input type="button" style={{padding: "0 2%", marginLeft:"3%", backgroundColor:"red"}} value="-" onClick={event=>{removeProduto(event, index);}}/> 
                            <span style={{margin:"0 3%", fontWeight:"bold"}}>{n.qtd}</span>
                            <input type="button" style={{backgroundColor:"red", marginRight:"3%", padding: "0 2%"}} value="+" onClick={event=>{addProduto(event, index);}}/>
                            preço: {Number(n.preco).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}<br/>
                            total: {Number(n.preco*n.qtd).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                        </div>                
                    </div>
                )}
                
                {getFrete()&&<select placeholder="unidade" value={values.tipoFrete} onChange={event=>setValues({...values, tipoFrete:event.target.value})}>
                    {values.loja&&values.loja.retirada&&<option value="RETIRADA">retirada</option>}
                    {values.frete.id&&<option value="LOJA">frete loja</option>}
                    {/* <option value="dibros">frete dibros</option> */}
                </select>}
                
                {getFrete()&&!values.tipoFrete!=="LOJA"&&<h3>Tempo de entrega {distancia(values.enderecoLoja.latitude, values.enderecoLoja.longitude, values.enderecoUsuario.latitude, values.enderecoUsuario.longitude)*values.frete.prazoEntrega} MINUTOS</h3>}

                <hr/>
                {!getFrete()&&<form>
                    <input type='text' value={values.cep} placeholder='cep'/>                    
                    <input type='submit' value="calcular frete"/>
                    <button style={{whiteSpace:"nowrap", fontSize:"8pt", fontWeight:"bold"}} onClick={getLocation}>📍 </button>
                </form>}
                

                Frete {Number(getFrete()).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                <br/>
                Total {Number(getTotal()).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                <input readOnly id="esvaziar" style={{cursor: "pointer", backgroundColor:"lightblue", color:"black", display: "block"}} value="esvaziar"/>
                <input readOnly onClick={criarPedido} id="finalizar" style={{cursor: "pointer", position: "fixed", right:"2em", backgroundColor:"red", color:"white", bottom:"2em"}} value="finalizar compra"/>
            </div>}
        </>
    );
}

export default Carrinho;