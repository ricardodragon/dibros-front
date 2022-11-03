import { useEffect, useState } from "react";
import axios from "axios";
import "./imagens.css"

function Imagens(props){

    const [values, setValues] = useState({pictures:[]})
    const dominio = process.env.REACT_APP_MELI_DOMAIN
    
    const onChange = async (event)=>{  
        event.preventDefault();   
        const pictures = values.pictures;   
        var formData = new FormData();
        formData.append('files', event.target.files[0]);
        pictures.push((await axios.post(dominio+'/meli/anuncios/imagens/229790949', formData)).data);                                                                       
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
            <div style={{padding:'1.5em'}}>                       
                <input className="form-control form-control-sm m-2" accept="image/*" disabled={props.disabled} type="file" onChange={onChange}/>                                        
                <div className="row">
                    {values.pictures.map(imagem =>{
                        return<div className="row" style={{boxSizing:"content-box"}}>                        
                            <img style={{height:'4em', width:'4em'}} src={imagem.url?imagem.url:imagem.variations[0].url} alt="" />
                            <button disabled={props.disabled} className="w-100 btn btn-sm btn-danger" onClick={event=>{event.preventDefault();excluir(imagem.id);}}>X</button>
                        </div>                     
                    })}
                </div>
            </div>
            <hr/>
        </>
    )
}

export default Imagens
