import { useEffect, useRef, useState } from 'react';
import axios from '../../../config/api/api';
import loader from "./../../../assets/loadinfo.gif";
import "./lojas.css";
import LojaComentarios from '../LojaComentarios';
import Colaboradores from './Colaboradores';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

function ListarLojas(props){
         
    const [values, setValues] = useState({lojas:[]})    
    const loadRef = useRef(null);
    const host = process.env.REACT_APP_URL;    
    const lojaNotFound = "https://thumbs.dreamstime.com/b/%C3%ADcone-de-imagem-sem-foto-ou-em-branco-carregamento-imagens-aus%C3%AAncia-marca-n%C3%A3o-dispon%C3%ADvel-sinal-breve-silhueta-natureza-simples-215973362.jpg";
    const paginaInicial = parseInt(new URLSearchParams(useLocation().search).get("pageLoja") || "0");

    useEffect(() => 
        props.url 
            ? (setValues(prev => ({ ...prev, carregando: true })), axios.get(`${props.url}?page=${paginaInicial}&size=${10}`).then(lojas => setValues(prev => ({ ...prev, lojas: lojas.data, page: paginaInicial, carregando: false, load: lojas.data.length<10 , usuario: JSON.parse(localStorage.getItem('usuario')) }))), undefined)
            : undefined
    , [props.url, paginaInicial]);     

    // 2º useEffect: Observer simples separado para as próximas páginas
    useEffect(() => {
        if (values.load || values.page === undefined || !loadRef.current) return;

        const observador = new IntersectionObserver(([entry]) => {
            if (!values.carregando && entry.isIntersecting) {
                setValues(prev => ({ ...prev, carregando: true }));

                axios.get(`${props.url}?page=${values.page + 1}&size=${10}&idLoja=${props.id}`).then(lojas => setValues(prev => ({
                    ...prev, carregando: false, page: prev.page + (lojas.data.length < 10 ? 0 : 1), load: lojas.data.length<10, lojas: prev.lojas.concat(lojas.data)
                })));
            }
        });

        observador.observe(loadRef.current);
        return () => observador.disconnect(); // Limpa o observer antigo
    }, [values.carregando, values.load, values.page, props.url, props.id]);

    const likeLoja = (event, loja) => {
        event.preventDefault();
        axios.post("/loja/loja/like/"+loja.id).then(r=>setValues({...values, lojas:values.lojas.map(x=>{return x.id===loja.id?{...x, isLike:true, likeQTD:x.likeQTD+1}:x})}))
    }

    const deleteLikeLoja = (event, loja) => {
        event.preventDefault();
        axios.delete("/loja/loja/like/"+loja.id).then(r=>setValues({...values, lojas:values.lojas.map(x=>{return x.id===loja.id?{...x, isLike:false, likeQTD:x.likeQTD-1}:x})}))
    }

    const modalColab = (event, loja) =>{
        event.stopPropagation();
        document.getElementById("modal-colaboradores").showModal();
        setValues({...values, loja})
    }

    const onError = ({ currentTarget })=>{currentTarget.onError=null; currentTarget.src=lojaNotFound}


    return (        
        <div className="lojas-conteudo">
            {values.lojas.map((loja, indexLoja) =>            
                <section className="card-loja" key={"loja-"+indexLoja}> 
                    <header>
                        <a href={"/loja/"+loja.id}>
                            <img className='imagem-loja' alt={"Foto loja : " +loja.nome} src={host+`/loja/lojas/imagem/${loja.id}/${loja.imagem}?Authorization=${localStorage.getItem("token")}`} onError={onError} />                            
                            <h3>{loja.nome}</h3>                             
                        </a>
                        <div className='opcoes'>⋮</div>
                    </header>
                    <div style={{padding:"2% 0"}}>
                        <div>preparo: {`${loja.preparacaoValor} ${loja.preparacaoUnidadeDTO}`}</div>
                        <div>entrega: </div>
                        <div>distancia: {loja.distancia/1000} km</div>
                    </div>

                    <div className="loja-curtidas">{loja.likeLojasQTD} curtidas</div>
                    <div className="loja-curtidas" style={{textAlign: "end"}} onClick={event=>{event.preventDefault();setValues({...values,lojas:values.lojas.map(x=>{return x.id===loja.id?{...x, expandComentarios:!x.expandComentarios}:x})})}}>{loja.comentarioLojasQTD} comentarios</div>
                    
                    <div className="like-container">                        
                        <div className="loja-like" onClick={event=>loja.isLike?deleteLikeLoja(event, loja):likeLoja(event, loja)}>{loja.isLike?'❤️':'🤍'}</div>
                        <div className="loja-like" onClick={event=>modalColab(event, loja)}>👥</div>
                        <div className="loja-like" onClick={event=>{event.preventDefault();setValues({...values, lojas:values.lojas.map(x=>{return x.id===loja.id?{...x, expandComentarios:!x.expandComentarios}:x})})}}>💬</div>
                    </div>  
                    {loja.expandComentarios&&<LojaComentarios id={loja.id}/>}                                      
                </section>            
            )}
            

            <dialog onClick={event=>document.getElementById("modal-colaboradores").close()} id="modal-colaboradores">
                <Colaboradores loja={values.loja}/>
            </dialog> 

            <a className='google-boot' href={"?pageLoja="+(values.page+1)}>teste</a> 

            <div className="loader-listar-loja">
                {values.load ? "fim dos lojas" : <img style={{ height: "5em" }} src={loader} ref={loadRef} alt="loading..." />}
            </div>
        </div>                
    )
}

export default ListarLojas
