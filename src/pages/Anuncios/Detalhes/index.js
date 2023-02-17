import { useState } from "react"
import { useParams } from "react-router-dom";
import { FcCheckmark, FcHighPriority } from "react-icons/fc";
import { MdRefresh } from "react-icons/md";
import LabelInput from "../../../estrutura/LabelInput";
import TipoAnuncio from "./components/TipoAnuncio";
import Categorias from "./components/Categorias";
// import Atributos from "./components/Atributos";
// import Imagens from "./components/Imagens";
// import AtributosVariacoes from "./components/AtributosVariacoes";
// import Variacoes from "./components/Variacoes";
import Contas from "./components/Contas";

import "./detalhes.css"
import axios from "axios";

function Detalhes(){

    const { idAnuncio, userId} = useParams(); 
    
    const setVisits = () => axios.get(process.env.REACT_APP_MELI_DOMAIN+'/meli/anuncios/visits/'+userId+'/'+idAnuncio).then(r => setValues({...values, visits: r.data[idAnuncio]}));
    
    const [values, setValues] = useState({anuncio:{title:'', price:0, available_quantity:0, variations:[], attributes:[], category_id:''}, disable: true, loader:false});                  
    
    const habilitarEdicao = event=>{event.preventDefault();setValues({...values, editar:true, disabled:!values.disabled})}
    const habilitarReplica = event=>{event.preventDefault();setValues({...values, editar:false, disabled:!values.disabled})}    

    return (               
        values.loader?<div style={{ position: "absolute", width:"100%", height:"100%", backgroundColor:"white", zIndex:"1000" }}>
            <div className="spinner-border p-5" style={{width: "3rem",height: "3rem", margin:"10% 0 0 30%"}} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>                 
        </div>:   
        <>
            <div className={"alert alert-success "+(values.ok?"":"visually-hidden")} role="alert"><FcCheckmark/> Anuncio enviado com sucesso</div>
            <div className={"alert alert-danger "+(values.erro?"":"visually-hidden")} role="alert"><FcHighPriority/>Erro: {values.erro}</div>
            <LabelInput readonly={true} label="Visitas" disabled={true} value={0}/>
            <button className="btn btn-sm btn-success" onClick={event=>{event.preventDefault();setVisits()}}><MdRefresh/></button>                                                                                                                                                    
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
            </form>
        </>
    )
}
export default Detalhes