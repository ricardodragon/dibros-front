import { useEffect, useState } from "react";
import axios from "./../../../config/api/api"
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import './conversa-detalhes.css'


function ConversaDetalhes(){
    
    const [values, setValues] = useState({texto:""})
    const [mensagens, setMensagens] = useState([]);
    const host = process.env.REACT_APP_URL;
    const { id } = useParams();

    useEffect(() => axios.get("/loja/seguidores/"+id).then(resp=> setValues({usuario:resp.data, texto:""})), [id])

    useEffect(() => axios.get("/loja/mensagem/"+id).then(r=> setMensagens(r.data)), [id])


    useEffect(() => {
        if(localStorage.getItem("token")!==null){
            const eventSource = new EventSource(`${host}/loja/mensagem/ws/${id}?Authorization=${localStorage.getItem("token")}`);
            eventSource.onmessage = (event) => setMensagens([JSON.parse(event.data), ...mensagens]);    
            eventSource.onerror = (error) => eventSource.close();  
            return eventSource.close();          
        }
    }, [mensagens, id, host])  

    const enviar = (event) => {
        event.preventDefault();
        axios.post("/loja/mensagem", {idRemetente:id, texto:values.texto})
    }

    const input = event => setValues({...values, texto:event.target.value})

    return(
        <>            
            {values.usuario&&<header className="mensagem-header">
                <img 
                    alt={"Foto usuario : " +values.usuario.nome} 
                    onError={({ currentTarget })=>{currentTarget.onError=null; currentTarget.src='https://freesvg.org/img/abstract-user-flat-3.png'}}
                    src={host+(values.usuario.imagemPath)} />
                <h3>{values.usuario.nome}</h3>
            </header>}
            {mensagens&&mensagens.toReversed().map((m, index)=><section className="card-mensagem" key={m.id} style={{"marginLeft": m.idAutor===JSON.parse(localStorage.getItem("usuario")).id?"30%":"none"}}>
                <p>{m.texto}</p>
            </section>)}
            
            <input type="button" onClick={enviar} value="enviar"/>
            <input className="mensagem-input" type="text" id="texto" onChange={input} value={values.texto} placeholder="Digite a mensagem"/>
        </>
    )
    
}

export default ConversaDetalhes;