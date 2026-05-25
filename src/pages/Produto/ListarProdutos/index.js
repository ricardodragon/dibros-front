import { useEffect, useState } from "react";
import axios from "../../../config/api/api";
import loader from "./../../../assets/loadinfo.gif";
import "./listar.css";

function ListarProdutos(props){
    const [values, setValues] = useState({})    
    const host =process.env.REACT_APP_URL;
    const lojaNotFound = "https://thumbs.dreamstime.com/b/%C3%ADcone-de-imagem-sem-foto-ou-em-branco-carregamento-imagens-aus%C3%AAncia-marca-n%C3%A3o-dispon%C3%ADvel-sinal-breve-silhueta-natureza-simples-215973362.jpg";;
    const produtoNotFound = "https://thumbs.dreamstime.com/b/%C3%ADcone-de-imagem-sem-foto-ou-em-branco-carregamento-imagens-aus%C3%AAncia-marca-n%C3%A3o-dispon%C3%ADvel-sinal-breve-silhueta-natureza-simples-215973362.jpg";

    useEffect(() => 
        axios.get(props.url+`page=${0}&size=${10}`).then(produtos =>setValues({produtos:produtos.data, page:0, usuario:JSON.parse(localStorage.getItem('usuario'))}))        
    , [props.url]);        
    
    const handlerScroll = (event) => {  
        const page = values.page+1; 
        if((event.target.scrollHeight - event.target.scrollTop)-10<=event.target.clientHeight&&values.produtos)
            axios.get(props.url+`page=${page}&size=${10}`).then(produtos =>{ setValues({...values, page, produtos:values.produtos.concat(produtos.data)})});
        if(props.onScroll)props.onScroll(event);
    }
    
    const onErrorLoja = ({ currentTarget })=>{currentTarget.onError=null; currentTarget.src=lojaNotFound}
    const onErrorProduto = ({ currentTarget })=>{currentTarget.onError=null; currentTarget.src=produtoNotFound}

    return (        
        <div className="produtos-conteudo" onScroll={handlerScroll}>
            {values.produtos&&values.produtos.map((produto, indexProduto) =>            
                <section className="card-produto" key={"produtos-"+indexProduto}>                  
                    <header>
                        <img alt={"Foto loja : " +produto.lojaDTO.nome} src={host+produto.lojaDTO.imagemPath} onError={onErrorLoja}/>
                        <h3>{produto.lojaDTO.nome}</h3>                             
                    </header>
                    <div className="opcoes">⋮</div>
                    <h2>{produto.titulo}</h2>                                                                    
                    
                    <img src={host+produto.imagemPath} alt={"Foto produto : " +produto.legenda} onError={onErrorProduto} className='img-produto' />                                                         
                    <div style={{boxSizing:'border-box', fontWeight:"bolder", textAlign:"center", fontSize:"10pt", width:"100%", padding:"1%"}}>
                        R$ {produto.preco},00
                    </div>   
                </section>
            )}
            <div style={{textAlign:"center"}}>{values.total&&values.produtos&&values.produtos.length>=values.total?"fim dos produtos":<img style={{height:"5em"}} src={loader} alt="loading..."/>}</div>
        </div>                
    )
}

export default ListarProdutos