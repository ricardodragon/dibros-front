import { useEffect, useState } from "react";
import axios from "../../config/api/api";
import { FcCheckmark, FcHighPriority } from "react-icons/fc";

function Anuncio(props){
    
    const [values, setValues] = useState({lojas:[], anuncios:[], anuncio:{preco:"", legenda:"", lojaDTO:{nome:"",id:""}, anuncioProdutosDTO:[]}})        
    const host =process.env.REACT_APP_URL;
    
    useEffect(() => 
        axios.get(("/loja/anuncios/usuario")).then(res => 
            axios.get("/loja/lojas").then(response =>                
                setValues({lojas:response.data,anuncios:res.data, erro: response.data.length<=0?"É preciso criar uma loja em \"Menu > Lojas\"":false, anuncio:{preco:"", legenda:"", lojaDTO:{nome:"",id:""}, anuncioProdutosDTO:[]}})))                  
    , []);

    const submit = event => {
        event.preventDefault();        
        var formData = new FormData(); var i = 0; var anuncio = values.anuncio;            
        [values.anuncio].concat(values.anuncio.anuncioProdutosDTO).filter(x=>x.imagem).map(x=>x.imagem).forEach(x=>formData.append("files", x));                       
        axios.post('/imagem/imagem', formData).then(imagens =>{                        
            if(anuncio.imagem) anuncio.imagemPath = imagens.data[i++];
            anuncio.anuncioProdutosDTO = anuncio.anuncioProdutosDTO.map(x=>x.imagem?{...x, imagemPath:imagens.data[i++]}:x);
            anuncio.id?axios.put('/loja/anuncios/'+anuncio.id, anuncio).then(callBackForm).catch(callBackErrorForm):
                axios.post('/loja/anuncios', anuncio).then(callBackForm).catch(callBackErrorForm)
        }).catch(error=>setValues({...values, ok:false, erro:error.response.data.message?error.response.data.message:error.response.data})); 
    }
    
    const callBackErrorForm = error => {         
        setValues({...values, ok:false, erro:JSON.stringify(error.response.data.message?error.response.data.message:error.response.data)});
    }

    const callBackForm = response => { 
        const a = values.anuncios.filter(x=>x.id===response.data.id); 
        setValues({...values, ok:`Anuncio '${response.data.id}' criado com sucesso.`, anuncio:{preco:"", legenda:"", imagem:"", lojaDTO:{nome:"",id:""}, anuncioProdutosDTO:[]}, anuncios:a.length?values.anuncios.map(anuncio=>{return anuncio.id===a[0].id?{...response.data}:anuncio}):values.anuncios.concat({...response.data, anuncioProdutosDTO:values.anuncio.anuncioProdutosDTO.map(x=>{return {...x, idAnuncio:response.data.id}})})});
    }

    // const enviaAnuncio = () => !values.anuncio.imagem||!values.anuncio.legenda||!values.anuncio.idLoja;
    const limpaAnuncio = () => values.anuncio.imagem||values.anuncio.legenda||values.anuncio.idLoja;

    const addProduto = event => {
        event.preventDefault();
        axios.get("/loja/produtos/"+values.produtoID).then(r=>
            r.data?setValues({...values, anuncio:{...values.anuncio, anuncioProdutosDTO:[...values.anuncio.anuncioProdutosDTO, {imagemPath:r.data.imagemPath, preco:r.data.preco, idAnuncio:values.anuncio.id, idProduto:r.data.id, produtoDTO:r.data}]}}):""
        )
    }
    return (
        <div>            
            <div className='anuncios-conteudo'>
                <div className={"alert alert-success "+(values.ok?"":"visually-hidden")} role="alert"><FcCheckmark/>Link enviado com sucesso</div>
                <div className={"alert alert-danger "+(values.erro?"":"visually-hidden")} role="alert"><FcHighPriority/>Erro: {values.erro}</div>
                <form className="mt-4" onSubmit={submit}>                     
                    <fieldset id="anuncio"><legend>{values.anuncio.id?"Editar":"Criar"} Anucio {values.anuncio.id}</legend>                                        
                        <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1 mb-4" htmlFor='loja'>Loja : </label>     
                        <select defaultValue="" value={values.anuncio.idLoja} id="loja" style={{display:"inline", width:"75%"}} onChange={event=> setValues({...values, anuncio:{...values.anuncio, idLoja:event.target.value>0?event.target.value:undefined, anuncioProdutosDTO:values.anuncio.anuncioProdutosDTO.filter(x=>x.idProduto.idLoja === event.target.value)}})}>                                                            
                            <option value="">Selecione uma loja</option>
                            {values.lojas.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                        </select>  
                        <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1 mb-4" htmlFor="legenda">Legenda : </label>            
                        <input id="legenda" style={{width:"75%"}} placeholder="legenda" onChange={event=>setValues({...values,anuncio:{...values.anuncio,legenda:event.target.value}})} value={values.anuncio.legenda} required type="text"/>                                                                      
                        <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1 mb-4" htmlFor="preco">Preço : </label>            
                        <input id="preco" style={{width:"75%"}} placeholder="preco" onChange={event=>setValues({...values,anuncio:{...values.anuncio,preco:event.target.value}})} value={values.anuncio.preco} required type="number"/>                                                                      
                    </fieldset>
                    <fieldset id="imagens"><legend>Fotos</legend>  
                        <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor='imagem'>Imagem : </label>            
                        <label htmlFor='imagem' className="p-1 mb-4" style={{textAlign:"center", width:"75%", backgroundColor: "#3498db", borderRadius: "5px", color: "#fff", cursor: "pointer"}}>📁 Upload</label>
                        <input id='imagem' label="Foto: " style={{display:"none"}} type="file" accept='image/*' onChange={event =>event.target.files[0]?setValues({...values, anuncio:{...values.anuncio, imagemPath:undefined,imagem:event.target.files[0]}}):""}/>                                                            
                        {values.anuncio.imagemPath&&<img alt="" style={{display:"block", width:"8em", height:"8em"}} src={host+values.anuncio.imagemPath}/>}
                        {values.anuncio.imagem&&<img alt="" style={{display:"block", width:"8em", height:"8em"}} src={URL.createObjectURL(values.anuncio.imagem)}/>}                                    
                    </fieldset>
                    {values.anuncio.idLoja&&
                        <fieldset id="produtos" className="mb-4"><legend>Produtos do Anúncio</legend>  
                            <label  style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1 mb-4" htmlFor="produto">Id : </label>
                            <input style={{width:"50%"}} placeholder="Id do produto" size="15" step="any" id="produto" type="number" value={values.produtoID} onChange={event=> setValues({...values, produtoID:event.target.value})}/>                        
                            <button disabled={!values.produtoID||values.anuncio.anuncioProdutosDTO.filter(x => x.idProduto===values.produtoID).length} style={{cursor:"pointer", border:"none", backgroundColor:"white", width:"15%"}} className="m-1" onClick={addProduto}>➕</button>
                            <div style={{overflowX:"auto", color:"white"}}>
                                <table style={{borderCollapse: "collapse", width: "100%"}}>
                                    <thead>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Título</th>
                                            <th scope="col">Preco</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    {values.anuncio.anuncioProdutosDTO&&values.anuncio.anuncioProdutosDTO.map((p, i)=> 
                                        <tr key={p.idProduto} style={{whiteSpace: "nowrap"}}>
                                            <td>                                                                                                
                                                <img alt="" style={{width:"2em", height:"2em", display:"inline"}} src={host+p.produtoDTO.imagemPath}/>
                                            </td>
                                            <td style={{ whiteSpace: "nowrap"}}>{p.produtoDTO.titulo}</td>                            
                                            <td style={{fontWeight: "bold"}}>{p.produtoDTO.preco}</td>                                                                                             
                                            <td style={{cursor:"pointer"}} onClick={event=>{event.preventDefault();setValues({...values, anuncio:{...values.anuncio, anuncioProdutosDTO:values.anuncio.anuncioProdutosDTO.filter(x => x.idProduto!==p.idProduto)}})}}>❌</td>
                                        </tr>
                                    )}               
                                </table> 
                            </div>
                        </fieldset>
                    }
                    <input type="submit" value="enviar" className="btn btn-sm btn-success mt-2 mb-4"/>    
                    <input disabled={!limpaAnuncio()} onClick={event => {event.preventDefault();setValues({...values, anuncio:{legenda:"", lojaDTO:{id:"", nome:""}, idLoja:0, anuncioProdutosDTO:[]}})}} type="submit" className="btn btn-sm btn-primary mt-2 mb-4" value="Limpar"/>                        
                </form>

                <div style={{overflowX:"auto", color:"white"}}>
                    <table style={{borderCollapse: "collapse", width: "100%"}}>
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Legenda</th>
                                <th scope="col">Produtos Anuncio</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        {/* <tr><td>{values.anuncios.map(p=>p.quantidade).reduce((sumQtd, a) => sumQtd + a, 0)}</td></tr> */}
                        <tbody>
                            {values.anuncios.map(a=>
                                <tr key={a.id} style={{cursor:"pointer", whiteSpace: "nowrap"}} onClick={event=>{event.preventDefault();window.scrollTo(0, 0);setValues({...values, anuncio:{...a, loja:a.lojaDTO}});document.getElementsByClassName("conteudo")[0].scrollTo(0, 0)}}>
                                    <td><img style={{width:"2em", height:"2em"}} alt={"Foto do anuncio "+a.legenda} src={host+a.imagemPath}/></td>                            
                                    <td>{a.legenda}</td>                                                             
                                    <td>{a.anuncioProdutosDTO.length}</td>                                                                                             
                                    <td onClick={event=>{event.stopPropagation();event.preventDefault();axios.delete("/loja/anuncios/"+a.id).then(response=>setValues({...values, anuncio:a.id===values.anuncio.id?{preco:"", legenda:"", imagem:"", lojaDTO:{nome:"",id:""}, anuncioProdutosDTO:[]}:values.anuncio, anuncios:values.anuncios.filter(x=>x.id!==a.id)}))}}>❌</td>
                                </tr>
                            )}               
                        </tbody>
                    </table>       
                </div>    
            </div>
        </div>
    );
}

export default Anuncio
