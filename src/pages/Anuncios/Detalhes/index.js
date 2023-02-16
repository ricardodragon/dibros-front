import { useCallback, useLayoutEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { FcCheckmark, FcHighPriority } from "react-icons/fc";
import { MdRefresh } from "react-icons/md";
import TipoAnuncio from "./components/TipoAnuncio";
import Categorias from "./components/Categorias";
import Atributos from "./components/Atributos";
import Imagens from "./components/Imagens";
import AtributosVariacoes from "./components/AtributosVariacoes";
import Variacoes from "./components/Variacoes";
import LabelInput from "../../../estrutura/LabelInput";
import Contas from "./components/Contas";
import "./detalhes.css"

function Detalhes(){
    
    let { idAnuncio } = useParams(); 
    let { userId } = useParams(); 


    const dominio = process.env.REACT_APP_MELI_DOMAIN
    
    const [values, setValues] = useState({qtd:0, visits:0,editar:false,disabled:false,contas:[],anuncio:{pictures:[], sale_terms:[], attributes:[], variations:[]}, loader:true});                  
    
    const setVisits = () => axios.get(dominio+'/meli/anuncios/visits/'+userId+'/'+idAnuncio).then(r => setValues({...values, visits: r.data[idAnuncio]}));

    const setAnuncio = useCallback(async() => {      
        if(idAnuncio==="0"){setValues({...values, loader:false}); return}
        setVisits();
        var anuncio = (await axios.get(dominio+'/meli/anuncios/'+idAnuncio+'?userId='+userId)).data;                          
        anuncio.variations = anuncio.variations.map(v=>{return{...v, picture_ids:anuncio.pictures.filter(p=>v.picture_ids.includes(p.id))}});                                        
        anuncio.pictures = anuncio.pictures.filter(p => anuncio.variations.filter(v => v.picture_ids.map(pi=>pi.id).includes(p.id)).length===0);                        
        var d = (await axios.get(dominio+'/meli/atributos/'+anuncio.category_id)).data.filter(x=>anuncio.attributes.filter(y=>y.id===x.id).length>0);
        anuncio.attributes = d.map(x=> { var {value_id, value_name} = anuncio.attributes.filter(y=>y.id===x.id)[0]; return {...x, value_id, value_name}})            
        setValues({...values, anuncio, disabled:true, editar:false, loader:false});         
    },[dominio, idAnuncio, userId, values])

    useLayoutEffect(() => setAnuncio(), []);

    const setAtributo = attributes => setValues({...values, anuncio: {...values.anuncio, attributes}})              

    const onSubmit = async event =>{
        setValues({...values, loader:true})     
        event.preventDefault();  
        var anuncio = JSON.parse(JSON.stringify(values.anuncio));         
        ["seller_id", "date_created", "permalink", "thumbnail", "last_updated", "stop_time", "initial_quantity", "sold_quantity", "base_price"].forEach(element => delete anuncio[element]);                 
        for(const [a] of Object.entries(anuncio)) if(!anuncio[a]) delete anuncio[a]           
        anuncio = anuncio.variations.length?{...anuncio, price:undefined, available_quantity:undefined}:anuncio
        anuncio.variations.map(v=>v.picture_ids).forEach(p=>anuncio.pictures = anuncio.pictures.filter(ap=>ap.id===p.id).length===0?anuncio.pictures.concat(p):anuncio.pictures)                
        if(values.editar) edit(anuncio);                    
        else{    
            delete anuncio["id"]   
            axios.post(dominio+'/meli/anuncios/'+values.contas[0].id, {...anuncio, variations:anuncio.variations.map(v=> {v.picture_ids=v.picture_ids.map(p=>p.id); delete v.id; return v})})
                .then(response=>{setValues({...values, ok:true});setAnuncio(response.data.id)})
                .catch(erro => {setValues({...values, loader:false, erro:JSON.stringify(erro.response.data)})});               
        }
    }       

    const edit = (anuncio) => {                              
        if(anuncio.variations.length>0) anuncio.variations = anuncio.variations.map(v=> {v.picture_ids=v.picture_ids.map(p=>p.id); return v})            
        axios.put(dominio+'/meli/anuncios/'+userId+'/'+idAnuncio, anuncio).then(response => {setValues({...values, ok:true});setAnuncio(response.data.id)})//
          .catch(error => {setValues({...values, loader:false, erro:JSON.stringify(error.response.data)})});       
    }

    const habilitarEdicao = event=>{event.preventDefault();setValues({...values, editar:true, disabled:!values.disabled})}
    const habilitarReplica = event=>{event.preventDefault();setValues({...values, editar:false, disabled:!values.disabled})}    
    const setVariation = (variations) => setValues({...values, anuncio: {...values.anuncio, variations}})
    const sort = (v, name, fator=1) => setValues({...values, anuncio: {...values.anuncio, variations:[].concat(values.anuncio.variations).sort((a, b) =>(a["attribute_combinations"].filter(x=>x.name===name)[0].value_name).localeCompare(b["attribute_combinations"].filter(x=>x.name===name)[0].value_name)*fator).reverse()}})
    
    const onChangeAttributeCombinations = (value, index)=> {        
        const variations = values.anuncio.variations;
        variations.forEach(v=>value?v.attribute_combinations[index]={...value, value_name:v.attribute_combinations[index]?v.attribute_combinations[index].value_name:''}:v.attribute_combinations = v.attribute_combinations.filter((x,i)=>i!==index))
        setValues({...values, anuncio:{...values.anuncio, variations}});
    }      

    return ( 

        <>       
            {values.loader?<div style={{ position: "absolute", width:"100%", height:"100%", backgroundColor:"white", zIndex:"1000" }}>
                <div className="spinner-border p-5" style={{width: "3rem",height: "3rem", margin:"10% 0 0 30%"}} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>                 
            </div>: 
            <>           
                <div className={"alert alert-success "+(values.ok?"":"visually-hidden")} role="alert">
                    <FcCheckmark/> Anuncio enviado com sucesso
                </div>
                <div className={"alert alert-danger "+(values.erro?"":"visually-hidden")} role="alert" >
                    <FcHighPriority/>Erro: {values.erro}
                </div>
                <LabelInput label="Visitas" disabled={true} value={values.visits}/>
                <button className="btn btn-sm btn-success" onClick={event=>{event.preventDefault();setVisits()}}><MdRefresh/></button>                                                                                                                                                    
                <form onSubmit={event => {event.preventDefault();onSubmit(event);}}>                  
                    <div className="d-flex justify-content-end">
                        {!values.disabled?<button className="btn btn-secondary" onClick={event=>{event.preventDefault();setAnuncio()}}>Redefinir</button>:null}            
                        {values.disabled?<button className="btn btn-primary" onClick={habilitarReplica}>Replicar</button>:null}                    
                        {values.disabled&&userId!==0&&!values.editar?<button className="btn btn-info" onClick={habilitarEdicao}> Editar </button>:null}  
                    </div>            
                    {!values.disabled&&!values.editar?<Contas label={"Publicar em"} onChange={(contas) => { setValues({...values, contas})}} id="conta"/>:null}                                     
                    <Categorias disabled={values.disabled} onChange={(category_id) =>setValues({...values, anuncio:{...values.anuncio, category_id}})} category_id={values.anuncio.category_id}/>                        
                    {values.anuncio.category_id&&values.contas?values.contas.map((conta)=><TipoAnuncio conta={conta} categoria={values.anuncio.category_id} onChange={listing_type_id=>setValues({...values, anuncio: {...values.anuncio, listing_type_id}})}/>):null}                                                                    
                    <h5 className="h3">Detalhes</h5>
                    <div className="row" style={{padding:'1.5em'}}>                
                        {/* <div className="col"><LabelInput required={true} disabled={values.disabled} value={values.anuncio.title} label="Título" id="titulo" type="text" onChange={title => setValues({...values, anuncio: {...values.anuncio, title}})}/></div> */}
                        <div className="col"><LabelInput required={true} disabled={values.disabled} value={values.anuncio.title} label="Título" id="titulo" type="text" onChange={title => setValues({...values, anuncio: {...values.anuncio, title}})}/></div>
                        {!values.anuncio.variations.length?
                            <>
                                <div className="col"><LabelInput disabled={values.disabled} value={values.anuncio.available_quantity} label="Quantidade" id="qtd_disponivel" type="number" onChange={available_quantity => setValues({...values, anuncio: {...values.anuncio, available_quantity}})}/></div>
                                <div className="col"><LabelInput disabled={values.disabled} value={values.anuncio.price} label="Preço" id="preco" type="number" onChange={price => setValues({...values, anuncio: {...values.anuncio, price}})}/></div>
                            </>:undefined
                        }
                    </div>
                    <hr/>
                    
                    <Atributos disabled={values.disabled} 
                        value={values.anuncio.attributes} 
                        categoria={values.anuncio.category_id} 
                        onChange={setAtributo}/>                            
                    
                    
                    <h5 className="h3">Imagens</h5>
                    <Imagens  disabled={values.disabled} value={values.anuncio.pictures} onChange={pictures=>setValues({...values, anuncio: {...values.anuncio, pictures}})}/>                                                                                                                                                  
                    <h5 className="h3">Variações</h5>                                                      
                    <div className="row" style={{padding:'1.5em'}}>                      
                        <div className="col"><label>Total</label><p className="fw-bolder">{values.anuncio.variations.length+" Variações"}</p><input value="+" className="btn btn-sm btn-primary mb-4 p-1" onClick={(event)=>{event.preventDefault();setValues({...values, anuncio:{...values.anuncio, variations:values.anuncio.variations.concat({attribute_combinations:values.anuncio.variations.length?values.anuncio.variations[0].attribute_combinations.map(a=>{return {...a,value_name:'', value_id:''}}):[], attributes:[], available_quantity:0, picture_ids:[], price:0, sold_quantity:0})}})}}/></div>
                        <div className="col"><label>Quantidade</label><p className="fw-bolder">{values.anuncio.variations.length>0?values.anuncio.variations.map(v=>parseInt(v.available_quantity)).reduce((prev, next)=>(prev+next)):0} Itens</p> </div>
                        <h5 style={{textAlign:"center"}}>Atributos da Variação</h5>                    
                        <hr/>
                        {values.anuncio.variations.length?
                            <><AtributosVariacoes disabled={values.disabled} categoria={values.anuncio.category_id} attribute_combinations={values.anuncio.variations[0]?values.anuncio.variations[0].attribute_combinations:[]} onChange={onChangeAttributeCombinations}/>                        
                            <LabelInput value={values.anuncio.variations[0].price} disabled={values.disabled}  label="Preço : " id="variations-price" type="number" step="0.1" placeholder="Alterar todos" onChange={price=>setValues({...values, anuncio:{...values.anuncio, variations:values.anuncio.variations.map(v=>{return{...v, price}})}})}/>                                                                                                                                             
                            <LabelInput value={values.qtd} disabled={values.disabled}  label="Quantidades : " id="variations-price" type="number" step="0.1" placeholder="Alterar todos" onChange={available_quantity=>setValues({...values,qtd:available_quantity, anuncio:{...values.anuncio, variations:values.anuncio.variations.map(v=>{return{...v, available_quantity}})}})}/>                                                                                                                                             
                            <label htmlFor="sort">Ordenar por : </label>
                            <select id="sort" className='col form-control form-control-sm' disabled={values.disabled} onChange={event=>{event.preventDefault();sort(values.variations, event.target.value)}}><option></option>{values.anuncio.variations[0].attribute_combinations.map(x=><option value={x.name}>{x.name}</option>)}</select>
                            <Variacoes disabled={values.disabled} variations={values.anuncio.variations} categoria={values.anuncio.category_id} onChange={setVariation}/></>:undefined}
                    </div>                
                    {!values.disabled?<input disabled={!values.contas} style={{float:"right", }} className="btn btn-sm btn-success" type="submit" value="Enviar"/>:null}                                                                                                                     
                </form> 
            </>}  
        </>     
        
    )
}
export default Detalhes