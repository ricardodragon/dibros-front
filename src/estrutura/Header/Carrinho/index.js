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
                    <img alt="Imagem item" src={n.imagemPath?host+n.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"} style={{borderRadius: "50%", width:"2.7em", height:"2.7em"}}/>                    
                    <div style={{display:'inline-block', width:'50%'}}>
                        <p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{n.titulo}</p>
                    </div>                
                    quantidade {n.qtd}               
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