import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { FcCheckmark, FcHighPriority } from "react-icons/fc";
import LabelInput from "../../../estrutura/LabelInput";
import TipoAnuncio from "./components/TipoAnuncio";
import Categorias from "./components/Categorias";
import Atributos from "./components/Atributos";
import Imagens from "./components/Imagens";
import AtributosVariacoes from "./components/AtributosVariacoes";
import Variacoes from "./components/Variacoes";
import Contas from "./components/Contas";

import "./detalhes.css"
import axios from "axios";

function Anuncio(){

    const { idAnuncio, userId} = useParams(); 
        
    const [values, setValues] = useState({anuncio:{title:'', price:0, available_quantity:0, variations:[], attributes:[], category_id:''}, disabled: true, loader:false});                  
    
    const setAnuncio = useCallback(()=>{        
        if(idAnuncio==="0"){setValues({anuncio:{title:'', price:0, available_quantity:0, attributes:[], variations:[]}, loader:false, disabled: false}); return}
        axios.get(process.env.REACT_APP_MELI_DOMAIN+'/meli/anuncios/'+idAnuncio+'?userId='+userId)
            .then(anuncio=> {
                anuncio.data.variations = anuncio.data.variations?.map(v=>{return{...v, picture_ids:anuncio.data.pictures.filter(p=>v.picture_ids.includes(p.id))}});
                anuncio.data.pictures = anuncio.data.pictures?.filter(p => anuncio.data.variations.filter(v => v.picture_ids.map(pi=>pi.id).includes(p.id)).length===0)                        
                axios.get(process.env.REACT_APP_MELI_DOMAIN+'/meli/atributos/'+anuncio.data.category_id)
                .then(res => {anuncio.data.attributes = res.data.map(x=> { if(anuncio.data.attributes.filter(y=>y.id===x.id).length){ const {value_id, value_name} = anuncio.data.attributes.filter(y=>y.id===x.id)[0]; return {...x, value_id, value_name}}else return x});setValues({anuncio:anuncio.data, disabled:true, loader:false, editar:userId!=="0"&&idAnuncio!=="0"})})                
            })
    }, [idAnuncio, userId])
    
    const setVisits = () => axios.get(process.env.REACT_APP_MELI_DOMAIN+'/meli/anuncios/visits/'+userId+'/'+idAnuncio).then(r => setValues({...values, visits: r.data[idAnuncio]}));
    useEffect(()=> { setAnuncio() },[setAnuncio])

    const onSubmit = () => {
        setValues({...values, loader:true})             
        var anuncio = JSON.parse(JSON.stringify(values.anuncio));         
        ["tags", "seller_id", "date_created", "permalink", "thumbnail", "last_updated", "stop_time", "initial_quantity", "sold_quantity", "base_price"].forEach(element => delete anuncio[element]);                 
        for(const [a] of Object.entries(anuncio)) if(!anuncio[a]) delete anuncio[a]           
        anuncio = anuncio.variations.length?{...anuncio, price:undefined, available_quantity:undefined}:anuncio
        anuncio.variations.map(v=>v.picture_ids).forEach(p=>anuncio.pictures = anuncio.pictures.filter(ap=>ap.id===p.id).length===0?anuncio.pictures.concat(p):anuncio.pictures)                
        if(values.editar) edit(anuncio);                    
        else{    
            delete anuncio["id"]   
            axios.post(process.env.REACT_APP_MELI_DOMAIN+'/meli/anuncios/'+values.contas[0].id, {...anuncio, variations:anuncio.variations.map(v=> {v.picture_ids=v.picture_ids.map(p=>p.id); delete v.id; return v})})
                .then(response=>{setValues({...values, ok:true});setAnuncio(response.data.id)})
                .catch(erro => {setValues({...values, loader:false, erro:JSON.stringify(erro.response.data)})});               
        }
    }       

    const edit = (anuncio) => {                              
        if(anuncio.variations.length>0) anuncio.variations = anuncio.variations.map(v=> {v.picture_ids=v.picture_ids.map(p=>p.id); return v})            
        axios.put(process.env.REACT_APP_MELI_DOMAIN+'/meli/anuncios/'+userId+'/'+idAnuncio, anuncio).then(response => {setValues({...values, ok:true});setAnuncio(response.data.id)})//
            .catch(error => {setValues({...values, loader:false, erro:JSON.stringify(error.response.data)})});       
    }

    const habilitarEdicao = event=>{event.preventDefault();setValues({...values, editar:true, disabled:!values.disabled})}
    const habilitarReplica = event=>{event.preventDefault();setValues({...values, editar:false, disabled:!values.disabled})}    
    const setAtributo = attributes => setValues({...values, anuncio: {...values.anuncio, attributes}});
    const sort = (v, name, fator=1) => setValues({...values, anuncio: {...values.anuncio, variations:[].concat(values.anuncio.variations).sort((a, b) => {
        const ta = v==="SKU"?a["attribute_combinations"].filter(x=>x.name===name)[0].value_name:a["attributes"].filter(a => a.id === "SELLER_SKU")[0];
        const tb = v==="SKU"?b["attribute_combinations"].filter(x=>x.name===name)[0].value_name:b["attributes"].filter(b => b.id === "SELLER_SKU")[0];            
        // if(v==="SKU")
            return (ta!==undefined?Number(ta.value_name):0)-(tb!==undefined?Number(tb.value_name):0)
        // else 
        //     return ta.localeCompare(tb)*fator;
    })}})        
    const setVariation = (variations) => setValues({...values, anuncio: {...values.anuncio, variations}})

    const onChangeAttributeCombinations = (value, index)=> {        
        const variations = values.anuncio.variations;
        variations.forEach(v=>value?v.attribute_combinations[index]={...value, value_name:v.attribute_combinations[index]?v.attribute_combinations[index].value_name:''}:v.attribute_combinations = v.attribute_combinations.filter((x,i)=>i!==index))
        setValues({...values, anuncio:{...values.anuncio, variations}});
    }      
        
    return (               
        values.loader?<div style={{ position: "absolute", width:"100%", height:"100%", backgroundColor:"white", zIndex:"1000" }}>
            <div className="spinner-border p-5" style={{width: "3rem",height: "3rem", margin:"10% 0 0 30%"}} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>                 
        </div>:   
        <>
            <div className={"alert alert-success "+(values.ok?"":"visually-hidden")} role="alert"><FcCheckmark/> Anuncio enviado com sucesso</div>
            <div className={"alert alert-danger "+(values.erro?"":"visually-hidden")} role="alert"><FcHighPriority/>Erro: {values.erro}</div>
            <LabelInput readonly={true} label="Visitas" disabled={true} value={values.visits}/>
            <p style={{cursor:"pointer"}} onClick={event=>{event.preventDefault();setVisits()}}>🔄</p>                                                                                                                                                    
            <form onSubmit={event => {event.preventDefault();onSubmit()}}> 
                <div className="d-flex justify-content-end">
                    {!values.disabled&&<button className="btn btn-secondary" onClick={event=>{event.preventDefault();setAnuncio()}}>Redefinir</button>}            
                    {values.disabled&&<button className="btn btn-primary" onClick={habilitarReplica}>Replicar</button>}                    
                    {values.editar&&<button className="btn btn-info" onClick={habilitarEdicao}> Editar </button>}  
                </div>
                {!values.disabled&&!values.editar&&<Contas label={"Publicar em"} value={values.contas&&values.contas.length>0?values.contas[0].email:''} onChange={(contas) => { setValues({...values, contas})}} id="conta"/>}                                     
                <Categorias disabled={values.disabled} onChange={(category_id) =>setValues({...values, anuncio:{...values.anuncio, category_id}})} category_id={values.anuncio.category_id}/>                        
                {values.anuncio.category_id&&values.contas&&values.contas.map((conta)=><TipoAnuncio key={conta.id} conta={conta} categoria={values.anuncio.category_id} onChange={listing_type_id=>setValues({...values, anuncio: {...values.anuncio, listing_type_id}})}/>)}                                                                    
                <h5 className="h3">Detalhes</h5>
                <div className="row" style={{padding:'1.5em'}}>                
                    <div className="col"><LabelInput required={true} disabled={values.disabled} value={values.anuncio.title} label="Título" id="titulo" type="text" onChange={title => setValues({...values, anuncio: {...values.anuncio, title}})}/></div>
                    {values.anuncio.variations&&values.anuncio.variations.length>0&&<>
                        <div className="col"><LabelInput disabled={values.disabled} value={values.anuncio.available_quantity} label="Quantidade" id="qtd_disponivel" type="number" onChange={available_quantity => setValues({...values, anuncio: {...values.anuncio, available_quantity}})}/></div>
                        <div className="col"><LabelInput disabled={values.disabled} value={values.anuncio.price} label="Preço" id="preco" type="number" onChange={price => setValues({...values, anuncio: {...values.anuncio, price}})}/></div>
                    </>}
                </div>
                <hr/>   
                <Atributos disabled={values.disabled} value={values.anuncio.attributes} categoria={values.anuncio.category_id} onChange={setAtributo}/>                            
                
                {values.anuncio.location&&Object.entries(values.anuncio.location).forEach((key, value)=>{
                    console.log(key, value);
                    // <Atributos disabled={values.disabled} value={[]} categoria={values.anuncio.category_id} onChange={attributes=>console.log(attributes)}/>                            
                })}
                                    
                <h5 className="h3">Imagens</h5>
                <Imagens disabled={values.disabled} value={values.anuncio.pictures} onChange={pictures=>setValues({...values, anuncio: {...values.anuncio, pictures}})}/>                                                                                                                                                  
                <h5 className="h3">Variações</h5>                                                      
                <div className="row" style={{padding:'1.5em'}}>                      
                    <div className="col"><label>Total</label><p className="fw-bolder">{(values.anuncio.variations?values.anuncio.variations.length:0)+" Variações"}</p><input readOnly={true} value="+" className="btn btn-sm btn-primary mb-4 p-1" onClick={(event)=>{event.preventDefault();setValues({...values, anuncio:{...values.anuncio, variations:values.anuncio.variations.concat({attribute_combinations:values.anuncio.variations.length>0?values.anuncio.variations[0].attribute_combinations.map(a=>{return {...a,value_name:'', value_id:''}}):[], attributes:[], available_quantity:0, picture_ids:[], price:0, sold_quantity:0})}})}}/></div>
                    <div className="col"><label>Quantidade</label><p className="fw-bolder">{values.anuncio.variations&&values.anuncio.variations.length>0?values.anuncio.variations.map(v=>parseInt(v.available_quantity)).reduce((prev, next)=>(prev+next)):0} Itens</p> </div>
                    <h5 style={{textAlign:"center"}}>Atributos da Variação</h5>                    
                    <hr/>
                    {values.anuncio.variations&&<>
                        <AtributosVariacoes disabled={values.disabled} categoria={values.anuncio.category_id} attribute_combinations={values.anuncio.variations&&values.anuncio.variations.length>0?values.anuncio.variations[0].attribute_combinations:[]} onChange={onChangeAttributeCombinations}/>                        
                        <LabelInput value={values.anuncio.variations.length>0?values.anuncio.variations[0].price:values.anuncio.price} disabled={values.disabled}  label="Preço : " id="variations-price" type="number" step="0.1" placeholder="Alterar todos" onChange={price=>setValues({...values, anuncio:{...values.anuncio, variations:values.anuncio.variations.map(v=>{return{...v, price}})}})}/>                                                                                                                                             
                        <LabelInput value={values.qtd} disabled={values.disabled}  label="Quantidades : " id="variations-price" type="number" step="0.1" placeholder="Alterar todos" onChange={available_quantity=>setValues({...values,qtd:available_quantity, anuncio:{...values.anuncio, variations:values.anuncio.variations.map(v=>{return{...v, available_quantity}})}})}/>
                        {values.anuncio.variations.length>0&&<><label htmlFor="sort">Ordenar por : </label><select defaultValue={"Ola"} id="sort" className='col form-control form-control-sm' disabled={values.disabled} onChange={event=>{event.preventDefault();sort(values.variations, event.target.value)}}><option></option><option value={"SKU"}>SKU</option>{values.anuncio.variations[0].attribute_combinations.map((x, i)=><option key={i} value={x.name}>{x.name}</option>)}</select></>}
                        <Variacoes disabled={values.disabled} variations={values.anuncio.variations} categoria={values.anuncio.category_id} onChange={setVariation}/>
                    </>}
                </div>                
                {!values.disabled&&<input style={{float:"right", }} className="btn btn-sm btn-success" type="submit" value="Enviar"/>}
            </form>
        </>
    )
}
export default Anuncio