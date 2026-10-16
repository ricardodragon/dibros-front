import { useMemo, useEffect, useState } from 'react';
import axios from '../../../config/api/api';
import loader from "./../../../assets/loadinfo.gif";
import Colaboradores from './Colaboradores';
import './criarLojas.css';

function CriarLojas() {

    const lojaBuilder = useMemo(() => {return {nome:"", imagem:"", retirada:true}}, [])
    const [values, setValues] = useState( {lojas:[], loja:lojaBuilder, load:true} )
    const host = process.env.REACT_APP_URL;

    useEffect(() =>{        
        axios.get(`/loja/lojas/usuario?page=${0}&size=${10}`).then(res => setValues({lojas:res.data, page:0, load:false, loja:lojaBuilder}))
    }, [lojaBuilder]);

    useEffect(()=>
        document.getElementById('modal-colaboradores').addEventListener('close', () => setValues({...values, usuarioLoja:undefined}))
    , [values]);

    const handlerScroll = (event) => {
        if(!values.loaderLojas&&(event.target.scrollHeight - event.target.scrollTop)<=event.target.clientHeight&&values.lojas!==undefined){  
            setValues({...values, loaderLojas:true}); 
            const page = values.page+1;
            axios.get(`/loja/lojas/usuario?page=${page}&size=10`)
                .then(lojas => setValues({...values, page, lojas:values.lojas.concat(lojas.data), loaderLojas:false}));
        }
    }

    const getLocation = () => navigator.geolocation?
        navigator.geolocation.getCurrentPosition(position=>
            setValues({...values, loja:{...values.loja, endereco:{latitude:position.coords.latitude, longitude:position.coords.longitude}}}),
            (error) => setValues({...values, erro:"erro ao buscar localização"}),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        ):"Geolocation is not supported by this browser.";

    const post = () => {
        setValues({...values, load:true});
        const formData = new FormData();
        const {imagem, ...loja} = values.loja;
        formData.append('loja', new Blob([JSON.stringify(loja)], { type: 'application/json' }));
        formData.append('imagem', imagem);
        axios.post("/loja/lojas", formData).then(res=>setValues({...values, load:false, erro:false, ok:true, loja:lojaBuilder}))
            .catch(error=>setValues({...values, load:false, erro:error.response&&error.response.data.message?error.response.data.message:"Erro desconhecido", ok:false}));
    }

    const put = () => {
        setValues({...values, load:true});
        const formData = new FormData();
        if(typeof values.loja.imagem === 'string')
            formData.append('loja', new Blob([JSON.stringify(values.loja)], { type: 'application/json' }));
        else {
            const {imagem, ...loja} = values.loja;
            formData.append('loja', new Blob([JSON.stringify(loja)], { type: 'application/json' }));
            formData.append('imagem', imagem);
        }
        axios.put("/loja/lojas", formData)
            .then(res=>setValues({...values, load:false, erro:false, ok:true, loja:lojaBuilder}))
            .catch(error=>setValues({...values, load:false, erro:error.response&&error.response.data.message?error.response.data.message:"Erro desconhecido", ok:false}));
    }  

    const excluirLoja = (id) => axios.delete("/loja/lojas/"+id).then(res => setValues({...values, erro:false, ok:true, lojas:values.lojas.filter(l=>id!==l.id)})).catch(error => setValues({...values, erro:error.response.data.message}))
    
    const editar = (event, loja) => {
        setValues({...values, loja});
        document.getElementsByClassName("mensagem-loja")[0].scrollIntoView({behavior: 'smooth'});
    }

    const modalColab = (event, loja) =>{
        event.stopPropagation();
        document.getElementById("modal-colaboradores").showModal();
        setValues({...values, usuarioLoja:loja})
    }

    const onError = ({ currentTarget })=>{currentTarget.onError=null; currentTarget.src="https://thumbs.dreamstime.com/b/%C3%ADcone-de-imagem-sem-foto-ou-em-branco-carregamento-imagens-aus%C3%AAncia-marca-n%C3%A3o-dispon%C3%ADvel-sinal-breve-silhueta-natureza-simples-215973362.jpg"}
    
    return <>
        {values.load&&<div className='loader-loja'><img src={loader} alt="loading..."/></div>}
        <div className='loja-conteudo' onScroll={handlerScroll}> 
            <div className='mensagem-loja'>{values.ok?"✅ Operação realizada com sucesso":(values.erro?"❌ Erro: "+values.erro:"")}</div>       
            <form className="form" onSubmit={event=>{event.preventDefault();setValues({...values, load:true});values.loja.id?put():post()}}> 
                <fieldset>
                    <legend>{values.loja.id?"editar":"criar"} loja {values.loja.id}</legend>                                    
                    <label htmlFor="nome">nome : </label>            
                    <input required style={{width:"75%"}} id="nome" placeholder="nome da loja" value={values.loja.nome} type="text" onChange={event=>setValues({...values, loja:{...values.loja, nome:event.target.value}})}/>                                                                                          
                    <label style={{width:"25%"}} htmlFor="prazo-preparacao">
                        prazo preparação em&nbsp;              
                        <select required id="prazo-preparacao" placeholder="unidade" value={values.loja.unidadePrazoPreparacao}>                                                                      
                            <option>minutos</option>
                            <option>horas</option>
                            <option>dias</option>
                        </select> : 
                    </label>
                    <input required style={{width:"75%"}} id="prazo-preparacao" placeholder="valor" value={values.loja.prazoPreparacao} type="number" onChange={event=>setValues({...values, loja:{...values.loja, prazoPreparacao:event.target.value}})}/>                            
                    <label htmlFor="nome-frete">permitir retirada : </label>            
                    <input required id="nome-frete" placeholder="nome do frete" checked={values.loja.retirada} type="checkbox" onChange={event=>setValues({...values, loja:{...values.loja, retirada:!values.loja.retirada}})}/> 
                </fieldset>                                                                          
                <fieldset><legend>tabela de : peso x comprimento x largura</legend>
                    <button onClick={event=>{event.preventDefault();setValues({...values, loja:{...values.loja, fretesDTO:[...(values.loja.fretesDTO||[]), {index:values.loja.fretesDTO?values.loja.fretesDTO.length:0}]}})}}>adicionar tabela</button><br/>
                    {values.loja.fretesDTO&&values.loja.fretesDTO.map((x, i)=><fieldset key={"frete-"+x.index}>
                        <label htmlFor={"max-peso-"+x.index}>max peso por pedido : </label>            
                        <input required disabled={x.confirmar} style={{width:"75%"}} id={"max-peso-"+x.index} placeholder="max peso por pedido" value={x.pesoMaximo} type="number" onChange={event=>setValues({...values, loja:{...values.loja, fretesDTO:values.loja.fretesDTO.map((f, index)=>i===index?{...f, pesoMaximo:event.target.value}:f)}})}/>                                                                      
                        {/* <label htmlFor={"min-peso-"+x.index}>min peso por pedido : </label>             */}
                        {/* <input required disabled={x.confirmar} style={{width:"75%"}} id={"min-peso-"+x.index} placeholder="min peso por pedido" value={x.pesoMinimo} type="number" onChange={event=>setValues({...values, loja:{...values.loja, fretesDTO:values.loja.fretesDTO.map((f, index)=>i===index?{...f, pesoMinimo:event.target.value}:f)}})}/>                                                                       */}
                        <label htmlFor={"max-comprimento-"+x.index}>max comprimento por pedido : </label>            
                        <input required disabled={x.confirmar} style={{width:"75%"}} id={"max-comprimento-"+x.index} placeholder="max comprimento por pedido" value={x.comprimentoMaximo} type="number" onChange={event=>setValues({...values, loja:{...values.loja, fretesDTO:values.loja.fretesDTO.map((f, index)=>i===index?{...f, comprimentoMaximo:event.target.value}:f)}})}/>                                                                      
                        {/* <label htmlFor={"min-comprimento-"+x.index}>min comprimento por pedido : </label>             */}
                        {/* <input required disabled={x.confirmar} style={{width:"75%"}} id={"min-comprimento-"+x.index} placeholder="min comprimento por pedido" value={x.comprimentoMinimo} type="number" onChange={event=>setValues({...values, loja:{...values.loja, fretesDTO:values.loja.fretesDTO.map((f, index)=>i===index?{...f, comprimentoMinimo:event.target.value}:f)}})}/>                                                                       */}
                        <label htmlFor={"max-largura-"+x.index}>max largura por pedido : </label>            
                        <input required disabled={x.confirmar} style={{width:"75%"}} id={"max-largura-"+x.index} placeholder="max largura por pedido" value={x.larguraMaximo} type="number" onChange={event=>setValues({...values, loja:{...values.loja, fretesDTO:values.loja.fretesDTO.map((f, index)=>i===index?{...f, larguraMaximo:event.target.value}:f)}})}/>                                                                      
                        {/* <label htmlFor={"min-largura-"+x.index}>min largura por pedido : </label>             */}
                        {/* <input required disabled={x.confirmar} style={{width:"75%"}} id={"min-largura-"+x.index} placeholder="min largura por pedido" value={x.larguraMinimo} type="number" onChange={event=>setValues({...values, loja:{...values.loja, fretesDTO:values.loja.fretesDTO.map((f, index)=>i===index?{...f, larguraMinimo:event.target.value}:f)}})}/>                                                                       */}
                        <label htmlFor={"valor-km-"+x.index}>valor/km : </label>            
                        <input required disabled={x.confirmar} style={{width:"75%"}} id={"valor-km-"+x.index} placeholder="valor da entrega por km" value={x.valorKm} type="number" onChange={event=>setValues({...values, loja:{...values.loja, fretesDTO:values.loja.fretesDTO.map((f, index)=>i===index?{...f, valorKm:event.target.value}:f)}})}/>                                                                      
                        <label htmlFor={"prazo-km-"+x.index}>prazo minutos/km : </label>            
                        <input required disabled={x.confirmar} style={{width:"75%"}} id={"prazo-km-"+x.index} placeholder="prazo em minutos por km" value={x.prazoEntrega} type="number" onChange={event=>setValues({...values, loja:{...values.loja, fretesDTO:values.loja.fretesDTO.map((f, index)=>i===index?{...f, prazoEntrega:event.target.value}:f)}})}/>                                                                      
                        <label htmlFor={"max-distancia-km-"+x.index}>máxima distancia/km : </label>            
                        <input required disabled={x.confirmar} style={{width:"75%"}} id={"max-distancia-km-"+x.index} placeholder="máxima distancia por km" value={x.distancia} type="number" onChange={event=>setValues({...values, loja:{...values.loja, fretesDTO:values.loja.fretesDTO.map((f, index)=>i===index?{...f, distancia:event.target.value}:f)}})}/>                                                                      
                        <button onClick={event=>{event.preventDefault();setValues({...values, loja:{...values.loja, fretesDTO:values.loja.fretesDTO.map((t, index)=>i===index?{...t, confirmar:!t.confirmar}:t)}})}}>{values.loja.fretesDTO[i].confirmar?'editar':'confirmar'}</button>
                        <button onClick={event=>{event.preventDefault();setValues({...values, loja:{...values.loja, fretesDTO:values.loja.fretesDTO.filter((_, index)=>index!==i)}});}}>excluir</button>
                    </fieldset>)}
                </fieldset>
                    {/* <label htmlFor="max-peso">max peso por pedido : </label>            
                    <input required style={{width:"75%"}} id="max-peso" placeholder="max peso por pedido" value={values.loja.fretesDTO[0].pesoMaximo} type="number" onChange={event=>setValues({...values, loja:{...values.loja, fretesDTO:values.loja.fretesDTO.map((x, i)=>i===0?{...x, pesoMaximo:event.target.value}:x)}})}/>                                                                      
                    <label htmlFor="min-peso">min peso por pedido : </label>            
                    <input required style={{width:"75%"}} id="min-peso" placeholder="min peso por pedido" value={values.loja.fretesDTO[0].pesoMinimo} type="number" onChange={event=>setValues({...values, loja:{...values.loja, fretesDTO:values.loja.fretesDTO.map((x, i)=>i===0?{...x, pesoMinimo:event.target.value}:x)}})}/>                                                                       */}
                <fieldset className='field-imagem'><legend>foto da loja</legend>                                    
                    <label htmlFor='imagem'>imagem : </label>            
                    <input required={!values.loja.imagem} id='imagem' type="file" accept='image/*' onChange={event => {event.preventDefault();setValues({...values, loja:{...values.loja, imagem:event.target.files[0]}});}}/>
                    {values.loja.imagem&&<img alt="" style={{display:"block", width:"8em", height:"8em"}}  src={typeof values.loja.imagem === 'string'?`${host}/loja/lojas/imagem/${values.loja.id}/${values.loja.imagem}?Authorization=${localStorage.getItem("token")}`:URL.createObjectURL(values.loja.imagem)}/>}                        
                </fieldset>
                {/* <fieldset><legend>Localização da loja</legend>   
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} htmlFor="localizacao">Local : {values.loja.endereco&&values.loja.endereco.latitude&&values.loja.endereco.longitude?'✅':'❌'}</label>            
                    <input style={{width:"75%"}} type="text" onKeyDown={(e) => e.preventDefault()} onClick={event => {getLocation();}} id="localizacao"/>                 
                </fieldset> */}
                <input type="submit" value="enviar"/>    
                <input onClick={event=>setValues({...values, loja:lojaBuilder})} type="reset" value="limpar"/>                        
            </form>

            {values.lojas&&
                <table id="tabela-lojas">
                    <thead>
                        <tr>
                            <th></th> 
                            <th></th>
                            <th>nome</th>                            
                            <th>endereços</th>
                            <th>colaboradores</th>
                            <th>admin</th>
                            <th>excluir</th>
                        </tr>
                    </thead>
                    <tbody>
                        {values.lojas.map(loja=>
                            <tr key={loja.id} onClick={event=>editar(event, loja)}>
                                <td>{loja.id}</td>
                                <td><img alt={"Foto loja : " +loja.nome} src={host+`/loja/lojas/imagem/${loja.id}/${loja.imagem}?Authorization=${localStorage.getItem("token")}`} onError={onError}/></td>
                                <td>{loja.nome}</td>                                
                                <td style={{cursor:'pointer'}}><a onClick={event=>event.stopPropagation()} href={'/loja/enderecos/'+loja.id}>enderecos</a></td>
                                <td style={{cursor:'pointer'}} onClick={event=>modalColab(event, loja)}>👥</td>
                                <td>{loja.isAdmin?'✅':'❌'}</td>
                                <td style={{cursor:"pointer"}}>{loja.isAdmin&&<button onClick={event=>{event.preventDefault();event.stopPropagation();excluirLoja(loja.id)}}>❌</button>}</td>
                            </tr>                                                                                  
                        )}
                        {values.loaderLojas?<tr><td colSpan="9"><img style={{height:"5em"}} src={loader} alt="loading..."/></td></tr>:<tr><td colSpan="9">"fim das lojas"</td></tr>}
                    </tbody>
                </table>
            }

            <dialog onClick={event=>document.getElementById("modal-colaboradores").close()} id="modal-colaboradores">
                {values.usuarioLoja&&<Colaboradores loja={values.usuarioLoja}/>}
            </dialog>
        </div>        
    </>
}
export default CriarLojas