import { useEffect, useState } from "react"
import axios from '../../../config/api/api';
import './conversa.css'
import { Link } from "react-router-dom";

function ConversaListar(){

    const [conversas, setConversas] = useState([]);
    const host = process.env.REACT_APP_URL;

    useEffect(() => axios.get("/loja/mensagem").then(r=>setConversas(r.data)), [])
    
    useEffect(() => {
        if(localStorage.getItem("token")!==null){
            const eventSource = new EventSource(`${host}/loja/mensagem/ws?Authorization=${localStorage.getItem("token")}`);
            eventSource.onmessage = (event) => { 
                const conversasCopia = conversas;
                const index = conversasCopia.findIndex(mensagem=>mensagem.idAutor===JSON.parse(event.data).idAutor);
                const m2 = index<0?[{vistoQTD:0}]:conversasCopia.splice(index, 1);
                setConversas([{...JSON.parse(event.data), vistoQTD:m2[0].vistoQTD+1}, ...conversasCopia])
            }
            eventSource.onerror = (error) => eventSource.close();            
            return () => eventSource.close(); 
        }
    }, [conversas, host]); 

    // const handlerScroll = (event) => {  
    //     const page = values.page+1; 
    //     if((event.target.scrollHeight - event.target.scrollTop)<=event.target.clientHeight&&values.lojas&&values.total&&values.lojas.length<values.total){                                                                   
    //         axios.get('/loja/lojas'+(id?`?idUsuario=${id}&`:localStorage.getItem("token")?'?':'/public?')+`page=${page}&size=${10}`).then(lojas =>
    //             setValues({...values, page, lojas:values.lojas.concat(lojas.data), total:lojas.headers.total})                
    //         )
    //     }
    //     if(props.onScroll)props.onScroll(event);
    // }

    return (        
        <section className="conversas-conteudo">
            {conversas.map((conversa, index) =>            
                <Link to={"/conversa-detalhes/"+(conversa.idAutor===JSON.parse(localStorage.getItem("usuario")).id?conversa.idRemetente:conversa.idAutor)} key={conversa.id}>
                    <img alt={"Foto usuario : " +conversa.usuario.nome} src={conversa.usuario.imagemPath?host+conversa.usuario.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"}/>                        
                    <div className="conversa-info">
                        <h3>{conversa.usuario.nome}</h3>
                        <p style={{fontWeight:'normal', display: "inline-block"}}>{conversa.texto}</p>         
                        {conversa.vistoQTD>0&&<div className='conversa-qtd'>{conversa.vistoQTD}</div>}
                    </div>
                    <div style={{fontWeight:"bolder", float:"right", cursor:"pointer"}}>⋮</div>
                </Link>
            )}
            {/* <div style={{textAlign:"center"}}>{values.total&&values.lojas.length>=values.total?"fim das lojas":<img style={{height:"5em"}} src={loader} alt="loading..."/>}</div> */}
        </section>                
    )
}
export default ConversaListar