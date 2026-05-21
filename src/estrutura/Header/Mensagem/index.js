import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../config/api/api';
import './../header.css';
import ConversaListar from '../../../pages/Conversa/ConversaListar';

function Mensagem(props){
    const [mensagensQtd, setMensagensQtd] = useState(0);

    useEffect(() =>
        axios.get(`/loja/mensagem/notificacao`).then(r=>setMensagensQtd(r.data))
    , [])
        
    const getMensagens = (event)=>{
        document.getElementById("carrinho-check").checked = false;
        document.getElementById("notificacao-check").checked = false;
    }

    return (<div onClick={event=>{event.stopPropagation()}} style={{display:"inline"}}>        
        <Link to="/conversa" className="mensagem-botao-pequeno">💬</Link>
        
        <label className="mensagem-botao-grande" htmlFor="mensagem-check" >
            💬
            {<div className='mensagem-qtd'>{mensagensQtd}</div>}                                    
        </label>
        <input type="checkbox" className="notificacao-check" id="mensagem-check" onChange={getMensagens}/>

        <div id="mensagem-menu">
            <ConversaListar/>
        </div>
    </div>)
}
export default Mensagem