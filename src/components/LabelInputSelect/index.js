import { useState } from "react";
import LabelInput from "../LabelInput";


function LabelInputSelect(props){
    const [values, setValues] = useState({})

    return (
        <>
            <LabelInput />
            <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor={props.id}>{props.label} : </label>
            
            <select onChange={(event) => props.onChange(event, props.index)} id={props.id} >                
                <option selected></option>
                {   
                    props.lista.map((value, index) => {                        
                        return (
                            <option key={index} name={index} value={value[props.value]}>{value[props.name]}</option>
                        )
                    })
                }
            </select>            
        </>
    )
}

export default LabelInputSelect