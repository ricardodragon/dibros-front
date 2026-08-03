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

    useEffect(() =>{
        api.get("/loja/pedido/"+id).then(p => {
            !p.data?history.push("/"):
            setValues({pedido:p.data, load:false})
        })
    }, [id, history]); 

    const onError = ({ currentTarget })=>{currentTarget.onError=null; currentTarget.src=lojaNotFound}

    const redirectLoja  = (event, id) => window.open('/loja/'+id, event.ctrlKey||event.metaKey?'_blank':'_self');    

    return (
        <>
            {values.load&&<div className='loader-pedido'><img src={loader} alt="loading..."/></div>}
            {!values.load&&<>
                <img className="pedido-loja-img" onClick={(event)=>redirectLoja(event, values.pedido.lojaDTO.id)} alt={"Foto loja : " +values.pedido.lojaDTO.nome} src={host+values.pedido.lojaDTO.imagemPath} onError={onError} />                            
                <h3 onClick={(event)=>redirectLoja(event, values.pedido.lojaDTO.id)}>{values.pedido.lojaDTO.nome}</h3>                             
                <img className="pedido-qr-code" src={"data:image/png;base64,"+values.pedido.pixPedidoDTO.imagem} alt={"pix qr-code"}/>
            </>}
        </>
    )
}
export default PedidoDetalhes