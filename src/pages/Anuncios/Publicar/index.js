import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import FieldsetLegend from "../../../components/Estrutura/FieldsetLegend";
import AtributosForm from "../../../components/AnuncioForms/AtributosForm";
import VariacoesForm from "../../../components/AnuncioForms/VariacoesForm";
import ImagensForm from "../../../components/AnuncioForms/ImagensForm";
import DescricaoForm from "../../../components/AnuncioForms/DescricaoForm";
import GarantiasForm from "../../../components/AnuncioForms/GarantiasForm";
import LabelInput from "../../../components/Estrutura/LabelInput";
import Contas from "../../../components/Contas";
import Categorias from "../../../components/AnuncioForms/CategoriasForm/Categorias";
import AtributosVariacoesForm from "../../../components/AnuncioForms/AtributosVariacoesForm";
import LabelSelect from "../../../components/Estrutura/LabelSelect";
import TipoAnuncio from "../../../components/AnuncioForms/TipoAnuncio";
import "./publicar.css"
function Publicar(){
    
    let { idAnuncio } = useParams(); 
    let { userId } = useParams(); 

    
    const [values, setValues] = useState({contas:[],anuncio:{pictures:[], sale_terms:[], attributes:[], variations:[]}, attribute_combinations:[]});                  
    
    const setAnuncio = async()=> {  
        if(idAnuncio==="0"&&userId==="0") return                     
        const anuncio = (await axios.get('http://localhost:8080/meli/anuncios/'+idAnuncio+'/'+userId)).data;        
        anuncio.variations=anuncio.variations.map(v=>{return{...v, picture_ids:anuncio.pictures.filter(p=>v.picture_ids.includes(p.id))}});                                        
        anuncio.pictures = anuncio.pictures.filter(p => anuncio.variations.filter(v => v.picture_ids.map(pi=>pi.id).includes(p.id)).length==0);        
        const attribute_combinations = anuncio.variations.length>0?anuncio.variations[0].attribute_combinations:values.attribute_combinations;
        setValues({...values, anuncio, attribute_combinations});         
    }

    useEffect(() => {
        setAnuncio();
    }, []);

    const setGarantia = tipoGarantia => {
        const sale_terms = values.anuncio.sale_terms.filter(value => value.id != tipoGarantia.id)
        sale_terms.push(tipoGarantia)
        setValues({...values, anuncio: {...values.anuncio, sale_terms}})    
    }

    const setAtributo = atributo => {
        const attributes = values.anuncio.attributes.filter(value => value.id != atributo.id)
        atributo.value_name!=""?attributes.push(atributo):console.log("Erro")
        setValues({...values, anuncio: {...values.anuncio, attributes}})        
    }
    
    const onSubmit = async event =>{     
        event.preventDefault(); 
        var formData = new FormData();        
        const anuncio = JSON.parse(JSON.stringify(values.anuncio));         
        ["seller_id", "date_created", "id", "permalink", "thumbnail", "last_updated", "stop_time", "initial_quantity", "sold_quantity", "base_price"].forEach(element => {           
            delete anuncio[element]
        });        
        anuncio.variations.map(v=>v.picture_ids).forEach(p=>anuncio.pictures = anuncio.pictures.filter(ap=>ap.id==p.id).length==0?anuncio.pictures.concat(p):anuncio.pictures)        
        anuncio.variations = anuncio.variations.map(v=> {v.picture_ids=v.picture_ids.map(p=>p.id); delete v.id; return v})                                                   
        axios.post('http://localhost:8080/meli/anuncios/'+values.contas[0].id, anuncio)        
    }       

    const setVariation = (variations) => setValues({...values, anuncio: {...values.anuncio, variations}})

    const sort = (v, index, fator=1) =>        
        v.sort((a, b) =>('' + a["attribute_combinations"][index].value_name).localeCompare(b["attribute_combinations"][index].value_name)*fator)
    
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
    // <LabelSelect label="Tipo de frete : " lista={(await axios.get('http://localhost:8080/meli/fretes/'+conta.id)).data.shipping_modes} onChange={value=>alert(value)}/>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    return (        
        <form onSubmit={event => {event.preventDefault();onSubmit(event);}}>                                                                                             
            <Contas onChange={(contas) => { setValues({...values, contas})}} id="conta"/>                      
            <LabelInput type="text" label="Replicar ID : "id="replicar" placeholder="digite um id de anuncio meli"/><br/>            
            <Categorias onChange={(category_id) => setValues({...values, anuncio: {...values.anuncio, category_id}})}/><label style={{fontWeight:"bold", marginLeft:"5%"}}>Id : </label>{values.anuncio.category_id}<br/>            
            {values.anuncio.category_id?values.contas.map((conta)=><>
                <TipoAnuncio conta={conta} categoria={values.anuncio.category_id} onChange={listing_type_id=>setValues({...values, anuncio: {...values.anuncio, listing_type_id}})}/>                                
            </>):null}<br/>                                                            
            <LabelInput value={values.anuncio.title} label="Título : " id="titulo" type="text" onChange={title => setValues({...values, anuncio: {...values.anuncio, title}})}/>                
            <LabelInput value={values.anuncio.available_quantity} label="Quantidade disponível : " id="qtd_disponivel" type="number" onChange={available_quantity => setValues({...values, anuncio: {...values.anuncio, available_quantity}})}/>                
            <LabelInput value={values.anuncio.price} label="Preço : " id="preco" type="number" onChange={price => setValues({...values, anuncio: {...values.anuncio, price}})}/>                
            <AtributosForm value={values.anuncio.attributes} categoria={values.anuncio.category_id} onChange={setAtributo}/>                
            <FieldsetLegend legend={"Imagens"} id={"check-imagens-fieldset"} classe={"imagens"}>   
                <ImagensForm value={values.anuncio.pictures} onChange={pictures=>setValues({...values, anuncio: {...values.anuncio, pictures}})}/>                                                                                        
            </FieldsetLegend>
            {/* <DescricaoForm />
            {values.anuncio.category_id?<GarantiasForm 
            setTipoGarantia={setGarantia} setTempoGarantia={setGarantia} categoria={values.anuncio.category_id}/>:null}                                                                          */}                
            
            {values.anuncio.category_id?
                <>
                    <AtributosVariacoesForm categoria={values.anuncio.category_id} attribute_combinations={values.attribute_combinations} onChange={onChangeAttribute_combinations}/>
                    {values.anuncio.variations.length>0?
                        <>                                                                                                      
                            <h1>{"Total : "+values.anuncio.variations.length+" Variações"}</h1> 
                            <h1>Qtd : {values.anuncio.variations.length>0?values.anuncio.variations.map(v=>parseInt(v.available_quantity)).reduce((prev, next)=>(prev+next)):0} Itens</h1>             
                            <LabelInput label="Preço : " id="variations-price" type="number" step="0.1" placeholder="Alterar todos" onChange={price=>setValues({...values, anuncio:{...values.anuncio, variations:values.anuncio.variations.map(v=>{return{...v, price}})}})}/>                                                                                                                     
                            <LabelSelect label="Ordenar crescente : " lista={values.anuncio.variations[0].attribute_combinations} onChange={value=>setValues({...values, variations: sort(values.anuncio.variations, value)})}/>                        
                            <LabelSelect label="Ordenar decrescente : " lista={values.anuncio.variations[0].attribute_combinations} onChange={value=>setValues({...values, variations: sort(values.anuncio.variations, value, -1)})}/>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                        </>:""
                    }
                    <input style={{float:"right"}} type="button" value="+" className="botao-add-variacao" onClick={(event)=>{event.preventDefault();setValues({...values, variations:[{attribute_combinations:values.attribute_combinations, attributes:[], available_quantity:0, picture_ids:[], price:0, sold_quantity:0}].concat(values.anuncio.variations)})}}/>                    
                    <VariacoesForm attribute_combinations={values.attribute_combinations} variations={values.anuncio.variations} categoria={values.anuncio.category_id} onChange={setVariation}/>
                </>:<p style={{fontWeight: "bold", fontSize:"14pt", color:"red"}}>Preencha a categoria</p>                                        
            }                                
                 
            <input type="reset" value="Reset"/>
            <input className="botao-publicar" type="submit"/>                                
        </form>        
    )
}
export default Publicar
