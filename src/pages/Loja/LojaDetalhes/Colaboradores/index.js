import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "./../../../../config/api/api";

function Colaboradores(props){
 
    const [values, setValues] = useState({colaboradores:[]})    
    const host = process.env.REACT_APP_URL;
        
    useEffect(() =>{
        axios.get(`/loja/lojas/usuarios/${props.id}?page=${0}&size=${10}`).then(res => setValues({colaboradores:res.data}))
    }, [props.id]);

    return(<>
        {values.colaboradores&&values.colaboradores.map(userLoja=>
            <div style={{textAlign:'left'}} key={userLoja.idUsuario+''+userLoja.idLoja}>
                <Link style={{display:'inline', verticalAlign:'top'}} to={"/perfil/"+userLoja.usuarioDTO.id}><img alt="Imagem perfil user" src={userLoja.usuarioDTO.imagemPath?host+userLoja.usuarioDTO.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"} style={{borderRadius: "50%", width:"2.7em", height:"2.7em"}}/></Link>                                      
                <div style={{display:'inline-block', width:'80%'}}>
                    <Link to={"/perfil/"+userLoja.usuarioDTO.id} style={{display:'inline-block'}}>
                        {userLoja.usuarioDTO.nome&&<p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{userLoja.usuarioDTO.nome}</p>}
                        {userLoja.usuarioDTO.email&&<p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{userLoja.usuarioDTO.email}</p>}
                    </Link>
                    <p style={{whiteSpace:'break-spaces', lineHeight:'normal'}}></p>
                    <button style={{display:'inline-block', width:'47%'}} disabled>{userLoja.conviteAceito?'colaborador':'aguardando'}</button>
                    {/* {props.usuarioLoja.admin&&props.usuarioLoja.idUsuario!==userLoja.idUsuario&&<button onClick={event=> axios.delete(`/loja/lojas/usuarios/${userLoja.idUsuario}/${userLoja.idLoja}`).then(r=>setValues({...values, colaboradores:values.colaboradores.filter(x=>x.idUsuario!==userLoja.idUsuario)}))} style={{display:'inline-block', color:'white', backgroundColor:'rgba(255, 0, 0, 0.70)', width:'47%', cursor:'pointer'}}>{userLoja.conviteAceito?'excluir':'cancelar'}</button>} */}
                </div>            
                <hr></hr>
            </div>
        )} 
    </>);
}
export default Colaboradores;