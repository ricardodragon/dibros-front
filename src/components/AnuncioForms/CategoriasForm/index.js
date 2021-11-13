import { useState } from 'react';
import FieldsetLegend from '../../FieldsetLegend';
import Categorias from './Categorias';
import "./categoriasForm.css"


function CategoriasForm(props){
    const [values, setValues] = useState({})

    return (
        <FieldsetLegend legend={"Categoria"} id={"check-categorias-fieldset"} classe="categorias">                                                         
            <Categorias onChange={props.onChange}/>        
        </FieldsetLegend>
    )
}

export default CategoriasForm