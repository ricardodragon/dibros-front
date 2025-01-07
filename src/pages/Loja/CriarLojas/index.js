import axios from '../../../config/api/api';
import React, { useEffect, useRef, useState } from 'react';

function CriarLojas() {
    
    const [values, setValues] = useState( {lojas:[], loja:{nome:"", imagemPath:"", imagem:""}} )
    const host = process.env.REACT_APP_URL;
    const ref = useRef();

    useEffect(() =>{
        setValues({lojas:[], loja:{nome:"", imagemPath:"", imagem:""}, load:true})
        axios.get("/loja/lojas").then(res => setValues({lojas:res.data, load:false, loja:{nome:"", imagemPath:"", imagem:""}}))
    }, []);

    const getLocation = () => navigator.geolocation?
        navigator.geolocation.getCurrentPosition(position=>
            setValues({...values, loja:{...values.loja, latitude:position.coords.latitude, longitude:position.coords.longitude}})):
        "Geolocation is not supported by this browser.";

    const enviar = event => { 
        setValues({...values, load:true});
        event.preventDefault();           
        var formData = new FormData();
        formData.append('files', values.loja.imagem);
        axios.post('/imagem/imagem', formData).then(imagens =>
            (values.loja.id?
                axios.put('/loja/lojas/'+1538, {...values.loja, imagemPath:imagens.data[0]?imagens.data[0]:values.loja.imagemPath}):                                        
                axios.post('/loja/lojas', {...values.loja, imagemPath:imagens.data[0]?imagens.data[0]:values.loja.imagemPath}))
                    .then(callBackForm).catch(callBackForm)
        ).catch(callBackForm)            
    }
    
    const callBackForm = (response) => {
        ref.current.value="";
        response.data&&response.data.id?
            setValues({...values, ok:true, erro:false, loja:{nome:"", imagemPath:"", imagem:""}, lojas:values.loja.id?values.lojas.map(x=>x.id===values.loja.id?response.data:x):[...values.lojas, response.data],load:false}):
            setValues({...values, erro:response&&response.response&&response.response.data&&response.response.data.message?response.response.data.message:"Erro desconhecido", ok:false, load:false})
        document.getElementsByClassName("anuncios-conteudo")[0].scrollTo(0, 0);
    }
        

    return <>
        {values.load&&<div style={{position:"absolute", width:"100%", height:"100%", backgroundColor:"rgba(173, 181, 189, 50%)", zIndex:"1000" }}>
            <div className="spinner-border p-1" style={{width: "3rem",height: "3rem", margin:"18% 0 0 47%"}} role="status"></div>                 
        </div>}
        <div className='anuncios-conteudo'>        
            {/* <button style={{float:"right"}} className='btn btn-primary'>Buscar loja 🔎</button> */}
            <div className={"alert alert-success "+(values.ok?"":"visually-hidden")} role="alert">✅ Operação realizada com sucesso</div>
            <div className={"alert alert-danger "+(values.erro?"":"visually-hidden")} role="alert">❌ Erro: {values.erro}</div>
            <form className="mt-4" onSubmit={enviar}> 
                <fieldset><legend>{values.loja.id?"Editar":"Criar"} Loja {values.loja.id}</legend>                                    
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor="nome">Nome : </label>            
                    <input required style={{width:"75%"}} className='mb-4' id="nome" placeholder="nome da loja" value={values.loja.nome} type="text" onChange={event=>setValues({...values, loja:{...values.loja, nome:event.target.value}})}/>                                                                      
                </fieldset>
                <fieldset><legend>Foto da loja</legend>                                    
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1" htmlFor='imagem'>Imagem : </label>            
                    <input ref={ref} required={!values.loja.imagemPath||values.loja.imagemPath===""} id='imagem' className='mb-4' type="file" style={{textAlign:"center", width:"75%", backgroundColor: "#3498db", borderRadius: "5px", color: "#fff"}} accept='image/*' onChange={event => {event.preventDefault();setValues({...values, loja:{...values.loja, imagemPath:undefined, imagem:event.target.files[0]}});}}/>
                    {(values.loja.imagemPath||values.loja.imagem)&&<img alt="" style={{display:"block", width:"8em", height:"8em"}} src={values.loja.imagemPath?host+values.loja.imagemPath:URL.createObjectURL(values.loja.imagem)}/>}                        
                </fieldset>
                <fieldset><legend>Localização da loja</legend>   
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} className="p-1 mb-4" htmlFor="localizacao">Local : {values.loja.latitude&&values.loja.longitude?'✅':'❌'}</label>            
                    <input style={{width:"75%"}} type="button" onClick={event => {event.preventDefault();getLocation();}} className="btn btn-sm btn-secondary" id="localizacao" value={"📌 Localização"}/>                 
                </fieldset>
                <input type="submit" value="enviar" className="btn btn-sm btn-success mt-2"/>    
                <input onClick={event => {event.preventDefault();setValues({...values, loja:{nome:"", imagemPath:"", imagem:""}})}} type="submit" className="btn btn-sm btn-primary mt-2" value="Limpar"/>                        
            </form>
        </div>        
    </>
}
export default CriarLojas