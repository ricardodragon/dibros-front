
import { useEffect, useState } from 'react';
import './carrinho.css'
import api from '../../config/api/api';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Carrinho(props){
    const [carrinho, setCarrinho] = useState(JSON.parse(localStorage.getItem("carrinho")));
    const [values, setValues] = useState({});
    const history = useHistory();  
    
    useEffect(()=>{
        if(!carrinho||carrinho.length===0)
            return history.push("/");
        if(carrinho[0].idLoja)
            api.get("/loja/lojas/perfil/"+carrinho[0].idLoja).then(res=> setValues({loja:res.data}));
        const carrinhoFunction = (e) => setCarrinho(JSON.parse(localStorage.getItem("carrinho")));
        window.addEventListener('carrinho', carrinhoFunction);        
        return () => window.removeEventListener('carrinho', carrinho);
    },[carrinho, history])

    return (<>
            {carrinho&&<div className='carrinho-info'>
                <h1 className='carrinho-titulo'>Finalizar pedido</h1>
                <label className='carrinho-label'>Seu pedido em</label>
                <h2 className='carrinho-loja-nome'>{values.loja?values.loja.nome:carrinho[0].usuarioDTO.nome}</h2>
                <hr/>                 
                <list>Itens</list>
                <hr/>
                Total R$ 48,89
                <input id="finalizar" style={{cursor: "pointer", position: "fixed", right:"2em", backgroundColor:"red", color:"white", bottom:"2em"}} value="finalizar compra"/>
            </div>}
        </>
    );
}

export default Carrinho;