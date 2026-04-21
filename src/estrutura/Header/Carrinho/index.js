import { useEffect, useState } from 'react';
import './../header.css';

function Carrinho(){
    const [carrinho, setCarrinho] = useState(JSON.parse(localStorage.getItem("carrinho")));
    const host = process.env.REACT_APP_URL;
    
    useEffect(() =>{         
        const carrinho = (e) => setCarrinho(JSON.parse(localStorage.getItem("carrinho")))
        window.addEventListener('carrinho', carrinho);        
        return () => window.removeEventListener('carrinho', carrinho);
    }, [])

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

    return (<>
        <label className="carrinho-botao" htmlFor="carrinho-check">
            🛒
            {carrinho&&<div className='carrinho-qtd'>{carrinho.length}</div>}                                    
        </label>
        <input type="checkbox" className="carrinho-check" id="carrinho-check"/>

        <div id="carrinho-menu">
            <h1>carrinho</h1>
            {localStorage.getItem('carrinho')&&JSON.parse(localStorage.getItem('carrinho')).map((n, index)=> 
                <div key={index} style={{padding:'1%', textAlign:'left'}}>
                    <img alt="Imagem item" src={n.imagemPath?host+n.imagemPath:"https://thumbs.dreamstime.com/b/%C3%ADcone-de-imagem-sem-foto-ou-em-branco-carregamento-imagens-aus%C3%AAncia-marca-n%C3%A3o-dispon%C3%ADvel-sinal-breve-silhueta-natureza-simples-215973362.jpg"} style={{borderRadius: "50%", width:"2.7em", height:"2.7em"}}/>                    
                    
                    <div style={{display:'inline-block', width:'50%', fontSize:"6pt", verticalAlign:"top"}}>
                        <p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{n.legenda?n.legenda:n.titulo}</p>
                        quantidade : 
                        <input type="button" style={{padding: "0 3%", marginLeft:"3%", backgroundColor:"red"}} value="-" onClick={event=>{removeProduto(event, index);}}/> 
                        <span style={{margin:"0 3%", fontWeight:"bold"}}>{n.qtd}</span>
                        <input type="button" style={{backgroundColor:"red", padding: "0 3%"}} value="+" onClick={event=>{addProduto(event, index);}}/>

                    </div>                
                                  
                </div>
            )}
            {localStorage.getItem('carrinho')&&<input type='button' onClick={esvaziar} value={'esvaziar'}/>} 
            <div style={{textAlign:"center"}}>
                {!localStorage.getItem('carrinho')&&<p>sem itens</p>}
            </div>
        </div>
    </>);
}
export default Carrinho