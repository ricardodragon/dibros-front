import { useState } from "react";


function LabelInput(props){
    const [values, setValues] = useState({})

    return (
        <>
            <label htmlFor={props.id} style={{padding: "1%", fontWeight: "bolder"}} >{props.label}</label>
            <input id={props.id} placeholder={props.placeholder} type={props.type} onChange={(event) => {}}/>
        </>
    )
}

export default LabelInput