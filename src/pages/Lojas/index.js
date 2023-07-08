import axios from 'axios';
import React, { useEffect, useState } from 'react';


function Lojas(props) {
    
    const [values, setValues] = useState( {lojas:[], loja:{nome:"", imagemPath:"", imagem:""}} )
    const host = window.location.protocol+ "//" + window.location.hostname+":7080";

    const verificaLoja = () => values.loja.nome||values.loja.imagem||values.loja.imagemPath;

    useEffect(() => 
        axios.get(host+"/loja/lojas").then(res => setValues({lojas:res.data, loja:{nome:"", imagemPath:"", imagem:""}}))
    , [host]);

    const getLocation = () => navigator.geolocation?navigator.geolocation.getCurrentPosition(position=>setValues({...values, position})):"Geolocation is not supported by this browser.";

    const enviar = event => { 
        event.preventDefault();           
        var formData = new FormData();
        formData.append('files', values.loja.imagem);
        axios.post(host+'/imagem/imagem', formData).then(imagens =>
            values.loja.id?
                axios.put(host+'/loja/lojas', {...values.loja, imagemPath:imagens.data[0]?imagens.data[0]:values.loja.imagemPath}).then(callBackForm):
                axios.post(host+'/loja/lojas', {...values.loja, imagemPath:imagens.data[0]?imagens.data[0]:values.loja.imagemPath}).then(callBackForm))            
    }
    
    const callBackForm = response => setValues({
        ...values, 
        loja:{nome:"", imagemPath:"", imagem:""}, 
        lojas:values.loja.id?values.lojas.map(x=>x.id===values.loja.id?response.data:x):[...values.lojas, response.data]
    })

    return <div>
        <form className="mt-4" onSubmit={enviar}> 
            {console.log(values.position)}
            <fieldset id="loja" className="p-1 mb-2" style={{borderRadius:"0.3em"}}><legend>{values.loja.id?"Editar":"Criar"} Loja {values.loja.id}</legend>                                    
                <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor="legenda">Nome : </label>            
                <input style={{width:"75%"}} id="nome" placeholder="nome da loja" value={values.loja.nome} required={true} type="text" onChange={event=>setValues({...values, loja:{...values.loja, nome:event.target.value}})}/>                                                                      
            </fieldset>
            <fieldset id="loja" className="p-1 mb-2" style={{borderRadius:"0.3em"}}><legend>Imagem</legend>
                <label htmlFor='imagem' className="p-1" style={{marginRight: "10%", backgroundColor: "#3498db", borderRadius: "5px", color: "#fff", cursor: "pointer"}}>📁 Upload</label>
                <input id='imagem' label="Foto: " style={{display:"none"}} type="file" accept='image/*' onChange={event => {event.preventDefault();setValues({...values, loja:{...values.loja, imagemPath:undefined, imagem:event.target.files[0]}});}}/>
                {values.loja.imagemPath&&<img alt="" style={{width:"3em", height:"3em", borderRadius: "5px"}} src={host+values.loja.imagemPath}/>}
                {values.loja.imagem&&<img alt="" style={{width:"3em", height:"3em", borderRadius: "5px"}} src={URL.createObjectURL(values.loja.imagem)}/>}                            
            </fieldset>
            <fieldset id="loja" className="p-1 mb-2" style={{borderRadius:"0.3em"}}><legend>Localização</legend>
                <button onClick={event => {event.preventDefault();getLocation();}} className="btn btn-sm btn-secondary">📌 Localização</button> {values.position?'✅':'❌'}
            </fieldset>
            <input disabled={!verificaLoja()} type="submit" value="enviar" className="btn btn-sm btn-success mt-2" />    
            <input disabled={!verificaLoja()} onClick={event => {event.preventDefault();setValues({...values, loja:{nome:"", imagemPath:"", imagem:""}})}} type="submit" className="btn btn-sm btn-primary mt-2" value="Limpar"/>                        
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
                            <td><img alt="Foto da loja" style={{width:"2em", height:"2em"}} src={host+l.imagemPath}/></td>                            
                            <td style={{fontWeight: "bold"}}>{l.nome}</td>                                                                                         
                            <td style={{fontWeight: "bold"}}><a onClick={event=>event.stopPropagation()} href={"/produtos/"+l.id}>Produtos</a></td>                                                                                         
                            <td onClick={event=>{event.stopPropagation();event.preventDefault();axios.delete(host+"/loja/lojas/"+l.id).then(r=>axios.get(host+"/loja/lojas").then(res => {setValues({...values, lojas:res.data, loja:{nome:"", imagemPath: "", imagem:""}})}))}}>❌</td>
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