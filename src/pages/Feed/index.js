import { useState } from "react";
import Template from "../../estrutura/Template"
import "./feed.css"
import ListarAnuncios from "../Anuncio/ListarAnuncios";
import ListarLojas from "../Loja/ListarLojas";
import ListarProdutos from "../Produto/ListarProdutos";

function Feed(props){
    
    const [values, setValues] = useState({page:"anuncios"});

    return (
        <Template>
            <nav id="menu-feed">
                <ul>
                    <li className="col-4" onClick={event=>{event.preventDefault();setValues({page:"anuncios"})}}>📢 anuncios</li>
                    <li className="col-4" onClick={event=>{event.preventDefault();setValues({page:"lojas"})}}>🏬 lojas</li>
                    <li className="col-4" onClick={event=>{event.preventDefault();setValues({page:"produtos"})}}>📦 produtos</li>
                </ul>
            </nav>
            <div>
                {values.page==="anuncios"&&<ListarAnuncios/>}
                {values.page==="lojas"&&<ListarLojas/>}
                {values.page==="produtos"&&<ListarProdutos/>}
            </div>
        </Template>
    )
}

export default Feed