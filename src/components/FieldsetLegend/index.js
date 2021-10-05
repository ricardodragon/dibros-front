import { useState } from "react";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import "./fieldsetLegend.css"

function FieldsetLegend(props){
    const [values, setValues] = useState({})

    return (
        <p style={{padding: "1%"}}> 
            <fieldset >                            
                <input type="checkbox" id={props.id} style={{}}/>
                <legend className={"seta-direita-"+props.classe}>                    
                    <label htmlFor={props.id}>{props.legend}<FaCaretRight/></label>                    
                </legend>
                <legend className={"seta-baixo-"+props.classe}>                    
                    <label htmlFor={props.id}>{props.legend}<FaCaretDown/></label>                    
                </legend>
                <p className={"conteudo-"+props.classe+"-form"}>                
                    {props.children}                
                </p>
            </fieldset>
        </p>         
    )
}

export default FieldsetLegend