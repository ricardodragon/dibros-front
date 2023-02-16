import { useEffect, useState } from "react";
import axios from "axios";
import "./usuarios.css"
import LabelInput from "../../estrutura/LabelInput";

function Usuarios(){

    const [values, setValues] = useState({usuarios:[], usuario:{email:"", username:"", password:""}})    
    
    useEffect(() => 
        axios.get(process.env.REACT_APP_MELI_DOMAIN+"/auth/usuarios/all").then(usuarios => {setValues({usuarios:usuarios.data, usuario:{email:"", username:"", password:""}});}), 
    []);

    const submit = event => {
        event.preventDefault();
        values.usuario.id?
            axios.put(process.env.REACT_APP_MELI_DOMAIN+"/auth/usuarios", values.usuario).then(res => 
                axios.get(process.env.REACT_APP_MELI_DOMAIN+"/auth/usuarios/all").then(usuarios => {setValues({usuarios:usuarios.data, usuario:{email:"", username:"", password:""}});})):
            axios.post(process.env.REACT_APP_MELI_DOMAIN+"/auth/usuarios", values.usuario).then(res => 
                axios.get(process.env.REACT_APP_MELI_DOMAIN+"/auth/usuarios/all").then(usuarios => {setValues({usuarios:usuarios.data, usuario:{email:"", username:"", password:""}});}))
        
    }

    return (
        <div className="p-2">            
            <form className="mb-4" onSubmit={submit}>                
                <fieldset id="usuario" className="p-2" style={{overflow:"hidden"}}>
                    <legend>{values.usuario.id?"Editar":"Criar"} Usuário</legend>
                    {values.usuario.id?<h1>{values.usuario.id}</h1>:""}
                    <LabelInput value={values.usuario.email} label="Email : " placeholder="email" id="email" type="email" onChange={email=>{setValues({...values, usuario:{...values.usuario,email}})}}/>                    
                    <LabelInput value={values.usuario.username} label="Nome de usuario : " placeholder="nome de usuario" id="username" type="text" onChange={username=>{setValues({...values, usuario:{...values.usuario,username}})}}/>                    
                    <LabelInput value={values.usuario.password} label="Senha : " placeholder="password" id="password" type="password" onChange={password=>{setValues({...values, usuario:{...values.usuario,password}})}}/>
                    <input type="submit" value="enviar" className="btn btn-sm btn-success mt-2"/>    
                    {values.usuario.id?<input onClick={event => {event.preventDefault();setValues({...values, usuario:{username:"",password:"", email:""}})}} type="submit" className="btn btn-sm btn-primary mt-2" value="Limpar"/>:""}                        
                </fieldset>
            </form>
            <div className="table-responsive">
                <table className="table " >     
                    <thead className="thead-light">
                        <tr className="table-light">
                            <th scope="col">#</th>
                            <th scope="col">Email</th>
                            <th scope="col">Usuario</th>
                            <th scope="col">Permissão</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead> 
                    <tbody>                
                        {values.usuarios.map((u,index)=>
                            <tr key={u.id}>
                                <th scope="row">{index}</th>
                                <td>{u.email}</td>
                                <td>{u.username}</td>
                                <td>{u.role}</td>
                                <td>{u.role!=="ADMIN"?<button className="btn btn-sm btn-primary" onClick={event=>{event.preventDefault();setValues({...values, usuario:u})}}>Editar</button>:""}</td>
                                <td>{u.role!=="ADMIN"?<button className="btn btn-sm btn-danger" onClick={event=>{event.preventDefault();axios.delete(process.env.REACT_APP_MELI_DOMAIN+"/usuario/"+u.id)}}>X</button>:""}</td>
                            </tr>
                        )}               
                    </tbody>    
                </table>
            </div>            
        </div>
    )
}

export default Usuarios