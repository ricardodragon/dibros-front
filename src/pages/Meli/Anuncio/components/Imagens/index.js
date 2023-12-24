import { useEffect, useState } from "react";
import axios from "axios";
import "./imagens.css"

function Imagens(props){

    const [values, setValues] = useState({pictures:[]})
    const host = window.location.protocol+ "//" + window.location.hostname+":7080";

    const onChange = async (event)=>{  
        event.preventDefault();   
        const pictures = values.pictures;   
        var formData = new FormData();
        formData.append('files', event.target.files[0]);
        pictures.push((await axios.post(host+'/meli/anuncios/imagens/229790949', formData)).data);                                                                       
        props.onChange(pictures);
    }

    const excluir = (id) => {                     
        const pictures = values.pictures.filter(img=>img.id!==id);                                  
        props.onChange(pictures);
    }                        
    
    useEffect(() => props.value!==undefined?setValues({pictures:props.value}):undefined, [props.value])

    return(        
        <div style={{padding:'1.5em'}}>                 
            <input accept="image/*" disabled={props.disabled} type="file" onChange={onChange}/>                                        
            <div style={{display: "flex"}}>
                {values.pictures.map((imagem, index) =>{
                    return<div key={index} className="row" style={{boxSizing:"content-box"}}>                        
                        <img style={{height:'4em', width:'4em'}} src={imagem.url?imagem.url:imagem.variations[0].url} alt="" />
                        <button disabled={props.disabled} className="w-100 btn btn-sm btn-danger" onClick={event=>{event.preventDefault();excluir(imagem.id);}}>X</button>
                    </div>                     
                })}
            </div>            
        </div>
    )
}

export default Imagens
