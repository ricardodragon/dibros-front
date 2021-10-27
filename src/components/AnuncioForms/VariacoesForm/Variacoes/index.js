import axios from "axios";
import { useEffect, useState } from "react";
import LabelInput from "../../../LabelInput";
import LabelSelect from "../../../LabelSelect";
import ImagensForm from "../../ImagensForm";
import AtributosVariacoes from "./AtributosVariacoes";
import "./variacoes.css"

function Variacoes(props){

    const [values, setValues] = useState({atributos:[], atributosVariacao:[], attributes:[], imagens:[]});
    
    const setImagens = (imagens) => setValues({...values, imagens})
    
    const setAtributosVariacao = (atributo) => {                          
        const atributosVariacao = [atributo].concat(values.atributosVariacao)
        setValues({...values,atributosVariacao})                            
    }

    const excluirAtributo = function(event, indexAtributo){        
        const atributosVariacao = values.atributosVariacao.filter((atributo, index) => index!=indexAtributo)
        setValues({...values, atributosVariacao})        
    }

    async function setAtributos(){                                                    
        setValues({
            ...values, 
            atributos:(await axios.get('http://localhost:8080/atributos/'+props.categoria)).data
        })               
    }useEffect(() => setAtributos() ,[props.categoria]); 

    const setAttributes = (a, atributo) => {
        const attributes = values.attributes.filter(value => value.id != atributo.id)
        attributes.push({id:atributo.id, value_name:a})               
        setValues({...values, attributes})
    }    

    const addVariacao = event => { 
        event.preventDefault()
        const variacao = {
            ...values.variacao, 
            attributes:values.attributes, 
            pictures: values.imagens,
            attribute_combinations: values.atributosVariacao
        }                        
        setValues({...values, variacao})
        props.addVariacao(variacao)         
    }

    return (
        <>                 
            <AtributosVariacoes 
                atributos={values.atributos.filter((value) => value.tags.allow_variations)} 
                onClick={setAtributosVariacao} excluirAtributo={excluirAtributo} 
                atributosVariacao={values.atributosVariacao} />                        
            
            <LabelInput label="Preço : " id="preco_variacao" type="number" onChange={valor=>setValues({...values, variacao:{...values.variacao, price:valor}})}/>                                         
            <LabelInput label="Quantidade disponível : " id="qtd_disponivel_varicao" type="number" onChange={valor=>setValues({...values, variacao:{...values.variacao, available_quantity:valor}})}/>                                                                                                                                                              
            {
                values.atributos.filter((value) => value.tags.variation_attribute).map((atributo, index) => {                    
                    if(atributo.value_type=="boolean")
                        return <LabelSelect id={atributo.id+"-"+props.variacao} lista={atributo.values} value="id" name="name" label={atributo.name} onChange={(event)=>{}}/>                        
                    return <span>                        
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
                })
                
            }
            <ImagensForm id="check-imagens-variacao-fieldset" classe="imagens-variacao" setImagens={imagens=>setImagens(imagens)}/>
            <input type="submit" value="Adicionar Variação" className="botao-add-variacao" onClick={event=>addVariacao(event)}/>                                            
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