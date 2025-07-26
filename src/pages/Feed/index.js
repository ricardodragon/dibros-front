import { HashLink } from "react-router-hash-link";
import Template from "../../estrutura/Template";
import AnunciosTabela from "../Anuncio/ListarAnuncios/AnunciosTabela";
import AnunciosFeed from "../Anuncio/ListarAnuncios/AnunciosFeed";
import ListarLojas from "../Loja/ListarLojas";
import ListarProdutos from "../Produto/ListarProdutos";
import "./feed.css";
import { useState } from "react";

function Feed(props){
    const [values, setValues] = useState({checkLayout:false})
    return (
        <Template>
            <nav className="menu-feed">
                <ul>
                    <HashLink to="#anuncios"><div style={{width:'33.33%', display:'inline-block'}}><li className='perfil-menu-opaciti'>📢 anuncios</li><li className='perfil-menu'>📢 anuncios</li></div></HashLink>
                    <HashLink to="#lojas"><div style={{width:'33.33%', display:'inline-block'}}><li className='perfil-menu-opaciti'>🏬 lojas</li><li className='perfil-menu'>🏬 lojas</li></div></HashLink>
                    <HashLink to="#produtos"><div style={{width:'33.33%', display:'inline-block'}}><li className='perfil-menu-opaciti'>📦 produtos</li><li className='perfil-menu'>📦 produtos</li></div></HashLink>                
                </ul>
            </nav>
            <div className="tabs-feed">
                <input type="checkbox" id="check-feed" onChange={event=>setValues({...values, checkLayout:!values.checkLayout})}/>
                <label className="check-feed-label" htmlFor="check-feed">
                    {values.checkLayout&&<span><i className="fa-solid fa-list"></i></span>}
                    {!values.checkLayout&&<span><i className="fa-solid fa-table-cells"></i></span>}
                </label>
                <section id="anuncios" className="tab">
                    {values.checkLayout&&<AnunciosFeed url={'/loja/anuncios'+(localStorage.getItem("token")?'?':'/public?')}/>}
                    {!values.checkLayout&&<AnunciosTabela url={'/loja/anuncios'+(localStorage.getItem("token")?'?':'/public?')}/>}
                </section>
                <section id="lojas" className="tab">
                    <ListarLojas/>
                </section>
                <section id="produtos" className="tab">
                    <ListarProdutos url={'/loja/produtos'+(localStorage.getItem("token")?'?':'/public?')}/>
                </section>                
            </div>
        </Template>
    )
}

export default Feed