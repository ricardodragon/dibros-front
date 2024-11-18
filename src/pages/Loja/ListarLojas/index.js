import { useEffect, useState } from 'react';

import "./lojas.css"
import axios from '../../../config/api/api';
import loader from "./../../../assets/loadinfo.gif";

function ListarLojas(props){
         
    const [values, setValues] = useState({lojas:[]})    
    const host = process.env.REACT_APP_URL;


    useEffect(() => 
        axios.get(process.env.REACT_APP_URL+"/auth/usuarios").then(r=>
            setValues({lojas:props.lojas, usuario:r.data})            
        )
    , [props.lojas]);    
    
    return (        
        <div className="lojas-conteudo" id="lojas" onScroll={props.scroll}>
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
