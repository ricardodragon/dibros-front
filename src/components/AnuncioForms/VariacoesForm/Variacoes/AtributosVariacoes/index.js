
import { useState } from "react"
import LabelInput from "../../../../LabelInput"
import "./atributosVariacoes.css"
function AtributosVariacoes(props){    
    const [values, setValues] = useState({atributos:[]})

    const excluirAtributo = (event, index) => {
        event.preventDefault();
        const atributos = values.atributos.filter((atributo, i) => i!=index)        
        setValues({...values, atributos});    
        props.onChange(atributos);  
    };

    const addAtributo = (event)=>{
        event.preventDefault();
        const atributos = values.atributos.concat([
            props.atributos.filter((value) => value.tags.allow_variations && value.id==values.nomeAtributo).length>0?
                {id:values.nomeAtributo, value_name:""}:
                {name:values.nomeAtributo, value_name:""}
        ])            
        setValues({...values, atributos});    
        props.onChange(atributos);    
    }

    const setAtributoValue = (index, value_name) => {                
        const atributos = values.atributos.map((atributo, i) => index==i?{...atributo, value_name}:atributo);
        setValues({...values, atributos});    
        props.onChange(atributos);     
    }

    return(        
        <>           
            <LabelInput label="Atributo personalizavel : " id="nome_atributo" list="atributos-variacao" type="text" onChange={(nomeAtributo)=>setValues({...values,nomeAtributo})}/>                                                                 
            <datalist id="atributos-variacao">
                {props.atributos.filter((value) => value.tags.allow_variations).map((value, index) => 
                    <option key={index} value={value.id}>{value.name}</option>)}
            </datalist>      

            <input type="submit" value="Adicionar Atributo" className="botao-add-atributo" onClick={addAtributo}/><br/><br/>                        
            
            {values.atributos.map((atributo, index) => 
                <>
                    <LabelInput label={atributo.name?atributo.name:atributo.id} id={atributo.id?atributo.id:atributo.name} type="text" onChange={(value)=>setAtributoValue(index, value)}/>                        
                    <input type="submit" value="Excluir Atributo" className="botao-excluir-atributo" onClick={event=>excluirAtributo(event, index)}/>
                </>
            )}                           
        </>
    )
}

export default AtributosVariacoes