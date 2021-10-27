import { useState } from "react"
import LabelInput from "../../../../LabelInput"
import "./atributosVariacoes.css"
function AtributosVariacoes(props){    
    const [values, setValues] = useState({atributos:[]})

    const excluirAtributo = (event, index) => {event.preventDefault();props.excluirAtributo(event, index)};
    return(        
        <>           
            <LabelInput label="Nome do atributo : " id="nome_atributo" list="atributos-variacao" type="text" onChange={(nomeAtributo)=>setValues({...values,nomeAtributo})}/>                                                                 
            <datalist id="atributos-variacao">
                {props.atributos.filter((value) => value.tags.allow_variations).map((value, index) => 
                    <option key={index} value={value.id}>{value.name}</option>)}
            </datalist>
            <LabelInput label="Valor do atributo : " id="valor_atributo" type="text" onChange={(valorAtributo)=>setValues({...values,valorAtributo})}/>                                         
            <input type="submit" value="Adicionar Atributo" className="botao-add-atributo" onClick={(event)=>{
                event.preventDefault();
                props.atributos.filter((value) => value.tags.allow_variations && value.id==values.nomeAtributo).length>0?
                    props.onClick({id:values.nomeAtributo, value_name:values.valorAtributo}):props.onClick({name:values.nomeAtributo, value_name:values.valorAtributo});
            }}/>            
            <div style={{borderBottom: "1px dotted rgba(0, 0, 0)"}}>
                {
                    props.atributosVariacao.map((atributo, index)=>                        
                        <span style={{padding:"2%", whiteSpace: "normal"}}>
                            <label style={{fontWeight: "bold"}}>{atributo.name?atributo.name:atributo.id} : </label>{atributo.value_name} 
                            <input type="submit" value="X" className="botao-excluir-variacao" onClick={event=>excluirAtributo(event, index)}/>
                        </span>)
                }                                                            
            </div>
        </>
    )
}

export default AtributosVariacoes