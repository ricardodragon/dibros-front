import axios from "axios";
import { useEffect, useState } from "react";
import LabelSelect from "../../Estrutura/LabelSelect";

function TipoAnuncio(props){

    const [values, setValues] = useState({tiposAnuncio:[]});

    const setTiposAnuncio = async() =>           
        setValues({
            ...values, 
            tiposAnuncio: (await axios.get('http://localhost:8080/meli/contas/'+props.conta.id+'/'+props.categoria)).data
        })

    useEffect(() => 
        setTiposAnuncio()
    , [props.categoria]);

    return(  
        <>            
            <label  style={{fontWeight:"bold", paddingLeft:"1%"}}>Tipo do Anuncio : </label>
            <LabelSelect 
                label={props.conta.email} id="tipo-anuncio" 
                lista={values.tiposAnuncio} name="name" onChange={value => props.onChange(values.tiposAnuncio[value].id)}/>                                                 
        </>
    )
    
}export default TipoAnuncio