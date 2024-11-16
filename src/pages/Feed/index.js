import { useEffect, useState } from "react";
import Template from "../../estrutura/Template"
import "./feed.css"
import ListarAnuncios from "../Anuncio/ListarAnuncios";
import ListarLojas from "../Loja/ListarLojas";
import ListarProdutos from "../Produto/ListarProdutos";
import axios from '../../config/api/api'
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function Feed(props){
    
    const [values, setValues] = useState({anuncios:{total:0, lista:[]}, produtos:{total:0, lista:[]}, lojas:{total:0, lista:[]}, usuario:{}, page:"anuncios"}) 
    const { id } = useParams();

    useEffect(() =>{
        axios.get(`/loja/anuncios/public?page=${0}&size=${10}`).then(anuncios =>     
            axios.get(`/loja/produtos/public?page=${0}&size=${10}&idLoja=${0}`).then(produtos => 
                axios.get(`/loja/lojas/public?page=${0}&size=${10}`).then(lojas =>     
                    setValues({
                        page:"anuncios",
                        anuncios:{lista:anuncios.data, total:anuncios.headers['total']}, 
                        lojas:{lista:lojas.data, total:lojas.headers['total']}, 
                        produtos:{lista:produtos.data, total:produtos.headers['total']}
                    })
                )
            )
        )
    }, [id]);    
    
    const handlerScroll = (event) => {
        if((event.target.scrollHeight - event.target.scrollTop)-10<=event.target.clientHeight)                                   
            if(values.page==='lojas'&&values.lojas.lista.length<values.lojas.total)
                axios.get(`/loja/lojas/public?page=${values.lojas.lista.length/10}&size=${10}`).then(lojas =>{ 
                    setValues({...values, lojas:{lista:values.lojas.lista.concat(lojas.data), total:lojas.headers.total}})
                });
            else if(values.page==='produtos'&&values.produtos.lista.length<values.produtos.total)
                axios.get(`/loja/produtos/public?page=${values.produtos.lista.length/10}&size=${10}&idLoja=${0}`).then(produtos =>{ 
                    setValues({...values, produtos:{lista:values.produtos.lista.concat(produtos.data), total:produtos.headers.total}})
                });
            else if(values.page==='anuncios'&&values.anuncios.lista.length<values.anuncios.total)
                axios.get(`/loja/anuncios/public?page=${values.anuncios.lista.length/10}&size=${10}`).then(anuncios =>{ 
                    setValues({...values, anuncios:{lista:values.anuncios.lista.concat(anuncios.data), total:anuncios.headers.total}, page:'anuncios'})
                });
    }

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
                {values.page==='anuncios'&&<ListarAnuncios anuncios={values.anuncios.lista} scroll={handlerScroll}/>}
                {values.page==='lojas'&&<ListarLojas lojas={values.lojas.lista} scroll={handlerScroll}/>}
                {values.page==='produtos'&&<ListarProdutos produtos={values.produtos.lista} scroll={handlerScroll}/>}                                
            </div>
        </Template>
    )
}

export default Feed