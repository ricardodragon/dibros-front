import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import queryString from 'query-string';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import axios from "axios";
import './contas.css'
import { Button, IconButton } from "@material-ui/core";
    
function Contas(){
    const [values, setValues] = useState({applicationUserId:JSON.parse(localStorage.getItem("usuario")).id, contas:[]});
    let { code } = queryString.parse(useLocation().search);
    
    if(code!==undefined)
        axios.post('http://localhost:8080/conta?code='+code+'&userId='+values.applicationUserId).then(response => {
            setValues({...values, contas:[...values.contas, response.data]}); 
        });
    
    async function setContas(){
        setValues({
            ...values, 
            contas:(await axios.get('http://localhost:8080/conta/all?id='+values.applicationUserId)).data
        })
    }

    useEffect(() => {
        setContas();            
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
                            <div className="header-card">
                                <h1>{value.nickname}</h1>
                            </div>
                            <div className="card-content">
                                <label>ID: </label>{value.id}
                            </div>
                            <div className="footer-card-contas">
                                <Link to={"/anuncios/userId="+value.userId} className="footer-card-link">
                                    <Button size="small" color="primary">
                                        Anuncios
                                    </Button>
                                </Link>
                                <Link to="/" className="footer-card-link">
                                    <Button size="small" color="primary">
                                        Perguntas
                                    </Button>        
                                </Link>
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}

export default Contas