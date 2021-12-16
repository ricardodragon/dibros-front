import { useEffect, useState } from "react";
import FieldsetLegend from "../../../components/FieldsetLegend";
import TipoAnuncioForm from "../../../components/AnuncioForms/TipoAnuncioForm";
import CategoriasForm from "../../../components/AnuncioForms/CategoriasForm";
import AtributosForm from "../../../components/AnuncioForms/AtributosForm";
import VariacoesForm from "../../../components/AnuncioForms/VariacoesForm";
import ImagensForm from "../../../components/AnuncioForms/ImagensForm";
import DescricaoForm from "../../../components/AnuncioForms/DescricaoForm";
import GarantiasForm from "../../../components/AnuncioForms/GarantiasForm";
import axios from "axios";
import "./publicar.css"
import { useParams } from "react-router";
import LabelInput from "../../../components/LabelInput";
import Contas from "../../../components/Contas";
import Categorias from "../../../components/AnuncioForms/CategoriasForm/Categorias";
function Publicar(){
    
    let { idAnuncio } = useParams(); 
    let { userId } = useParams(); 

    const [values, setValues] = useState({anuncio:{pictures:[], sale_terms:[], attributes:[], variations:[]}});                  
    
    const setAnuncio = async()=> {  
        if(idAnuncio==="0"&&userId==="0") return                     
        const anuncio = (await axios.get('http://localhost:8080/meli/anuncios/'+idAnuncio+'/'+userId)).data;        
        anuncio.variations=anuncio.variations.map(v=>{return{...v, picture_ids:anuncio.pictures.filter(p=>v.picture_ids.includes(p.id))}});                                        
        anuncio.pictures = anuncio.pictures.filter(p => anuncio.variations.filter(v => v.picture_ids.map(pi=>pi.id).includes(p.id)).length==0);        
        setValues({...values, anuncio}); 
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
        var formData = new FormData();                           
        const anuncio = values.anuncio;         
        ["date_created", "id", "permalink", "thumbnail", "last_updated", "stop_time", "initial_quantity", "sold_quantity", "base_price"].forEach(element => {           
            delete anuncio[element]
        });        
        anuncio.variations.map(v=>v.picture_ids).forEach(p=>anuncio.pictures = anuncio.pictures.filter(ap=>ap.id==p.id).length==0?anuncio.pictures.concat(p):anuncio.pictures)        
        anuncio.variations.map(v=> {v.picture_ids=v.picture_ids.map(p=>p.id); return v})                     
        console.log(anuncio)
        //axios.post('http://localhost:8080/meli/anuncios/'+values.contas[0].id, anuncio)
    }       

    const setVariation = (variations) => {
        const pictures = values.anuncio.pictures;
        pictures.push()
        
        setValues({...values, anuncio: {...values.anuncio, variations}})
    }

    return (
        
        <form onSubmit={event => {event.preventDefault();onSubmit(event);}}>                                                                                             
            <Contas onChange={(contas) => { setValues({...values, contas})}} id="conta"/>                        
            <LabelInput type="text" label="Replicar ID : "id="replicar" placeholder="digite um id de anuncio meli"/><br/>                                                            
            <label style={{fontWeight:"bold", paddingLeft:"1%"}}>Categoria : </label> <Categorias onChange={(category_id) => setValues({...values, anuncio: {...values.anuncio, category_id}})}/><label style={{fontWeight:"bold", marginLeft:"5%"}}>Id : </label>{values.anuncio.category_id}
            {/* <CategoriasForm onChange={(category_id) => setValues({...values, anuncio: {...values.anuncio, category_id}})}/>                             */}
            {values.anuncio.category_id&&values.contas?
                <TipoAnuncioForm contas={values.contas} categoria={values.anuncio.category_id} 
                    onChange={listing_type_id=>setValues({...values, anuncio: {...values.anuncio, listing_type_id}})}/>
                    :null
            }
            <FieldsetLegend legend={"Anuncio"} id={"check-anuncio-fieldset"} classe="anuncio">                                              
                <LabelInput value={values.anuncio.title} label="Título : " id="titulo" type="text" onChange={title => setValues({...values, anuncio: {...values.anuncio, title}})}/>                
                <LabelInput value={values.anuncio.available_quantity} label="Quantidade disponível : " id="qtd_disponivel" type="number" onChange={available_quantity => setValues({...values, anuncio: {...values.anuncio, available_quantity}})}/>                
                <LabelInput value={values.anuncio.price} label="Preço : " id="preco" type="number" onChange={price => setValues({...values, anuncio: {...values.anuncio, price}})}/>                
                <AtributosForm 
                    value={values.anuncio.attributes} categoria={values.anuncio.category_id} onChange={setAtributo}/>                
                <FieldsetLegend legend={"Imagens"} id={"check-imagens-fieldset"} classe={"imagens"}>   
                    <ImagensForm 
                        value={values.anuncio.pictures} 
                        onChange={pictures=>setValues({...values, anuncio: {...values.anuncio, pictures}})}/>                                                                                        
                </FieldsetLegend>
                {/* <DescricaoForm />
                {values.anuncio.category_id?<GarantiasForm 
                    setTipoGarantia={setGarantia} setTempoGarantia={setGarantia} categoria={values.anuncio.category_id}/>:null}                                                                          */}
                <VariacoesForm value={values.anuncio.variations} categoria={values.anuncio.category_id} onChange={setVariation}/>                                         
            </FieldsetLegend>                                
            <input className="botao-publicar" type="submit"/>                                
        </form>        
    )
}
export default Publicar
