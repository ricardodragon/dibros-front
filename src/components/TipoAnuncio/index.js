import axios from "axios";
import { useEffect, useState } from "react";

function TipoAnuncio(props){
    const [values, setValues] = useState({tiposAnuncio:[]});

    const getTiposAnuncio = async () => {
        console.log (props.categoria)
        setValues({
            ...values, 
            tiposAnuncio: (await axios.get('http://localhost:8080/conta/'+props.userMeliId+'/'+props.categoria)).data
        })
    }
    useEffect(() => getTiposAnuncio(), []);

    return(                                
        <select name="tipo_anuncio" id="tipo_anuncio">
            {   
                values.tiposAnuncio.map((value, index) => {
                    return (
                        <option key={index} name="index" value="index">{value.name}</option>
                    )
                })
            }
        </select>            
    )
}export default TipoAnuncio