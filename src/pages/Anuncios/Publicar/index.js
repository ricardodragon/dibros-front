import axios from "axios";
import { useState } from "react";
import Categorias from "../../../components/Categorias";
import Garantias from "../../../components/Garantias";


function Publicar(){
    const [anuncio, setAnuncio] = useState([]);

    function postAnuncio(event){
        axios.post('http://localhost:8080/anuncios/publicar', {anuncio: anuncio})
            .then(response => {
                
            });
    }
    return (
        <>
            <h1>Publicar</h1>
                <div>
                    <span style={{float: "left", width: "48%", padding: "1%", display: "flex"}}><label for="titulo">Título : </label><input id="titulo" type="text" /></span>
                    <span style={{float: "right", width: "48%", padding: "1%", display: "flex"}}><label for="subtitulo">Subtítulo : </label><input id="subtitulo" type="text"/></span>
                </div>
                <div>
                    <span style={{float: "left", width: "62%", padding: "1%"}}>
                        <label for="start_date">Começar anuncio em : </label><input id="start_date" type="datetime-local"  style={{marginRight: "3%"}}/>
                        <label for="stop_date">Parar anuncio em : </label><input id="stop_date" type="datetime-local"/>
                    </span>
                    <span style={{float: "right", width: "31%",  padding: "1%"}}>
                        <label for="condicao">Condição : </label><input id="condicao" type="checkbox"/>
                    </span>
                </div>                
                <div>            
                    <span style={{float: "left", width: "62%", padding: "1%"}}>
                        <label for="preco">Preço : </label><input id="preco" type="number" style={{marginRight: "21.2%"}}/>
                        <label for="moeda_corrente">Moeda Corrente : </label><input id="moeda_corrente" type="number"/>
                    </span>
                    <span style={{float: "right", width: "31%", padding: "1%"}}><label for="modo_compra">Modo de compra : </label><input id="modo_compra" type="checkbox"/></span>
                </div>
                <div>
                    <span style={{float: "left", width: "65%", padding: "1%"}}>
                        <label for="original_price">Preço Original : </label><input id="original_price" type="currency" style={{marginRight: "12.7%"}}/>
                        <label for="preco_base">Preço Base : </label><input id="preco_base" type="number"/>
                    </span>
                    <span style={{float: "left", width: "31%",  padding: "1%"}}><label for="aceita_mercadopago">Aceita MercadoPago : </label><input id="aceita_mercadopago" type="checkbox"/></span>
                </div>
                <div>
                    <span style={{float: "left", width: "62%", padding: "1%"}}>
                        <label for="qtd_disponivel">Quantidade disponível : </label><input id="qtd_disponivel" type="number" style={{marginRight: "5.2%"}}/>
                        <label for="initial_quantity">Quantidade inicial : </label><input id="initial_quantity" type="number"/>
                    </span>
                    <span style={{float: "right", width: "31%",  padding: "1%"}}>
                        <Categorias/>
                    </span>
                </div>              
                <Garantias/>                
        
        </>
    )
}

export default Publicar