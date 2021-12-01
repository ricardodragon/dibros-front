import axios from "axios";
import { useEffect, useState } from "react";
import LabelInput from "../../../LabelInput";
import ImagensForm from "../../ImagensForm";
import AtributosVariacoes from "./AtributosVariacoes";
import "./variacoes.css"

function Variacoes(props){

    const [values, setValues] = useState({atributos:[], attributes:[]});    
    

    async function setAtributos(){                                                    
        setValues({
            ...values, 
            atributos:(await axios.get('http://localhost:8080/atributos/'+props.categoria)).data
        })               
    }useEffect(() => setAtributos() ,[props.categoria]); 

    const setAttributes = (value_name, atributo) => {
        const attributes = values.attributes.filter(value => value.id != atributo.id)
        attributes.push({id:atributo.id, value_name})               
        setValues({...values, attributes})
    }    

    const addVariacao = event => { 
        event.preventDefault()
        const variacao = {...values.variacao, attributes:values.attributes}                                
        setValues({...values, variacao})
        props.addVariacao(variacao)         
    }

    return (
        <>                                       

            <AtributosVariacoes 
                atributos={values.atributos.filter((value) => value.tags.allow_variations)} 
                onChange={attribute_combinations=>setValues({...values, variacao:{...values.variacao, attribute_combinations}})}
                autoComplete={props.autoComplete}/>                                                          
                        
            <LabelInput label="Preço : " id="preco_variacao" type="number" onChange={price=>setValues({...values, variacao:{...values.variacao, price}})}/>                                         
            <LabelInput label="Quantidade disponível : " id="qtd_disponivel_varicao" type="number" onChange={available_quantity=>setValues({...values, variacao:{...values.variacao, available_quantity}})}/>                                                                                                                                                                                      
                         
            {
                values.atributos.filter((value) => value.tags.variation_attribute).map((atributo, index) => 
                    <span>                        
                        <LabelInput 
                            label={atributo.name} id={atributo.id+"-"+props.variacao} type="text" 
                            list={atributo.id+"-"+index+"-"+props.variacao} value={atributo.value} 
                            onChange={a=>setAttributes(a, atributo)}/>                        
                        
                        <datalist id={atributo.id+"-"+index+"-"+props.variacao}>
                            {atributo.values?   
                                atributo.values.map((value, index) => 
                                    <option value={value.name} key={index}/>):""}                                                        
                        </datalist>
                    </span>
                )                                
            }
            <ImagensForm id="check-imagens-variacao-fieldset" classe="imagens-variacao" onChange={picture_ids=>setValues({...values, variacao:{...values.variacao, picture_ids}})}/>                        
            <input type="button" value="Adicionar Variação" className="botao-add-variacao" onClick={event=>addVariacao(event)}/>                                            
        </>
    )
}

export default Variacoes


// {  
//     "id":"EAN",
//     "value_name":"9780471117094"
//  }

// {        
//     "picture_ids": [
//         "833400-MLB44247818982_122020"
//     ],
//     "attribute_combinations": [
//         {
//             "id": null,
//             "name": "Celular",
//             "value_id": null,
//             "value_name": "iPhone 11 Pro Max",
//             "value_struct": null,
//             "values": [
//                 {
//                     "id": null,
//                     "name": "iPhone 11 Pro Max",
//                     "struct": null
//                 }
//             ]
//         },
//         {
//             "id": "COLOR",
//             "name": "Cor",
//             "value_id": "52007",
//             "value_name": "Amarelo",
//             "value_struct": null,
//             "values": [
//                 {
//                     "id": "52007",
//                     "name": "Amarelo",
//                     "struct": null
//                 }
//             ]
//         }
//     ]
// }