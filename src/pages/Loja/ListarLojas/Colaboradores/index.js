import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from '../../../../config/api/api';
import loader from "./../../../../assets/loadinfo.gif";

function Colaboradores(props) {
    
    const [values, setValues] = useState({loader:true, colabEmail:""})
    const host = process.env.REACT_APP_URL;

    useEffect(() =>{
        setValues({loader:true})
        return props.loja?
            axios.get(`/loja/lojas/usuarios/${props.loja.id}?page=${0}&size=${10}`)
                .then(res => setValues({usuarioLojas:res.data, loader:false, colabEmail:""})):""
    }, [props.loja]);

    const excluir = (event, userLoja) => axios.delete(`/loja/lojas/usuarios/${userLoja.idUsuario}/${userLoja.idLoja}`).then(r=>setValues({...values, colaboradores:values.colaboradores.filter(x=>x.idUsuario!==userLoja.idUsuario)}))
    
    return(         
        <div style={{width:'98%', height:'100%', padding:'1%'}} onClick={event=>event.stopPropagation()}>
            
            {values.loader&&<img style={{height:"5em", top:"50%"}} src={loader} alt="loading..."/>}                        

            {values.usuarioLojas&&values.usuarioLojas.map(userLoja=>
                <div style={{textAlign:'left'}} key={userLoja.idUsuario+''+userLoja.idLoja}>
                    <Link style={{display:'inline', verticalAlign:'top'}} to={"/perfil/"+userLoja.usuarioDTO.id}><img alt="Imagem perfil user" src={`${host}/auth/usuarios/imagem/${userLoja.usuarioDTO.id}/${userLoja.usuarioDTO.imagem}?Authorization=${localStorage.getItem("token")}`} style={{borderRadius: "50%", width:"2.7em", height:"2.7em"}}/></Link>                                      
                    <div style={{display:'inline-block', width:'80%'}}>
                        <Link to={"/perfil/"+userLoja.usuarioDTO.id} style={{display:'inline-block'}}>
                            {userLoja.usuarioDTO.nome&&<p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{userLoja.usuarioDTO.nome}</p>}
                            {userLoja.usuarioDTO.email&&<p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{userLoja.usuarioDTO.email}</p>}
                        </Link>
                        <p style={{whiteSpace:'break-spaces', lineHeight:'normal'}}></p>
                        <button style={{display:'inline-block', width:'47%'}} disabled>{userLoja.conviteAceito?'colaborador':'aguardando'}</button>
                        {props.loja.isAdmin&&
                            <button onClick={event=>excluir(event, userLoja)} style={{display:'inline-block', color:'white', backgroundColor:'rgba(255, 0, 0, 0.70)', width:'47%', cursor:'pointer'}}>{userLoja.conviteAceito?'excluir':'cancelar'}</button>
                        }
                    </div>            
                    <hr></hr>
                </div>
            )}
            
        </div>)

}export default Colaboradores;