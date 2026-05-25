import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import axios from '../../../config/api/api';
import loader from "./../../../assets/loadinfo.gif";
import "./lojas.css";
import { Link } from 'react-router-dom';

function ListarLojas(props){
         
    const [values, setValues] = useState({lojas:[]})    
    const host = process.env.REACT_APP_URL;
    const { id } = useParams();
    const lojaNotFound = "https://thumbs.dreamstime.com/b/%C3%ADcone-de-imagem-sem-foto-ou-em-branco-carregamento-imagens-aus%C3%AAncia-marca-n%C3%A3o-dispon%C3%ADvel-sinal-breve-silhueta-natureza-simples-215973362.jpg";

    useEffect(() => 
        axios.get('/loja/lojas'+(id?`?idUsuario=${id}&`:localStorage.getItem("token")?'?':'/public?')+`page=${0}&size=${10}`).then(lojas =>             
            setValues({lojas:lojas.data, page:0, usuario:JSON.parse(localStorage.getItem('usuario'))})                
        )
    , [id]);      

    const handlerScroll = (event) => {  
        const page = values.page+1; 
        if((event.target.scrollHeight - event.target.scrollTop)<=event.target.clientHeight&&values.lojas&&values.total&&values.lojas.length<values.total){                                                                   
            axios.get('/loja/lojas'+(id?`?idUsuario=${id}&`:localStorage.getItem("token")?'?':'/public?')+`page=${page}&size=${10}`).then(lojas =>
                setValues({...values, page, lojas:values.lojas.concat(lojas.data), total:lojas.headers.total})                
            )
        }
        if(props.onScroll)props.onScroll(event);
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
                </section>            
            )}
            <div style={{textAlign:"center"}}>
                {values.total&&values.lojas.length>=values.total?"fim das lojas":<img style={{height:"5em"}} src={loader} alt="loading..."/>}
            </div>
        </div>                
    )
}

export default ListarLojas
