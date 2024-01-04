import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import queryString from 'query-string';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import axios from "axios";
import './contas.css'
import { IconButton } from "@material-ui/core";
import { FcCheckmark, FcHighPriority } from "react-icons/fc";
    
function Contas(props){
    const [values, setValues] = useState({contas:[]});        
    const { code } = queryString.parse(props.location.search)
    const host = process.env.REACT_APP_URL;
    const erroContaMessage = "Erro ao salvar conta, pressione f5 para tentar novamente ou clique no botão adicionar conta novamente, se persistir o erro verifique sua conta MELI";
    useEffect(() => {
        if(code)
            axios.post(host+'/meli/contas?code='+code).then(res=> 
                axios.get(host+'/meli/contas/all')
                    .then(res=> props.history.replace("/meli/contas"))
                    .catch(error=> axios.get(host+'/meli/contas/all')).then(r=>setValues({contas:r.data, erro:erroContaMessage}))
            )
        else
            axios.get(host+'/meli/contas/all').then(r=>setValues({contas:r.data}))   
    }, [code, host]);

    const redirectMeli = () => {                
        const uriRedirect = 'https://dibros.com.br/meli/contas'
        window.location.href = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=5401911184235214&redirect_uri=${uriRedirect}`;
    }

    return (
        <div className="row">  
            <div className={"alert alert-success "+(values.ok?"":"visually-hidden")} role="alert"><FcCheckmark/>Link enviado com sucesso</div>
            <div className={"alert alert-danger "+(values.erro?"":"visually-hidden")} role="alert"><FcHighPriority/>Erro: {values.erro}</div>          
            <IconButton color="primary" className="btn-add-contas" aria-label="Adicionar conta" onClick={redirectMeli}>
                <AddShoppingCartIcon /> ADICIONAR CONTA
            </IconButton>
            {
                values.contas.map((value, index) => {
                    return (                        
                        <div key={index} className="card-contas col-md-3 col-sm-12">
                            <span className="header-card h5">{value.nickname}</span>                                                        
                            <hr/>
                            <label>id: </label>{value.id}                              
                            <hr/>
                            <span className="header-card"><label>email: </label><span style={{fontWeight:"bold"}}>{value.email}</span></span>
                            <hr/>
                            <div>
                                <Link to={"/meli/anuncios/"+value.id+"/"+undefined} className="btn-link">Anuncios</Link>
                                &nbsp;&nbsp;  
                                <button className="btn btn-danger btn-sm" onClick={event=>{event.preventDefault();axios.delete(host+'/meli/contas/'+value.idLocal);}}>Excluir</button>                       
                            </div>
                        </div>                        
                    )
                })
            }
        </div>
    )
}

export default Contas