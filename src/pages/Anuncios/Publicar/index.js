import axios from "axios";
import { useState } from "react";
import Categorias from "../../../components/Categorias";
import Garantias from "../../../components/Garantias";
import TipoAnuncio from "../../../components/TipoAnuncio";


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
                    <span style={{float: "left", width: "48%", padding: "1%", display: "flex"}}><label htmlFor="titulo">Título : </label><input id="titulo" type="text" /></span>
                    <span style={{float: "right", width: "48%", padding: "1%", display: "flex"}}><label htmlFor="subtitulo">Subtítulo : </label><input id="subtitulo" type="text"/></span>
                </div>
                <div>
                    <span style={{float: "left", width: "62%", padding: "1%"}}>
                        <label htmlFor="start_date">Começar anuncio em : </label><input id="start_date" type="datetime-local"  style={{marginRight: "3%"}}/>
                        <label htmlFor="stop_date">Parar anuncio em : </label><input id="stop_date" type="datetime-local"/>
                    </span>
                    <span style={{float: "right", width: "31%",  padding: "1%"}}>
                        <label htmlFor="condicao">Condição : </label><input id="condicao" type="checkbox"/>
                    </span>
                </div>                
                <div>            
                    <span style={{float: "left", width: "62%", padding: "1%"}}>
                        <label htmlFor="preco">Preço : </label><input id="preco" type="number" style={{marginRight: "21.2%"}}/>
                        <label htmlFor="moeda_corrente">Moeda Corrente : </label><input id="moeda_corrente" type="number"/>
                    </span>
                    <span style={{float: "right", width: "31%", padding: "1%"}}><label htmlFor="modo_compra">Modo de compra : </label><input id="modo_compra" type="checkbox"/></span>
                </div>
                <div>
                    <span style={{float: "left", width: "65%", padding: "1%"}}>
                        <label htmlFor="original_price">Preço Original : </label><input id="original_price" type="currency" style={{marginRight: "12.7%"}}/>
                        <label htmlFor="preco_base">Preço Base : </label><input id="preco_base" type="number"/>
                    </span>
                    <span style={{float: "left", width: "31%",  padding: "1%"}}><label htmlFor="aceita_mercadopago">Aceita MercadoPago : </label><input id="aceita_mercadopago" type="checkbox"/></span>
                </div>
                <div>
                    <span style={{float: "left", width: "62%", padding: "1%"}}>
                        <label htmlFor="qtd_disponivel">Quantidade disponível : </label><input id="qtd_disponivel" type="number" style={{marginRight: "5.2%"}}/>
                        <label htmlFor="initial_quantity">Quantidade inicial : </label><input id="initial_quantity" type="number"/>
                    </span>
                    <span style={{float: "right", width: "31%",  padding: "1%"}}>
                        <Categorias/>
                    </span>
                </div>              
                <Garantias/>                
                <TipoAnuncio/>
        </>
    )
}

export default Publicar