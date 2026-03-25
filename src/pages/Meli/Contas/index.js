import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import queryString from 'query-string';
import axios from "../../../config/api/api";
import './contas.css'
    
function Contas(props){
    const [values, setValues] = useState({contas:[]});        
    const { code } = queryString.parse(props.location.search)
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

    const redirectMeli = () => {                
        const uriRedirect = 'https://dibros.com.br/meli/contas'
        window.location.href = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=5401911184235214&redirect_uri=${uriRedirect}`;
    }

    return (
        <div className="anuncios-conteudo"> 
            <header style={{width:"100%", textAlign:"center", padding:"8% 0"}}>
                <h1>contas mercado livre</h1>
            </header> 
            
            {
                values.contas.map((value, index) => {
                    return (                        
                        <div key={index} className="card-contas">
                            <h5 className="header-card">{value.nickname}</h5>                                                        
                            <hr/>
                            <label>id: </label>{value.id}                              
                            <hr/>
                            <h5 className="header-card"><label>email: </label><span style={{fontWeight:"bold"}}>{value.email}</span></h5>
                            <hr/>
                            <div>
                                <Link style={{fontWeight:"bolder", color:"rgb(0, 112, 224)"}} to={"/meli/anuncios/"+value.id+"/"+undefined}>anuncios</Link>                                  
                                <span style={{color:"red", float:"right", cursor:"pointer"}} onClick={event=>{event.preventDefault();axios.delete('/meli/contas/'+value.idLocal)}} value="excluir">excluir</span>
                            </div>
                        </div>                        
                    )
                })
            }
            <input style={{cursor:"pointer", float: "right", position: "absolute", right: "6%", bottom: "6%", backgroundColor:"yellow"}} onClick={redirectMeli} value="🔗 ADICIONAR CONTA"/>
        </div>
    )
}

export default Contas