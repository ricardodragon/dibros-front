
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import LabelInput from '../../estrutura/LabelInput';
import './style.css';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

function Produtos(props){
    
    const [values, setValues] = useState({lojas:[], produtos:[], produto:{preco:"", quantidade:"", titulo:"", lojaDTO:{nome:"",id:""}}})    
    const { id } = useParams();

    const verificaProduto = () => values.produto.quantidade||values.produto.preco||values.produto.titulo;
     
    useEffect(() => 
        axios.get(process.env.REACT_APP_MELI_DOMAIN+(id>0?"/loja/produto/loja/"+id:"/loja/produto")).then(res => 
            axios.get(process.env.REACT_APP_MELI_DOMAIN+"/loja/lojas").then(response =>
                setValues({lojas:response.data,produtos:res.data, produto:{preco:"", quantidade:"", titulo:"", lojaDTO:{nome:"",id:""}}})))            
    , []);

    const submit = event => {
        event.preventDefault();
        values.produto.id?
            axios.put(process.env.REACT_APP_MELI_DOMAIN+"/loja/produto", values.produto).then(res => 
                axios.get(process.env.REACT_APP_MELI_DOMAIN+"/loja/produto").then(res => {setValues({...values, produtos:res.data, produto:{preco:"", quantidade:"", titulo:"", lojaDTO:{id:"", nome:""}}})})):
            axios.post(process.env.REACT_APP_MELI_DOMAIN+"/loja/produto", values.produto).then(res => 
                axios.get(process.env.REACT_APP_MELI_DOMAIN+"/loja/produto").then(res => {setValues({...values, produtos:res.data, produto:{preco:"", quantidade:"", titulo:"", lojaDTO:{id:"", nome:""}}})}))        
    }

    return (
        <div className="p-4">
            <h4>Produtos</h4>
            <form className="mt-4" onSubmit={submit}>                
                <fieldset id="usuario" className="p-2" style={{overflow:"hidden", borderRadius:"0.9em"}}>
                    <legend>{values.produto.id?"Editar":"Criar"} Produto {values.produto.id}</legend>                    
                    {/* <LabelInput value={values.produto.codigo} label="Codigo: " placeholder="codigo" id="codigo" type="text" onChange={codigo=>setValues({...values,produto:{...values.produto,codigo}})}/> */}
                    <LabelInput value={values.produto.quantidade} label="Quantidade: " placeholder="quantidade" id="quantidade" type="number" onChange={quantidade=>setValues({...values,produto:{...values.produto,quantidade}})}/>
                    <LabelInput value={values.produto.preco} label="Valor: " placeholder="valor" id="valor" type="number" step="0.2" onChange={preco=>setValues({...values,produto:{...values.produto,preco}})}/>
                    <LabelInput value={values.produto.titulo} label="Título: " placeholder="título" id="titulo" type="text" onChange={titulo=>setValues({...values,produto:{...values.produto,titulo}})}/>                    
                    {/* <LabelInput value={values.produto.lojaDTO.nome} label="Loja: " placeholder="Atenção!!!! Alterar para todos os produtos da loja" id="loja" type="text" onChange={nome=>setValues({...values,produto:{...values.produto,lojaDTO:{...values.produto.lojaDTO,nome}}})}/>                     */}
                    {/* {values.produto.id?<Link to={"/anuncios/"+0+"/"+values.produto.id}>anuncios</Link>:""} */}
                    {/* <LabelSelect id={""} lista={["", "mercado livre"]} onChange={(i)=>console.log(i)} value="integracoes" label={""} name = "name"/>                         */}                    
                    {/* <td><button className="btn btn-sm btn-success" onClick={event=>{event.preventDefault();}}>🔄Anuncios</button></td> */}
                    <input disabled={!verificaProduto()} type="submit" value="enviar" className="btn btn-sm btn-success mt-2"/>    
                    <input disabled={!verificaProduto()} onClick={event => {event.preventDefault();setValues({...values, produto:{preco:"", quantidade:"", titulo:"", lojaDTO:{id:"", nome:""}}})}} type="submit" className="btn btn-sm btn-primary mt-2" value="Limpar"/>                        
                </fieldset>
            </form>
            <div className="table-responsive mt-3">
                <label htmlFor='lojas'>Loja</label>
                <select id="lojas" style={{borderRadius:"0.9em"}} className='col form-control form-control-sm mt-3' onChange={async event=>{event.preventDefault();setValues({...values, produtos:(await axios.get(process.env.REACT_APP_MELI_DOMAIN+(event.target.value>0?"/loja/produto/loja/"+event.target.value:"/loja/produto"))).data})}}>                                                            
                    <option value={0}>Todos</option>
                    {values.lojas.map((value, index) => <option key={index} value={index}>{value.nome}</option>)}
                </select> 
                <table className="table mt-4">     
                    <thead className="thead-light">
                        <tr className="table-light">
                            <th scope="col">ID/SKU</th>
                            <th scope="col">Título</th>
                            <th scope="col">Preço</th>
                            <th scope="col">Qtd</th>
                            <th scope="col">Meli</th>  
                            <th scope="col">Amazon</th>  
                            <th scope="col">Shopee</th>  
                            {/* <th scope="col"></th>                                                      */}
                        </tr>
                    </thead> 
                    <tbody> 
                        {/* <tr >
                            <td>{values.produtos.map(p=>p.quantidade).reduce((sumQtd, a) => sumQtd + a, 0)}</td>
                        </tr>                */}
                        {values.produtos.map(p=>
                            <tr key={p.id} style={{cursor:"pointer", whiteSpace: "nowrap"}} onClick={event=>{event.preventDefault();window.scrollTo(0, 0);setValues({...values, produto:{...p, loja:p.lojaDTO}});}}>
                                <td>{p.id}</td>
                                <td style={{fontWeight: "bold"}}>{p.titulo}</td>                                                             
                                <td>{"R$ "+p.preco}</td>
                                <td>{p.quantidade}</td>
                                <td>
                                    {/* <div style={{cursor:"pointer"}} onClick={event=>{event.stopPropagation();event.preventDefault();
                                        axios.put(process.env.REACT_APP_MELI_DOMAIN+"/meli/anuncios/by-sku/"+p.id+"/"+p.quantidade).then(res=> console.log(res))
                                    }}>🔄</div> */}
                                    <Link onClick={event=>event.stopPropagation()} target="_blank" to={"/anuncios/"+0+"/"+p.id} className="btn-link">Anuncios</Link>
                                </td>
                                <td></td>
                                <td></td>                                
                                <td><button className="btn btn-sm btn-danger" onClick={event=>{event.preventDefault();axios.delete(process.env.REACT_APP_MELI_DOMAIN+"/produto/"+p.id).then(r=>axios.get(process.env.REACT_APP_MELI_DOMAIN+"/produto/all").then(res => {setValues({...values, produtos:res.data, produto:{preco:"", quantidade:"", titulo:""}})}))}}>X</button></td>
                            </tr>
                        )}               
                    </tbody>    
                </table>       
            </div>    
        </div>
    );
}

export default Produtos