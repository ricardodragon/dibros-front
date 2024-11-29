import React, { useEffect, useState } from 'react';
import './perfil.css'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import axios from '../../../config/api/api'
import ListarAnuncios from '../../Anuncio/ListarAnuncios';
import ListarLojas from '../../Loja/ListarLojas';
import ListarProdutos from '../../Produto/ListarProdutos';
import './perfil.css';
import { HashLink } from 'react-router-hash-link';

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
            document.getElementById('tabs').style.height='92%';                        
        }        
        else if(values.scroll>event.target.scrollTop&&Math.round((tabsHeight/conteudoHeight)*100+1)>80){
            document.getElementById('detalhar-perfil-header').style.height='25%'; 
            document.getElementById('tabs').style.height='67%';                         
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
                <h2 style={{paddingRight:'10%'}}>{values.usuario.seguidores}<p>seguidores</p></h2>
                <h2>{values.usuario.seguindoQuantidade}<p>seguindo</p></h2>
                {JSON.parse(localStorage.getItem('usuario'))?.id!==values.usuario.id&&<div style={{width:'100%'}} id='botoes'>                                            
                    {(values.usuario.seguindo&&<button disabled={true} style={{width:'35%', borderRadius:'3%', backgroundColor:'#0275d8', color:'white'}}>seguindo</button>)||
                    (<button style={{width:'35%', borderRadius:'3%', backgroundColor:'#0275d8', color:'white'}} onClick={event=>axios.post('/loja/seguidores/'+id)}>seguir</button>)}                    
                    <button style={{width:'55%', borderRadius:'3%', backgroundColor:'#0275d8', color:'white'}}>mensagem</button>
                </div>}
            </div>
        </header>}

        <nav className="menu-feed">
            <ul>
                <li><HashLink to="#anuncios">📢 anuncios</HashLink></li>
                <li><HashLink to="#lojas">🏬 lojas</HashLink></li>
                <li><HashLink to="#produtos">📦 produtos</HashLink></li>
            </ul>
        </nav>         

        <main id='tabs'>
            <div id="anuncios" className="tab">
                <ListarAnuncios id={id} onScroll={onScroll}/>
            </div>
            <div id="lojas" className="tab">
                <ListarLojas id={id} onScroll={onScroll}/>
            </div>
            <div id="produtos" className="tab">
                <ListarProdutos id={id} onScroll={onScroll}/>
            </div> 
        </main>
    </div>
}

export default DetalharPerfil;
