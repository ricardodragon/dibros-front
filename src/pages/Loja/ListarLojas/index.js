import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import axios from '../../../config/api/api';
import loader from "./../../../assets/loadinfo.gif";
import "./lojas.css";

function ListarLojas(props){
         
    const [values, setValues] = useState({lojas:[]})    
    const host = process.env.REACT_APP_URL;
    const { id } = useParams();

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

    return (        
        <div className="lojas-conteudo" onScroll={handlerScroll}>
            {values.lojas.map((loja, indexLoja) =>            
                <section className="card-loja" key={"loja-"+indexLoja}> 
                    <header style={{padding: "2%", overflow:'hidden'}}>
                        <img alt={"Foto loja : " +loja.nome} src={host+loja.imagemPath} style={{borderRadius: "50%", width:"3em", height:"3em"}}/>
                        <h3 style={{textOverflow: "ellipsis", maxWidth: "16ch", overflow: "hidden", verticalAlign:'top', fontWeight:"bolder", display: "inline", fontSize:"11pt", paddingLeft:'2%'}}>{loja.nome}</h3>                             
                        <div style={{fontWeight:"bolder", float:"right", cursor:"pointer"}}>⋮</div>
                    </header>
                </section>            
            )}
            <div style={{textAlign:"center"}}>{values.total&&values.lojas.length>=values.total?"fim das lojas":<img style={{height:"5em"}} src={loader} alt="loading..."/>}</div>
        </div>                
    )
}

export default ListarLojas
