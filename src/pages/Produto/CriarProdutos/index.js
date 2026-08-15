import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import axios from '../../../config/api/api';
import loader from "./../../../assets/loadinfo.gif";
import './produtos.css';

function CriarProdutos(){
    
    const [values, setValues] = useState({})    
    const host = process.env.REACT_APP_URL;
    const id = useParams().id;
    const history = useHistory();

    useEffect(() => 
        axios.get(`/loja/produtos/loja?id=${id}&page=${0}&size=${10}`).then(produtos => 
            axios.get(`/loja/lojas/usuario?page=${0}&size=${99}`).then(lojas =>
                setValues({lojas:lojas.data, page:0, produtos:produtos.data, erro: lojas.data.length<=0?"É preciso criar uma loja em \"Menu > Lojas\"":false, produto:{titulo:'', quantidade:'', preco:'', idLoja:'0'}, load:false, loaderProdutos:false})))            
    , [id]);    

    const handlerScroll = (event) => {
        if(!values.loaderProdutos&&(event.target.scrollHeight - event.target.scrollTop)<=event.target.clientHeight&&values.produtos!==undefined){  
            setValues({...values, loaderProdutos:true}); 
            const page = values.page+1;
            axios.get(`/loja/produtos/loja?${id}&page=${page}&size=10`)
                .then(produtos => setValues({...values, page, produtos:values.produtos.concat(produtos.data), loaderProdutos:false}));
        }
    }

    const post = () => {
        setValues({...values, load:true});
        const formData = new FormData();
        const {imagem, ...produto} = values.produto;
        formData.append('produtoDTO', new Blob([JSON.stringify(produto)], { type: 'application/json' }));
        formData.append('imagem', imagem);
        axios.post("/loja/produtos", formData)
            .then(res=>setValues({...values, load:false, erro:false, ok:true, produto:{preco:"", quantidade:"", titulo:"", idLoja:"", imagem:""}}))
            .catch(error=>setValues({...values, load:false, erro:error.response&&error.response.data.message?error.response.data.message:"Erro desconhecido", ok:false}));
    }
    
    const put = () => {
        setValues({...values, load:true});
        const formData = new FormData();
        if(typeof values.produto.imagem === 'string')
            formData.append('produtoDTO', new Blob([JSON.stringify(values.produto)], { type: 'application/json' }));
        else {
            const {imagem, ...produto} = values.produto;
            formData.append('produtoDTO', new Blob([JSON.stringify(produto)], { type: 'application/json' }));
            formData.append('imagem', imagem);
        }
        axios.put("/loja/produtos", formData)
            .then(res=>setValues({...values, load:false, erro:false, ok:true, produto:{preco:"", quantidade:"", titulo:"", idLoja:"", imagem:""}}))
            .catch(error=>setValues({...values, load:false, erro:error.response&&error.response.data.message?error.response.data.message:"Erro desconhecido", ok:false}));
    }
    
    const excluirProduto = (id) => axios.delete("/loja/produtos/"+id)
        .then(res => setValues({...values, erro:false, ok:true, produtos:values.produtos.filter(pro=>id!==pro.id)}))
        .catch(error => setValues({...values, erro:error.response.data.message}))

    const changeLoja = (event) => history.push({pathname: '/produtos/'+event.target.value});

    return (
        <>
            {values.load&&<div className='loader-produto'><img src={loader} alt="loading..."/></div>}
            <div className='produto-conteudo' onScroll={handlerScroll}>
                <div className='mensagem-produto'>{values.ok?"✅ Operação realizada com sucesso":(values.erro?"❌ Erro: "+values.erro:"")}</div>
                {values.produto&&<form onSubmit={event=>{event.preventDefault();setValues({...values, load:true});values.produto.id?put():post()}}>                
                    <fieldset id="produto"><legend>{values.produto.id?"Editar":"Criar"} Produto {values.produto.id}</legend>                                      
                        <label htmlFor='loja'>Loja :</label>  
                        <select disabled={values.produto.id} required value={values.produto.idLoja} id="loja" style={{width:"75%"}} onChange={event=>setValues({...values, produto:{...values.produto, idLoja:event.target.value}})}>                                                            
                            <option value="">Selecione uma loja</option>
                            {values.lojas.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                        </select> 
                        <label htmlFor="titulo">Título : </label>            
                        <input required id="titulo" placeholder="Título do produto" value={values.produto.titulo} type="text" onChange={event=>setValues({...values,produto:{...values.produto,titulo:event.target.value}})}/>                                                                                                        
                        <label htmlFor="quantidade">Quantidade: </label>            
                        <input required id="quantidade" placeholder="quantidade" value={values.produto.quantidade} type="number" onChange={event=>setValues({...values,produto:{...values.produto,quantidade:Number(event.target.value)}})}/>                                                                                                        
                        <label htmlFor="preco">Valor: </label>            
                        <input required id="preco" placeholder="valor" value={values.produto.preco} type="number" step="0.2" onChange={event=>setValues({...values,produto:{...values.produto,preco:event.target.value}})}/>                                                                                                                                                                                                                                    
                    </fieldset>    
                    <fieldset className='field-imagem'>
                        <legend>Imagem</legend>                                      
                        <label htmlFor='imagem'>Imagem : </label>            
                        <input required={!values.produto.imagem} id='imagem' type="file" accept='image/*' onChange={event=>setValues({...values, produto:{...values.produto, imagem:event.target.files[0]}})}/>
                        {values.produto.imagem&&<img alt="" src={typeof values.produto.imagem === 'string'?`${host}/loja/produtos/imagem/${values.produto.id}/${values.produto.imagem}?Authorization=${localStorage.getItem("token")}`:URL.createObjectURL(values.produto.imagem)}/>}
                    </fieldset>
                    <input type="submit" value="enviar"/>    
                    <input onClick={event => {event.preventDefault();setValues({...values, produto:{preco:"", quantidade:"", titulo:"", idLoja:""}})}} type="submit" value="Limpar"/>                                        
                </form>}
                
                <fieldset style={{overflowX:"auto", color:"white"}}><legend>Meus produtos</legend> 
                    {values.lojas&&<select id="lojas" value={id} onChange={changeLoja}>
                        <option value="0">Selecione a loja</option>
                        {values.lojas.map((value, index) => <option key={index} value={value.id}>{value.nome}</option>)}
                    </select>} 
                    
                    {values.produtos&&<table style={{borderCollapse: "collapse", width: "100%", textAlign:'center'}}>    
                        <thead>
                            <tr>
                                <th scope="col">ID/SKU</th>
                                <th></th>
                                <th scope="col">Título</th>
                                <th scope="col">Preço</th>
                                <th scope="col">Qtd</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {values.produtos.map(p=>
                                <tr key={p.id} style={{cursor:"pointer", whiteSpace: "nowrap"}} onClick={event=>{event.preventDefault();setValues({...values, produto:{...p}});document.getElementsByClassName("mensagem-produto")[0].scrollIntoView({behavior: 'smooth'})}}>
                                    <td>{p.id}</td>
                                    <td><img alt="" style={{width:"2em", height:"2em"}} src={host+`/loja/produtos/imagem/${p.id}/${p.imagem}?Authorization=${localStorage.getItem("token")}`}/></td>                            
                                    <td style={{fontWeight: "bold"}}>{p.titulo}</td>                                                             
                                    <td>{Number(p.preco).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                                    <td>{p.quantidade}</td>
                                    {(p.lojaDTO.usuarioId===JSON.parse(localStorage.getItem("usuario")).id||(p.lojaDTO.usuarioLojasDTO&&p.lojaDTO.usuarioLojasDTO[0].admin))&&<td onClick={event=>{event.stopPropagation();event.preventDefault();excluirProduto(p.id)}}>❌</td>}
                                </tr>
                            )}
                            {values.loaderProdutos?<tr><td colSpan="9"><img style={{height:"5em"}} src={loader} alt="loading..."/></td></tr>:<tr><td colSpan="9">"fim dos produtos"</td></tr>}
                        </tbody>
                    </table>} 
                </fieldset>    
            </div>
        </>
    );
}

export default CriarProdutos