
function LabelSelect(props){

    return (
        <div>           
            <label className="p-1" htmlFor={props.id}>{props.label}</label>
            <select required={props.required} className='form-control form-control-sm' disabled={props.disabled} onChange={(event) => {event.preventDefault();props.onChange(event.target.value)}} id={props.id}>                                                            
                <option selected></option>
                {   
                    props.lista.map((value, index) => {                        
                        return (
                            <option key={index} selected={value.selected} value={index}>{value.name}</option>
                        )
                    })
                }
            </select>            
        </div>
    )
}

export default LabelSelect