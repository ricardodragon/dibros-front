import axios from "axios";
import { useEffect, useState } from "react";

function TipoAnuncio(){
    const [tiposAnuncio, setTiposAnuncio] = useState([]);
    const [tipoAnuncio, setTipoAnuncio] = useState({});

    const getTiposAnuncio = async () => 
        setTiposAnuncio(tiposAnuncio.concat((await axios.get('http://localhost:8080/categorias/MLB5095/listing_types')).data));

    useEffect(() => { getTiposAnuncio() }, []);

    return(
        <div>
            <span style={{float: "left", width: "62%", padding: "1%"}}>
                <label htmlFor="tipo_anuncio">Tipo de anuncio : </label>
                <select name="tipo_anuncio" id="tipo_anuncio">
                    {   
                        tiposAnuncio.map((value, index) => {
                            return (
                                <option key={index} name="index" value="index">{value.name}</option>
                            )
                        })
                    }
                </select>
            </span>
        </div>
    )
}export default TipoAnuncio