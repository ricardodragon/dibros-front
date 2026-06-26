import { useEffect, useState } from 'react';
import axios from '../../../config/api/api';
import loader from "./../../../assets/loadinfo.gif";
import "./lojas.css";
import { Link } from 'react-router-dom';
import Colaboradores from '../CriarLojas/Colaboradores';
import LojaComentarios from '../LojaComentarios';

function ListarLojas(props){
         
    const [values, setValues] = useState({lojas:[]})    
    const host = process.env.REACT_APP_URL;    
    const lojaNotFound = "https://thumbs.dreamstime.com/b/%C3%ADcone-de-imagem-sem-foto-ou-em-branco-carregamento-imagens-aus%C3%AAncia-marca-n%C3%A3o-dispon%C3%ADvel-sinal-breve-silhueta-natureza-simples-215973362.jpg";

    useEffect(() => 
        axios.get(`/loja/lojas?idUser=${props.id}&page=${0}&size=${10}`).then(lojas =>             
            setValues({lojas:lojas.data, page:0, usuario:JSON.parse(localStorage.getItem('usuario'))})                
        )
    , [props.id]);      

    const handlerScroll = (event) => {  
        const page = values.page+1; 
        if((event.target.scrollHeight - event.target.scrollTop)<=event.target.clientHeight&&values.lojas&&values.total&&values.lojas.length<values.total){                                                                   
            axios.get(`/loja/lojas?idUser=${props.id}&page=${page}&size=${10}`).then(lojas =>
                setValues({...values, page, lojas:values.lojas.concat(lojas.data), total:lojas.headers.total})                
            )
        }
        if(props.onScroll)props.onScroll(event);
    }

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
        <div className="lojas-conteudo" onScroll={handlerScroll}>
            {values.lojas.map((loja, indexLoja) =>            
                <section className="card-loja" key={"loja-"+indexLoja}> 
                    <header>
                        <Link to={"/loja/"+loja.id}>
                            <img alt={"Foto loja : " +loja.nome} src={host+loja.imagemPath} onError={onError} />                            
                            <h3>{loja.nome}</h3>                             
                        </Link>
                        <div className='opcoes'>⋮</div>
                    </header>
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
            
            <div style={{textAlign:"center"}}>
                {values.total&&values.lojas.length>=values.total?"fim das lojas":<img style={{height:"5em"}} src={loader} alt="loading..."/>}
            </div>
        </div>                
    )
}

export default ListarLojas
