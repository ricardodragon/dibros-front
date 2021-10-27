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
        <span style={{whiteSpace: "nowrap"}}>
            <label htmlFor={props.id} style={{padding: "1%", fontWeight: "bolder"}} >{props.label}</label>
            <input id={props.id} placeholder={props.placeholder} type={props.type} list={props.list} onChange={onChange}/>
        </span>
    )
}

export default LabelInput