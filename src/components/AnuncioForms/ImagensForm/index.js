import { useState } from "react";
import FieldsetLegend from "../../FieldsetLegend";
import axios from "axios";
import "./imagensForm.css"

function ImagensForm(props){
    const [values, setValues] = useState({files:[]})

    const onChange = async (event)=>{  
        event.preventDefault();
        const files =  values.files;    
        var formData = new FormData();
        formData.append('files', event.target.files[0]);
        const id = (await axios.post('http://localhost:8080/anuncios/imagens/229790949', formData)).data
        files.push({id,file:URL.createObjectURL(event.target.files[0])})        
        setValues({...values, files});                                           
        props.onChange(files.map(imagem=>imagem.id));
    }

    const excluir = (id)=>{   
                  
        const files = values.files.map(file=>file.id!=id)     
        setValues({...values, files:values.files.filter(file=>file.id!=id)});                                
        props.onChange(files.map(imagem=>imagem.id).filter(imagem=>imagem!=id));
    }

    return(
        
        <FieldsetLegend legend={"Imagens"} id={props.id} classe={props.classe}>          
            <input className="botao-add-atributo" accept="image/*" type="file" onChange={onChange}/>
            {values.files.map(imagem =>{ 
                return <>
                    <img alt="" height="100" width="100" src={imagem.file}/>
                    <input 
                        className="botao-excluir-atributo" type="button" 
                        onClick={event=>{event.preventDefault();excluir(imagem.id);}}/>
                </>
                }
            )}
            
        </FieldsetLegend>
    )
}

export default ImagensForm
