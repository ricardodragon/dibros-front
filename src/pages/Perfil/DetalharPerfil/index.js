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
        axios.get("/loja/seguidores/"+id).then(seguidores => setValues({usuario:seguidores.data,scroll:0}))
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
    //         else if(values.page==='anuncios'&&values.anuncios.lista.length<values.anuncios.total)
    //             axios.get(`/loja/anuncios/public?page=${values.anuncios.lista.length/10}&size=${10}`).then(anuncios =>{ 
    //                 setValues({...values, anuncios:{lista:values.anuncios.lista.concat(anuncios.data), total:anuncios.headers.total}, page:'anuncios'})
    //             });
    // }

    const onScroll = (event) =>{       
        const conteudoHeight = document.getElementById('cont').clientHeight;
        const tabsHeight = document.getElementById('tabs').clientHeight;
        const headerHeight = document.getElementById('detalhar-perfil-header').clientHeight;
        console.log((tabsHeight/conteudoHeight)*100)
        console.log((headerHeight/conteudoHeight)*100)
        if(values.scroll<event.target.scrollTop&&Math.round((tabsHeight/conteudoHeight)*100+1)<96){
            document.getElementById('detalhar-perfil-header').style.height=Math.round((headerHeight/conteudoHeight)*100-2)+'%'; 
            document.getElementById('tabs').style.height=Math.round((tabsHeight/conteudoHeight)*100+2)+'%';                        
        }        
        else if(values.scroll>event.target.scrollTop&&Math.round((tabsHeight/conteudoHeight)*100+2)>=66){
            document.getElementById('detalhar-perfil-header').style.height=Math.round((headerHeight/conteudoHeight)*100+2)+'%'; 
            document.getElementById('tabs').style.height=Math.round((tabsHeight/conteudoHeight)*100-2)+'%';                         
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
                <h2>{values.usuario.seguindo}<p>seguindo</p></h2>
                <div style={{width:'100%'}} id='botoes'>
                    <button style={{width:'35%', borderRadius:'3%', backgroundColor:'#0275d8', color:'white'}}>seguir</button>
                    <button style={{width:'55%', borderRadius:'3%', backgroundColor:'#0275d8', color:'white'}}>mensagem</button>
                </div>
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
                <ListarAnuncios onScroll={onScroll}/>
            </div>
            <div id="lojas" className="tab">
                <ListarLojas/>
            </div>
            <div id="produtos" className="tab">
                <ListarProdutos/>
            </div> 
        </main>
    </div>
}

export default DetalharPerfil;
