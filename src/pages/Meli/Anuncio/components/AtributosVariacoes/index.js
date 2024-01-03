
import axios from "axios";
import { useEffect, useState } from "react"
import "./atributosVariacoes.css"

function AtributosVariacoes(props){    
    const [values, setValues] = useState({atributos:[], novoAtributo:''})
    const host = "https://dibros.ddns.net:7080";

    const addAtributo = (event)=>{
        event.preventDefault();                          
        props.onChange({id: undefined, name: values.novoAtributo, value_id: '', value_name: ''}, props.attribute_combinations.length)                              
    }
      
    useEffect(() => props.categoria!==undefined?
        axios.get(host+'/meli/atributos/'+props.categoria).then(res=> res.data.filter(value=>value.tags.allow_variations)):undefined
    , [props.categoria, host]);

    return(        
        <span >                   
            
            <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"20%", fontWeight:"bold"}} disabled={values.disabled} htmlFor="variations-price">Atributo : </label>
            <input list="atributos-variacao" size={"8"} disabled={props.disabled} style={{width:"45%", marginRight:"5%"}} type="text" placeholder="Adicione atributos" id="nome_atributo" onChange={(novoAtributo)=>setValues({...values,novoAtributo})}/>                                                
            <datalist id="atributos-variacao">
                {values.atributos.map((value, index) => 
                    <option key={index} value={value.id}>{value.name}</option>)}
            </datalist>                   
            <button disabled={props.disabled} className="btn btn-sm btn-success" style={{width:"30%"}} onClick={addAtributo}>Adicionar</button>                                                                       

            {props.attribute_combinations.map((atributo, index) => 
                <div key={index}>
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"20%", fontWeight:"bold"}} disabled={values.disabled} htmlFor="variations-price">{atributo.name+" :"}</label>
                    <input value={atributo.name} required={true} disabled={props.disabled} size={"8"} style={{width:"45%", marginRight:"5%"}} type="text" placeholder={"Digite a/o : "+atributo.name} id={atributo.name} onChange={value=>props.onChange({name:value, id:null},index)}/>                                                                                                               
                    <button disabled={props.disabled} className="btn btn-sm btn-danger" style={{width:"30%"}} onClick={event=>{event.preventDefault();props.onChange(undefined, index)}}>Excluir</button>                                                                       
                </div>
            )}                 
        </span>
    )
}

export default AtributosVariacoes