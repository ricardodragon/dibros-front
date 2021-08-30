import axios from "axios";
import { useState } from "react";


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
            <label for="titulo">Título</label><input id="titulo" type="text"/>
            <label for="subtitulo">Subtítulo</label><input id="subtitulo" type="text"/>
            <label for="start_date">Começar anuncio em : </label><input id="start_date" type="date"/>
            <label for="stop_date">Parar anuncio em : </label><input id="stop_date" type="date"/>
            <label for="modo_compra">Modo de compra</label><input id="modo_compra" type="checkbox"/>
            <label for="price">Preço</label><input id="price" type="number"/>        
            <label for="moeda_corrente">Moeda Corrente</label><input id="moeda_corrente" type="number"/>
            <label for="condicao">Condição</label><input id="condicao" type="checkbox"/>
            <label for="original_price">Preço Original</label><input id="original_price" type="currency"/>
            <label for="preco_base">Preço Base</label><input id="preco_base" type="number"/>
            <label for="preco_base">Preço Base</label><input id="preco_base" type="number"/>
            <label for="qtd_disponivel">Quantidade disponível</label><input id="qtd_disponivel" type="number"/>
            <label for="initial_quantity">Quantidade inicial</label><input id="initial_quantity" type="number"/>
            <label for="aceita_mercadopago">Aceita MercadoPago</label><input id="aceita_mercadopago" type="checkbox"/>
            

        </>
    )
}

export default Publicar