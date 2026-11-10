import { useMemo, useEffect, useState } from 'react';
import axios from '../../../config/api/api';
import loader from "./../../../assets/loadinfo.gif";
import Colaboradores from './Colaboradores';
import './criarLojas.css';
import Frete from '../Frete';
import Endereco from './Endereco';

function CriarLojas(props) {

    const lojaBuilder = useMemo(() => {return {nome:"", imagem:"", retirada:true, preparacaoUnidadeDTO:"DIAS", enderecoLojaDTO:{}}}, [])
    const [values, setValues] = useState( {lojas:[], page:0, loja:lojaBuilder, load:true} )
    const host = process.env.REACT_APP_URL;

    useEffect(() =>{        
        axios.get(`/loja/lojas/usuario?page=${0}&size=${10}`).then(res => setValues(prev => ({...prev, page: prev.page+1, fimLojas:res.data.length===0, load:false, lojas: prev.lojas.concat(res.data)})))
    }, [lojaBuilder]);

    useEffect(()=>
        document.getElementById('modal-colaboradores').addEventListener('close', () => setValues({...values, usuarioLoja:undefined}))
    , [values]);

    const handlerScroll = (e) => {
        const { scrollHeight, scrollTop, clientHeight } = e.target;
        if (!values.loaderLojas && (scrollHeight - scrollTop) <= clientHeight && values.lojas && !values.fimLojas) {  
            setValues(prev => ({ ...prev, loaderLojas: true })); 
            axios.get(`/loja/lojas/usuario?page=${values.page + 1}&size=10`).then(res => 
                setValues(prev => ({...prev, fimLojas:res.data.length===0, page: prev.page+1, lojas: prev.lojas.concat(res.data), loaderLojas: false}))
            );
        }
    };

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
                    <label style={{width:"25%"}} htmlFor="prazo-preparacao">prazo preparação</label>
                    <input required id="prazo-preparacao" placeholder="valor" value={values.loja.preparacaoValor} type="number" onChange={event=>setValues({...values, loja:{...values.loja, preparacaoValor:event.target.value}})}/>                            
                    <select required id="prazo-preparacao" placeholder="unidade" defaultValue={"DIAS"} onChange={event=>setValues({...values, loja:{...values.loja, preparacaoUnidadeDTO:event.target.value}})} value={values.loja.preparacaoUnidadeDTO}>                                                                      
                        <option value={"MINUTOS"}>minutos</option>
                        <option value={"HORAS"}>horas</option>
                        <option value={"DIAS"}>dias</option>
                    </select><br/>
                    <label htmlFor="retirada" >permitir retirada : </label>            
                    <input required id="retirada" placeholder="nome do frete" checked={values.loja.retirada} type="checkbox" onChange={event=>setValues({...values, loja:{...values.loja, retirada:!values.loja.retirada}})}/> 
                </fieldset>                                                                          
                
                <Frete values={values} setValues={setValues}/>
                
                <fieldset className='field-imagem'><legend>foto da loja</legend>                                    
                    <label htmlFor='imagem'>imagem : </label>            
                    <input required={!values.loja.imagem} id='imagem' type="file" accept='image/*' onChange={event => {event.preventDefault();setValues({...values, loja:{...values.loja, imagem:event.target.files[0]}});}}/>
                    {values.loja.imagem&&<img alt="" style={{display:"block", width:"8em", height:"8em"}}  src={typeof values.loja.imagem === 'string'?`${host}/loja/lojas/imagem/${values.loja.id}/${values.loja.imagem}?Authorization=${localStorage.getItem("token")}`:URL.createObjectURL(values.loja.imagem)}/>}                        
                </fieldset>                

                <Endereco values={values} setValues={setValues}/>
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
                                {/* <td style={{cursor:'pointer'}}><a onClick={event=>event.stopPropagation()} href={'/loja/enderecos/'+loja.id}>enderecos</a></td> */}
                                <td style={{cursor:'pointer'}} onClick={event=>modalColab(event, loja)}>👥</td>
                                <td>{loja.isAdmin?'✅':'❌'}</td>
                                <td style={{cursor:"pointer"}}>{loja.isAdmin&&<button onClick={event=>{event.preventDefault();event.stopPropagation();excluirLoja(loja.id)}}>❌</button>}</td>
                            </tr>                                                                                  
                        )}
                        {!values.fimLojas?<tr><td colSpan="9"><img style={{height:"5em"}} src={loader} alt="loading..."/></td></tr>:<tr><td colSpan="9">"fim das lojas"</td></tr>}
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