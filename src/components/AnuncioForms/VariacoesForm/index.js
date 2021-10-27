
import { useState } from "react"
import FieldsetLegend from "../../FieldsetLegend"
import Variacoes from "./Variacoes/index.js"
import "./variacoesForm.css"

function VariacoesForm(props){

    const [values, setValues] = useState({variacoes:[]})

    const addVariacao = function(variacao){     
        const variacoes = values.variacoes.concat(variacao)
        setValues({...values, variacoes})
        props.onChange(variacoes)
    }

    const excluirVariacao = function(){} 

    return (
        <FieldsetLegend legend={"Variacões"} id={"check-variacoes-fieldset"} classe="variacoes">
            <Variacoes categoria={props.categoria} index={0} addVariacao={addVariacao}/>
            <ul>                
                {
                    values.variacoes.map((variacao, index) => 
                        <li>
                            {index+1} 
                            <input type="submit" value="Editar Variacao" className="botao-editar-variacao" onClick={(event)=>{}}/>                        
                        </li>)                    
                }
            </ul>            
        </FieldsetLegend>        
    )
}

export default VariacoesForm