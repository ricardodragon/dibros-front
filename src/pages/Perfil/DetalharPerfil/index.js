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

    const [values, setValues] = useState({anuncios:{total:0, lista:[]}, produtos:{total:0, lista:[]}, lojas:{total:0, lista:[]}, usuario:{}})    
    const { id } = useParams();
    const host = process.env.REACT_APP_URL;

    useEffect(() =>{
        axios.get("/loja/seguidores/"+id).then(seguidores => 
            axios.get(`/loja/produtos/public?page=${0}&size=${10}&idLoja=${0}`).then(produtos => 
                setValues({
                    usuario:seguidores.data,                                            
                    produtos:{lista:produtos.data, total:produtos.headers['total']}
                })                                    
            )
        )
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

    return <div style={{height:'100%', width:'100%'}}>        
        <header style={{height:'30%'}}>
            <div>
                <div className='foto-perfil' style={{paddingLeft:'5%'}}>
                    <h3><img alt={"Foto do perfil : "} src={values.usuario.imagemPath?host+values.usuario.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"}/></h3>
                    <h2>{values.usuario.nome}</h2>
                </div>
                <div className=''><h3>{values.usuario.seguidores}</h3><p>seguidores</p></div>
                <div className=''><h3>{values.usuario.seguindo}</h3><p>seguindo</p></div>
            </div>            
        </header>

        <nav className="menu-feed">
            <ul>
                <li><HashLink to="#anuncios">📢 anuncios</HashLink></li>
                <li><HashLink to="#lojas">🏬 lojas</HashLink></li>
                <li><HashLink to="#produtos">📦 produtos</HashLink></li>
            </ul>
        </nav>         

        <div className='tabs'>
            <section id="anuncios">
                <ListarAnuncios/>
            </section>
            <section id="lojas">
                <ListarLojas/>
            </section>
            <section id="produtos">
                <ListarProdutos/>
            </section> 
        </div>
    </div>
}

export default DetalharPerfil;
