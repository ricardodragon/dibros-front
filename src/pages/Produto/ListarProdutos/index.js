import { useEffect, useState } from "react";
import axios from "../../../config/api/api";
import loader from "./../../../assets/loadinfo.gif";
import "./listar.css"

function ListarProdutos(props){
    const [values, setValues] = useState({})    
    const host =process.env.REACT_APP_URL;

    useEffect(() => 
        axios.get(process.env.REACT_APP_URL+"/auth/usuarios").then(r=>
            setValues({produtos:props.produtos, usuario:r.data})            
        )
    , [props.produtos]);        
    
    return (        
        <div className="produtos-conteudo" id="produtos-conteudo" onScroll={props.scroll}>
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
            <div style={{textAlign:"center"}}>{values.total&&values.produtos.length>=values.total?"fim dos produtos":<img style={{height:"5em"}} src={loader} alt="loading..."/>}</div>
        </div>                
    )
}

export default ListarProdutos