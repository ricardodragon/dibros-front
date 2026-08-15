import { useEffect, useState } from "react";
import api from '../../../config/api/api';
import loader from "./../../../assets/loadinfo.gif";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import './pedido-detalhes.css'


function PedidoDetalhes(props) {

    const [values, setValues] = useState({load:true})    
    const { id } = useParams();
    const host = process.env.REACT_APP_URL;
    const history = useHistory();
    const lojaNotFound = "https://thumbs.dreamstime.com/b/%C3%ADcone-de-imagem-sem-foto-ou-em-branco-carregamento-imagens-aus%C3%AAncia-marca-n%C3%A3o-dispon%C3%ADvel-sinal-breve-silhueta-natureza-simples-215973362.jpg";         
    const [segundosRestantes, setSegundosRestantes] = useState((tempoExpiracao) => {
        return Math.max(0, Math.floor((tempoExpiracao - Date.now()) / 1000));
    });
    const min = String(Math.floor(segundosRestantes / 60)).padStart(2, '0');
    const seg = String(segundosRestantes % 60).padStart(2, '0');
    const [tempoExpiracao, setTempoExpiracao] = useState(new Date());
    
    useEffect(() =>{
        api.get("/loja/pedido/"+id).then(p => {
            if(!p.data)
                history.push("/")
            setValues({pedido:p.data, load:false})
            setTempoExpiracao(new Date(p.data.criacao).getTime() + (6 * 60 * 1000))
        })
    }, [id, history]); 

    useEffect(()=>{
        if (segundosRestantes <= 0) return;
        const intervalo = setInterval(() => {
            if(Math.floor((tempoExpiracao - Date.now()) / 1000) <= 0) {
                clearInterval(intervalo);
                history.push("/");                
            }else 
                setSegundosRestantes(Math.floor((tempoExpiracao - Date.now()) / 1000));
        }, 1000);
        return () => clearInterval(intervalo);
    }, [tempoExpiracao, segundosRestantes, history]);

    const onError = ({ currentTarget })=>{currentTarget.onError=null; currentTarget.src=lojaNotFound}

    const redirectLoja  = (event, id) => window.open('/loja/'+id, event.ctrlKey||event.metaKey?'_blank':'_self');    

    const copiarPix = event => {
        const msgSucesso = document.getElementById('mensagem-sucesso');
        navigator.clipboard.writeText(values.pedido.pixPedidoDTO.payload).then(() => {
            msgSucesso.classList.remove('hidden');
            setTimeout(() => 
                msgSucesso.classList.add('hidden')
            , 3000);
        });
    }



    return (
        <>
            {values.load&&<div className='loader-pedido'><img src={loader} alt="loading..."/></div>}
            {!values.load&&<div className="pedido-pix">             
                <img className="pedido-loja-img" onClick={(event)=>redirectLoja(event, values.pedido.lojaDTO.id)} alt={"Foto loja : " +values.pedido.lojaDTO.nome} src={`${host}/loja/lojas/imagem/${values.pedido.lojaDTO.id}/${values.pedido.lojaDTO.imagem}?Authorization=${localStorage.getItem("token")}`} onError={onError} />                            
                <h3 onClick={(event)=>redirectLoja(event, values.pedido.lojaDTO.id)}>{values.pedido.lojaDTO.nome}</h3>                             

                <div style={{fontSize: '2rem', fontFamily: 'monospace'}}>{min}:{seg}</div>   

                <div className="pix-box">
                    <div className="input-group">
                        <input type="text" size="29" id="codigo-pix" value={values.pedido.pixPedidoDTO.payload} readOnly/>
                        <button id="copiar-btn" onClick={copiarPix}>Copiar</button>
                    </div>
                    <span id="mensagem-sucesso" className="hidden">Chave copiada!</span>
                </div>
                
                <img className="pedido-qr-code" src={`${host}/loja/pedido/imagem/${values.pedido.pixPedidoDTO.imagem}?Authorization=${localStorage.getItem("token")}`} alt={"pix qr-code"}/>
                
            </div>}
        </>
    )
}
export default PedidoDetalhes