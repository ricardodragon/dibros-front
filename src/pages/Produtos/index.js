
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import LabelInput from '../../estrutura/LabelInput';
import './style.css';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

function Produtos(props){
    
    const [values, setValues] = useState({lojas:[], produtos:[], produto:{imagem: "", preco:"", quantidade:"", titulo:"", lojaDTO:{nome:"",id:""}}})    
    const { id } = useParams();

    const host = "http://" + window.location.hostname+":7080";

    useEffect(() => 
        axios.get(host+(id>0?"/loja/produto/loja/"+id:"/loja/produto")).then(res => 
            axios.get(host+"/loja/lojas").then(response =>
                setValues({lojas:response.data,produtos:res.data, produto:{imagem: "", preco:"", quantidade:"", titulo:"", lojaDTO:{nome:"",id:""}}})))            
    , [id, host]);

    const submit = event => {
        event.preventDefault();
        var formData = new FormData();
        formData.append('files', values.produto.imagem);        
        axios.post(host+'/imagem/imagem', formData).then(imagens =>
            axios.post(host+"/loja/produto", {...values.produto, imagemPath:imagens.data[0]?imagens.data[0]:values.produto.imagemPath}).then(response => 
                setValues({...values, produto:{imagem: "", preco:"", quantidade:"", titulo:"", lojaDTO:{id:"", nome:""}}, produtos:values.produto.id?values.produtos.map(x=>x.id===values.produto.id?response.data:x):values.produtos.concat(response.data)})))                
    }

    return (
        <div>
            <form className="mt-4" onSubmit={submit}>                
                <fieldset id="usuario" className="p-2" style={{overflow:"hidden", borderRadius:"0.9em"}}>                    
                    <legend>{values.produto.id?"Editar":"Criar"} Produto {values.produto.id}</legend>                                        
                    <LabelInput required={true} value={values.produto.quantidade} label="Quantidade: " placeholder="quantidade" id="quantidade" type="number" onChange={quantidade=>setValues({...values,produto:{...values.produto,quantidade}})}/>
                    <LabelInput value={values.produto.preco} label="Valor: " placeholder="valor" id="valor" type="number" step="0.2" onChange={preco=>setValues({...values,produto:{...values.produto,preco}})}/>
                    <LabelInput required={true} value={values.produto.titulo} label="Título: " placeholder="título" id="titulo" type="text" onChange={titulo=>setValues({...values,produto:{...values.produto,titulo}})}/>                                                                                         
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt"}} className="p-1" htmlFor='loja'>Loja :</label>
                    <select defaultValue={values.produto.idLoja} required={true} id="loja" style={{borderRadius:"0.9em"}} className='col form-control form-control-sm' onChange={event=>{event.preventDefault();setValues({...values, produto:{...values.produto, idLoja:event.target.value}});}}>                                                            
                        <option value={0}>Selecione uma loja</option>
                        {values.lojas.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                    </select>    
                    
                    <input type='hidden' required={true} value={values.produto.idLoja}/>

                    <label htmlFor='imagem' className="p-1 mt-3 mb-3" style={{display:"block", marginRight: "10%", backgroundColor: "#3498db", borderRadius: "5px", color: "#fff", cursor: "pointer"}}>📁 Foto</label>
                    <input id='imagem' label="Foto: " style={{display:"none"}} type="file" accept='image/*' onChange={event => {event.preventDefault();setValues({...values, produto:{...values.produto, imagemPath:undefined, imagem:event.target.files[0]}});}}/>                                        

                    {values.produto.imagemPath&&<img alt="" style={{display:"block", width:"8em", height:"8em"}} src={host+values.produto.imagemPath}/>}
                    {values.produto.imagem&&<img alt="" style={{display:"block", width:"8em", height:"8em"}} src={URL.createObjectURL(values.produto.imagem)}/>}            
                    <input disabled={!values.produto.quantidade||!values.produto.titulo||!values.produto.idLoja} type="submit" value="enviar" className="btn btn-sm btn-success mt-2"/>    
                    <input disabled={!(values.produto.quantidade||values.produto.titulo||values.produto.idLoja||values.produto.imagem)} onClick={event => {event.preventDefault();setValues({...values, produto:{preco:"", quantidade:"", titulo:"", lojaDTO:{id:"", nome:""}}})}} type="submit" className="btn btn-sm btn-primary mt-2" value="Limpar"/>                        
                </fieldset>
            </form>
            <div className="table-responsive mt-3">
                <label htmlFor='lojas'>Loja</label>
                <select defaultValue={id} id="lojas" style={{borderRadius:"0.9em"}} className='col form-control form-control-sm mt-3' onChange={async event=>{event.preventDefault();setValues({...values, produtos:(await axios.get(host+(event.target.value>0?"/loja/produto/loja/"+event.target.value:"/loja/produto"))).data})}}>                                                            
                    <option value={0}>Todos</option>
                    {values.lojas.map((value, index) => <option key={index} value={value.id}>{value.nome}</option>)}
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
                                <td><img alt="" style={{width:"2em", height:"2em"}} src={host+p.imagemPath}/></td>                            
                                <td style={{fontWeight: "bold"}}>{p.titulo}</td>                                                             
                                <td>{"R$ "+p.preco}</td>
                                <td>{p.quantidade}</td>
                                <td><Link onClick={event=>event.stopPropagation()} target="_blank" to={"/anuncios/"+0+"/"+p.id} className="btn-link">Anuncios</Link></td>
                                <td></td>
                                <td></td>                                
                                <td onClick={event=>{event.stopPropagation();event.preventDefault();axios.delete(host+"/produto/"+p.id).then(r=>axios.get(host+"/produto/all").then(res => {setValues({...values, produtos:res.data, produto:{preco:"", quantidade:"", titulo:""}})}))}}>❌</td>
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
            // axios.put(host+"/loja/produto", values.produto).then(res => 
            //     axios.get(host+"/loja/produto").then(res => {setValues({...values, produtos:res.data, produto:{preco:"", quantidade:"", titulo:"", lojaDTO:{id:"", nome:""}}})})):