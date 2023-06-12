import { useEffect, useState } from "react";
import LabelInput from "../../estrutura/LabelInput";
import axios from "axios";

function Anuncio(props){
    
    const [values, setValues] = useState({lojas:[], anuncios:[], anuncio:{preco:"", legenda:"", imagem:"", lojaDTO:{nome:"",id:""}, anuncioProdutosDTO:[]}})    
    
    useEffect(() => 
        axios.get(process.env.REACT_APP_MELI_DOMAIN+("/loja/anuncio")).then(res => 
            axios.get(process.env.REACT_APP_MELI_DOMAIN+"/loja/lojas").then(response =>                
                setValues({lojas:response.data,anuncios:res.data, anuncio:{preco:"", legenda:"", imagem:"", lojaDTO:{nome:"",id:""}, anuncioProdutosDTO:[]}})))                  
    , []);

    const submit = event => {
        event.preventDefault();
        var formData = new FormData();
        formData.append('files', undefined);
        formData.append('anuncioDTO', new Blob([JSON.stringify(undefined)], {type: "application/json"}));        
    }

    const verificaAnuncio = () => (values.anuncio.imagemPath||values.anuncio.imagemPath)&&values.anuncio.preco||values.anuncio.legenda;

    const addProdutoDTO = event => {
        event.preventDefault();
        axios.get(process.env.REACT_APP_MELI_DOMAIN+"/loja/produto/"+values.produtoID).then(r=>
            r.data?setValues({...values, anuncio:{...values.anuncio, anuncioProdutosDTO:[...values.anuncio.anuncioProdutosDTO, {produtoDTO:r.data, imagemPath:r.data.imagemPath}]}}):""
        )
    }
    return (
        <div className="p-4">
            <h4>Anunciar</h4>

            <form className="mt-4" onSubmit={submit}><legend></legend>                        
                <fieldset id="anuncio" className="p-1 mb-2" style={{borderRadius:"0.3em"}}><legend>{values.anuncio.id?"Editar":"Criar"} Anucio {values.anuncio.id}</legend>                                        
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor='loja'>Loja : </label>     
                    <select id="loja" style={{display:"inline", width:"75%"}} onChange={async event=> setValues({...values, anuncio:{...values.anuncio, idLoja:event.target.value}})}>                                                            
                        <option value={0}>Selecione uma loja</option>
                        {values.lojas.map(l => <option selected={l.id==values.anuncio.idLoja} key={l.id} value={l.id}>{l.nome}</option>)}
                    </select>                   
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor="legenda">Legenda : </label>            
                    <input id="legenda" style={{width:"75%"}} placeholder="legenda" onChange={event=>setValues({...values,anuncio:{...values.anuncio,legenda:event.target.value}})} value={values.anuncio.legenda} required={props.required} type="text"/>                                                                      
                </fieldset>
                <fieldset id="imagens" className="p-1 mb-2"  style={{borderRadius:"0.3em"}}><legend>Fotos do Anúncio</legend>  
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1 mt-3" htmlFor='imagem'>Fotos :</label>
                    <input id='imagem' size="8" label="Foto: " style={{width:"75%"}}  placeholder="foto" type="file" accept='image/*' onChange={event => setValues({...values, anuncio:{...values.anuncio, imagem:event.target.files[0]}})}/>                                    
                    {values.anuncio.imagemPath&&<img style={{width:"3em", height:"3em"}} src={process.env.REACT_APP_MELI_DOMAIN+values.anuncio.imagemPath}/>}
                    {values.anuncio.imagem&&<img style={{width:"3em", height:"3em"}} src={URL.createObjectURL(values.anuncio.imagem)}/>}            
                </fieldset>
                {values.anuncio.idLoja&&values.anuncio.idLoja!=0&&
                    <fieldset id="produtos" className="p-1" style={{borderRadius:"0.3em"}}><legend>Produtos do Anúncio</legend>  
                        <label  style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} htmlFor="produto">Id Produto : </label>
                        <input style={{width:"60%"}} placeholder="Id do produto" size="15" step="any" id="produto" type="number" value={values.produtoID} onChange={event=> setValues({...values, produtoID:event.target.value})}/>                        
                        <button disabled={!values.produtoID||values.anuncio.anuncioProdutosDTO.filter(x => x.produtoDTO.id==values.produtoID).length} style={{cursor:"pointer", border:"none", backgroundColor:"white", width:"5%"}} onClick={addProdutoDTO}>➕</button>
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
                                        <tr key={p.produtoDTO.id} style={{whiteSpace: "nowrap"}}>
                                            <td>{p.produtoDTO.id}</td>
                                            <td>🔃<img style={{width:"2em", height:"2em", display:"inline"}} src={process.env.REACT_APP_MELI_DOMAIN+p.imagemPath}/></td>
                                            <td style={{ textOverflow: "ellipsis", maxWidth: "13ch", overflow: "hidden", whiteSpace: "nowrap"}}>{p.produtoDTO.titulo}</td>                            
                                            <td style={{fontWeight: "bold"}}><input id={p.produtoDTO.id+"input"} type="number" step="0.1" min="0" max="9999" style={{width:"80%"}} value={p.preco} onChange={event=>setValues({...values, anuncio:{...values.anuncio, anuncioProdutosDTO:values.anuncio.anuncioProdutosDTO.map(x=>{return x.produtoDTO.id===p.produtoDTO.id?{...x, preco:event.target.value}:x})}})}/></td>                                                                                             
                                            <td><button className="btn btn-sm btn-danger" onClick={event=>{event.preventDefault();setValues({...values, anuncio:{...values.anuncio, anuncioProdutosDTO:values.anuncio.anuncioProdutosDTO.filter(x => x.produtoDTO.id!==p.produtoDTO.id)}})}}>X</button></td>
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
                <label htmlFor='lojas'>Loja</label>                
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
                                <td><img style={{width:"2em", height:"2em"}} src={process.env.REACT_APP_MELI_DOMAIN+a.imagemPath}/></td>                            
                                <td style={{fontWeight: "bold"}}>{a.legenda}</td>                                                             
                                <td style={{fontWeight: "bold"}}>{a.anuncioProdutosDTO.length}</td>                                                                                             
                                <td><button className="btn btn-sm btn-danger" onClick={event=>{event.preventDefault();axios.delete(process.env.REACT_APP_MELI_DOMAIN+"/anuncio/"+a.id)}}>X</button></td>
                            </tr>
                        )}               
                    </tbody>    
                </table>       
            </div>    
        </div>
    );
}

export default Anuncio
