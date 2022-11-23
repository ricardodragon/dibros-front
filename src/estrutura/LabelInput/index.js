import { useEffect } from "react";

function 
LabelInput(props){

    // useEffect(() => {
    //     const timeOutId = setTimeout(() => setDisplayMessage(query), 500);
    //     return () => clearTimeout(timeOutId);
    // }, [query]);    

    const onChange = event => {
        event.preventDefault();
        props.onChange(event.target.value)
    }

    return (
        <>
            <label style={{whiteSpace:"nowrap"}} className="p-1" htmlFor={props.id}>{props.label}</label>            
            <input readonly={props.readonly} placeholder={props.placeholder} list={props.list} onChange={onChange} value={props.value} id={props.id} disabled={props.disabled} required={props.required} step={props.step} size={props.size} type={props.type} className={"form-control form-control-sm"}/>                        
        </>        
    )
}

export default LabelInput