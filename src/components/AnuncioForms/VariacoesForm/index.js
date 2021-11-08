
import { useState } from "react"
import FieldsetLegend from "../../FieldsetLegend"
import Variacoes from "./Variacoes/index.js"
import "./variacoesForm.css"

function VariacoesForm(props){

    const [values, setValues] = useState({variacoes:[], index:0})

    const addVariacao = function(variacao){     
        const variacoes = values.variacoes.concat(variacao)
        setValues({...values, variacoes})
        props.onChange(variacoes)
    }

    const excluirVariacao = function(){} 

    return (
        <FieldsetLegend legend={"Variacões"} id={"check-variacoes-fieldset"} classe="variacoes">
            <Variacoes categoria={props.categoria} index={values.index} addVariacao={addVariacao}/>
            <ul>                
                {
                    values.variacoes.map((variacao, index) => 
                        <li>
                            {index+1} 
                            <input type="submit" value="Editar Variacao" className="botao-editar-variacao" onClick={(event)=>{}}/>   
                            <input type="submit" value="Excluir Variacao" className="botao-excluir-variacao" onClick={(event)=>setValues({...values, variacoes: values.variacoes.filter((value, i)=>index!=i)})}/>                        
                        </li>)                    
                }
            </ul>            
        </FieldsetLegend>        
    )
}

export default VariacoesForm