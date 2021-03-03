import { IconButton } from "@material-ui/core";
import { useEffect } from "react";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import queryString from 'query-string';
import { useLocation } from "react-router-dom";
import axios from "axios";
    
function Contas(props){
    let { code } = queryString.parse(useLocation().search);
    useEffect(() => {
        if(code!=null)
            axios.post('http://localhost:8080/conta?code='+code).then(response => {

            });
    }, );

    const redirectMeli = () => {
        window.location.href = "http://auth.mercadolivre.com.br/authorization?response_type=code&client_id=5401911184235214&redirect_uri=http://localhost:3000/contas";
    }
    
    return (
        <IconButton color="primary" aria-label="Adicionar conta" onClick={redirectMeli}>
            <AddShoppingCartIcon /> Adicionar conta
        </IconButton>
    )
}

export default Contas