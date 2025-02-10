import axios from '../../../config/api/api';
import React, { useEffect, useRef, useState } from 'react';
import Colaboradores from './Colaboradores';

function CriarLojas() {
    
    const [values, setValues] = useState( {lojas:[], loja:{nome:"", imagemPath:"", imagem:""}} )
    const host = process.env.REACT_APP_URL;
    const ref = useRef();

    useEffect(() =>{
        setValues({lojas:[], loja:{nome:"", imagemPath:"", imagem:""}, load:true})
        axios.get(`/loja/lojas?page=${0}&size=${10}&idUsuario=`+JSON.parse(localStorage.getItem("usuario")).id).then(res => setValues({lojas:res.data, load:false, loja:{nome:"", imagemPath:"", imagem:""}}))
    }, []);

    const getLocation = () => navigator.geolocation?
        navigator.geolocation.getCurrentPosition(position=>
            setValues({...values, loja:{...values.loja, latitude:position.coords.latitude, longitude:position.coords.longitude}})):
        "Geolocation is not supported by this browser.";

    const enviaImagens = () => {
        var formData = new FormData();
        formData.append('files', values.loja.imagem);    
        return axios.post('/imagem/imagem', formData).catch(error=>console.log(error));
    }

    const getImagens = (imagens) => {return {...values.loja, imagemPath:imagens.data?imagens.data:values.loja.imagemPath}}

    const post = () => 
        enviaImagens().then(imagens => 
            axios.post("/loja/lojas", getImagens(imagens)).then(res=>setValues({...values, erro:false, ok:true}))
            .catch(error=>setValues({...values, erro:error.response&&error.response.data.message?error.response.data.message:"Erro desconhecido", ok:false, load:false})))

    const put = event => {                  
        enviaImagens().then(imagens=>
            axios.post('/loja/lojas', {...values.loja, imagemPath:imagens.data}).then(callBackForm).catch(callBackForm))        
    }
    
    const callBackForm = (response) => {
        ref.current.value="";
        response.data&&response.data.id?
            setValues({...values, ok:true, erro:false, loja:{nome:"", imagemPath:"", imagem:""}, lojas:values.loja.id?values.lojas.map(x=>x.id===values.loja.id?response.data:x):[...values.lojas, response.data],load:false}):
            setValues({...values, error:response.response&&response.response.data.message?response.response.data.message:"Erro desconhecido", ok:false, load:false})
    }

    const excluirLoja = (id) => axios.delete("/loja/lojas/"+id)
        .then(res => setValues({...values, erro:false, ok:true, lojas:values.lojas.filter(l=>id!==l.id)}))
        .catch(error => setValues({...values, erro:error.response.data.message}))

    return <>
        {values.load&&<div style={{position:"absolute", width:"100%", height:"100%", backgroundColor:"rgba(173, 181, 189, 50%)", zIndex:"1000" }}>
            <div className="spinner-border p-1" style={{width: "3rem",height: "3rem", margin:"18% 0 0 47%"}} role="status"></div>                 
        </div>}
        <div style={{overflowX:"hidden", overflowΥ:'scroll', height:'89vh'}}>        
            {(values.ok||values.erro)&&<div style={{width: "100%", textAlign:"center"}}>{values.ok?"✅ Operação realizada com sucesso":"❌ Erro: "+values.erro}</div>}                
            <form onSubmit={event=>{event.preventDefault();setValues({...values, load:true});values.loja.id?put():post()}}> 
                <fieldset><legend>{values.loja.id?"Editar":"Criar"} Loja {values.loja.id}</legend>                                    
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} htmlFor="nome">Nome : </label>            
                    <input required style={{width:"75%"}} id="nome" placeholder="nome da loja" value={values.loja.nome} type="text" onChange={event=>setValues({...values, loja:{...values.loja, nome:event.target.value}})}/>                                                                      
                </fieldset>
                <fieldset><legend>Foto da loja</legend>                                    
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} htmlFor='imagem'>Imagem : </label>            
                    <input ref={ref} required={!values.loja.imagemPath||values.loja.imagemPath===""} id='imagem' type="file" style={{textAlign:"center", width:"75%", backgroundColor: "#3498db", borderRadius: "5px", color: "#fff"}} accept='image/*' onChange={event => {event.preventDefault();setValues({...values, loja:{...values.loja, imagemPath:undefined, imagem:event.target.files[0]}});}}/>
                    {(values.loja.imagemPath||values.loja.imagem)&&<img alt="" style={{display:"block", width:"8em", height:"8em"}} src={values.loja.imagemPath?host+values.loja.imagemPath:URL.createObjectURL(values.loja.imagem)}/>}                        
                </fieldset>
                <fieldset><legend>Localização da loja</legend>   
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} htmlFor="localizacao">Local : {values.loja.latitude&&values.loja.longitude?'✅':'❌'}</label>            
                    <input style={{width:"75%"}} type="button" onClick={event => {event.preventDefault();getLocation();}} id="localizacao" value={"📌 Localização"}/>                 
                </fieldset>
                <input type="submit" value="enviar"/>    
                <input onClick={event => {event.preventDefault();setValues({...values, loja:{nome:"", imagemPath:"", imagem:""}})}} type="submit" value="Limpar"/>                        
            </form>

            {values.lojas&&
                <table style={{width: "100%", textAlign:'center'}}>
                    <thead>
                        <tr> 
                            <th></th>
                            <th>Nome</th>
                            <th>Colaboradores</th>
                            <th>EXCLUIR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {values.lojas.map(loja=>
                            <tr key={loja.id}>
                                <td ><img alt={"Foto loja : " +loja.nome} src={host+loja.imagemPath} style={{borderRadius: "50%", width:"2em", height:"2em"}}/></td>
                                <td>{loja.nome}</td>
                                <td style={{cursor:'pointer'}} onClick={event=>{setValues({...values, colaboradoresModal:loja.id});document.getElementById("modal").showModal();}}>{loja.colaboradores}</td>
                                <td style={{cursor:"pointer"}} onClick={event=>{event.stopPropagation();event.preventDefault();excluirLoja(loja.id)}}>❌</td>
                            </tr>                                                        
                        )}
                    </tbody>
                </table>
            }
            <Colaboradores idLoja={values.colaboradoresModal}/>
        </div>        
    </>
}
export default CriarLojas