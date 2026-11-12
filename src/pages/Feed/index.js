import ListarLojas from "../Loja/ListarLojas";
import ListarProdutos from "../Produto/ListarProdutos";
import "./feed.css";
import { Link } from "react-router-dom";

function Feed(props){

    const trocarFeed = (event, id)=>{
        event.preventDefault();
        document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    }

    return (
        <>
            <span className="menu-feed" name="lojas" onClick={event=>trocarFeed(event, "lojas")}><span className='feed-menu-opaciti'>🏬 lojas</span><span className='feed-menu'>🏬 lojas</span></span>
            <span name="produtos" onClick={event=>trocarFeed(event, "produtos")} className="menu-feed"><span className='feed-menu-opaciti'>📦 produtos</span><span className='feed-menu'>📦 produtos</span></span> 

            <div className="tabs-feed">
                <section id="lojas" className="tab">
                    <ListarLojas url={`/loja/lojas/public`} rotaEdicao="/lojas"/>
                    <Link className="criar-anuncios" to={'/lojas'}>+</Link>
                </section>
                <section id="produtos" className="tab">
                    <ListarProdutos url={`/loja/produtos/public`}/>
                    <Link className="criar-anuncios" to={'/produtos/'+0}>+</Link>
                </section>  
            </div>
        </>
    )
}

export default Feed