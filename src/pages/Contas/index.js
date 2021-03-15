import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import queryString from 'query-string';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import axios from "axios";
import './contas.css'
import { Button, IconButton } from "@material-ui/core";
    
function Contas(){
    const [contas, setContas] = useState([]);
    let { code } = queryString.parse(useLocation().search);
    

    if(code!==undefined)
        axios.post('http://localhost:8080/conta?code='+code+'&userId='+JSON.parse(localStorage.getItem("usuario")).id).then(response => {
            setContas(contas => [...contas, response.data]); 
        });
        
    const getContas = async () => {
        const response = await axios.get('http://localhost:8080/conta/all?id='+JSON.parse(localStorage.getItem("usuario")).id);
        setContas(contas.concat(response.data.content));
    }

    useEffect(() => {
        getContas();
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
                contas.map((value, index) => {
                    return (
                        <div key={index} className="card-contas">
                            <div className="header-card">
                                <h1>{value.nickname}</h1>
                            </div>
                            <div className="card-content">
                                <label>ID: </label>{value.userId}
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