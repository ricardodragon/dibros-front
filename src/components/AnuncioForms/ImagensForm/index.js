import { useState } from "react";
import FieldsetLegend from "../../FieldsetLegend";
import "./imagensForm.css"

function ImagensForm(props){
    const [values, setValues] = useState({files:[]})

    const setImagens = (event)=>{                 
        setValues({...values, files:Array.from(event.target.files).map(file => URL.createObjectURL(file))});          
        props.setImagens(event.target.files)                  
    }

    return(
        <FieldsetLegend legend={"Imagens"} id={props.id} classe={props.classe}>              
            <input className="botao-add-atributo" accept="image/*" type="file" multiple onChange={setImagens}/>
            {values.files.map(file =><img alt="" height="100" width="100" src={file}/>)}
        </FieldsetLegend>
    )
}

export default ImagensForm