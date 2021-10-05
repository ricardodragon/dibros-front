import { useState } from "react";
import FieldsetLegend from "../../FieldsetLegend";
import "./imagensForm.css"

function ImagensForm(props){
    const [values, setValues] = useState({files:[]})

    const setImages = (event)=>{ 
        const files = [];     
        Array.from(event.target.files).forEach(file => files.push(URL.createObjectURL(file))                                           )                                  
        setValues({...values,files})                    
    }

    return(
        <FieldsetLegend legend={"Imagens"} id={"check-imagens-fieldset"} classe="imagens">              
            <input accept="image/*" type="file" multiple onChange={setImages}/>
            {
                values.files.map(file =><img alt="" height="200" width="200" src={file}/>)
            }
        </FieldsetLegend>
    )
}

export default ImagensForm