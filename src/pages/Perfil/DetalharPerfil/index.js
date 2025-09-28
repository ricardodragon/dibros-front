import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { HashLink } from 'react-router-hash-link';
import axios from '../../../config/api/api';
import AnunciosTabela from '../../Anuncio/ListarAnuncios/AnunciosTabela';
import ListarLojas from '../../Loja/ListarLojas';
import ListarProdutos from '../../Produto/ListarProdutos';
import './perfil.css';
import AnunciosFeed from '../../Anuncio/ListarAnuncios/AnunciosFeed';

function DetalharPerfil(props) {

    const [values, setValues] = useState({})    
    const { id } = useParams();
    const host = process.env.REACT_APP_URL;

    useEffect(() =>{
        axios.get("/loja/seguidores/"+id).then(seguidores => setValues({usuario:seguidores.data, scroll:0}))
    }, [id]);        

    const onScroll = (event) =>{       
        const conteudoHeight = document.getElementById('cont').clientHeight;
        const tabsHeight = document.getElementById('tabs').clientHeight;
        if(values.scroll<event.target.scrollTop&&Math.round((tabsHeight/conteudoHeight)*100+1)<80){
            document.getElementById('detalhar-perfil-header').style.height='0%'; 
            document.getElementById('tabs').style.height='96%';                        
        }        
        else if(values.scroll>event.target.scrollTop&&Math.round((tabsHeight/conteudoHeight)*100+1)>80){
            document.getElementById('detalhar-perfil-header').style.height='25%'; 
            document.getElementById('tabs').style.height='71%';                         
        }
        setValues({...values, scroll:event.target.scrollTop});            
    }

    return <div id="cont" style={{height:'100%'}}>        
        {values.usuario&&<header id='detalhar-perfil-header'>
            <h1>
                <figure>
                    <img alt={"Foto do perfil : "} src={values.usuario.imagemPath?host+values.usuario.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"}/>
                    <figcaption style={{width:'70%'}}>{values.usuario.nome}</figcaption>
                </figure>
            </h1>
            <div className='seguidores'>
                <h2 style={{paddingRight:'5%'}}>{values.usuario.seguidoresQTD}<p>seguidores</p></h2>
                <h2>{values.usuario.seguindoQTD}<p>seguindo</p></h2>
                {JSON.parse(localStorage.getItem('usuario'))?.id!==values.usuario.id&&<div id='botoes' style={{cursor:'pointer'}}>                                            
                    {(values.usuario.seguindo===null&&<button onClick={event=>axios.post('/loja/seguidores/'+id).then(r=>setValues({...values, usuario:{...values.usuario, seguindo:false}}))}>seguir</button>)||
                    (values.usuario.seguindo&&<button disabled={true} style={{color:'white', cursor:'default'}}>parar de seguir</button>)||
                    (!values.usuario.seguindo&&<button style={{color:'white'}} disabled>aguardando</button>)}                    
                    <button >mensagem</button>
                </div>}
            </div>
        </header>}

        <nav className="menu-feed">
            <ul>
                <HashLink to="#anuncios"><div style={{width:'33.33%', display:'inline-block'}}><li className='perfil-menu-opaciti'>📢 anuncios</li><li className='perfil-menu'>📢 anuncios</li></div></HashLink>
                <HashLink to="#lojas"><div style={{width:'33.33%', display:'inline-block'}}><li className='perfil-menu-opaciti'>🏬 lojas</li><li className='perfil-menu'>🏬 lojas</li></div></HashLink>
                <HashLink to="#produtos"><div style={{width:'33.33%', display:'inline-block'}}><li className='perfil-menu-opaciti'>📦 produtos</li><li className='perfil-menu'>📦 produtos</li></div></HashLink>                
            </ul>
        </nav>         

        <main id='tabs'>
            <input type="checkbox" id="check-feed" onChange={event=>setValues({...values, checkLayout:!values.checkLayout})}/>
            <label className="check-feed-label" htmlFor="check-feed">
                {values.checkLayout&&<span><i className="fa-solid fa-list" style={{fontSize: "32px"}}></i></span>}
                {!values.checkLayout&&<span><i className="fa-solid fa-table-cells" style={{fontSize: "32px"}}></i></span>}
            </label>
            <div id="anuncios" className="tab">
                {values.checkLayout&&<AnunciosFeed onScroll={onScroll} url={`/loja/anuncios?idUsuario=${id}&`}/>}
                {!values.checkLayout&&<AnunciosTabela onScroll={onScroll} url={`/loja/anuncios?idUsuario=${id}&`}/>}                
            </div>
            <div id="lojas" className="tab">
                <ListarLojas onScroll={onScroll}/>
            </div>
            <div id="produtos" className="tab">
                <ListarProdutos onScroll={onScroll} url={`/loja/produtos?idUsuario=${id}&`}/>
            </div> 
        </main>
    </div>
}

export default DetalharPerfil;
