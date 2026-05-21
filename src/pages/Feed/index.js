import { HashLink } from "react-router-hash-link";
import Template from "../../estrutura/Template";
import AnunciosTabela from "../Anuncio/ListarAnuncios/AnunciosTabela";
import AnunciosFeed from "../Anuncio/ListarAnuncios/AnunciosFeed";
import ListarLojas from "../Loja/ListarLojas";
import ListarProdutos from "../Produto/ListarProdutos";
import "./feed.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function Feed(props){
    const [values, setValues] = useState({checkLayout:true})
    return (
        <Template>
            <HashLink to="#anuncios" className="menu-feed"><span className='feed-menu-opaciti'>📢 anuncios</span><span className='feed-menu'>📢 anuncios</span></HashLink>
            <HashLink to="#lojas" className="menu-feed"><span className='feed-menu-opaciti'>🏬 lojas</span><span className='feed-menu'>🏬 lojas</span></HashLink>
            <HashLink to="#produtos" className="menu-feed"><span className='feed-menu-opaciti'>📦 produtos</span><span className='feed-menu'>📦 produtos</span></HashLink> 

            <div className="tabs-feed">
                <input type="checkbox" id="check-feed" onChange={event=>setValues({...values, checkLayout:!values.checkLayout})}/>
                <label className="check-feed-label" htmlFor="check-feed">
                    {values.checkLayout&&<span><i className="fa-solid fa-list" style={{backgroundColor:"black", fontSize: "32px"}}></i></span>}
                    {!values.checkLayout&&<span><i className="fa-solid fa-table-cells" style={{backgroundColor:"black", fontSize: "32px"}}></i></span>}
                </label>
                <section id="anuncios" className="tab">
                    {values.checkLayout&&<AnunciosFeed url={'/loja/anuncios'+(localStorage.getItem("token")?'?':'/public?')}/>}
                    {!values.checkLayout&&<AnunciosTabela url={'/loja/anuncios'+(localStorage.getItem("token")?'?':'/public?')}/>}
                    <Link className="criar-anuncios" to={'/anuncio'}>+</Link>
                </section>
                <section id="lojas" className="tab">
                    <ListarLojas/>
                    <Link className="criar-anuncios" to={'/lojas'}>+</Link>
                </section>
                <section id="produtos" className="tab">
                    <ListarProdutos url={'/loja/produtos'+(localStorage.getItem("token")?'?':'/public?')}/>
                    <Link className="criar-anuncios" to={'/produtos/'+0}>+</Link>
                </section>  
            </div>
        </Template>
    )
}

export default Feed