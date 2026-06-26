import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { HashLink } from "react-router-hash-link";
import axios from '../../../config/api/api';
import ListarProdutos from "../../Produto/ListarProdutos";
import Colaboradores from "./Colaboradores";
import './loja-detalhes.css';

function LojaDetalhes(props){
 
    const [values, setValues] = useState({checkLayout:true})    
    const { id } = useParams();
    const host = process.env.REACT_APP_URL;
        
    useEffect(() =>{
        axios.get("/loja/lojas/"+id).then(loja => setValues({loja:loja.data, checkLayout:true}))
    }, [id]);   

    const onError = ({ currentTarget })=>{currentTarget.onError=null; currentTarget.src='https://freesvg.org/img/abstract-user-flat-3.png'};

    return(<>   
        {values.loja&&<header id='loja-perfil-header'>
            <figure>
                <img alt={"Foto da loja : "} onError={onError} src={values.loja.imagemPath?host+values.loja.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"}/>
                <figcaption>{values.loja.nome}</figcaption>
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
        
        <div className="tabs-feed" style={{height:"74%"}}>
            <input type="checkbox" id="check-feed" onChange={event=>setValues({...values, checkLayout:!values.checkLayout})}/>
            <label className="check-feed-label" htmlFor="check-feed">
                {values.checkLayout&&<span><i className="fa-solid fa-list" style={{backgroundColor:"black", fontSize: "32px"}}></i></span>}
                {!values.checkLayout&&<span><i className="fa-solid fa-table-cells" style={{backgroundColor:"black", fontSize: "32px"}}></i></span>}
            </label>
            <section id="produtos" className="tab">
                <ListarProdutos id={id}/>
            </section>  
            <section id="colaboradores" className="tab">
                <Colaboradores id={id}/>
            </section>
        </div> 
    </>)
}

export default LojaDetalhes;