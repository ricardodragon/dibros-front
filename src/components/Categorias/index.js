import axios from 'axios';
import { useEffect, useState } from 'react';

function Categorias(){
    
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState({});

    const getCategorias = async () => 
        setCategorias(categorias.concat((await axios.get('http://localhost:8080/categorias/MLB')).data));

    useEffect(() => { getCategorias() }, []);

    return (
        <>
            <label htmlFor="categoria">Categoria : </label>  
            <select name="categoria" id="categoria">
                {   
                    categorias.map((value, index) => {
                        return (
                            <option key={index} name="index" value="index">{value.name}</option>
                        )
                    })
                }
            </select>
        </>
    )
}

export default Categorias
