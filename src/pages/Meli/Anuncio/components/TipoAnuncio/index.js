import axios from "axios";
import { useEffect, useState } from "react";
import LabelSelect from "../../../../../estrutura/LabelSelect";

function TipoAnuncio(props){

    const [values, setValues] = useState({tiposAnuncio:[]});
    const host = process.env.REACT_APP_URL;

    useEffect(() => 
        axios.get('/meli/contas/'+props.conta.id+'/'+props.categoria).then(res=> setValues({tiposAnuncio:res.data}))
    , [props.categoria, props.conta, host]);

    return(  
        <div key={props.key}>  
            <h5 className="h3">Tipo do Anuncio</h5>
            <div style={{padding:'1.5em'}}>                             
                <LabelSelect 
                    label={props.conta.email} id="tipo-anuncio" required={true}
                    lista={values.tiposAnuncio} name="name" onChange={value => props.onChange(values.tiposAnuncio[value].id)}/>                                                 
            </div>
            <hr/>
        </div>
    )
    
}export default TipoAnuncio