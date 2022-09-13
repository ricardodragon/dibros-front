import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import VariacoesForm from "../../../components/AnuncioForms/VariacoesForm";
import Imagens from "../../../components/AnuncioForms/Imagens";
import LabelInput from "../../../components/Estrutura/LabelInput";
import Contas from "../../../components/Contas";
import Categorias from "../../../components/AnuncioForms/CategoriasForm/Categorias";
import AtributosVariacoesForm from "../../../components/AnuncioForms/AtributosVariacoesForm";
import TipoAnuncio from "../../../components/AnuncioForms/TipoAnuncio";
import "./detalhes.css"
import Atributos from "../../../components/AnuncioForms/AtributosForm/Atributos";
import LabelSelect from "../../../components/Estrutura/LabelSelect";

function Detalhes(){
    
    let { idAnuncio } = useParams(); 
    let { userId } = useParams(); 
    const dominio = "http://DESKTOP-DS0K2GT:8080"
    
    const [values, setValues] = useState({editar:false,disabled:false,contas:[],anuncio:{pictures:[], sale_terms:[], attributes:[], variations:[]}, attribute_combinations:[]});                  
    
    const setAnuncio = async()=> {  
        if(idAnuncio==="0") return                     
        const anuncio = (await axios.get(dominio+'/meli/anuncios/'+idAnuncio+'/'+userId)).data;        
        anuncio.variations=anuncio.variations.map(v=>{return{...v, picture_ids:anuncio.pictures.filter(p=>v.picture_ids.includes(p.id))}});                                        
        anuncio.pictures = anuncio.pictures.filter(p => anuncio.variations.filter(v => v.picture_ids.map(pi=>pi.id).includes(p.id)).length==0);        
        anuncio.attributes = anuncio.attributes.map(a => {return {...a, selected:1}})
        const attribute_combinations = anuncio.variations.length>0?anuncio.variations[0].attribute_combinations:values.attribute_combinations;                        
        setValues({...values, anuncio, attribute_combinations, disabled:true, editar:false});         
    }

    useEffect(() => setAnuncio(), []);

    const setAtributo = attributes => setValues({...values, anuncio: {...values.anuncio, attributes}})              

    const onSubmit = async event =>{     
        event.preventDefault();  
        const anuncio = JSON.parse(JSON.stringify(values.anuncio));         
        ["seller_id", "date_created", "permalink", "thumbnail", "last_updated", "stop_time", "initial_quantity", "sold_quantity", "base_price"].forEach(element => delete anuncio[element]);         
        for(const [a, value] of Object.entries(anuncio)) if(!anuncio[a]) delete anuncio[a]           
        anuncio.variations.map(v=>v.picture_ids).forEach(p=>anuncio.pictures = anuncio.pictures.filter(ap=>ap.id==p.id).length==0?anuncio.pictures.concat(p):anuncio.pictures)                
        if(values.editar) edit(anuncio);                    
        else{                
            delete anuncio["id"]   
            anuncio.variations = anuncio.variations.map(v=> {v.picture_ids=v.picture_ids.map(p=>p.id); delete v.id; return v})                                                   
            axios.post(dominio+'/meli/anuncios/'+values.contas[0].id, anuncio)        
        }
    }       

    const edit = (anuncio) => {            
        ['buying_mode', 'category_id', 'condition', 'currency_id', 'listing_type_id'].forEach(element => {
            delete anuncio[element]});                      
        if(anuncio.variations.length>0){
            anuncio.variations = anuncio.variations.map(v=> {v.picture_ids=v.picture_ids.map(p=>p.id); return v})
            anuncio.available_quantity = null;anuncio.price = null;
        }
        axios.post(dominio+'/meli/anuncios/'+userId+'/'+idAnuncio, anuncio);
    }

    const habilitarEdicao = event=>{event.preventDefault();setValues({...values, editar:true, disabled:!values.disabled})}
    const habilitarReplica = event=>{event.preventDefault();setValues({...values, editar:false, disabled:!values.disabled})}    
    const setVariation = (variations) => setValues({...values, anuncio: {...values.anuncio, variations}})
    const sort = (v, index, fator=1) => v.sort((a, b) =>('' + a["attribute_combinations"][index].value_name).localeCompare(b["attribute_combinations"][index].value_name)*fator)
    
    const onChangeAttribute_combinations = (attribute_combinations)=>{        
        setValues({
            ...values, 
            attribute_combinations, 
            anuncio:{
                ...values.anuncio, 
                variations:values.anuncio.variations.map(v => {
                    const att = attribute_combinations.map((a, index)=>{
                        return {...a, value_name:v.attribute_combinations[index]?v.attribute_combinations[index].value_name:""}
                    });
                    v.attribute_combinations = att;
                    return v;
                }
            )}
        });  
    }

    return (        
        <form onSubmit={event => {event.preventDefault();onSubmit(event);}}>                                                                                                                             
            <div className="d-flex justify-content-end">
                {!values.disabled?<button className="btn btn-secondary" onClick={event=>{event.preventDefault();setAnuncio()}}>Redefinir</button>:null}            
                {values.disabled?<button className="btn btn-primary" onClick={habilitarReplica}>Replicar</button>:null}                    
                {values.disabled&&userId!=0&&!values.editar?<button className="btn btn-info" onClick={habilitarEdicao}> Editar </button>:null}  
            </div>            
            {values.anuncio.id&&!values.disabled&&!values.editar?<Contas label={"Publicar em"} onChange={(contas) => { setValues({...values, contas})}} id="conta"/>:null}                                     
            <Categorias disabled={values.disabled} onChange={(category_id) => setValues({...values, anuncio: {...values.anuncio, category_id}})} categoria={values.anuncio.category_id}/>                        
            {values.anuncio.category_id?values.contas.map((conta)=><TipoAnuncio conta={conta} categoria={values.anuncio.category_id} onChange={listing_type_id=>setValues({...values, anuncio: {...values.anuncio, listing_type_id}})}/>):null}                                                                    
            <h5 className="h3">Detalhes</h5>
            <div className="row" style={{padding:'1.5em'}}>                
                <div className="col-sm-12 col-md-3"><LabelInput disabled={values.disabled} value={values.anuncio.title} label="Título" id="titulo" type="text" onChange={title => setValues({...values, anuncio: {...values.anuncio, title}})}/></div>
                <div className="col-sm-12 col-md-3"><LabelInput disabled={values.disabled} value={values.anuncio.available_quantity} label="Quantidade disponível" id="qtd_disponivel" type="number" onChange={available_quantity => setValues({...values, anuncio: {...values.anuncio, available_quantity}})}/></div>
                <div className="col-sm-12 col-md-3"><LabelInput disabled={values.disabled} value={values.anuncio.price} label="Preço" id="preco" type="number" onChange={price => setValues({...values, anuncio: {...values.anuncio, price}})}/></div>
            </div>
            <hr/>
            <Atributos disabled={values.disabled} value={values.anuncio.attributes} categoria={values.anuncio.category_id} onChange={setAtributo}/>                            
            <Imagens  disabled={values.disabled} value={values.anuncio.pictures} onChange={pictures=>setValues({...values, anuncio: {...values.anuncio, pictures}})}/>                                                                                                                                      
            
            <h5 className="h3">Variações</h5>
            {values.anuncio.category_id?                                            
                <div className="row" style={{padding:'1.5em'}}>  
                    <div className="col-sm">
                        <label>Total</label><p className="fw-bolder">{values.anuncio.variations.length+" Variações"}</p> 
                    </div>
                    <div className="col-sm">
                        <label>Quantidade</label><p className="fw-bolder">{values.anuncio.variations.length>0?values.anuncio.variations.map(v=>parseInt(v.available_quantity)).reduce((prev, next)=>(prev+next)):0} Itens</p> 
                    </div>
                    {!values.disabled?<>
                            <AtributosVariacoesForm  disabled={values.disabled} categoria={values.anuncio.category_id} attribute_combinations={values.attribute_combinations} onChange={onChangeAttribute_combinations}/>                        
                            <LabelInput label="Preço : " id="variations-price" type="number" step="0.1" placeholder="Alterar todos" onChange={price=>setValues({...values, anuncio:{...values.anuncio, variations:values.anuncio.variations.map(v=>{return{...v, price}})}})}/>                                                                                                                     
                            <LabelSelect label="Ordenar crescente : " lista={values.anuncio.variations[0].attribute_combinations} onChange={value=>setValues({...values, variations: sort(values.anuncio.variations, value)})}/>                        
                            <LabelSelect label="Ordenar decrescente : " lista={values.anuncio.variations[0].attribute_combinations} onChange={value=>setValues({...values, variations: sort(values.anuncio.variations, value, -1)})}/>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                            <button style={{float:"right", fontWeight:"bold"}} className="btn btn-sm btn-primary" onClick={(event)=>{event.preventDefault();setValues({...values, anuncio:{...values.anuncio,variations:[{attribute_combinations:values.attribute_combinations, attributes:[], available_quantity:0, picture_ids:[], price:0, sold_quantity:0}].concat(values.anuncio.variations)}})}}>+</button>                                           
                        </>:null
                    }
                <VariacoesForm disabled={values.disabled} attribute_combinations={values.attribute_combinations} variations={values.anuncio.variations} categoria={values.anuncio.category_id} onChange={setVariation}/> 
                </div>:<p style={{fontWeight: "bold", fontSize:"14pt", color:"red"}}>Preencha a categoria</p>                                        
            }  
            {!values.disabled?<input style={{float:"right", margin:"5% 4% 0 0"}} className="btn btn-sm btn-success" type="submit" value="Enviar"/>:null}                                                                                                     
        </form>        
    )
}
export default Detalhes

{/* <DescricaoForm />
            {values.anuncio.category_id?<GarantiasForm setTipoGarantia={setGarantia} setTempoGarantia={setGarantia} categoria={values.anuncio.category_id}/>:null}*/}                

// <LabelSelect label="Tipo de frete : " lista={(await axios.get('http://localhost:8080/meli/fretes/'+conta.id)).data.shipping_modes} onChange={value=>alert(value)}/>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          

// const setGarantia = tipoGarantia => {
//     const sale_terms = values.anuncio.sale_terms.filter(value => value.id != tipoGarantia.id)
//     sale_terms.push(tipoGarantia)
//     setValues({...values, anuncio: {...values.anuncio, sale_terms}})    
// }