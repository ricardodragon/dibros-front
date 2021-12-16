import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import queryString from 'query-string';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import axios from "axios";
import './contas.css'
import { Button, IconButton } from "@material-ui/core";
    
function Contas(props){
    const [values, setValues] = useState({applicationUserId:JSON.parse(localStorage.getItem("usuario")).id, contas:[]});
    
    const addContas = async () =>{
        let { code } = queryString.parse(props.location.search);            
        if(code)
            setValues({
                ...values, 
                contas:[
                    ...values.contas, 
                    (await axios.post('http://localhost:8080/meli/contas?code='+code+'&userId='+values.applicationUserId)).data
                ]
            });
    }

    const setContas = async () => {
        let { code } = queryString.parse(props.location.search);            
        setValues({
            ...values, 
            contas:(await axios.get('http://localhost:8080/meli/contas/all?id='+values.applicationUserId)).data
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
                            <div className="header-card">
                                <h1>{value.nickname}</h1>
                            </div>
                            <div className="card-content">
                                <label>ID: </label>{value.id}
                            </div>
                            <div className="footer-card-contas">
                                <Link to={"/anuncios/"+value.userId} className="footer-card-link">
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