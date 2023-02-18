import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { FcCheckmark, FcHighPriority } from "react-icons/fc";
// import { MdRefresh } from "react-icons/md";
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

function Detalhes(){

    const { idAnuncio, userId} = useParams(); 
    
    
    const [values, setValues] = useState({anuncio:{title:'', price:0, available_quantity:0, variations:[], attributes:[], category_id:''}, disable: true, loader:false});                  
    
    const setAnuncio = useCallback(()=>{        
        if(idAnuncio==="0"){setValues({anuncio:{title:'', price:0, available_quantity:0, attributes:[], variations:[]}, loader:false, disable: false}); return}
        axios.get(process.env.REACT_APP_MELI_DOMAIN+'/meli/anuncios/'+idAnuncio+'?userId='+userId)
        .then(anuncio=> {
            anuncio.data.variations = anuncio.data.variations?.map(v=>{return{...v, picture_ids:anuncio.data.pictures.filter(p=>v.picture_ids.includes(p.id))}});
            anuncio.data.pictures = anuncio.data.pictures?.filter(p => anuncio.data.variations.filter(v => v.picture_ids.map(pi=>pi.id).includes(p.id)).length===0)                        
            axios.get(process.env.REACT_APP_MELI_DOMAIN+'/meli/atributos/'+anuncio.data.category_id)
            .then(res => {anuncio.data.attributes = res.data.map(x=> { if(anuncio.data.attributes.filter(y=>y.id===x.id).length){ const {value_id, value_name} = anuncio.data.attributes.filter(y=>y.id===x.id)[0]; return {...x, value_id, value_name}}else return x});setValues({anuncio:anuncio.data, disable: false, loader:false})})                
        })
    }, [idAnuncio, userId])
    
    const setVisits = () => axios.get(process.env.REACT_APP_MELI_DOMAIN+'/meli/anuncios/visits/'+userId+'/'+idAnuncio).then(r => setValues({...values, visits: r.data[idAnuncio]}));
    useEffect(()=> { setAnuncio() },[setAnuncio])

    const habilitarEdicao = event=>{event.preventDefault();setValues({...values, editar:true, disabled:!values.disabled})}
    const habilitarReplica = event=>{event.preventDefault();setValues({...values, editar:false, disabled:!values.disabled})}    
    const setAtributo = attributes => setValues({...values, anuncio: {...values.anuncio, attributes}});
    const sort = (v, name, fator=1) => setValues({...values, anuncio: {...values.anuncio, variations:[].concat(values.anuncio.variations).sort((a, b) =>(a["attribute_combinations"].filter(x=>x.name===name)[0].value_name).localeCompare(b["attribute_combinations"].filter(x=>x.name===name)[0].value_name)*fator).reverse()}})
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
            {/* <LabelInput readonly={true} label="Visitas" disabled={true} value={0}/> */}
            <button className="btn btn-sm btn-success" onClick={event=>{event.preventDefault();setVisits()}}></button>                                                                                                                                                    
            <form onSubmit={event => {event.preventDefault();}}> 
                <div className="d-flex justify-content-end">
                    {!values.disabled?<button className="btn btn-secondary" onClick={event=>{event.preventDefault();}}>Redefinir</button>:null}            
                    {values.disabled?<button className="btn btn-primary" onClick={habilitarReplica}>Replicar</button>:null}                    
                    {values.disabled&&userId!==0&&!values.editar?<button className="btn btn-info" onClick={habilitarEdicao}> Editar </button>:null}  
                </div>
                {!values.disabled&&!values.editar?<Contas label={"Publicar em"} onChange={(contas) => { setValues({...values, contas})}} id="conta"/>:null}                                     
                <Categorias disabled={values.disabled} onChange={(category_id) =>setValues({...values, anuncio:{...values.anuncio, category_id}})} category_id={values.anuncio.category_id}/>                        
                {values.anuncio.category_id&&values.contas?values.contas.map((conta)=><TipoAnuncio key={conta.id} conta={conta} categoria={values.anuncio.category_id} onChange={listing_type_id=>setValues({...values, anuncio: {...values.anuncio, listing_type_id}})}/>):null}                                                                    
                <h5 className="h3">Detalhes</h5>
                <div className="row" style={{padding:'1.5em'}}>                
                    <div className="col"><LabelInput required={true} disabled={values.disabled} value={values.anuncio.title} label="Título" id="titulo" type="text" onChange={title => setValues({...values, anuncio: {...values.anuncio, title}})}/></div>
                    {!values.anuncio.variations?<>
                        <div className="col"><LabelInput disabled={values.disabled} value={values.anuncio.available_quantity} label="Quantidade" id="qtd_disponivel" type="number" onChange={available_quantity => setValues({...values, anuncio: {...values.anuncio, available_quantity}})}/></div>
                        <div className="col"><LabelInput disabled={values.disabled} value={values.anuncio.price} label="Preço" id="preco" type="number" onChange={price => setValues({...values, anuncio: {...values.anuncio, price}})}/></div>
                    </>:undefined}
                </div>
                <hr/>   
                <Atributos disabled={values.disabled} value={values.anuncio.attributes} categoria={values.anuncio.category_id} onChange={setAtributo}/>                            
                                    
                <h5 className="h3">Imagens</h5>
                <Imagens  disabled={values.disabled} value={values.anuncio.pictures} onChange={pictures=>setValues({...values, anuncio: {...values.anuncio, pictures}})}/>                                                                                                                                                  
                <h5 className="h3">Variações</h5>                                                      
                <div className="row" style={{padding:'1.5em'}}>                      
                    <div className="col"><label>Total</label><p className="fw-bolder">{(values.anuncio.variations?values.anuncio.variations.length:0)+" Variações"}</p><input readOnly={true} value="+" className="btn btn-sm btn-primary mb-4 p-1" onClick={(event)=>{event.preventDefault();setValues({...values, anuncio:{...values.anuncio, variations:values.anuncio.variations.concat({attribute_combinations:values.anuncio.variations.length>0?values.anuncio.variations[0].attribute_combinations.map(a=>{return {...a,value_name:'', value_id:''}}):[], attributes:[], available_quantity:0, picture_ids:[], price:0, sold_quantity:0})}})}}/></div>
                    <div className="col"><label>Quantidade</label><p className="fw-bolder">{values.anuncio.variations&&values.anuncio.variations.length>0?values.anuncio.variations.map(v=>parseInt(v.available_quantity)).reduce((prev, next)=>(prev+next)):0} Itens</p> </div>
                    <h5 style={{textAlign:"center"}}>Atributos da Variação</h5>                    
                    <hr/>
                    {values.anuncio.variations?
                        <>
                        <AtributosVariacoes disabled={values.disabled} categoria={values.anuncio.category_id} attribute_combinations={values.anuncio.variations&&values.anuncio.variations.length>0?values.anuncio.variations[0].attribute_combinations:[]} onChange={onChangeAttributeCombinations}/>                        
                        <LabelInput value={values.anuncio.variations.length>0?values.anuncio.variations[0].price:values.anuncio.price} disabled={values.disabled}  label="Preço : " id="variations-price" type="number" step="0.1" placeholder="Alterar todos" onChange={price=>setValues({...values, anuncio:{...values.anuncio, variations:values.anuncio.variations.map(v=>{return{...v, price}})}})}/>                                                                                                                                             
                        <LabelInput value={values.qtd} disabled={values.disabled}  label="Quantidades : " id="variations-price" type="number" step="0.1" placeholder="Alterar todos" onChange={available_quantity=>setValues({...values,qtd:available_quantity, anuncio:{...values.anuncio, variations:values.anuncio.variations.map(v=>{return{...v, available_quantity}})}})}/>                                                                                                                                             
                        {values.anuncio.variations.length>0?<><label htmlFor="sort">Ordenar por : </label><select defaultValue={"Ola"} id="sort" className='col form-control form-control-sm' disabled={values.disabled} onChange={event=>{event.preventDefault();sort(values.variations, event.target.value)}}><option ></option>{values.anuncio.variations[0].attribute_combinations.map((x, i)=><option key={i} value={x.name}>{x.name}</option>)}</select></>:""}
                        <Variacoes disabled={values.disabled} variations={values.anuncio.variations} categoria={values.anuncio.category_id} onChange={setVariation}/>
                        </>:undefined}
                </div>                
                {!values.disabled?<input disabled={!values.contas} style={{float:"right", }} className="btn btn-sm btn-success" type="submit" value="Enviar"/>:null}                                                                                                                                              
            </form>
        </>
    )
}
export default Detalhes