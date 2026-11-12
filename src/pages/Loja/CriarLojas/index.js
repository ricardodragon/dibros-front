import { useEffect, useState } from 'react';
import axios from '../../../config/api/api';
import './criarLojas.css';
import Frete from '../Frete';
import Endereco from './Endereco';
import ListarLojas from '../ListarLojas';
import loader from "./../../../assets/loadinfo.gif";
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';


const aplicarMascaraPix = (valor, tipo) => {
    if (!valor) return "";
    if (tipo === "CPF") 
        return valor.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2").substring(0, 14);
    if (tipo === "CNPJ") 
        return valor.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2").substring(0, 18);    
    if (tipo === "CELULAR") 
        return valor.replace(/\D/g, "").replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").substring(0, 15);
    return valor; // E-mail e chave aleatória não usam máscara numérica
};
const lojaBuilder = {nome:"", imagem:"", isDono:true, retirada:true, preparacaoValor:'',preparacaoUnidadeDTO:"DIAS", enderecoLojaDTO:{}, fretesDTO: [], tipoChavePix: "CPF", chavePix: ""}

function CriarLojas(props) {
    
    const [values, setValues] = useState( {lojas:[], page:0, refreshLista:0, loja:lojaBuilder, load:true} )
    const host = process.env.REACT_APP_URL;
    const location = useLocation().search;
    const searchParams = new URLSearchParams(location);
    const id = searchParams.get('id');
    const history = useHistory();
    
    useEffect(()=>
        document.getElementById('modal-colaboradores').addEventListener('close', () => setValues(prev=>({...prev, usuarioLoja:undefined})))
    , []);

    useEffect(() => {
        if (!id){
            setValues(prev=>({...prev, loja:lojaBuilder, load:false}));
            return;
        }
        document.getElementsByClassName("loja-conteudo")[0]?.scrollTo({ top: 0, behavior: 'smooth' });
        axios.get(`/loja/lojas/${id}`).then(r=>setValues(prev=>({...prev, load:false, loja:{...r.data, freteDTO: r.data.fretesDTO || []}})));
    }, [id]);

    const post = () => {
        setValues({...values, load:true});
        const formData = new FormData();
        const {imagem, ...loja} = values.loja;
        formData.append('loja', new Blob([JSON.stringify(loja)], { type: 'application/json' }));
        formData.append('imagem', imagem);
        axios.post("/loja/lojas", formData)
            .then(res=>setValues(prev => ({...prev, refreshLista:prev.refreshLista+1, loja:lojaBuilder, load: false, erro: false, ok: true})))
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
            .then(res=>limparParametroEdicao())
            .catch(error=>setValues({...values, load:false, erro:error.response&&error.response.data.message?error.response.data.message:"Erro desconhecido", ok:false}));
    }  
    
    const limparParametroEdicao = () => {
        const novosParams = new URLSearchParams(location.search);
        novosParams.delete('id');
        history.replace({pathname: location.pathname, search: novosParams.toString() ? `?${novosParams.toString()}` : ''});
        setValues({...values, load:false, refreshLista:values.refreshLista+1})
    };

    // const modalColab = (event, loja) =>{
    //     event.stopPropagation();
    //     document.getElementById("modal-colaboradores").showModal();
    //     setValues({...values, usuarioLoja:loja})
    // }

    return <>
        {values.load&&<div className='loader-loja'><img src={loader} alt="loading..."/></div>}
        <div className='loja-conteudo'> 
            <div className='mensagem-loja'>{values.ok?"✅ Operação realizada com sucesso":(values.erro?"❌ Erro: "+values.erro:"")}</div>       
            <form className="form" onSubmit={event=>{event.preventDefault();setValues({...values, load:true});values.loja.id?put():post()}}> 
                <fieldset >
                    <legend>{values.loja.id?"editar":"criar"} loja {values.loja.id}</legend>                                    
                    <label htmlFor="nome">nome :       
                        <input required id="nome" placeholder="nome da loja" value={values.loja.nome} type="text" onChange={event=>setValues({...values, loja:{...values.loja, nome:event.target.value}})}/>                                                                                          
                    </label>      
                    <label htmlFor="prazo-preparacao">prazo preparação
                        <div style={{display: "flex", gap: "8px"}}>
                            <input required id="prazo-preparacao" placeholder="valor" value={values.loja.preparacaoValor} type="number" onChange={event=>setValues({...values, loja:{...values.loja, preparacaoValor:event.target.value}})}/>                                                
                            <select required id="prazo-preparacao" placeholder="unidade" defaultValue={"DIAS"} onChange={event=>setValues({...values, loja:{...values.loja, preparacaoUnidadeDTO:event.target.value}})} value={values.loja.preparacaoUnidadeDTO}>                                                                      
                                <option value={"MINUTOS"}>minutos</option>
                                <option value={"HORAS"}>horas</option>
                                <option value={"DIAS"}>dias</option>
                            </select>
                        </div>
                    </label>
                    
                    <label htmlFor="retirada" >permitir retirada :  
                        <input id="retirada" placeholder="nome do frete" checked={values.loja.retirada} type="checkbox" onChange={event=>setValues({...values, loja:{...values.loja, retirada:!values.loja.retirada}})}/>                     
                    </label> 
                </fieldset>                                                                          
                
                {values.loja.isDono&&<fieldset>
                    <legend>Dados de Recebimento (Repasse PIX)</legend>
                    <label htmlFor="tipo-pix">tipo de chave : 
                        <select id="tipo-pix"  value={values.loja.tipoChavePix || "CPF"} onChange={event => setValues({...values, loja: { ...values.loja, tipoChavePix: event.target.value, chavePix: "" }})}>
                            <option value="CPF">CPF</option>
                            <option value="CNPJ">CNPJ</option>
                            <option value="EMAIL">E-mail</option>
                            <option value="CELULAR">Celular (com DDD)</option>
                            <option value="ALEATORIA">Chave Aleatória</option>
                        </select>
                    </label>
                    <label htmlFor="pix">chave pix :     
                        <input id="pix" required placeholder={
                                values.loja.tipoChavePix === "CPF" ? "000.000.000-00" :
                                values.loja.tipoChavePix === "CNPJ" ? "00.000.000/0001-00" :
                                values.loja.tipoChavePix === "CELULAR" ? "(11) 99999-9999" :
                                values.loja.tipoChavePix === "EMAIL" ? "exemplo@email.com" : "chave aleatória"
                            } 
                            type={values.loja.tipoChavePix === "EMAIL" ? "email" : "text"} 
                            value={values.loja.chavePix || ""} 
                            onChange={event=>setValues({...values, loja: { ...values.loja, chavePix: aplicarMascaraPix(event.target.value, values.loja.tipoChavePix)}})}
                        /> 
                    </label>        
                </fieldset>}

                <Frete values={values} setValues={setValues}/>
                
                <fieldset className='field-imagem'><legend>foto da loja</legend>                                    
                    <label htmlFor='imagem'>imagem :        
                        <input required={!values.loja.imagem} id='imagem' type="file" accept='image/*' onChange={event => {event.preventDefault();setValues({...values, loja:{...values.loja, imagem:event.target.files[0]}});}}/>
                    </label>     
                    {values.loja.imagem&&<img alt="" style={{display:"block", width:"8em", height:"8em"}}  src={typeof values.loja.imagem === 'string'?`${host}/loja/lojas/imagem/${values.loja.id}/${values.loja.imagem}?Authorization=${localStorage.getItem("token")}`:URL.createObjectURL(values.loja.imagem)}/>}                        
                </fieldset>                

                <Endereco values={values} setValues={setValues}/>
                <input type="submit" value="enviar"/>    
                <input onClick={limparParametroEdicao} type="reset" value="limpar"/>                        
            </form>

            <span style={{width: "100%"}} className="menu-feed" name="lojas"><span className='feed-menu-opaciti' style={{cursor: "default"}}>🏬 lojas</span><span style={{cursor: "default"}} className='feed-menu'>🏬 lojas</span></span>

            <div className="tabs-feed">
                <section id="lojas" className="tab">
                    <ListarLojas url={`/loja/lojas/usuario`} refresh={values.refreshLista}/>
                </section>
            </div>            

            {/* <dialog onClick={event=>document.getElementById("modal-colaboradores").close()} id="modal-colaboradores">
                {values.usuarioLoja&&<Colaboradores loja={values.usuarioLoja}/>}
            </dialog>  */}
        </div>        
    </>
}
export default CriarLojas