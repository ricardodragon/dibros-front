import { useEffect, useState } from "react";
import axios from "axios";
import "./imagensForm.css"

function ImagensForm(props){

    const [values, setValues] = useState({pictures:[]})

    const onChange = async (event)=>{  
        event.preventDefault();   
        const pictures = values.pictures;   
        var formData = new FormData();
        formData.append('files', event.target.files[0]);
        pictures.push((await axios.post('http://localhost:8080/meli/anuncios/imagens/229790949', formData)).data);                                                                       
        props.onChange(pictures);
    }

    const excluir = (id) => {                     
        const pictures = values.pictures.filter(img=>img.id!=id);                                  
        props.onChange(pictures);
    }

    const setPictures = () => 
        props.value!==undefined?            
            setValues({...values, pictures:props.value}):undefined                
    

    useEffect(() => setPictures(), [props.value])

    return(        
        <>                           
            <input className="botao-add-atributo" accept="image/*"  disabled={props.disabled} type="file" onChange={onChange}/>                        
            {values.pictures.map(imagem =>{ 
                    return <>
                        <img alt="" height="100" width="100" src={imagem.url?imagem.url:imagem.variations[0].url}/>
                        {!props.disabled?<input                         
                            value="X" className="botao-excluir-atributo" type="button" 
                            onClick={event=>{event.preventDefault();excluir(imagem.id);}}/>:null}
                    </>
                }
            )}
            
        </>
    )
}

export default ImagensForm
