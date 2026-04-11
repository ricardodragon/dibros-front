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
                    {values.checkLayout&&<span><i className="fa-solid fa-list" style={{backgroundColor:"black", fontSize: "32px"}}></i></span>}
                    {!values.checkLayout&&<span><i className="fa-solid fa-table-cells" style={{backgroundColor:"black", fontSize: "32px"}}></i></span>}
                </label>
                <section id="anuncios" className="tab">
                    {values.checkLayout&&<AnunciosFeed url={'/loja/anuncios'+(localStorage.getItem("token")?'?':'/public?')}/>}
                    {!values.checkLayout&&<AnunciosTabela url={'/loja/anuncios'+(localStorage.getItem("token")?'?':'/public?')}/>}
                    <Link className="criar-anuncios" to={'/anuncio'}>➕</Link>
                </section>
                <section id="lojas" className="tab">
                    <ListarLojas/>
                    <Link className="criar-anuncios" to={'/lojas'}>➕</Link>
                </section>
                <section id="produtos" className="tab">
                    <ListarProdutos url={'/loja/produtos'+(localStorage.getItem("token")?'?':'/public?')}/>
                    <Link className="criar-anuncios" to={'/produtos/'+0}>➕</Link>
                </section>  
            </div>
        </Template>
    )
}

export default Feed