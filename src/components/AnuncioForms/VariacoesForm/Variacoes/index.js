import { useEffect, useState } from "react";
import LabelInput from "../../../LabelInput";
import Atributos from "../../AtributosForm/Atributos";
import ImagensForm from "../../ImagensForm";
import "./variacoes.css"

function Variacoes(props){

    const [values, setValues] = useState({variation:{pictures:[], picture_ids:[], attribute_combinations:[]}});            
    
    const setVariation = () =>         
        setValues({...values, variation:props.value!=undefined?props.value:values.variation})    
    useEffect(() => setVariation() ,[props.value]);         

    const setAtributoValue = (index, value_name) => {   
        const variation = values.variation;
        variation.attribute_combinations[index].value_name = value_name   
        props.onChange(variation)                        
    }
    
    return (
        <>                        
            {values.variation.attribute_combinations.map((atributo, index) =>                 
                <LabelInput 
                    value={atributo.value_name} label={atributo.name?atributo.name+" :":atributo.id+" :"} 
                    id={atributo.id?atributo.id:atributo.name} type="text" 
                    onChange={value=>setAtributoValue(index, value)}/>                                                            
            )}     
            
            <LabelInput 
                value={values.variation.price} label="Preço :" id="preco_variacao" type="number" 
                onChange={price=>props.onChange({...values.variation, price})}/>                                                         

            <LabelInput 
                value={values.variation.available_quantity} label="Qtd :" 
                id="qtd_disponivel_varicao" type="number" 
                onChange={available_quantity=>props.onChange({...values.variation, available_quantity})}/>
                                             
            <Atributos variacao={true} value={values.variation.attributes?values.variation.attributes:[]} onChange={atributo=>props.onChange(values.variation)} categoria={props.categoria}/>
            <br/>            
            <ImagensForm 
                value={values.variation.picture_ids}                 
                onChange={picture_ids=>props.onChange({...values.variation, picture_ids:picture_ids})}/>
            {/* <input style={{marginLeft:"80%"}} type="button" value="Confirmar" className="botao-add-variacao" onClick={(event)=>event.preventDefault();props.onChange(values.variation);}/>                                             */}
            
        </>
    )
}

export default Variacoes