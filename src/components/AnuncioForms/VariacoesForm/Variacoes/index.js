import LabelInput from "../../../Estrutura/LabelInput";
import Atributos from "../../AtributosForm/Atributos";
import Imagens from "../../Imagens";
import "./variacoes.css"

function Variacoes(props){
    
    const setAtributoValue = (index, value_name) => {   
        const variation = props.value;
        variation.attribute_combinations[index].value_name = value_name   
        props.onChange(variation)                        
    }
    
    return (
        <>                        
            {props.value.attribute_combinations.map((atributo, index) =>                 
                <LabelInput 
                    disabled={props.disabled}
                    value={atributo.value_name} label={atributo.name?atributo.name+" : ":atributo.id+" : "} 
                    id={atributo.id?atributo.id:atributo.name} type="text" 
                    onChange={value=>setAtributoValue(index, value)}/>                                                            
            )}     
            
            <LabelInput 
                disabled={props.disabled}
                value={props.value.price} label="Preço :" id="preco_variacao" type="number" 
                onChange={price=>props.onChange({...props.value, price})}/>                                                         

            <LabelInput 
                disabled={props.disabled}
                value={props.value.available_quantity} label="Qtd :" 
                id="qtd_disponivel_varicao" type="number" 
                onChange={available_quantity=>props.onChange({...props.value, available_quantity})}/>
                                             
            <Atributos disabled={props.disabled} variacao={true} value={props.value.attributes?props.value.attributes:[]} onChange={atributo=>props.onChange(props.value)} categoria={props.categoria}/>
            <br/>            
            <Imagens
                disabled={props.disabled}
                value={props.value.picture_ids}                           
                onChange={picture_ids=>props.onChange({...props.value, picture_ids:picture_ids})}/>                        
        </>
    )
}

export default Variacoes