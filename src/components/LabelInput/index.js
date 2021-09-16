import { useState } from "react";


function LabelInput(props){
    const [values, setValues] = useState({})

    return (
        <>
            <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor={props.id}>{props.label}</label>
            <input id={props.id} placeholder={props.placeholder} type={props.type} onChange={(event) => {}}/>
        </>
    )
}

export default LabelInput