import { useEffect, useState } from "react"
import axios from '../../../config/api/api';
import './conversa.css'
import { Link } from "react-router-dom";

function ConversaListar(){

    const [values, setValues] = useState({mensagens:[]})
    const [mensagens, setMensagens] = useState([]);
    const host = process.env.REACT_APP_URL;

    useEffect(() => axios.get("/loja/mensagem").then(r=>setValues({mensagens:r.data})),[])
    
    useEffect(() => {
        if(localStorage.getItem("token")!==null){
            const eventSource = new EventSource(`${host}/loja/mensagem/ws?Authorization=${localStorage.getItem("token")}`);
            eventSource.onmessage = (event) => console.log(event.data);    
            eventSource.onerror = (error) => eventSource.close();            
            return () => eventSource.close(); 
        }
    }, [host]) 

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
        <div className="mensagens-conteudo">
            {values.mensagens.map((mensagem, index) =>            
                <Link to={"/conversa-detalhes/"+(mensagem.idAutor===JSON.parse(localStorage.getItem("usuario")).id?mensagem.idRemetente:mensagem.idAutor)}  key={mensagem.id}>
                    <header>
                        <img alt={"Foto usuario : " +mensagem.usuario.nome} src={mensagem.usuario.imagemPath?host+mensagem.usuario.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"}/>                        
                        <section>
                            <h3>{mensagem.usuario.nome}</h3>
                            <p style={{fontWeight:'normal', display: "inline-block"}}>{mensagem.texto}</p>         
                            {mensagem.vistoQTD>0&&<div className='mensagem-qtd'>{mensagem.vistoQTD}</div>}
                        </section>
                        <div style={{fontWeight:"bolder", float:"right", cursor:"pointer"}}>⋮</div>
                    </header>
                </Link>
            )}
            {/* <div style={{textAlign:"center"}}>{values.total&&values.lojas.length>=values.total?"fim das lojas":<img style={{height:"5em"}} src={loader} alt="loading..."/>}</div> */}
        </div>                
    )
}
export default ConversaListar