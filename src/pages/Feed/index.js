import { useEffect } from "react";
import Template from "../../estrutura/Template"
import "./feed.css"
import ListarAnuncios from "../Anuncio/ListarAnuncios";
import ListarLojas from "../Loja/ListarLojas";
import ListarProdutos from "../Produto/ListarProdutos";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { HashLink } from "react-router-hash-link";

function Feed(props){
    
    // const [values, setValues] = useState({page:"anuncios"}) 
    const { id } = useParams();

    useEffect(() =>{
        // axios.get(`/loja/produtos/public?page=${0}&size=${10}&idLoja=${0}`).then(produtos => 
        //     setValues({
        //         page:"anuncios",
        //         anuncios:{lista:anuncios.data, total:anuncios.headers['total']}, 
        //         produtos:{lista:produtos.data, total:produtos.headers['total']}
        //     })
        // )
    }, [id]);    
    
    // const handlerScroll = (event) => {
    //     if((event.target.scrollHeight - event.target.scrollTop)-10<=event.target.clientHeight)                                   
    //         if(values.page==='lojas'&&values.lojas.lista.length<values.lojas.total)
    //             axios.get(`/loja/lojas/public?page=${values.lojas.lista.length/10}&size=${10}`).then(lojas =>{ 
    //                 setValues({...values, lojas:{lista:values.lojas.lista.concat(lojas.data), total:lojas.headers.total}})
    //             });
    //         else if(values.page==='produtos'&&values.produtos.lista.length<values.produtos.total)
    //             axios.get(`/loja/produtos/public?page=${values.produtos.lista.length/10}&size=${10}&idLoja=${0}`).then(produtos =>{ 
    //                 setValues({...values, produtos:{lista:values.produtos.lista.concat(produtos.data), total:produtos.headers.total}})
    //             });
    // }

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
                    <ListarAnuncios/>
                </section>
                <section id="lojas" className="tab">
                    <ListarLojas/>
                </section>
                <section id="produtos" className="tab">
                    <ListarProdutos/>
                </section>                
            </div>
        </Template>
    )
}

export default Feed