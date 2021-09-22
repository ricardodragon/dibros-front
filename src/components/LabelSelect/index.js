import { useState } from "react";


function LabelSelect(props){
    const [values, setValues] = useState({})

    return (
        <>
            <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor={props.id}>{props.label}</label>
            <select onChange={(event) => {props.onChange(event, props.id)}} id={props.id} >
                {/* (event)=>{addCategoria(event, index)}}> */}
                <option selected></option>
                {   
                    props.lista.map((value, index) => {                        
                        return (
                            <option value={value[props.value]}>{value[props.name]}</option>
                        )
                    })
                }
            </select>
            
        </>
    )
}

export default LabelSelect