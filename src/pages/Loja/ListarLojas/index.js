import { useEffect, useState } from 'react';
import axios from '../../../config/api/api';
import loader from "./../../../assets/loadinfo.gif";
import "./lojas.css";
import { Link } from 'react-router-dom';
import LojaComentarios from '../LojaComentarios';
import Colaboradores from './Colaboradores';

function ListarLojas(props){
         
    const [values, setValues] = useState({lojas:[]})    
    const host = process.env.REACT_APP_URL;    
    const lojaNotFound = "https://thumbs.dreamstime.com/b/%C3%ADcone-de-imagem-sem-foto-ou-em-branco-carregamento-imagens-aus%C3%AAncia-marca-n%C3%A3o-dispon%C3%ADvel-sinal-breve-silhueta-natureza-simples-215973362.jpg";

    useEffect(() => 
        props.url?
            axios.get(`${props.url}?page=${0}&size=${10}`).then(lojas => setValues({lojas:lojas.data, page:0, usuario:JSON.parse(localStorage.getItem('usuario'))})):""                
    , [props.url]);      

    const loadEvento = (load) => {        
        if(!load||values.carregando) return;
        setValues({...values, carregando:true})
        const buscar = () => axios.get(`${props.url}?page=${values.page+1}&size=${10}&idLoja=${props.id}`).then(lojas=>setValues({...values, carregando:false, page:values.page+(lojas.data.length===0?0:1), load:lojas.data.length===0, lojas:values.lojas.concat(lojas.data)}))
        
        const observador = new IntersectionObserver(([entry]) => entry.isIntersecting?buscar():"");
        observador.observe(load);
    };

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
                        <Link to={"/loja/"+loja.id}>
                            <img className='imagem-loja' alt={"Foto loja : " +loja.nome} src={host+`/loja/lojas/imagem/${loja.id}/${loja.imagem}?Authorization=${localStorage.getItem("token")}`} onError={onError} />                            
                            <h3>{loja.nome}</h3>                             
                        </Link>
                        <div className='opcoes'>⋮</div>
                    </header>
                    <div style={{padding:"10%"}}></div>
                    <div className="loja-curtidas">{loja.likeLojasQTD} curtidas</div>
                    <div className="loja-curtidas" style={{textAlign: "end"}} onClick={event=>setValues({...values, lojas:values.lojas.map(x=>{return x.id===loja.id?{...x, expandComentarios:!x.expandComentarios}:x})})}>{loja.comentarioLojasQTD} comentarios</div>
                    
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

            <div className="loader-listar-loja">
                {values.load?"fim dos lojas":<img style={{height:"5em"}} src={loader} ref={loadEvento} alt="loading..."/>}
            </div>
        </div>                
    )
}

export default ListarLojas
