import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { HashLink } from 'react-router-hash-link';
import axios from '../../../config/api/api';
import AnunciosTabela from '../../Anuncio/ListarAnuncios/AnunciosTabela';
import ListarLojas from '../../Loja/ListarLojas';
import ListarProdutos from '../../Produto/ListarProdutos';
import './perfil.css';
import AnunciosFeed from '../../Anuncio/ListarAnuncios/AnunciosFeed';
import { Link } from 'react-router-dom';

function DetalharPerfil(props) {

    const [values, setValues] = useState({checkLayout:true})    
    const { id } = useParams();
    const host = process.env.REACT_APP_URL;

    useEffect(() =>{
        axios.get("/loja/seguidores/"+id).then(seguidores => setValues({usuario:seguidores.data, checkLayout:true}))
    }, [id]);        

    const onError = ({ currentTarget })=>{currentTarget.onError=null; currentTarget.src='https://freesvg.org/img/abstract-user-flat-3.png'};

    return <>        
        {values.usuario&&<header id='detalhar-perfil-header'>
            <figure>
                <img onError={onError} alt={"Foto do perfil : "} src={values.usuario.imagemPath?host+values.usuario.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"}/>
                <figcaption>{values.usuario.nome}</figcaption>
            </figure>
            <div className='seguidores'>
                <h2><p>{values.usuario.seguidoresQTD}</p>seguidores</h2>
                <h2><p>{values.usuario.seguindoQTD}</p>seguindo</h2>
                {JSON.parse(localStorage.getItem('usuario'))?.id!==values.usuario.id&&<div id='botoes' style={{cursor:'pointer'}}>                                            
                    {(values.usuario.seguindo===null&&<button onClick={event=>axios.post('/loja/seguidores/'+id).then(r=>setValues({...values, usuario:{...values.usuario, seguindo:false}}))}>seguir</button>)||
                    (values.usuario.seguindo&&<button disabled={true} style={{color:'white', cursor:'default'}}>parar de seguir</button>)||
                    (!values.usuario.seguindo&&<button style={{color:'white'}} disabled>aguardando</button>)}                    
                    <Link to={"/conversa-detalhes/"+values.usuario.id}><button >mensagem</button></Link>
                </div>}
            </div>
        </header>}

        <HashLink to="#anuncios" className="menu-feed"><span className='feed-menu-opaciti'>📢 anuncios</span><span className='feed-menu'>📢 anuncios</span></HashLink>
        <HashLink to="#lojas" className="menu-feed"><span className='feed-menu-opaciti'>🏬 lojas</span><span className='feed-menu'>🏬 lojas</span></HashLink>
        <HashLink to="#produtos" className="menu-feed"><span className='feed-menu-opaciti'>📦 produtos</span><span className='feed-menu'>📦 produtos</span></HashLink> 

        <div className="tabs-feed" style={{height:"74%"}}>
            <input type="checkbox" id="check-feed" onChange={event=>setValues({...values, checkLayout:!values.checkLayout})}/>
            <label className="check-feed-label" htmlFor="check-feed">
                {values.checkLayout&&<span><i className="fa-solid fa-list" style={{backgroundColor:"black", fontSize: "32px"}}></i></span>}
                {!values.checkLayout&&<span><i className="fa-solid fa-table-cells" style={{backgroundColor:"black", fontSize: "32px"}}></i></span>}
            </label>
            <section id="anuncios" className="tab">
                {values.checkLayout&&<AnunciosFeed url={`/loja/anuncios?idUsuario=${id}&`}/>}
                {!values.checkLayout&&<AnunciosTabela url={`/loja/anuncios?idUsuario=${id}&`}/>}  
            </section>
            <section id="lojas" className="tab">
                <ListarLojas/>
            </section>
            <section id="produtos" className="tab">
                <ListarProdutos url={`/loja/produtos?idUsuario=${id}&`}/>
            </section>  
        </div>
    </>
}

export default DetalharPerfil;
