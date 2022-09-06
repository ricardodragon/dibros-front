import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import queryString from 'query-string';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import axios from "axios";
import './contas.css'
import { Button, IconButton } from "@material-ui/core";
    
function Contas(props){
    const [values, setValues] = useState({applicationUserId:JSON.parse(localStorage.getItem("usuario")).id, contas:[]});
    const dominio = "http://DESKTOP-DS0K2GT:8080"
    
    const addContas = async () =>{
        let { code } = queryString.parse(props.location.search);            
        if(code)
            setValues({
                ...values, 
                contas:[
                    ...values.contas, 
                    (await axios.post(dominio+'/meli/contas?code='+code+'&userId='+values.applicationUserId)).data
                ]
            });
    }

    const setContas = async () => {
        let { code } = queryString.parse(props.location.search);            
        setValues({
            ...values, 
            contas:(await axios.get(dominio+'/meli/contas/all?id='+values.applicationUserId)).data
        })
    }

    useEffect(() => {
        setContas();
        addContas();                 
    }, []);

    const redirectMeli = () => {
        window.location.href = "http://auth.mercadolivre.com.br/authorization?response_type=code&client_id=5401911184235214&redirect_uri=http://localhost:3000/contas";
    }

    return (
        <>            
            <IconButton color="primary" className="btn-add-contas" aria-label="Adicionar conta" onClick={redirectMeli}>
                <AddShoppingCartIcon /> ADICIONAR CONTA
            </IconButton>
            {
                values.contas.map((value, index) => {
                    return (                        
                        <div key={index} className="card-contas">
                            <span className="header-card h5">{value.nickname}</span>
                            <hr/>                            
                            <label>ID: </label>{value.id}                            
                            <hr/>
                            
                            <Link to={"/anuncios/"+value.userId} className="link-primary">Anuncios</Link>
                            &nbsp;&nbsp;                             
                            <Link to="/" className="link-danger">Perguntas</Link>
                        </div>                        
                    )
                })
            }
        </>
    )
}

export default Contas