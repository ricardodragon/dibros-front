import axios from 'axios';
import React, { useEffect, useState } from 'react';
import LabelInput from "../../estrutura/LabelInput";


function Lojas(props) {
    
    const [values, setValues] = useState( {lojas:[], loja:{nome:"", imagemPath:"", imagem:""}} )

    const verificaLoja = () => values.loja.nome;

    useEffect(() => 
        axios.get(process.env.REACT_APP_MELI_DOMAIN+"/loja/lojas").then(res => setValues({lojas:res.data, loja:{nome:"", imagemPath:"", imagem:""}}))
    , []);

    const enviar = event => { 
        event.preventDefault();           
        var formData = new FormData();
        formData.append('file', values.loja.imagem);
        formData.append('lojaDTO', new Blob([JSON.stringify(values.loja)], {type: "application/json"}));
        axios.post(process.env.REACT_APP_MELI_DOMAIN+'/loja/lojas', formData).then(response => setValues({
            ...values, 
            loja:{nome:"", imagemPath:"", imagem:""}, 
            lojas:values.loja.id?values.lojas.map(x=>x.id==values.loja.id?response.data:x):[...values.lojas, response.data]
        }));                                                                       
    }

    return <div className="p-4" >
        <h4>Lojas</h4>
        <form className="mt-4" onSubmit={enviar}>                
            <fieldset id="loja" className="p-2" style={{overflow:"hidden", borderRadius:"0.9em"}}>
                <legend>{values.loja.id?"Editar":"Criar"} Loja {values.loja.id}</legend>                                    
                <LabelInput value={values.loja.nome} label="Nome da loja: " placeholder="nome" id="nome" type="text" onChange={nome=>setValues({...values, loja:{...values.loja, nome}})}/>
                <label style={{whiteSpace:"nowrap", fontSize:"8pt"}} className="p-1" htmlFor='imagem'>Foto da loja</label>
                <input id='imagem' className={"form-control form-control-sm mb-2"} label="Foto: " placeholder="foto" type="file" accept='image/*' multiple onChange={event => {event.preventDefault();setValues({...values, loja:{...values.loja, imagem:event.target.files[0]}});}}/>                                    
                {values.loja.imagemPath&&<img style={{width:"8em", height:"8em"}} src={process.env.REACT_APP_MELI_DOMAIN+values.loja.imagemPath}/>}
                {values.loja.imagem&&<img style={{width:"8em", height:"8em"}} src={URL.createObjectURL(values.loja.imagem)}/>}            
                <input disabled={false} type="submit" value="enviar" className="btn btn-sm btn-success mt-2"/>    
                <input disabled={false} onClick={event => {event.preventDefault();setValues({...values, loja:{nome:"", imagemPath:"", imagem:""}})}} type="submit" className="btn btn-sm btn-primary mt-2" value="Limpar"/>                        
            </fieldset>
        </form>
        <div className="table-responsive mt-4">
            <table className="table">     
                <thead className="thead-light">
                    <tr className="table-light">  
                        <th scope="col">ID</th>                           
                        <th scope="col"></th>                        
                        <th scope="col">Nome</th>                                                
                        <th scope="col"></th>                                                
                        <th scope="col"></th>
                    </tr>
                </thead> 
                <tbody>                                                 
                    {values.lojas.map(l=>
                    <>                    
                        <tr key={"lojas"+l.id} style={{cursor:"pointer", whiteSpace: "nowrap"}} onClick={event=>{event.preventDefault();setValues({...values, loja:l});document.getElementsByClassName("conteudo")[0].scrollTo(0, 0)}}>
                            <td>{l.id}</td>                            
                            <td><img style={{width:"2em", height:"2em"}} src={process.env.REACT_APP_MELI_DOMAIN+l.imagemPath}/></td>                            
                            <td style={{fontWeight: "bold"}}>{l.nome}</td>                                                                                         
                            <td style={{fontWeight: "bold"}}><a onClick={event=>event.stopPropagation()} href={"/produtos/"+l.id}>Produtos</a></td>                                                                                         
                            <td><button className="btn btn-sm btn-danger" onClick={event=>{event.preventDefault();axios.delete(process.env.REACT_APP_MELI_DOMAIN+"/loja/lojas/"+l.id).then(r=>axios.get(process.env.REACT_APP_MELI_DOMAIN+"/loja/lojas").then(res => {setValues({...values, lojas:res.data, loja:{nome:"", imagemPath: "", imagem:""}})}))}}>X</button></td>
                        </tr>
                        <tr></tr>
                    </>                    
                    )}  
                </tbody>    
            </table>       
        </div>    
    </div>
}

export default Lojas;