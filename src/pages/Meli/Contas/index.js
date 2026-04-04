import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../../config/api/api";
import './contas.css'
    
function Contas(props){
    const [values, setValues] = useState({contas:[]});        
    const code = undefined//queryString.parse(props.location.search)
    const host = process.env.REACT_APP_URL;
    const erroContaMessage = "Erro ao salvar conta, pressione f5 para tentar novamente ou clique no botão adicionar conta novamente, se persistir o erro verifique sua conta MELI";
    useEffect(() => {
        if(code)
            axios.post('/meli/contas?code='+code).then(res=> 
                axios.get('/meli/contas/all')
                    .then(res=> props.history.replace("/meli/contas"))
                    .catch(error=> axios.get('/meli/contas/all')).then(r=>setValues({contas:r.data, erro:erroContaMessage}))
            )
        else
            axios.get('/meli/contas/all').then(r=>setValues({contas:r.data}))   
    }, [props.history, code, host]);

    return (
        <div className="meli-contas-conteudo"> 
            {values.contas.map((value, index) => {
                return (                        
                    <div style={{padding:"2% 0", marginTop:"1%"}} className="meli-card-conta" key={"anuncio-"+index}>      
                        <h5 className="meli-email"><span style={{fontWeight:"bold"}}>{value.email}</span></h5>
                        <div className="meli-conta-id"><label>id: </label>{value.id}</div>                              
                        <h5 className="meli-conta-nickname">{value.nickname}</h5>                                                        
                        <div style={{padding:"0 2%"}}>
                            <Link style={{fontWeight:"bolder", color:"rgb(0, 112, 224)"}} to={"/meli/anuncios/"+value.id+"/"+undefined}>anuncios</Link>                                  
                            <span style={{color:"red", float:"right", cursor:"pointer"}} onClick={event=>{event.preventDefault();axios.delete('/meli/contas/'+value.idLocal)}} value="excluir">excluir</span>
                        </div>
                    </div>
                )
            })}            
        </div>
    )
}

export default Contas