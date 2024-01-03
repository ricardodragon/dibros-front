import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import queryString from 'query-string';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import axios from "axios";
import './contas.css'
import { IconButton } from "@material-ui/core";
    
function Contas(props){
    const [values, setValues] = useState({contas:[]});        
    const { code } = queryString.parse(props.location.search)
    const host = "https://dibros.ddns.net:7080";

    useEffect(() => {
        if(code)
            axios.post(host+'/meli/contas?code='+code+'&userId='+JSON.parse(localStorage.getItem("usuario")).id).then(res=> 
                axios.get(host+'/meli/contas/all?id='+JSON.parse(localStorage.getItem("usuario")).id)
                    .then(res=> setValues({contas:res.data}))
            )
        else
            axios.get(host+'/meli/contas/all?id='+JSON.parse(localStorage.getItem("usuario")).id)
                .then(res=> setValues({contas:res.data}))
    }, [code, values.contas, host]);

    const redirectMeli = () => {                
        const uriRedirect = 'https://dibros.com.br/meli/contas'
        window.location.href = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=5401911184235214&redirect_uri=${uriRedirect}`;
    }

    return (
        <div className="row">            
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
                            {/* <Link to="/" className="link-danger">Perguntas</Link> */}
                        </div>                        
                    )
                })
            }
        </div>
    )
}

export default Contas