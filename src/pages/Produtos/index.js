
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { FcCheckmark, FcHighPriority } from 'react-icons/fc';
import './style.css';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

function Produtos(props){
    
    const [values, setValues] = useState({lojas:[], produtos:[], produto:{imagem: "", preco:"", quantidade:"", titulo:"", lojaDTO:{nome:"",id:""}}})    
    const { id } = useParams();

    const host = process.env.REACT_APP_URL;

    useEffect(() => 
        axios.get(host+`/loja/produtos?page=${0}&size=${100}&idLoja=${id}`).then(res => 
            axios.get(host+"/loja/lojas").then(response =>
                setValues({lojas:response.data,produtos:res.data, idLoja:id, produto:{imagem: "", preco:"", quantidade:"", titulo:"", lojaDTO:{nome:"",id:""}}})))            
    , [id, host]);

    const submit = event => {
        event.preventDefault();
        var formData = new FormData();
        formData.append('files', values.produto.imagem);        
        axios.post(host+'/imagem/imagem', formData).then(imagens =>
            axios.post(host+"/loja/produtos", {...values.produto, imagemPath:imagens.data[0]?imagens.data[0]:values.produto.imagemPath})
                .then(response => setValues({...values, ok:true, erro:false, produto:{imagem: "", preco:"", quantidade:"", titulo:"", lojaDTO:{id:"", nome:""}}, produtos:values.produto.id?values.produtos.map(x=>x.id===values.produto.id?response.data:x):values.produtos.concat(response.data)})))                
                .catch(error=> setValues({...values, erro:error.response.data.message, ok:false}))
    }

    return (
        <div className="anuncios-conteudo">
            <div className={"alert alert-success "+(values.ok?"":"visually-hidden")} role="alert"><FcCheckmark/>Operação realizada com sucesso</div>
            <div className={"alert alert-danger "+(values.erro?"":"visually-hidden")} role="alert"><FcHighPriority/>Erro: {values.erro}</div>            
            <form className="mt-4" onSubmit={submit}>                
                <fieldset id="usuario"><legend>{values.produto.id?"Editar":"Criar"} Produto {values.produto.id}</legend>                                      
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor='loja'>Loja :</label>  
                    <select required defaultValue="" value={values.produto.idLoja} id="loja" style={{width:"75%"}} className='mb-4' onChange={event=>setValues({...values, produto:{...values.produto, idLoja:event.target.value}})}>                                                            
                        <option value="">Selecione uma loja</option>
                        {values.lojas.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                    </select> 
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor="titulo">Título : </label>            
                    <input required style={{width:"75%", marginBottom:"4%"}} className='mb-4' id="titulo" placeholder="Título do produto" value={values.produto.titulo} type="text" onChange={event=>setValues({...values,produto:{...values.produto,titulo:event.target.value}})}/>                                                                                                        
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor="quantidade">Quantidade: </label>            
                    <input required style={{width:"75%", marginBottom:"4%"}} className='mb-4' id="quantidade" placeholder="quantidade" value={values.produto.quantidade} type="number" onChange={event=>setValues({...values,produto:{...values.produto,quantidade:event.target.value}})}/>                                                                                                        
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor="preco">Valor: </label>            
                    <input required style={{width:"75%", marginBottom:"4%"}} className='mb-4' id="preco" placeholder="valor" value={values.produto.preco} type="number" step="0.2" onChange={event=>setValues({...values,produto:{...values.produto,preco:event.target.value}})}/>                                                                                                                                                                                                                                    
                </fieldset>    
                <fieldset id="usuario"><legend>Imagem</legend>                                      
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor='imagem'>Imagem : </label>            
                    <label htmlFor='imagem' className="p-1 mb-4" style={{textAlign:"center", width:"75%", backgroundColor: "#3498db", borderRadius: "5px", color: "#fff", cursor: "pointer"}}>📁 Upload</label>
                    <input id='imagem' label="Foto: " style={{display:"none"}} className='mb-4' type="file" accept='image/*' onChange={event => {event.preventDefault();setValues({...values, produto:{...values.produto, imagemPath:undefined, imagem:event.target.files[0]}});}}/>
                    {values.produto.imagemPath&&<img alt="" style={{display:"block", width:"8em", height:"8em"}} src={host+values.produto.imagemPath}/>}
                    {values.produto.imagem&&<img alt="" style={{display:"block", width:"8em", height:"8em"}} src={URL.createObjectURL(values.produto.imagem)}/>}            
                </fieldset>
                <input disabled={!values.produto.quantidade||!values.produto.titulo||!values.produto.idLoja} type="submit" value="enviar" className="btn btn-sm btn-success mt-2"/>    
                <input disabled={!(values.produto.quantidade||values.produto.titulo||values.produto.idLoja||values.produto.imagem)} onClick={event => {event.preventDefault();setValues({...values, produto:{preco:"", quantidade:"", titulo:"", lojaDTO:{id:"", nome:""}}})}} type="submit" className="btn btn-sm btn-primary mt-2" value="Limpar"/>                                        
            </form>
            <div className="table-responsive mt-3">
                <label htmlFor='lojas'>Loja</label>
                <select defaultValue={values.idLoja} id="lojas" value={values.idLoja} style={{borderRadius:"0.9em"}} className='col form-control form-control-sm mt-3' onChange={async event=>{event.preventDefault();setValues({...values, idLoja:event.target.value, produtos:(await axios.get(host+"/loja/produtos?idLoja="+event.target.value)).data})}}>                                                            
                    <option value="">Todos</option>
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
                            <tr key={p.id} style={{cursor:"pointer", whiteSpace: "nowrap"}} onClick={event=>{event.preventDefault();setValues({...values, produto:{...p, loja:p.lojaDTO}});document.getElementsByClassName("conteudo")[0].scrollTo(0, 0)}}>
                                <td>{p.id}</td>
                                <td><img alt="" style={{width:"2em", height:"2em"}} src={host+p.imagemPath}/></td>                            
                                <td style={{fontWeight: "bold"}}>{p.titulo}</td>                                                             
                                <td>{"R$ "+p.preco}</td>
                                <td>{p.quantidade}</td>
                                <td><Link onClick={event=>event.stopPropagation()} target="_blank" to={"/anuncios/"+0+"/"+p.id} className="btn-link">Anuncios</Link></td>
                                <td></td>
                                <td></td>                                
                                <td onClick={event=>{
                                    event.stopPropagation();event.preventDefault();
                                    axios.delete(host+"/loja/produtos/"+p.id)
                                        .then(res => setValues({...values, ok:true, erro:false, produtos:values.produtos.filter(pro=>p.id!==pro.id)}))
                                        .catch(error=>setValues({...values, erro:error.response.data.message, ok:false}))
                                    document.getElementsByClassName("conteudo")[0].scrollTo(0, 0);
                                    window.scrollTo(0,0);
                                }}>❌</td>
                            </tr>
                        )}               
                    </tbody>    
                </table>       
            </div>    
        </div>
    );
}

export default Produtos