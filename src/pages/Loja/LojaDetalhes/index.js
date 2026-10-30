import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { HashLink } from "react-router-hash-link";
import axios from '../../../config/api/api';
import ListarProdutos from "../../Produto/ListarProdutos";
import Colaboradores from "./Colaboradores";
import './loja-detalhes.css';

function LojaDetalhes(props){
 
    const [values, setValues] = useState({})    
    const { id } = useParams();
    const host = process.env.REACT_APP_URL;
        
    useEffect(() =>{
        axios.get("/loja/lojas/"+id).then(loja => setValues({loja:loja.data, checkLayout:true}))
    }, [id]);   

    const onError = ({ currentTarget })=>{currentTarget.onError=null; currentTarget.src='https://freesvg.org/img/abstract-user-flat-3.png'};

    return(<>   
        {values.loja&&<header id='loja-perfil-header'>
            <figure>
                <img alt={"Foto da loja : "} onError={onError} src={`${host}/loja/lojas/imagem/${values.loja.id}/${values.loja.imagem}?Authorization=${localStorage.getItem("token")}`}/>
                <figcaption>{values.loja.nome}</figcaption>
                <div style={{padding:"2% 0"}}>
                    <div>preparo: {`${values.loja.preparacaoValor} ${values.loja.preparacaoUnidadeDTO}`}</div>
                    <div>entrega: </div>
                </div>
            </figure>
            
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

        <HashLink to="#produtos" className="menu-feed"><span className='feed-menu-opaciti'>📦 produtos</span><span className='feed-menu'>📦 produtos</span></HashLink> 
        <HashLink to="#colaboradores" className="menu-feed"><span className='feed-menu-opaciti'>👥 colaboradores</span><span className='feed-menu'>👥 colaboradores</span></HashLink>
        
        <div className="tabs-feed">
            <section id="produtos" className="tab">
                <ListarProdutos url={`/loja/produtos/loja/${id}`}/>
            </section>  
            <section id="colaboradores" className="tab">
                <Colaboradores id={id}/>
            </section>
        </div> 
    </>)
}

export default LojaDetalhes;