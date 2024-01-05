import { useEffect, useState } from "react";
import axios from "axios";

function Anuncio(props){
    
    const [values, setValues] = useState({lojas:[], anuncios:[], anuncio:{preco:"", legenda:"", lojaDTO:{nome:"",id:""}, anuncioProdutosDTO:[]}})    
    const host = process.env.REACT_APP_URL;

    useEffect(() => 
        axios.get(host+("/loja/anuncio/usuario")).then(res => 
            axios.get(host+"/loja/lojas").then(response =>                
                setValues({lojas:response.data,anuncios:res.data, anuncio:{preco:"", legenda:"", lojaDTO:{nome:"",id:""}, anuncioProdutosDTO:[]}})))                  
    , [host]);

    const submit = event => {
        event.preventDefault();
        var formData = new FormData(); var i = 0; var anuncio = values.anuncio;            
        [values.anuncio].concat(values.anuncio.anuncioProdutosDTO).filter(x=>x.imagem).map(x=>x.imagem).forEach(x=>formData.append("files", x));                       
        axios.post(host+'/imagem/imagem', formData).then(imagens =>{                        
            if(anuncio.imagem) anuncio.imagemPath = imagens.data[i++];
            anuncio.anuncioProdutosDTO = anuncio.anuncioProdutosDTO.map(x=>x.imagem?{...x, imagemPath:imagens.data[i++]}:x);
            anuncio.id?axios.put(host+'/loja/anuncio', anuncio).then(callBackForm):
                axios.post(host+'/loja/anuncio', anuncio).then(callBackForm)
        }); 
    }
    
    const callBackForm = response => { 
        const a = values.anuncios.filter(x=>x.id===response.data.id); 
        setValues({...values, anuncio:{preco:"", legenda:"", imagem:"", lojaDTO:{nome:"",id:""}, anuncioProdutosDTO:[]}, anuncios:a.length?values.anuncios.map(anuncio=>{return anuncio.id===a[0].id?{...response.data, anuncioProdutosDTO:values.anuncio.anuncioProdutosDTO}:anuncio}):values.anuncios.concat({...response.data, anuncioProdutosDTO:values.anuncio.anuncioProdutosDTO.map(x=>{return {...x, idAnuncio:response.data.id}})})});
    }

    const verificaAnuncio = () => values.anuncio.imagemPath||values.anuncio.imagem||values.anuncio.legenda||values.anuncio.idLoja;

    const addProduto = event => {
        event.preventDefault();
        axios.get(host+"/loja/produto/"+values.produtoID+"/"+values.anuncio.idLoja).then(r=>
            r.data?setValues({...values, anuncio:{...values.anuncio, anuncioProdutosDTO:[...values.anuncio.anuncioProdutosDTO, {imagemPath:r.data.imagemPath, preco:r.data.preco, idAnuncio:values.anuncio.id, idProduto:r.data.id, produtoDTO:r.data}]}}):""
        )
    }
    return (
        <div className='anuncios-conteudo'>
            <form className="mt-4" onSubmit={submit}><legend></legend>                        
                <fieldset id="anuncio" className="p-1 mb-2" style={{borderRadius:"0.3em"}}><legend>{values.anuncio.id?"Editar":"Criar"} Anucio {values.anuncio.id}</legend>                                        
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor='loja'>Loja : </label>     
                    <select defaultValue={0} value={values.anuncio.idLoja} id="loja" style={{display:"inline", width:"75%"}} onChange={event=> setValues({...values, anuncio:{...values.anuncio, idLoja:event.target.value>0?event.target.value:undefined, anuncioProdutosDTO:values.anuncio.anuncioProdutosDTO.filter(x=>x.idProduto.idLoja === event.target.value)}})}>                                                            
                        <option value={0}>Selecione uma loja</option>
                        {values.lojas.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                    </select>  
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor="legenda">Legenda : </label>            
                    <input id="legenda" style={{width:"75%"}} placeholder="legenda" onChange={event=>setValues({...values,anuncio:{...values.anuncio,legenda:event.target.value}})} value={values.anuncio.legenda} required={props.required} type="text"/>                                                                      
                </fieldset>
                <fieldset id="imagens" className="p-1 mb-2"  style={{borderRadius:"0.3em"}}><legend>Fotos</legend>  
                    <label htmlFor='imagem' className="p-1" style={{backgroundColor: "#3498db", borderRadius: "5px", color: "#fff", cursor: "pointer"}}>📁 Upload</label>
                    <input id='imagem' label="Foto: " style={{display:"none"}} type="file" accept='image/*' onChange={event =>event.target.files[0]?setValues({...values, anuncio:{...values.anuncio, imagemPath:undefined,imagem:event.target.files[0]}}):""}/>                                    
                    <img alt="" style={{width:"3em", height:"3em"}} src={values.anuncio.imagem?URL.createObjectURL(values.anuncio.imagem):host+values.anuncio.imagemPath}/>
                </fieldset>
                {values.anuncio.idLoja&&
                    <fieldset id="produtos" className="p-1" style={{borderRadius:"0.3em"}}><legend>Produtos do Anúncio</legend>  
                        <label  style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} htmlFor="produto">Id : </label>
                        <input style={{width:"60%"}} placeholder="Id do produto" size="15" step="any" id="produto" type="number" value={values.produtoID} onChange={event=> setValues({...values, produtoID:event.target.value})}/>                        
                        <button disabled={!values.produtoID||values.anuncio.anuncioProdutosDTO.filter(x => x.idProduto===values.produtoID).length} style={{cursor:"pointer", border:"none", backgroundColor:"white", width:"15%"}} onClick={addProduto}>➕</button>
                        <div className="table-responsive">
                            <table className="table">
                                <thead className="thead-light">
                                    <tr className="table-light">
                                        <th scope="col">ID</th>
                                        <th scope="col"></th>
                                        <th scope="col">Título</th>
                                        <th scope="col">Preco</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead> 
                                <tbody> 
                                    {values.anuncio.anuncioProdutosDTO&&values.anuncio.anuncioProdutosDTO.map((p, i)=> 
                                        <tr key={p.idProduto} style={{whiteSpace: "nowrap"}}>
                                            <td>{p.idProduto}</td>
                                            <td>
                                                <label style={{cursor: "pointer"}} htmlFor={"imagem - "+p.idProduto}>🔃</label>
                                                <input accept='image/*' onChange={event=>event.target.files[0]?setValues({...values, anuncio:{...values.anuncio, anuncioProdutosDTO:values.anuncio.anuncioProdutosDTO.map(x=>{return x.idProduto===p.idProduto?{...x, imagemPath:undefined, imagem:event.target.files[0]}:x})}}):""} id={"imagem - "+p.idProduto} type="file" style={{display:'none'}} />
                                                <img alt="" style={{width:"2em", height:"2em", display:"inline"}} src={p.imagem?URL.createObjectURL(p.imagem):host+p.imagemPath}/>
                                            </td>
                                            <td style={{ textOverflow: "ellipsis", maxWidth: "13ch", overflow: "hidden", whiteSpace: "nowrap"}}>{p.produtoDTO.titulo}</td>                            
                                            <td style={{fontWeight: "bold"}}><input id={p.idProduto+"input"} type="number" step="0.1" style={{width:"80%"}} value={p.preco} onChange={event=>setValues({...values, anuncio:{...values.anuncio, anuncioProdutosDTO:values.anuncio.anuncioProdutosDTO.map(x=>{return x.idProduto===p.idProduto?{...x, preco:event.target.value}:x})}})}/></td>                                                                                             
                                            <td style={{cursor:"pointer"}} onClick={event=>{event.preventDefault();setValues({...values, anuncio:{...values.anuncio, anuncioProdutosDTO:values.anuncio.anuncioProdutosDTO.filter(x => x.idProduto!==p.idProduto)}})}}>❌</td>
                                        </tr>
                                    )}               
                                </tbody>    
                            </table> 
                        </div>
                    </fieldset>
                }

                <div>
                    <input disabled={!verificaAnuncio()} type="submit" value="enviar" className="btn btn-sm btn-success mt-2"/>    
                    <input disabled={!verificaAnuncio()} onClick={event => {event.preventDefault();setValues({...values, anuncio:{legenda:"", lojaDTO:{id:"", nome:""}, anuncioProdutosDTO:[]}})}} type="submit" className="btn btn-sm btn-primary mt-2" value="Limpar"/>                        
                </div>
            </form>

            <div className="table-responsive mt-3">                              
                <table className="table mt-4">     
                    <thead className="thead-light">
                        <tr className="table-light">
                            <th scope="col">ID</th>
                            <th scope="col"></th>
                            <th scope="col">Legenda</th>
                            <th scope="col">Produtos Anuncio</th>
                            <th scope="col"></th>
                        </tr>
                    </thead> 
                    <tbody> 
                        {/* <tr><td>{values.anuncios.map(p=>p.quantidade).reduce((sumQtd, a) => sumQtd + a, 0)}</td></tr> */}
                        {values.anuncios.map(a=>
                            <tr key={a.id} style={{cursor:"pointer", whiteSpace: "nowrap"}} onClick={event=>{event.preventDefault();window.scrollTo(0, 0);setValues({...values, anuncio:{...a, loja:a.lojaDTO}});document.getElementsByClassName("conteudo")[0].scrollTo(0, 0)}}>
                                <td>{a.id}</td>
                                <td><img style={{width:"2em", height:"2em"}} alt={"Foto do anuncio "+a.legenda} src={host+a.imagemPath}/></td>                            
                                <td style={{fontWeight: "bold"}}>{a.legenda}</td>                                                             
                                <td style={{fontWeight: "bold"}}>{a.anuncioProdutosDTO.length}</td>                                                                                             
                                <td onClick={event=>{event.stopPropagation();event.preventDefault();axios.delete(host+"/loja/anuncio/"+a.id).then(response=>setValues({...values, anuncio:a.id===values.anuncio.id?{preco:"", legenda:"", imagem:"", lojaDTO:{nome:"",id:""}, anuncioProdutosDTO:[]}:values.anuncio, anuncios:values.anuncios.filter(x=>x.id!==a.id)}))}}>❌</td>
                            </tr>
                        )}               
                    </tbody>    
                </table>       
            </div>    
        </div>
    );
}

export default Anuncio
