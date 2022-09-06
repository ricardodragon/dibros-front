
function LabelInput(props){

    // useEffect(() => {
    //     const timeOutId = setTimeout(() => setDisplayMessage(query), 500);
    //     return () => clearTimeout(timeOutId);
    // }, [query]);

    const onChange = event => {
        event.preventDefault();
        props.onChange(event.target.value)
    }

    return (
        <div className="row">
            <label htmlFor={props.id} className="col-6 col-form-label">{props.label}</label>
            <div className="col-6">
                <input readonly={props.readonly} placeholder={props.placeholder} list={props.list} onChange={onChange} value={props.value} id={props.id} disabled={props.disabled} required={props.required} step={props.step} size={props.size} type={props.type} className={props.className+" form-control form-control-sm"}/>            
            </div>
        </div>
    )
}

export default LabelInput