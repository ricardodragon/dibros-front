import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { HashLink } from "react-router-hash-link";
import axios from '../../../config/api/api';
import AnunciosFeed from "../../Anuncio/ListarAnuncios/AnunciosFeed";
import ListarProdutos from "../../Produto/ListarProdutos";
import Colaboradores from "./Colaboradores";
import './loja-detalhes.css';

function LojaDetalhes(props){
 
    const [values, setValues] = useState({})    
    const { id } = useParams();
    const host = process.env.REACT_APP_URL;
        
    useEffect(() =>{
        axios.get("/loja/lojas/perfil/"+id).then(loja => setValues({loja:loja.data, scroll:0}))
    }, [id]);   

    return(
        <div id="" style={{height:'100%'}}>   
            {values.loja&&<header id='loja-perfil-header'>
                <h1>
                    <figure>
                        <img alt={"Foto da loja : "} src={values.loja.imagemPath?host+values.loja.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"}/>
                        <figcaption style={{width:'70%'}}>{values.loja.nome}</figcaption>
                    </figure>
                </h1>
                <div className='loja-seguidores'>
                    <h2 >{values.loja.seguidores}<p>seguidores</p></h2>
                    <h2>35<p>vendas</p></h2>
                    <div id='botoes'>                                            
                        {(!values.loja.seguindo&&
                            <button onClick={event=>axios.post('/loja/seguidores/'+id).then(r=>setValues({...values, loja:{...values.loja, seguindo:false}}))}>seguir</button>)||
                            <button disabled={true} style={{color:'white', cursor:'default'}}>seguindo</button>}                    
                    </div>
                </div>
            </header>
            }

            <nav className="menu-feed">
                <ul>
                    <HashLink to="#anuncios"><div style={{width:'33.33%', display:'inline-block'}}><li className='perfil-menu-opaciti'>📢 anuncios</li><li className='perfil-menu'>📢 anuncios</li></div></HashLink>
                    <HashLink to="#produtos"><div style={{width:'33.33%', display:'inline-block'}}><li className='perfil-menu-opaciti'>📦 produtos</li><li className='perfil-menu'>📦 produtos</li></div></HashLink>                
                    <HashLink to="#colaboradores"><div style={{width:'33.33%', display:'inline-block'}}><li className='perfil-menu-opaciti'>👥 colaboradores</li><li className='perfil-menu'>👥 colaboradores</li></div></HashLink>
                </ul>
            </nav> 

            <main id='tabs'>
                <div id="anuncios" className="tab">
                    <AnunciosFeed url={`/loja/anuncios/loja/${id}?`}/>
                </div>                
                <div id="produtos" className="tab">
                    <ListarProdutos url={`/loja/produtos?idLoja=${id}&`}/>
                </div>
                <div id="colaboradores" className="tab">
                    <Colaboradores id={id}/>
                </div> 
            </main>    
        </div>
    )
}

export default LojaDetalhes;