
import axios from "axios";
import { useEffect, useState } from "react"
import LabelInput from "../../../../../estrutura/LabelInput";
import "./atributosVariacoes.css"

function AtributosVariacoes(props){    
    const [values, setValues] = useState({atributos:[], novoAtributo:''})
    const dominio = process.env.REACT_APP_MELI_DOMAIN;

    const addAtributo = (event)=>{
        event.preventDefault();                          
        props.onChange({id: undefined, name: values.novoAtributo, value_id: '', value_name: ''}, props.attribute_combinations.length)                              
    }
      
    const setAtributos = async () => setValues({
        ...values, 
        atributos:props.categoria!==undefined?(await axios.get(dominio+'/store/atributos/'+props.categoria)).data.filter(value=>value.tags.allow_variations):values.atributos        
    });useEffect(() =>setAtributos(), [props.category_id]);

    return(        
        <div className="row">                   
            <div className="col">
                <LabelInput size={"8"}  disabled={props.disabled} label="Atributo" id="nome_atributo" list="atributos-variacao" type="text" onChange={(novoAtributo)=>setValues({...values,novoAtributo})}/>                                                                 
                <datalist id="atributos-variacao">
                    {values.atributos.map((value, index) => 
                        <option key={index} value={value.id}>{value.name}</option>)}
                </datalist>   
                <button disabled={props.disabled} className="w-100 btn btn-sm btn-success" onClick={addAtributo}>Adicionar</button><br/>                                                                       
            </div>
            {props.attribute_combinations.map((atributo, index) => 
                <div className="col">
                    <LabelInput required={true} disabled={props.disabled} size={"8"} value={atributo.name} label={atributo.name} id={atributo.name} type="text" onChange={value=>props.onChange({name:value, id:null},index)}/>                                            
                    <button disabled={props.disabled} className="w-100 btn btn-sm btn-danger" onClick={event=>{event.preventDefault();props.onChange(undefined, index)}}>Excluir</button>
                </div>
            )}                 
        </div>
    )
}

export default AtributosVariacoes