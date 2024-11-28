import { useEffect, useState } from 'react';

import "./lojas.css"
import axios from '../../../config/api/api';
import loader from "./../../../assets/loadinfo.gif";

function ListarLojas(props){
         
    const [values, setValues] = useState({lojas:[]})    
    const host = process.env.REACT_APP_URL;


    useEffect(() => 
        axios.get(`${props.id?'/loja/lojas/'+props.id:'/loja/lojas/public'}?page=${0}&size=${10}`).then(lojas =>             
            setValues({lojas:lojas.data, usuario:JSON.parse(localStorage.getItem('usuario')), total: lojas.headers['total']})                
        )
    , [props.id]);      

    const handlerScroll = (event) => {  
        if((event.target.scrollHeight - event.target.scrollTop)<=event.target.clientHeight&&values.lojas&&values.total&&values.lojas.length<values.total){                                                                   
            axios.get(`${props.id?'/loja/lojas/'+props.id:'/loja/lojas/public'}?page=${values.lojas.length/10}&size=${10}`).then(lojas =>
                setValues({...values, lojas:values.lojas.concat(lojas.data), total:lojas.headers.total})                
            )
        }
        if(props.onScroll)props.onScroll(event);
    }

    return (        
        <div className="lojas-conteudo" onScroll={handlerScroll}>
            {values.lojas.map((loja, indexLoja) =>            
                <section className="card-loja" key={"loja-"+indexLoja}> 
                    <header style={{padding: "2%"}}>
                        <img alt={"Foto loja : " +loja.nome} src={host+loja.imagemPath} style={{borderRadius: "50%", width:"3em", height:"3em"}}/>
                        <h3 style={{fontWeight:"bolder", display: "inline", fontSize:"11pt", paddingLeft:'2%'}}>{loja.nome}</h3>                             
                        <div style={{fontWeight:"bolder", float:"right", cursor:"pointer"}}>⋮</div>
                    </header>
                </section>            
            )}
            <div style={{textAlign:"center"}}>{values.total&&values.lojas.length>=values.total?"fim das lojas":<img style={{height:"5em"}} src={loader} alt="loading..."/>}</div>
        </div>                
    )
}

export default ListarLojas
