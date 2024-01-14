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
import "./detalhes.css"
import axios from "axios";

function Anuncio(){

    const { idAnuncio, userId} = useParams(); 
        
    const [values, setValues] = useState({anuncio:{title:'', price:0, available_quantity:0, variations:[], attributes:[], category_id:''}, disabled: true, loader:false, conta:0});                  
    const host = process.env.REACT_APP_URL;

    const setAnuncio = useCallback(()=>{        
        if(idAnuncio==="0"){axios.get(host+"/meli/contas/all").then(r=> setValues({contas:r.data, anuncio:{title:'', price:0, available_quantity:0, attributes:[], variations:[]}, loader:false, disabled: false})); return}
        axios.get(host+'/meli/anuncios/'+idAnuncio+'?userId='+userId)
            .then(anuncio=> {
                anuncio.data.variations = anuncio.data.variations?.map(v=>{return{...v, picture_ids:anuncio.data.pictures.filter(p=>v.picture_ids.includes(p.id))}});
                anuncio.data.pictures = anuncio.data.pictures?.filter(p => anuncio.data.variations.filter(v => v.picture_ids.map(pi=>pi.id).includes(p.id)).length===0)                        
                axios.get(host+'/meli/atributos/'+anuncio.data.category_id)
                .then(res => {anuncio.data.attributes = res.data.map(x=> { if(anuncio.data.attributes.filter(y=>y.id===x.id).length){ const {value_id, value_name} = anuncio.data.attributes.filter(y=>y.id===x.id)[0]; return {...x, value_id, value_name}}else return x});setValues({anuncio:anuncio.data, disabled:true, loader:false, editar:userId!=="0"&&idAnuncio!=="0", conta:0})})                
            })
    }, [idAnuncio, userId, host])
    
    const setVisits = () => axios.get(host+'/meli/anuncios/visits/'+userId+'/'+idAnuncio).then(r => setValues({...values, visits: r.data[idAnuncio]}));
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
            axios.post(host+'/meli/anuncios/'+values.contas[0].id, {...anuncio, variations:anuncio.variations.map(v=> {v.picture_ids=v.picture_ids.map(p=>p.id); delete v.id; return v})})
                .then(response=>{setValues({...values, ok:true});setAnuncio(response.data.id)})
                .catch(erro => {setValues({...values, loader:false, erro:JSON.stringify(erro.response.data)})});               
        }
    }       

    const edit = (anuncio) => {                              
        if(anuncio.variations.length>0) anuncio.variations = anuncio.variations.map(v=> {v.picture_ids=v.picture_ids.map(p=>p.id); return v})            
        axios.put(host+'/meli/anuncios/'+userId+'/'+idAnuncio, anuncio).then(response => {setValues({...values, ok:true});setAnuncio(response.data.id)})//
            .catch(error => {setValues({...values, loader:false, erro:JSON.stringify(error.response.data)})});       
    }

    const habilitarEdicao = event=>{event.preventDefault();setValues({...values, editar:true, disabled:!values.disabled})}
    const habilitarReplica = async event=>{event.preventDefault();setValues({...values, editar:false, disabled:!values.disabled, contas:(await (axios.get(host+"/meli/contas/all"))).data})}    
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
        <div className="anuncios-conteudo">
            <div className={"alert alert-success "+(values.ok?"":"visually-hidden")} role="alert"><FcCheckmark/> Anuncio enviado com sucesso</div>
            <div className={"alert alert-danger "+(values.erro?"":"visually-hidden")} role="alert"><FcHighPriority/>Erro: {values.erro}</div>
            <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"20%", fontWeight:"bold"}}>Visitas : </label>
            <input disabled style={{width:"65%", marginRight:"5%"}} value={values.visits}/>
            <input style={{width:"10%"}} className="btn btn-sm btn-primary" onClick={event=>{event.preventDefault();setVisits()}} value={"🔄 Atualizar"}/>
            <form onSubmit={event => {event.preventDefault();onSubmit()}} className="mt-2"> 
                {!values.disabled&&<button style={{width:"100%"}} className="btn btn-secondary" onClick={event=>{event.preventDefault();setAnuncio()}}>Redefinir</button>}            
                {values.disabled&&values.editar&&<button style={{width:"100%"}} className="btn btn-primary" onClick={habilitarEdicao}> Editar </button>}  
                {values.disabled&&<button style={{width:"100%"}} className="btn btn-info" onClick={habilitarReplica}>Replicar</button>}                    
                {!values.disabled&&!values.editar&&<fieldset className="w-100">
                    <hr/>
                    <h5 className="h3">Contas</h5>                                                      
                    <div style={{padding:'1.5em'}}> 
                        <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor='contas'>Publicar em : </label>     
                        <select defaultValue={0} id="conta" style={{display:"inline", width:"75%"}} onChange={(event) => setValues({...values, conta:event.target.value})}>                                                            
                            <option value={0}>Selecione uma conta</option>
                            {values.contas.map(c => <option key={c.id} value={c.id}>{c.email}</option>)}
                        </select>
                    </div>
                </fieldset>}                                                     
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
                                    
                <h5 className="h3">Imagens</h5>
                <Imagens disabled={values.disabled} value={values.anuncio.pictures} onChange={pictures=>setValues({...values, anuncio: {...values.anuncio, pictures}})}/>                                                                                                                                                  
                <hr/>
                <h5 className="h3">Variações</h5>                                                      
                <div style={{padding:'1.5em'}}>                      
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"20%", fontWeight:"bold"}}>Total : </label>
                    <input disabled style={{width:"80%"}} value={(values.anuncio.variations?values.anuncio.variations.length:0) + " Variações"}/>
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"20%", fontWeight:"bold"}}>Quantidade : </label>
                    <input disabled style={{width:"80%"}} value={values.anuncio.variations&&values.anuncio.variations.length>0?values.anuncio.variations.map(v=>parseInt(v.available_quantity)).reduce((prev, next)=>(prev+next))+" Itens":0 + " Itens"}/>                    
                    <h5 style={{textAlign:"center"}}>Atributos da Variação</h5>                    
                    <hr/>
                    {values.anuncio.variations&&<>
                        <AtributosVariacoes disabled={values.disabled} categoria={values.anuncio.category_id} attribute_combinations={values.anuncio.variations&&values.anuncio.variations.length>0?values.anuncio.variations[0].attribute_combinations:[]} onChange={onChangeAttributeCombinations}/>                                                
                        <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"20%", fontWeight:"bold"}} disabled={values.disabled} htmlFor="variations-price">Preço : </label>
                        <input disabled={values.disabled} style={{width:"80%"}} type="number" step="0.1" placeholder="Alterar todos" id="variations-price" value={values.anuncio.variations.length>0?values.anuncio.variations[0].price:values.anuncio.price} onChange={price=>setValues({...values, anuncio:{...values.anuncio, variations:values.anuncio.variations.map(v=>{return{...v, price}})}})}/>                                                

                        {values.anuncio.variations.length>0&&<>
                            <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"20%", fontWeight:"bold", marginTop:"2%"}} htmlFor="sort">Ordenar por : </label>
                            <select defaultValue={"Ola"} id="sort" style={{width:"80%"}} disabled={values.disabled} onChange={event=>{event.preventDefault();sort(values.variations, event.target.value)}}><option></option><option value={"SKU"}>SKU</option>{values.anuncio.variations[0].attribute_combinations.map((x, i)=><option key={i} value={x.name}>{x.name}</option>)}</select>
                        </>}
                        <input value="+" className="btn btn-sm btn-primary mb-4 mt-4 p-1 w-100" onClick={(event)=>{event.preventDefault();setValues({...values, anuncio:{...values.anuncio, variations:values.anuncio.variations.concat({attribute_combinations:values.anuncio.variations.length>0?values.anuncio.variations[0].attribute_combinations.map(a=>{return {...a,value_name:'', value_id:''}}):[], attributes:[], available_quantity:0, picture_ids:[], price:0, sold_quantity:0})}})}}/>
                        <Variacoes disabled={values.disabled} variations={values.anuncio.variations} categoria={values.anuncio.category_id} onChange={setVariation}/>
                    </>}
                </div>                
                {!values.disabled&&<input style={{float:"right", }} className="btn btn-sm btn-success" type="submit" value="Enviar"/>}
            </form>
        </div>
    )
}
export default Anuncio