import axios from "axios";
import { useEffect, useState } from "react";
import LabelSelect from "../../Estrutura/LabelSelect";

function TipoAnuncio(props){

    const [values, setValues] = useState({tiposAnuncio:[]});
    const dominio = "http://DESKTOP-DS0K2GT"
    
    const setTiposAnuncio = async() =>           
        setValues({
            ...values, 
            tiposAnuncio: (await axios.get(dominio+':8080/meli/contas/'+props.conta.id+'/'+props.categoria)).data
        })

    useEffect(() => 
        setTiposAnuncio()
    , [props.categoria]);

    return(  
        <>  
            <h5 className="h3">Tipo do Anuncio</h5>
            <div style={{padding:'1.5em'}}>                             
                <LabelSelect 
                    label={props.conta.email} id="tipo-anuncio" 
                    lista={values.tiposAnuncio} name="name" onChange={value => props.onChange(values.tiposAnuncio[value].id)}/>                                                 
            </div>
            <hr/>
        </>
    )
    
}export default TipoAnuncio