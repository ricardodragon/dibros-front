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
            setValues({...values, anuncio:{...values.anuncio, anuncioProdutosDTO:[...values.anuncio.anuncioProdutosDTO, {produtoDTO:r.data, imagemPath:r.data.imagemPath}]}})
        )
    }
    return (
        <div className="p-4">
            <h4>Anunciar</h4>

            <form className="mt-4" onSubmit={submit}>                
                <fieldset id="anuncio" className="p-2" style={{overflow:"hidden", borderRadius:"0.9em"}}>             
                    <legend>{undefined?"Editar":"Criar"} Anucio {undefined}</legend>                                        
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt"}} className="p-1" htmlFor='loja'>Loja :</label>     
                    <select id="loja" style={{borderRadius:"0.9em"}} className='col form-control form-control-sm' onChange={async event=> setValues({...values, anuncio:{...values.anuncio, idLoja:event.target.value}})}>                                                            
                        <option value={0}>Selecione uma loja</option>
                        {values.lojas.map(l => <option selected={l.id==values.anuncio.idLoja} key={l.id} value={l.id}>{l.nome}</option>)}
                    </select>        
                    
                    <LabelInput value={values.anuncio.preco} label="Valor: " placeholder="valor" id="valor" type="number" step="0.2" onChange={preco=>setValues({...values,anuncio:{...values.anuncio,preco}})}/>
                    <LabelInput value={values.anuncio.titulo} label="Legenda: " placeholder="legenda" id="legenda" type="text" onChange={legenda=>setValues({...values,anuncio:{...values.anuncio,legenda}})}/>                                                                                                                                                
                    
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt"}} className="p-1 mt-3" htmlFor='imagem'>Foto do anuncio :</label>
                    <input id='imagem' className={"form-control form-control-sm mb-3"} label="Foto: " placeholder="foto" type="file" accept='image/*' onChange={event => setValues({...values, anuncio:{...values.anuncio, imagem:event.target.files[0]}})}/>                                    
                    {values.anuncio.imagemPath&&<img style={{width:"3em", height:"3em"}} src={process.env.REACT_APP_MELI_DOMAIN+values.anuncio.imagemPath}/>}
                    {values.anuncio.imagem&&<img style={{width:"3em", height:"3em"}} src={URL.createObjectURL(values.anuncio.imagem)}/>}            
                    
                    {values.anuncio.idLoja&&
                    <>                        
                        <label htmlFor="produto">Produto : </label>
                        <input placeholder="Id do produto" size="15" id="produto" type="number" value={values.produtoID} onChange={event=> setValues({...values, produtoID:event.target.value})}/>                        
                        <button disabled={!values.produtoID} style={{cursor:"pointer", border:"none", backgroundColor:"white"}} onClick={addProdutoDTO}>➕</button>
                    </>}

                    {values.anuncio.anuncioProdutosDTO&&values.anuncio.anuncioProdutosDTO.map(x=> <div style={{display:"flex", alignItems: "center"}}>
                        <div style={{flex: 1, display: "inline-block", textOverflow: "ellipsis", maxWidth: "13ch", overflow: "hidden", whiteSpace: "nowrap"}}>{x.produtoDTO.titulo}</div>, 
                        <img style={{width:"2em", height:"2em", display:"inline"}} src={process.env.REACT_APP_MELI_DOMAIN+x.imagemPath}/>, 
                        <input type="text" step="0.1" min="0" max="9999" value={x.preco}/>
                    </div>)}   

                    <div>
                        <input disabled={!verificaAnuncio()} type="submit" value="enviar" className="btn btn-sm btn-success mt-2"/>    
                        <input disabled={!verificaAnuncio()} onClick={event => {event.preventDefault();setValues({...values, anuncio:{preco:"", quantidade:"", titulo:"", lojaDTO:{id:"", nome:""}}})}} type="submit" className="btn btn-sm btn-primary mt-2" value="Limpar"/>                        
                    </div>
                </fieldset>
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
