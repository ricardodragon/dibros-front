import { useState } from "react";
import FieldsetLegend from "../../../components/FieldsetLegend";
import AnuncioForm from "../../../components/AnuncioForms/AnuncioForm";
import MoedaForm from "../../../components/AnuncioForms/MoedaForm";
import EstoqueForm from "../../../components/AnuncioForms/EstoqueForm";
import TipoAnuncioForm from "../../../components/AnuncioForms/TipoAnuncioForm";
import CategoriasForm from "../../../components/AnuncioForms/CategoriasForm";
import AtributosForm from "../../../components/AnuncioForms/AtributosForm";
import VariacoesForm from "../../../components/AnuncioForms/VariacoesForm";
import ContasForm from "../../../components/AnuncioForms/ContasForm";
import ReplicarAnuncioForm from "../../../components/AnuncioForms/ReplicarAnuncioForm";
import ImagensForm from "../../../components/AnuncioForms/ImagensForm";
import DescricaoForm from "../../../components/AnuncioForms/DescricaoForm";
import GarantiasForm from "../../../components/AnuncioForms/GarantiasForm";
import axios from "axios";
import "./publicar.css"

function Publicar(){
    
    const [values, setValues] = useState({pictures:[], garantias:[], anuncio:{sale_terms:[], attributes:[]}});                  

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
        //{console.log(values.contas[0])}
        for(const v of anuncio.variations)
            anuncio.pictures = anuncio.pictures.concat(v.picture_ids.map(i=>{return {id:i}}))                        
        axios.post('http://localhost:8080/anuncios/'+values.contas[0].id, anuncio)
    }       

    return (
                                
        <form onSubmit={event => {event.preventDefault();onSubmit(event);}}> 
                                    
            <ContasForm onChange={(contas) => { setValues({...values, contas})}}/>
            <ReplicarAnuncioForm/>
            
            { values.contas? 
                <>
                    <TipoAnuncioForm contas={values.contas} categoria={values.categoriaId} onChange={listing_type_id=>setValues({...values, anuncio: {...values.anuncio, listing_type_id}})}/>
                    <CategoriasForm onChange={(category_id) => setValues({...values, categoriaId:category_id, anuncio: {...values.anuncio, category_id}})}/>                
                    <FieldsetLegend legend={"Anuncio"} id={"check-anuncio-fieldset"} classe="anuncio">                                              
                        <AnuncioForm 
                            onChangeTitulo={title => setValues({...values, anuncio: {...values.anuncio, title}})} 
                            onChangeSubTitulo={subtitle=>setValues({...values, anuncio: {...values.anuncio, subtitle}})}/>                
                        <MoedaForm onChangePreco={price => setValues({...values, anuncio: {...values.anuncio, price}})} />                
                        <EstoqueForm onChange={available_quantity=>setValues({...values, anuncio: {...values.anuncio, available_quantity}})}/>                                                                                  
                        <AtributosForm categoria={values.categoriaId} onChange={setAtributo}/>                                
                        <ImagensForm id="check-imagens-fieldset" classe="imagens" onChange={pictures=>setValues({...values, anuncio: {...values.anuncio, pictures:pictures.map(i => {return {id:i}})}})}/>                                                
                        {console.log(values.anuncio)}
                        <DescricaoForm/>
                        <GarantiasForm 
                            setTipoGarantia={setGarantia} setTempoGarantia={setGarantia} categoria={values.categoriaId}/>
                        <VariacoesForm categoria={values.categoriaId} onChange={variations=>setValues({...values, anuncio: {...values.anuncio, variations}})}/>                                         
                    </FieldsetLegend>    
                </>
             : null }
            <input className="botao-publicar" type="submit"/>                                
        </form>        
    )
}
export default Publicar
