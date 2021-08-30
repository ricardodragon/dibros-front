import axios from 'axios';
import { useEffect, useState } from 'react';

function Categorias(){
    
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState({});

    const getCategorias = async () => {
        setCategorias(categorias.concat((await axios.get('http://localhost:8080/categorias/MLB')).data));
        console.log(categorias)
    }

    useEffect(() => { getCategorias() }, []);

    return (
        <>
            <label for="categoria">Categoria : </label>  
            <select name="categoria" id="categoria">
                {   
                    categorias.map((value, index) => {
                        return (
                            <option name="index" value="index">{value.name}</option>
                        )
                    })
                }
            </select>
        </>
    )
}

export default Categorias
