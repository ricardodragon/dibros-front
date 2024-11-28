import { useEffect, useState } from "react";
import axios from "../../../config/api/api";
import loader from "./../../../assets/loadinfo.gif";
import "./listar.css"

function ListarProdutos(props){
    const [values, setValues] = useState({})    
    const host =process.env.REACT_APP_URL;

    useEffect(() =>         
        axios.get(`/loja/produtos${props.id?`?idUsuario=${props.id}&&`:'/public?'}page=${0}&size=${10}&idLoja=${0}`).then(produtos =>
            setValues({produtos:produtos.data, total:produtos.headers['total'], usuario:JSON.parse(localStorage.getItem('usuario'))})            
        )        
    , [props.id]);        
    
    const handlerScroll = (event) => {   
        if((event.target.scrollHeight - event.target.scrollTop)<=event.target.clientHeight&&values.produtos&&values.total&&values.produtos.length<values.total){     
            axios.get(`/loja/produtos${props.id?`?idUsuario=${props.id}&&`:'/public?'}page=${values.produtos.length/10}&size=${10}&idLoja=${0}`).then(produtos =>{ 
                setValues({...values, produtos:values.produtos.concat(produtos.data), total:produtos.headers.total})
            });
        }
        if(props.onScroll)props.onScroll(event);
    }
    
    return (        
        <div className="produtos-conteudo" onScroll={handlerScroll}>
            {values.produtos&&values.produtos.map((produto, indexProduto) =>            
                <section className="card-produto" key={"produtos-"+indexProduto}>                  
                    <header style={{padding: "2%"}}>
                        <img alt={"Foto produto : " +produto.legenda} src={host+produto.lojaDTO.imagemPath} style={{borderRadius: "50%", width:"3em", height:"3em"}}/>
                        <h3 style={{display: "inline", fontSize:"11pt", paddingLeft:'2%'}}>{produto.lojaDTO.nome}</h3>                             
                        <div style={{fontWeight:"bolder", float:"right", cursor:"pointer"}}>⋮</div>
                    </header>
                    <h2 style={{paddingLeft: "2.5%", fontSize:"12pt"}}>{produto.titulo}</h2>                                                                    
                    
                    <p className="teste">
                        <img src={host+produto.imagemPath} alt="Produto" id={{}} className='img-produto' />                                                         
                    </p>
                    <div style={{fontWeight:"bolder", textAlign:"center", fontSize:"10pt", width:"100%", padding:"1%"}}>
                        R$ {produto.preco},00
                    </div>   
                </section>
            )}
            <div style={{textAlign:"center"}}>{values.total&&values.produtos&&values.produtos.length>=values.total?"fim dos produtos":<img style={{height:"5em"}} src={loader} alt="loading..."/>}</div>
        </div>                
    )
}

export default ListarProdutos