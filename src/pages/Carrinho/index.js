
import { useEffect, useState } from 'react';
import './carrinho.css'
import api from '../../config/api/api';
import loader from "./../../assets/loadinfo.gif";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Carrinho(props){
    const [carrinho, setCarrinho] = useState(JSON.parse(localStorage.getItem("carrinho")));
    const [values, setValues] = useState({load:true});
    const history = useHistory();  
    const host = process.env.REACT_APP_URL;

    useEffect(()=>{
        if(!carrinho||carrinho.length===0)
            return history.push("/");
        if(carrinho[0].idLoja)
            api.get("/loja/lojas/"+carrinho[0].idLoja).then(res=> setValues({loja:res.data, load:false}));
        const carrinhoFunction = (e) => setCarrinho(JSON.parse(localStorage.getItem("carrinho")));
        window.addEventListener('carrinho', carrinhoFunction);        
        return () => window.removeEventListener('carrinho', carrinho);
    }, [carrinho, history])

    const addProduto = (event, index) => true

    const removeProduto = (event, index) => true

    const criarPedido = (event) => {
        setValues({...values, load:true});
        const c = JSON.parse(localStorage.getItem("carrinho"));
        api.post("/loja/pedido", {produtoPedido:c, idLoja:c[0].idLoja}).then(r => {
            history.push("/pedido-detalhes/"+r.data);
            localStorage.removeItem("carrinho");
        })
    }

    return (<>
            {values.load&&<div className='loader-loja'><img src={loader} alt="loading..."/></div>}
            {carrinho&&<div className='carrinho-info' style={{overflowY:"scroll", height:"73vh", paddingBottom:"12vh"}}>
                <h1 className='carrinho-titulo'>Finalizar pedido</h1>
                <label className='carrinho-label'>Seu pedido em</label>
                {values.loja&&<h2 className='carrinho-loja-nome'>{values.loja.nome}</h2>}                
                <hr/>                 
                <h1>carrinho</h1>
                {carrinho.map((n, index)=> 
                    <div key={index} style={{padding:'1%', textAlign:'left'}}>
                        <img alt="Imagem item" src={`${host}/loja/produtos/imagem/${n.id}/${n.imagem}?Authorization=${localStorage.getItem("token")}`} style={{width:"4em", height:"4em", paddingRight:"2%"}}/>                    
                        
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

                <hr/>
                Total R$ {parseFloat(carrinho.reduce((total, p) => total + p.preco*p.qtd, 0)).toFixed(2)}
                <input readOnly id="esvaziar" style={{cursor: "pointer", backgroundColor:"lightblue", color:"black", display: "block"}} value="esvaziar"/>
                <input readOnly onClick={criarPedido} id="finalizar" style={{cursor: "pointer", position: "fixed", right:"2em", backgroundColor:"red", color:"white", bottom:"2em"}} value="finalizar compra"/>
            </div>}
        </>
    );
}

export default Carrinho;