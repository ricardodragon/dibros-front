import Template from "../../estrutura/Template"
import "./feed.css"
import ListarAnuncios from "../Anuncio/ListarAnuncios";
import ListarLojas from "../Loja/ListarLojas";
import ListarProdutos from "../Produto/ListarProdutos";
import { HashLink } from "react-router-hash-link";

function Feed(props){

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
                <section id="anuncios" className="tab">
                    <ListarAnuncios url={'/loja/anuncios'+(localStorage.getItem("token")?'?':'/public?')}/>
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