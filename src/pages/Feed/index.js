import Template from "../../estrutura/Template";
import ListarLojas from "../Loja/ListarLojas";
import ListarProdutos from "../Produto/ListarProdutos";
import "./feed.css";
import { Link } from "react-router-dom";

function Feed(props){

    return (
        <Template>
            <a className="menu-feed" href="#lojas"><span className='feed-menu-opaciti'>🏬 lojas</span><span className='feed-menu'>🏬 lojas</span></a>
            <a href="#produtos" className="menu-feed"><span className='feed-menu-opaciti'>📦 produtos</span><span className='feed-menu'>📦 produtos</span></a> 

            <div className="tabs-feed">
                <section id="lojas" className="tab">
                    <ListarLojas url={`/loja/lojas`}/>
                    <Link className="criar-anuncios" to={'/lojas'}>+</Link>
                </section>
                <section id="produtos" className="tab">
                    <ListarProdutos url={`/loja/produtos`}/>
                    <Link className="criar-anuncios" to={'/produtos/'+0}>+</Link>
                </section>  
            </div>
        </Template>
    )
}

export default Feed