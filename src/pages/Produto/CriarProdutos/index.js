import axios from '../../../config/api/api';
import loader from "./../../../assets/loadinfo.gif";
import { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import './produtos.css';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

function CriarProdutos(){
    
    const [values, setValues] = useState({})    
    const idLoja = useParams().id;
    const { id } = JSON.parse(localStorage.getItem('usuario'))
    const ref = useRef();
    const host = process.env.REACT_APP_URL;
    
    useEffect(() => 
        axios.get(`/loja/produtos?idUsuario=${id}&idLoja=${idLoja}&page=${0}&size=${100}`).then(produtos => 
            axios.get(`/loja/lojas?idUsuario=${id}&page=${0}&size=${100}`).then(lojas =>
                setValues({lojas:lojas.data, produtos:produtos.data, erro: lojas.data.length<=0?"É preciso criar uma loja em \"Menu > Lojas\"":false, idLoja:id, produto:{titulo:'', quantidade:'', preco:''}, load:false})))            
    , [idLoja, id]);    

    const enviaImagens = () => {
        var formData = new FormData();
        formData.append('files', values.produto.imagem);    
        return axios.post('/imagem/imagem', formData).catch(error=>console.log(error));
    }

    const getImagens = (imagens) => {return {...values.produto, imagemPath:imagens.data?imagens.data:values.produto.imagemPath}}

    const post = () => 
        enviaImagens().then(imagens => 
            axios.post("/loja/produtos", getImagens(imagens)).then(res=>setValues({...values, erro:false, ok:true}))
                .catch(error=>setValues({...values, erro:error.response&&error.response.data.message?error.response.data.message:"Erro desconhecido", ok:false, load:false})))

    const put = () => enviaImagens.then(imagens => axios.put("/loja/produtos/"+values.produto.id, getImagens(imagens)))                                                               
    
    // const callBackForm = (response) => {
    //     ref.current.value="";
    //     response.data&&response.data.id?
    //         setValues({...values, ok:true, erro:false, produto:{idLoja:"", imagem: "", preco:"", quantidade:"", titulo:""}, produtos:values.produto.id?values.produtos.map(x=>x.id===values.produto.id?response.data:x):values.produtos.concat(response.data), load:false}):
    //         setValues({...values, erro:response&&response.response&&response.response.data&&response.response.data.message?response.response.data.message:"Erro desconhecido", ok:false, load:false})
    //     document.getElementsByClassName("anuncios-conteudo")[0].scrollTo(0, 0);
    // }
    
    const excluirProduto = (id) => axios.delete("/loja/produtos/"+id)
        .then(res => setValues({...values, erro:false, ok:true, produtos:values.produtos.filter(pro=>id!==pro.id)}))
        .catch(error => setValues({...values, erro:error.response.data.message}))

    return (
        <>
            {values.load&&<div style={{position:"absolute", width:"100%", height:"100%", backgroundColor:"rgba(173, 181, 189, 50%)", zIndex:"1" }}>
                <img style={{height:"5em", position:'relative', top:'38%', left:'42%'}} src={loader} alt="loading..."/>
            </div>}
            <div style={{overflowX:"hidden", overflowΥ:'scroll', height:'89vh'}}>
                {(values.ok||values.erro)&&<div style={{width: "100%", textAlign:"center"}}>{values.ok?"✅ Operação realizada com sucesso":"❌ Erro: "+values.erro}</div>}                
                {values.produto&&<form onSubmit={event=>{event.preventDefault();setValues({...values, load:true});values.produto.id?put():post()}}>                
                    <fieldset id="usuario"><legend>{values.produto.id?"Editar":"Criar"} Produto {values.produto.id}</legend>                                      
                        <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} htmlFor='loja'>Loja :</label>  
                        <select disabled={values.produto.id} required value={values.produto.idLoja} id="loja" style={{width:"75%"}} onChange={event=>setValues({...values, produto:{...values.produto, idLoja:event.target.value}})}>                                                            
                            <option value="">Selecione uma loja</option>
                            {values.lojas.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                        </select> 
                        <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} htmlFor="titulo">Título : </label>            
                        <input required style={{width:"75%", marginBottom:"4%"}} id="titulo" placeholder="Título do produto" value={values.produto.titulo} type="text" onChange={event=>setValues({...values,produto:{...values.produto,titulo:event.target.value}})}/>                                                                                                        
                        <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} htmlFor="quantidade">Quantidade: </label>            
                        <input required style={{width:"75%", marginBottom:"4%"}} id="quantidade" placeholder="quantidade" value={values.produto.quantidade} type="number" onChange={event=>setValues({...values,produto:{...values.produto,quantidade:event.target.value}})}/>                                                                                                        
                        <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} htmlFor="preco">Valor: </label>            
                        <input required style={{width:"75%", marginBottom:"4%"}} id="preco" placeholder="valor" value={values.produto.preco} type="number" step="0.2" onChange={event=>setValues({...values,produto:{...values.produto,preco:event.target.value}})}/>                                                                                                                                                                                                                                    
                    </fieldset>    
                    <fieldset id="usuario"><legend>Imagem</legend>                                      
                        <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} htmlFor='imagem'>Imagem : </label>            
                        <input ref={ref} required={!values.produto.imagemPath||values.produto.imagemPath===""} id='imagem' type="file" style={{textAlign:"center", width:"75%", backgroundColor: "#3498db", borderRadius: "5px", color: "#fff"}} accept='image/*' onChange={event => {event.preventDefault();setValues({...values, produto:{...values.produto, imagemPath:undefined, imagem:event.target.files[0]}});}}/>
                        {(values.produto.imagemPath||values.produto.imagem)&&<img alt="" style={{display:"block", width:"8em", height:"8em"}} src={values.produto.imagemPath?host+values.produto.imagemPath:URL.createObjectURL(values.produto.imagem)}/>}                        
                    </fieldset>
                    <input type="submit" value="enviar"/>    
                    <input onClick={event => {event.preventDefault();ref.current.value="";setValues({...values, produto:{preco:"", quantidade:"", titulo:"", idLoja:""}})}} type="submit" value="Limpar"/>                                        
                </form>}
                
                {values.idLoja&&<fieldset style={{overflowX:"auto", color:"white"}}><legend>Meus produtos</legend> 
                    <select id="lojas" value={values.idLoja} onChange={async event=>{event.preventDefault();setValues({...values, idLoja:event.target.value, produtos:(await axios.get(`/loja/produtos?idUsuario=${id}&idLoja=${event.target.value}&page=${0}&size=${100}`)).data})}}>                                                            
                        <option value="">Selecione a loja</option>
                        {values.lojas.map((value, index) => <option key={index} value={value.id}>{value.nome}</option>)}
                    </select> 
                    
                    <table style={{borderCollapse: "collapse", width: "100%", textAlign:'center'}}>    
                        <thead>
                            <tr>
                                <th scope="col">ID/SKU</th>
                                <th></th>
                                <th scope="col">Título</th>
                                <th scope="col">Preço</th>
                                <th scope="col">Qtd</th>
                                <th scope="col">Meli</th>  
                                <th scope="col">Amazon</th>  
                                <th scope="col">Shopee</th>  
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {values.produtos.map(p=>
                                <tr key={p.id} style={{cursor:"pointer", whiteSpace: "nowrap"}} onClick={event=>{event.preventDefault();setValues({...values, produto:{...p, loja:p.lojaDTO}});document.getElementsByClassName("anuncios-conteudo")[0].scrollTo(0, 0)}}>
                                    <td>{p.id}</td>
                                    <td><img alt="" style={{width:"2em", height:"2em"}} src={host+p.imagemPath}/></td>                            
                                    <td style={{fontWeight: "bold"}}>{p.titulo}</td>                                                             
                                    <td>{"R$ "+p.preco}</td>
                                    <td>{p.quantidade}</td>
                                    <td><Link onClick={event=>event.stopPropagation()} target="_blank" to={"/anuncios/"+0+"/"+p.id}>Anuncios</Link></td>
                                    <td></td>
                                    <td></td>                                
                                    <td onClick={event=>{event.stopPropagation();event.preventDefault();excluirProduto(p.id)}}>❌</td>
                                </tr>
                            )}               
                        </tbody>
                    </table> 
                </fieldset>}    
            </div>
        </>
    );
}

export default CriarProdutos