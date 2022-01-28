import { useState } from "react";


function LabelSelect(props){
    const [values, setValues] = useState({})

    return (
        <span style={{whiteSpace: "nowrap"}}>            
            <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor={props.id}>{props.label}</label>
            <select disabled={props.disabled} onChange={(event) => {event.preventDefault();props.onChange(event.target.value)}} id={props.id}>                                                            
                <option selected></option>
                {   
                    props.lista.map((value, index) => {                        
                        return (
                            <option selected={value.selected} value={index}>{value.name}</option>
                        )
                    })
                }
            </select>            
        </span>
    )
}

export default LabelSelect