
import axios from "axios";
import { useEffect, useState } from "react"
import LabelInput from "../../LabelInput";
import "./atributosVariacoes.css"
function AtributosVariacoesForm(props){    
    const [values, setValues] = useState({atributos:[], attribute_combinations:[]})
    
    const addAtributo = (event)=>{
        event.preventDefault();                    
        props.onChange(values.atributos.filter((value) => value.id==values.nomeAtributo)>0?
            {id:values.nomeAtributo}:
            {name:values.nomeAtributo}
        );    
    }

    const excluirAtributo = (event, index) =>{
        event.preventDefault();        
        props.excluirAtributo(index);
    }    

    const setAtributos = async () => setValues({
        ...values, 
        atributos:props.value.categoria!=undefined?(await axios.get('http://localhost:8080/meli/atributos/'+props.value.categoria)).data.filter(value=>value.tags.allow_variations):values.atributos,
        attribute_combinations: props.value.attribute_combinations        
    });useEffect(() =>setAtributos(), [props.value]);

    return(        
        <>       
            {values.attribute_combinations.map((atributo, index) => 
                <>
                    <LabelInput value={atributo.name} label={""} id={atributo.name} type="text" onChange={value=>props.onChange(value, index)}/>                                            
                    <input type="submit" value="Excluir" className="botao-excluir-atributo" onClick={event=>excluirAtributo(event, index)}/>
                </>
            )}          

            <LabelInput label="Atributo personalizavel : " id="nome_atributo" list="atributos-variacao" type="text" onChange={(nomeAtributo)=>setValues({...values,nomeAtributo})}/>                                                                 
            <datalist id="atributos-variacao">
                {values.atributos.map((value, index) => 
                    <option key={index} value={value.id}>{value.name}</option>)}
            </datalist>      

            <input type="submit" value="Adicionar Atributo" className="botao-add-atributo" onClick={addAtributo}/><br/>                                                                       
        </>
    )
}

export default AtributosVariacoesForm