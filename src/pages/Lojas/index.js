import axios from 'axios';
import React, { useEffect, useState } from 'react';
import LabelInput from "../../estrutura/LabelInput";
import { Link } from '@material-ui/core';


function Lojas(props) {
    
    const [values, setValues] = useState( {lojas:[], loja:{nome:"", imagemPath:"", imagens:{}}} )

    useEffect(() => 
        axios.get(process.env.REACT_APP_MELI_DOMAIN+"/loja/lojas").then(res => setValues({lojas:res.data, loja:{nome:"", imagemPath:"", imagens:{}}}))
    , []);

    const enviar = event => { 
        event.preventDefault();           
        var formData = new FormData();
        formData.append('file', values.loja.imagem);
        formData.append('lojaDTO', new Blob([JSON.stringify(values.loja)], {type: "application/json"}));
        axios.post(process.env.REACT_APP_MELI_DOMAIN+'/loja/lojas', formData).then(response => setValues({...values, lojas:[...values.lojas, response.data]}));                                                                       
    }

    return <div className="p-4">
        <h4>Lojas</h4>
        <form className="mt-4" onSubmit={enviar}>                
            <fieldset id="loja" className="p-2" style={{overflow:"hidden", borderRadius:"0.9em"}}>
                <legend>{values.loja.id?"Editar":"Criar"} Loja {values.loja.id}</legend>                                    
                <LabelInput value={values.loja.nome} label="Nome da loja: " placeholder="nome" id="nome" type="text" onChange={nome=>setValues({...values, loja:{...values.loja, nome}})}/>
                <input className={"form-control form-control-sm"} value={values.loja.imagemPath} label="Foto: " placeholder="foto" id="foto" type="file" multiple onChange={event => {event.preventDefault();setValues({...values, loja:{...values.loja, imagem:event.target.files[0]}});}}/>                                    
                <input disabled={false} type="submit" value="enviar" className="btn btn-sm btn-success mt-2"/>    
                <input disabled={false} onClick={event => {event.preventDefault();console.log("Input limpar nova loja")}} type="submit" className="btn btn-sm btn-primary mt-2" value="Limpar"/>                        
            </fieldset>
        </form>
        {/* <img src={{uri:process.env.REACT_APP_MELI_DOMAIN+'/loja/D_NQ_NP_706555-MLB50090926457_052022-F.webp',headers:{Authorization: 'Bearer '+localStorage.getItem("token")}}}/> */}
        <div className="table-responsive mt-4">
            <table className="table">     
                <thead className="thead-light">
                    <tr className="table-light">                        
                        <th scope="col"></th>                        
                        <th scope="col">Nome</th>                                                
                        <th scope="col"></th>                                                
                        <th scope="col"></th>
                    </tr>
                </thead> 
                <tbody>                                                 
                    {values.lojas.map(l=>
                    <>
                        <tr key={"lojas"+l.id} style={{cursor:"pointer", whiteSpace: "nowrap"}}>
                            <td><img style={{width:"2em"}} src={l.imagemPath}/></td>                            
                            <td style={{fontWeight: "bold"}}>{l.nome}</td>                                                                                         
                            <td style={{fontWeight: "bold"}}>
                                <a href={"/produtos/"+l.id}>Produtos</a>
                            </td>                                                                                         
                            <td><button className="btn btn-sm btn-danger" onClick={event=>{event.preventDefault();axios.delete(process.env.REACT_APP_MELI_DOMAIN+"/loja/lojas/"+l.id).then(r=>axios.get(process.env.REACT_APP_MELI_DOMAIN+"/loja/lojas").then(res => {setValues({...values, lojas:res.data, loja:{nome:"", imagemPath: ""}})}))}}>X</button></td>
                        </tr>
                        <tr>

                        </tr>
                        
                    </>                    
                    )}  
                </tbody>    
            </table>       
        </div>    
    </div>
}

export default Lojas;