import axios from '../../config/api/api';
import React, { useEffect, useState } from 'react';
import { FcCheckmark, FcHighPriority } from 'react-icons/fc';

function Lojas(props) {
    
    const [values, setValues] = useState( {lojas:[], loja:{nome:"", imagemPath:"", imagem:""}} )
    const host = process.env.REACT_APP_URL;

    const verificaLoja = () => values.loja.nome||values.loja.imagem||values.loja.imagemPath;

    useEffect(() =>{
        setValues({lojas:[], loja:{nome:"", imagemPath:"", imagem:""}, load:true})
        axios.get("/loja/lojas").then(res => setValues({lojas:res.data, load:false, loja:{nome:"", imagemPath:"", imagem:""}}))
    }, []);

    const getLocation = () => navigator.geolocation?
        navigator.geolocation.getCurrentPosition(position=>
            setValues({...values, loja:{...values.loja, latitude:position.coords.latitude, longitude:position.coords.longitude}})):
        "Geolocation is not supported by this browser.";

    const enviar = event => { 
        event.preventDefault();           
        var formData = new FormData();
        formData.append('files', values.loja.imagem);
        axios.post('/imagem/imagem', formData).then(imagens =>
            values.loja.id?
                axios.put('/loja/lojas/'+values.loja.id, {...values.loja, imagemPath:imagens.data[0]?imagens.data[0]:values.loja.imagemPath})
                    .then(callBackForm).catch(error=>setValues({...values, erro:error.response.data.message, ok:false})):
                axios.post('/loja/lojas', {...values.loja, imagemPath:imagens.data[0]?imagens.data[0]:values.loja.imagemPath})
                    .then(callBackForm).catch(error=>setValues({...values, erro:error.response.data.message, ok:false}))
        ).catch(error=>console.log(error))            
    }
    
    const callBackForm = response => setValues({
        ...values, 
        loja:{nome:"", imagemPath:"", imagem:""}, 
        lojas:values.loja.id?values.lojas.map(x=>x.id===values.loja.id?response.data:x):[...values.lojas, response.data],
        ok:true,
        erro:false
    })

    return <>
        {values.load&&<div style={{position:"absolute", width:"100%", height:"100%", backgroundColor:"rgba(173, 181, 189, 50%)", zIndex:"1000" }}>
            <div className="spinner-border p-1" style={{width: "3rem",height: "3rem", margin:"18% 0 0 47%"}} role="status"></div>                 
        </div>}
        <div className='anuncios-conteudo'>        
            {/* <button style={{float:"right"}} className='btn btn-primary'>Buscar loja 🔎</button> */}
            <div className={"alert alert-success "+(values.ok?"":"visually-hidden")} role="alert"><FcCheckmark/>Operação realizada com sucesso</div>
            <div className={"alert alert-danger "+(values.erro?"":"visually-hidden")} role="alert"><FcHighPriority/>Erro: {values.erro}</div>
            <form className="mt-4" onSubmit={enviar}> 
                <fieldset><legend>{values.loja.id?"Editar":"Criar"} Loja {values.loja.id}</legend>                                    
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor="nome">Nome : </label>            
                    <input style={{width:"75%"}} className='mb-4' id="nome" placeholder="nome da loja" value={values.loja.nome} required={true} type="text" onChange={event=>setValues({...values, loja:{...values.loja, nome:event.target.value}})}/>                                                                      
                </fieldset>
                <fieldset><legend>Foto da loja</legend>                                    
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor='imagem'>Imagem : </label>            
                    <label htmlFor='imagem' className="p-1 mb-4" style={{textAlign:"center", width:"75%", backgroundColor: "#3498db", borderRadius: "5px", color: "#fff", cursor: "pointer"}}>📁 Upload</label>
                    <input id='imagem' label="Foto: " style={{display:"none"}} type="file" accept='image/*' onChange={event => {event.preventDefault();setValues({...values, loja:{...values.loja, imagemPath:undefined, imagem:event.target.files[0]}});}}/>
                    {values.loja.imagemPath&&<img alt="" style={{width:"3em", height:"3em", borderRadius: "5px"}} src={host+values.loja.imagemPath}/>}
                    {values.loja.imagem&&<img alt="" style={{width:"3em", height:"3em", borderRadius: "5px"}} src={URL.createObjectURL(values.loja.imagem)}/>}                            
                </fieldset>
                <fieldset><legend>Localização da loja</legend>   
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1 mb-4" htmlFor="localizacao">Local : {values.loja.latitude&&values.loja.longitude?'✅':'❌'}</label>            
                    <input style={{width:"75%"}} type="button" onClick={event => {event.preventDefault();getLocation();}} className="btn btn-sm btn-secondary" id="localizacao" value={"📌 Localização"}/>                 
                </fieldset>
                <input disabled={!verificaLoja()} type="submit" value="enviar" className="btn btn-sm btn-success mt-2"/>    
                <input disabled={!verificaLoja()} onClick={event => {event.preventDefault();setValues({...values, loja:{nome:"", imagemPath:"", imagem:""}})}} type="submit" className="btn btn-sm btn-primary mt-2" value="Limpar"/>                        
            </form>
            <div style={{overflowX:"auto", color:"white"}}>
                <table  style={{borderCollapse: "collapse", width: "100%"}}>
                    <thead>
                        <tr>  
                            <th scope="col"></th>                        
                            <th scope="col">Nome</th>                                                
                            <th scope="col"></th>                                                
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {values.lojas.map(l=>
                            <tr key={"lojas"+l.id} style={{cursor:"pointer", whiteSpace: "nowrap"}} onClick={event=>{event.preventDefault();setValues({...values, loja:l});document.getElementsByClassName("conteudo")[0].scrollTo(0, 0)}}>
                                <td><img alt="Foto da loja" style={{width:"2em", height:"2em"}} src={host+l.imagemPath}/></td>                            
                                <td style={{fontWeight: "bold"}}>{l.nome}</td>                                                                                         
                                <td style={{fontWeight: "bold"}}><a onClick={event=>event.stopPropagation()} href={"/produtos/"+l.id}>Produtos</a></td>                                                                                         
                                <td onClick={event=>{
                                    event.stopPropagation();event.preventDefault();axios.delete("/loja/lojas/"+l.id)
                                    .then(res => setValues({...values, lojas:values.lojas.filter(loja=>loja.id!==l.id), ok:true, erro:false, loja:{nome:"", imagemPath: "", imagem:""}}))
                                    .catch(error=>setValues({...values, erro:error.response.data.message, ok:false}))
                                }}>❌</td>
                            </tr>
                        )} 
                    </tbody> 
                </table>       
            </div>    
        </div>
    </>
}

export default Lojas;