import { useEffect, useState } from 'react';
import './../header.css';

function Carrinho(){
    const [carrinho, setCarrinho] = useState(JSON.parse(localStorage.getItem("carrinho")));
    const [checked, setChecked] = useState(false);
    const host = process.env.REACT_APP_URL;
    
    useEffect(() =>{         
        const carrinho = (e) => {
            setChecked(!checked);
            setCarrinho(JSON.parse(localStorage.getItem("carrinho")))
        }
        window.addEventListener('carrinho', carrinho);        
        return () => window.removeEventListener('carrinho', carrinho);
    }, [checked])

    const addProduto = (event, index) => {
        event.preventDefault();
        localStorage.setItem("carrinho", JSON.stringify(JSON.parse(localStorage.getItem("carrinho")).map((x, i)=> i===index?{...x, qtd:x.qtd+1}:x).filter(x=>!x.quantidade||x.qtd<x.quantidade)));            
        window.dispatchEvent(new Event("carrinho"))
    }
    
    const removeProduto = (event, index) => { 
        event.preventDefault();
        const carrinho = JSON.parse(localStorage.getItem("carrinho")).map((x, i)=> i===index?{...x, qtd:x.qtd-1}:x).filter(x=>x.qtd>0)
        localStorage.setItem("carrinho", JSON.stringify(carrinho))   
        if(carrinho.length===0)
            esvaziar(event)
        else{
            window.dispatchEvent(new Event("carrinho"));
        }
    } 

    const esvaziar = event => {event.preventDefault();localStorage.removeItem('carrinho');window.dispatchEvent(new Event("carrinho"));}

    const setChecks = (event) => {
        document.getElementById("mensagem-check").checked = false;
        document.getElementById("notificacao-check").checked = false;
        setChecked(!checked);
    }

    return (<div style={{display:"inline"}}>
        <label className="carrinho-botao" htmlFor="carrinho-check">
            🛒
            {carrinho&&<div className='carrinho-qtd'>{carrinho.length}</div>}                                    
        </label>
        <input type="checkbox" className="carrinho-check" id="carrinho-check" checked={checked} onChange={setChecks}/>

        <div id="carrinho-menu" onClick={event=>event.stopPropagation()}>
            <h1>carrinho</h1>
            {localStorage.getItem('carrinho')&&
                <>
                    {JSON.parse(localStorage.getItem('carrinho')).map((n, index)=> 
                        <div key={index} style={{padding:'1%', textAlign:'left'}}>
                            <img alt="Imagem item" src={`${host}/loja/produtos/imagem/${n.id}/${n.imagem}?Authorization=${localStorage.getItem("token")}`} style={{borderRadius: "50%", width:"2.7em", height:"2.7em"}}/>                    
                            
                            <div style={{display:'inline-block', width:'50%', fontSize:"6pt", verticalAlign:"top"}}>
                                <p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{n.legenda?n.legenda:n.titulo}</p>
                                quantidade : 
                                <input type="button" style={{padding: "0 3%", marginLeft:"3%", backgroundColor:"red"}} value="-" onClick={event=>{removeProduto(event, index);}}/> 
                                <span style={{margin:"0 3%", fontWeight:"bold"}}>{n.qtd}</span>
                                <input type="button" style={{backgroundColor:"red", padding: "0 3%"}} value="+" onClick={event=>{addProduto(event, index);}}/>
                                preço: {Number(n.preco).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}<br/>
                                total: {Number(n.preco*n.qtd).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                            </div>                
                            
                        </div>)}
                    <input type='button' onClick={esvaziar} value={'esvaziar'}/><br/>
                    <a href='/carrinho' style={{backgroundColor:"green", padding: "0 3%"}}>finalizar compra</a>
                </>
            }             
            <div style={{textAlign:"center"}}>
                {!localStorage.getItem('carrinho')&&<p>sem itens</p>}
            </div>
        </div>
    </div>);
}
export default Carrinho