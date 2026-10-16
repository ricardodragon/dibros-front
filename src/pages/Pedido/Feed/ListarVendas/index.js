import { useEffect, useState } from "react";
import axios from "../../../../config/api/api";
import loader from "./../../../../assets/loadinfo.gif";
import "./listar-venda.css";

function ListarVendas(props) {

    const [values, setValues] = useState({pedidos:[], load:true, fim:false, page:0})    
    const host = process.env.REACT_APP_URL;
    const lojaNotFound = "https://thumbs.dreamstime.com/b/%C3%ADcone-de-imagem-sem-foto-ou-em-branco-carregamento-imagens-aus%C3%AAncia-marca-n%C3%A3o-dispon%C3%ADvel-sinal-breve-silhueta-natureza-simples-215973362.jpg";    

    useEffect(() => 
        axios.get(`/loja/pedido/loja?page=${0}&size=${10}`).then(r=> setValues({pedidos:r.data, load:false, fim:r.data.length<10, page:0}))
    , [])

    const onError = ({ currentTarget })=>{currentTarget.onError=null; currentTarget.src=lojaNotFound}

    const handlerScroll = (event) => { 
        if((event.target.scrollHeight - event.target.scrollTop)<=event.target.clientHeight&&!values.fim){   
            const page = values.page+1; 
            axios.get(`/loja/pedido?page=${page}&size=${10}`).then(r =>
                r.data.length>0?setValues({...values, page, lojas:values.pedidos.concat(r.data)}):setValues({...values, fim:true})                
            )
        }
    }

    const redirectPedido  = (event, id) => window.open('/pedido-detalhes/'+id, event.ctrlKey||event.metaKey?'_blank':'_self');
    
    const redirectLoja  = (event, id) => window.open('/loja/'+id, event.ctrlKey||event.metaKey?'_blank':'_self');

    return (<>
        {values.load&&<div className='loader-pedido'><img src={loader} alt="loading..."/></div>}
        <div className="venda-conteudo" onScroll={handlerScroll}>
            {values.pedidos.map(pedido=> 
                <section className="card-venda" onClick={(event)=>redirectPedido(event, pedido.id)} key={"pedido-"+pedido.id}> 
                    <header>
                        <img onClick={(event)=>redirectLoja(event, pedido.lojaDTO.id)} alt={"Foto loja : " +pedido.lojaDTO.nome} src={`${host}/loja/lojas/imagem/${pedido.lojaDTO.id}/${pedido.lojaDTO.imagem}?Authorization=${localStorage.getItem("token")}`} onError={onError} />                            
                        <h3 onClick={(event)=>redirectLoja(event, pedido.lojaDTO.id)}>{pedido.lojaDTO.nome}</h3>                             
                    </header>

                    <form>
                        <label htmlFor="codigo-entrega">codigo da entrega</label>
                        <input type="text" id="codigo-entrega"/>
                    </form>
                    <div className="venda-criacao">{pedido.criacao}</div>
                    
                    <div className="status-venda-container">                        
                        <div className="venda-status">pago: {pedido.pago?'✅':'⛔'}</div>
                        <div className="venda-status">entregue: {pedido.entregue?'✅':'⛔'}</div>
                    </div>                                                      
                </section>     
            )}
            
            <div style={{textAlign:"center"}}>
                {values.fim?"fim dos pedidos":<img style={{height:"5em"}} src={loader} alt="loading..."/>}
            </div>
        </div>    
        
    </>)
}
export default ListarVendas