
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import LabelInput from '../../estrutura/LabelInput';
import './style.css';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

function Produtos(props){
    
    const [values, setValues] = useState({lojas:[], produtos:[], produto:{imagem: "", preco:"", quantidade:"", titulo:"", lojaDTO:{nome:"",id:""}}})    
    const { id } = useParams();

    const verificaProduto = () => values.produto.quantidade||values.produto.preco||values.produto.titulo;
     
    useEffect(() => 
        axios.get(process.env.REACT_APP_MELI_DOMAIN+(id>0?"/loja/produto/loja/"+id:"/loja/produto")).then(res => 
            axios.get(process.env.REACT_APP_MELI_DOMAIN+"/loja/lojas").then(response =>
                setValues({lojas:response.data,produtos:res.data, produto:{imagem: "", preco:"", quantidade:"", titulo:"", lojaDTO:{nome:"",id:""}}})))            
    , []);

    const submit = event => {
        event.preventDefault();
        var formData = new FormData();
        formData.append('file', values.produto.imagem);
        formData.append('produtoDTO', new Blob([JSON.stringify(values.produto)], {type: "application/json"}));
        axios.post(process.env.REACT_APP_MELI_DOMAIN+"/loja/produto", formData).then(res => 
            axios.get(process.env.REACT_APP_MELI_DOMAIN+"/loja/produto").then(res => {setValues({...values, produtos:res.data, produto:{imagem: "", preco:"", quantidade:"", titulo:"", lojaDTO:{id:"", nome:""}}})}))                
    }

    return (
        <div>
            <form className="mt-4" onSubmit={submit}>                
                <fieldset id="usuario" className="p-2" style={{overflow:"hidden", borderRadius:"0.9em"}}>                    
                    <legend>{values.produto.id?"Editar":"Criar"} Produto {values.produto.id}</legend>                                        
                    <LabelInput value={values.produto.quantidade} label="Quantidade: " placeholder="quantidade" id="quantidade" type="number" onChange={quantidade=>setValues({...values,produto:{...values.produto,quantidade}})}/>
                    <LabelInput value={values.produto.preco} label="Valor: " placeholder="valor" id="valor" type="number" step="0.2" onChange={preco=>setValues({...values,produto:{...values.produto,preco}})}/>
                    <LabelInput value={values.produto.titulo} label="Título: " placeholder="título" id="titulo" type="text" onChange={titulo=>setValues({...values,produto:{...values.produto,titulo}})}/>                                                                                         
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt"}} className="p-1" htmlFor='loja'>Loja :</label>
                    <select id="loja" style={{borderRadius:"0.9em"}} className='col form-control form-control-sm' onChange={event=>{event.preventDefault();setValues({...values, produto:{...values.produto, idLoja:event.target.value}});}}>                                                            
                        <option value={0}>Selecione uma loja</option>
                        {values.lojas.map(l => <option selected={l.id==values.produto.idLoja} key={l.id} value={l.id}>{l.nome}</option>)}
                    </select>                     
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt"}} className="p-1 mt-3" htmlFor='imagem'>Foto do produto :</label>
                    <input id='imagem' className={"form-control form-control-sm mb-3"} label="Foto: " placeholder="foto" type="file" accept='image/*' onChange={event => {event.preventDefault();setValues({...values, produto:{...values.produto, imagem:event.target.files[0]}});}}/>                                    
                    {values.produto.imagemPath&&<img style={{width:"8em", height:"8em"}} src={process.env.REACT_APP_MELI_DOMAIN+values.produto.imagemPath}/>}
                    {values.produto.imagem&&<img style={{width:"8em", height:"8em"}} src={URL.createObjectURL(values.produto.imagem)}/>}            
                    <input disabled={!verificaProduto()} type="submit" value="enviar" className="btn btn-sm btn-success mt-2"/>    
                    <input disabled={!verificaProduto()} onClick={event => {event.preventDefault();setValues({...values, produto:{preco:"", quantidade:"", titulo:"", lojaDTO:{id:"", nome:""}}})}} type="submit" className="btn btn-sm btn-primary mt-2" value="Limpar"/>                        
                </fieldset>
            </form>
            <div className="table-responsive mt-3">
                <label htmlFor='lojas'>Loja</label>
                <select id="lojas" style={{borderRadius:"0.9em"}} className='col form-control form-control-sm mt-3' onChange={async event=>{event.preventDefault();setValues({...values, produtos:(await axios.get(process.env.REACT_APP_MELI_DOMAIN+(event.target.value>0?"/loja/produto/loja/"+event.target.value:"/loja/produto"))).data})}}>                                                            
                    <option value={0}>Todos</option>
                    {values.lojas.map((value, index) => <option selected={id==value.id} key={index} value={value.id}>{value.nome}</option>)}
                </select> 
                <table className="table mt-4">     
                    <thead className="thead-light">
                        <tr className="table-light">
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
                        {/* <tr><td>{values.produtos.map(p=>p.quantidade).reduce((sumQtd, a) => sumQtd + a, 0)}</td></tr> */}
                        {values.produtos.map(p=>
                            <tr key={p.id} style={{cursor:"pointer", whiteSpace: "nowrap"}} onClick={event=>{event.preventDefault();window.scrollTo(0, 0);setValues({...values, produto:{...p, loja:p.lojaDTO}});document.getElementsByClassName("conteudo")[0].scrollTo(0, 0)}}>
                                <td>{p.id}</td>
                                <td><img style={{width:"2em", height:"2em"}} src={process.env.REACT_APP_MELI_DOMAIN+p.imagemPath}/></td>                            
                                <td style={{fontWeight: "bold"}}>{p.titulo}</td>                                                             
                                <td>{"R$ "+p.preco}</td>
                                <td>{p.quantidade}</td>
                                <td><Link onClick={event=>event.stopPropagation()} target="_blank" to={"/anuncios/"+0+"/"+p.id} className="btn-link">Anuncios</Link></td>
                                <td></td>
                                <td></td>                                
                                <td onClick={event=>{event.preventDefault();axios.delete(process.env.REACT_APP_MELI_DOMAIN+"/produto/"+p.id).then(r=>axios.get(process.env.REACT_APP_MELI_DOMAIN+"/produto/all").then(res => {setValues({...values, produtos:res.data, produto:{preco:"", quantidade:"", titulo:""}})}))}}>❌</td>
                            </tr>
                        )}               
                    </tbody>    
                </table>       
            </div>    
        </div>
    );
}

export default Produtos

// values.produto.id?
            // axios.put(process.env.REACT_APP_MELI_DOMAIN+"/loja/produto", values.produto).then(res => 
            //     axios.get(process.env.REACT_APP_MELI_DOMAIN+"/loja/produto").then(res => {setValues({...values, produtos:res.data, produto:{preco:"", quantidade:"", titulo:"", lojaDTO:{id:"", nome:""}}})})):