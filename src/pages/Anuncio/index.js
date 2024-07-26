import { useEffect, useRef, useState } from "react";
import axios from "../../config/api/api";
import { FcCheckmark, FcHighPriority } from "react-icons/fc";

function Anuncio(props){
    
    const [values, setValues] = useState({lojas:[], anuncios:[], produtoID:"", anuncio:{preco:"", legenda:""}})        
    const host = process.env.REACT_APP_URL;
    const ref = useRef();

    useEffect(() => {
        setValues({lojas:[], anuncios:[], load:true, anuncio:{preco:"", legenda:""}});
        axios.get(("/loja/anuncios/usuario")).then(res => 
            axios.get("/loja/lojas").then(response =>                
                setValues({lojas:response.data, produtoID:"", anuncios:res.data, erro: response.data.length<=0?"É preciso criar uma loja em \"Menu > Lojas\"":false, load:false, anuncio:{preco:"", legenda:""}})))                  
    }, []);

    const submit = event => {
        setValues({...values, load:true});
        event.preventDefault();        
        var formData = new FormData();
        formData.append("files", values.anuncio.imagem)
        //[values.anuncio].concat(values.anuncio.anuncioProdutosDTO).filter(x=>x.imagem).map(x=>x.imagem).forEach(x=>formData.append("files", x));                       
        axios.post('/imagem/imagem', formData).then(imagens =>                        
            // anuncio.imagemPath = imagens.data[0];
            // anuncio.anuncioProdutosDTO = anuncio.anuncioProdutosDTO.map(x=>x.imagem?{...x, imagemPath:imagens.data[i++]}:x);
            (!values.anuncio.id?
                axios.post('/loja/anuncios', {...values.anuncio, imagemPath:imagens.data[0]?imagens.data[0]:values.anuncio.imagemPath}):
                axios.put('/loja/anuncios/'+values.anuncio.id, {...values.anuncio, imagemPath:imagens.data[0]?imagens.data[0]:values.anuncio.imagemPath}))
                    .then(callBackForm).catch(callBackForm))
            .catch(callBackForm); 
    }    

    const getLocation = () => navigator.geolocation?
    navigator.geolocation.getCurrentPosition(position=>
        setValues({...values, anuncio:{...values.anuncio, latitude:position.coords.latitude, longitude:position.coords.longitude}})):
    "Geolocation is not supported by this browser.";

    const callBackForm = response => { 
        if(response.data&&response.data.id){
            ref.current.value="";
            setValues({
                ...values, 
                ok:`Anuncio '${response.data.legenda}' criado com sucesso.`, 
                erro:false, 
                load:false,
                anuncio:{preco:"", legenda:"", idLoja:""},
                anuncios:values.anuncio.id?values.anuncios.map(x=>x.id===values.anuncio.id?response.data:x):values.anuncios.concat(response.data)
            });
        }else
            setValues({...values, erro:response&&response.response&&response.response.data&&response.response.data.message?response.response.data.message:"Erro desconhecido", ok:false, load:false})
        document.getElementsByClassName("anuncios-conteudo")[0].scrollTo(0, 0);
    }   

    const addProduto = event => {
        event.preventDefault();
        axios.get("/loja/produtos/"+values.produtoID).then(r=>
            r.data?setValues({...values, anuncio:{...values.anuncio, anuncioProdutosDTO:[...values.anuncio.anuncioProdutosDTO, {imagemPath:r.data.imagemPath, preco:r.data.preco, idAnuncio:values.anuncio.id, idProduto:r.data.id, produtoDTO:r.data}]}}):""
        )
    }
    return (
        <div>            
            {values.load&&<div style={{position:"absolute", width:"100%", height:"100%", backgroundColor:"rgba(173, 181, 189, 50%)", zIndex:"1000" }}>
                <div className="spinner-border p-1" style={{width: "3rem",height: "3rem", margin:"18% 0 0 47%"}} role="status"></div>                 
            </div>}
            <div className='anuncios-conteudo'>
                <div className={"alert alert-success "+(values.ok?"":"visually-hidden")} role="alert"><FcCheckmark/>Anuncio criado com sucesso</div>
                <div className={"alert alert-danger "+(values.erro?"":"visually-hidden")} role="alert"><FcHighPriority/>Erro: {values.erro}</div>
                <form className="mt-4" onSubmit={submit}>                     
                    <fieldset id="anuncio"><legend>{values.anuncio.id?"Editar":"Criar"} Anucio {values.anuncio.legenda}</legend>                                        
                        <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1 mb-4" htmlFor='loja'>Loja : </label>     
                        <select value={values.anuncio.idLoja} id="loja" style={{display:"inline", width:"75%"}} onChange={event=> setValues({...values, produtoID:"", anuncio:{...values.anuncio, anuncioProdutosDTO:[], idLoja:event.target.value}})}>                                                            
                            <option value="">Selecione uma loja</option>
                            {values.lojas.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                        </select>  
                        <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1 mb-4" htmlFor="legenda">Legenda : </label>            
                        <input required id="legenda" style={{width:"75%"}} placeholder="legenda" onChange={event=>setValues({...values,anuncio:{...values.anuncio,legenda:event.target.value}})} value={values.anuncio.legenda} type="text"/>                                                                      
                        <label required style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1 mb-4" htmlFor="preco">Preço : </label>            
                        <input required id="preco" style={{width:"75%"}} placeholder="preco" onChange={event=>setValues({...values,anuncio:{...values.anuncio,preco:event.target.value}})} value={values.anuncio.preco} type="number"/>                                                                      
                    </fieldset>
                    {!values.anuncio.idLoja&&<fieldset>
                        <legend>Localização da loja</legend>   
                        <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1 mb-4" htmlFor="localizacao">Local : {values.anuncio.latitude&&values.anuncio.longitude?'✅':'❌'}</label>            
                        <input style={{width:"75%"}} type="button" onClick={event => {event.preventDefault();getLocation();}} className="btn btn-sm btn-secondary" id="localizacao" value={"📌 Localização"}/>                 
                    </fieldset>}
                    <fieldset id="imagens"><legend>Fotos</legend>  
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor='imagem'>Imagem : </label>            
                        <input ref={ref} required={!values.anuncio.imagemPath||values.anuncio.imagemPath===""} id='imagem' className='mb-4' type="file" style={{textAlign:"center", width:"75%", backgroundColor: "#3498db", borderRadius: "5px", color: "#fff"}} accept='image/*' onChange={event => {event.preventDefault();console.log(event.target.files);setValues({...values, anuncio:{...values.anuncio, imagemPath:undefined, imagem:event.target.files[0]}});}}/>
                        {(values.anuncio.imagemPath||values.anuncio.imagem)&&<img alt="" style={{display:"block", width:"8em", height:"8em"}} src={values.anuncio.imagemPath?host+values.anuncio.imagemPath:URL.createObjectURL(values.anuncio.imagem)}/>}                                                                        
                    </fieldset>
                    {values.anuncio.idLoja&&
                        <fieldset id="produtos" className="mb-4"><legend>Produtos do Anúncio</legend>  
                            <label  style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1 mb-4" htmlFor="produto">Id : </label>
                            <input style={{width:"50%"}} placeholder="Id do produto" size="15" step="any" id="produto" type="number" value={values.produtoID} onChange={event=> setValues({...values, produtoID:event.target.value})}/>                        
                            <button disabled={!values.produtoID||(values.anuncio.anuncioProdutosDTO.length&&values.anuncio.anuncioProdutosDTO.filter(x => x.idProduto===values.produtoID).length)} style={{cursor:"pointer", border:"none", backgroundColor:"white", width:"15%"}} className="m-1" onClick={addProduto}>➕</button>
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
                                    <tbody>
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
                                    </tbody>
                                </table> 
                            </div>
                        </fieldset>
                    }
                    <input type="submit" value="enviar" className="btn btn-sm btn-success mt-2 mb-4"/>    
                    <input onClick={event => {event.preventDefault();ref.current.value="";setValues({...values, anuncio:{legenda:"", preco:"", idLoja:""}})}} type="submit" className="btn btn-sm btn-primary mt-2 mb-4" value="Limpar"/>                        
                </form>

                <div style={{overflowX:"auto", color:"white"}}>
                    <table style={{borderCollapse: "collapse", width: "100%"}}>
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Legenda</th>
                                <th scope="col">Preço</th>                                
                                <th scope="col">Produtos Anuncio</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        {/* <tr><td>{values.anuncios.map(p=>p.quantidade).reduce((sumQtd, a) => sumQtd + a, 0)}</td></tr> */}
                        <tbody>
                            {values.anuncios.map(a=>
                                <tr key={a.id} style={{cursor:"pointer", whiteSpace: "nowrap"}} onClick={event=>{event.preventDefault();setValues({...values,  produtoID:"", anuncio:{...a, loja:a.lojaDTO}});document.getElementsByClassName("anuncios-conteudo")[0].scrollTo(0, 0)}}>
                                    <td><img style={{width:"2em", height:"2em"}} alt={"Foto do anuncio "+a.legenda} src={host+a.imagemPath}/></td>                            
                                    <td>{a.legenda}</td>  
                                    <td>{a.preco}</td>                                                             
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
