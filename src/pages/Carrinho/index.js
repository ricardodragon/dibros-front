
import { useEffect, useState } from 'react';
import './carrinho.css'
import api from '../../config/api/api';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Carrinho(props){
    const [carrinho, setCarrinho] = useState(JSON.parse(localStorage.getItem("carrinho")));
    const [values, setValues] = useState({});
    const history = useHistory();  
    const host = process.env.REACT_APP_URL;

    useEffect(()=>{
        if(!carrinho||carrinho.length===0)
            return history.push("/");
        if(carrinho[0].idLoja)
            api.get("/loja/lojas/perfil/"+carrinho[0].idLoja).then(res=> setValues({loja:res.data}));
        const carrinhoFunction = (e) => setCarrinho(JSON.parse(localStorage.getItem("carrinho")));
        window.addEventListener('carrinho', carrinhoFunction);        
        return () => window.removeEventListener('carrinho', carrinho);
    },[carrinho, history])

    const addProduto = (event, index) => true

    const removeProduto = (event, index) => true

    return (<>
            {carrinho&&<div className='carrinho-info' style={{overflowY:"scroll", height:"73vh", paddingBottom:"12vh"}}>
                <h1 className='carrinho-titulo'>Finalizar pedido</h1>
                <label className='carrinho-label'>Seu pedido em</label>
                {values.loja&&<h2 className='carrinho-loja-nome'>{values.loja.nome}</h2>}
                {carrinho[0].usuarioDTO&&<h2 className='carrinho-loja-nome'>{carrinho[0].usuarioDTO.nome}</h2>}
                <hr/>                 
                <h1>carrinho</h1>
                {carrinho.map((n, index)=> 
                    <div key={index} style={{padding:'1%', textAlign:'left'}}>
                        <img alt="Imagem item" src={n.imagemPath?host+n.imagemPath:"https://thumbs.dreamstime.com/b/%C3%ADcone-de-imagem-sem-foto-ou-em-branco-carregamento-imagens-aus%C3%AAncia-marca-n%C3%A3o-dispon%C3%ADvel-sinal-breve-silhueta-natureza-simples-215973362.jpg"} style={{width:"4em", height:"4em", paddingRight:"2%"}}/>                    
                        
                        <div style={{display:'inline-block', width:'50%', verticalAlign:"top"}}>
                            <p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{n.legenda?n.legenda:n.titulo}</p>                            
                            <input type="button" style={{padding: "0 2%", marginLeft:"3%", backgroundColor:"red"}} value="-" onClick={event=>{removeProduto(event, index);}}/> 
                            <span style={{margin:"0 3%", fontWeight:"bold"}}>{n.qtd}</span>
                            <input type="button" style={{backgroundColor:"red", marginRight:"3%", padding: "0 2%"}} value="+" onClick={event=>{addProduto(event, index);}}/>
                            R$ {parseFloat(n.preco*n.qtd).toFixed(2)}
                        </div>                
                                    
                    </div>
                )}

                <hr/>
                Total R$ {parseFloat(carrinho.reduce((total, p) => total + p.preco*p.qtd, 0)).toFixed(2)}
                <input id="esvaziar" style={{cursor: "pointer", backgroundColor:"lightblue", color:"black", display: "block"}} value="esvaziar"/>
                <input id="finalizar" style={{cursor: "pointer", position: "fixed", right:"2em", backgroundColor:"red", color:"white", bottom:"2em"}} value="finalizar compra"/>
            </div>}
        </>
    );
}

export default Carrinho;