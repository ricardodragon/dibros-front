import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../../config/api/api';
import './../../header.css';

function ColaboradorAceito(props){
    const [values, setValues] = useState({});
    const host = process.env.REACT_APP_URL;

    useEffect(() => 
        axios.get("/loja/lojas/"+props.id).then(loja => setValues({loja:loja.data}))
    , [props.id])



    return values.loja?
        <div style={{padding:'1%', textAlign:'left'}} className='notificacao-check'>
            <Link style={{display:'inline', verticalAlign:'top', width:'50%'}} to={"/perfil/"+values.loja.id}><img alt="Imagem perfil user" src={values.loja.imagemPath?host+values.loja.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"} style={{borderRadius: "50%", width:"2.7em", height:"2.7em"}}/></Link>                                      
            <div style={{display:'inline-block', width:'50%'}}><Link to={"/perfil/"+values.loja.id}><p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{values.loja.nome}</p></Link><p style={{whiteSpace:'break-spaces', lineHeight:'normal'}}>convite aceito</p></div>            
            <hr/>
        </div>:
        <></>;
}
export default ColaboradorAceito