import axios from "axios";
import { useEffect, useState } from "react";
import LabelSelect from "../../../LabelSelect";

function TipoAnuncio(props){

    const [values, setValues] = useState({tiposAnuncio:[]});

    const setTiposAnuncio = async() =>             
        setValues({
            ...values, 
            tiposAnuncio: (await axios.get('http://localhost:8080/conta/'+props.conta.id+'/'+props.categoria)).data
        })

    useEffect(() => 
        setTiposAnuncio()
    , [props]);

    return(  
        <LabelSelect 
            label={props.conta.email} id="tipo-anuncio" 
            lista={values.tiposAnuncio} name="name" onChange={(event) => props.onChange(JSON.parse(event.target.value).id)}/>                                                 
    )
}export default TipoAnuncio