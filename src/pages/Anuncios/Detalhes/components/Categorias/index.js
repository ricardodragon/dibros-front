import axios from 'axios';
import { useEffect, useState } from 'react';
import { BsPencil } from "react-icons/bs";
import LabelSelect from "../../../../../estrutura/LabelSelect";

function Categorias(props){
    const dominio = process.env.REACT_APP_MELI_DOMAIN
    const [values, setValues] = useState({categorias:[], categoria:{}});
      
    const setCategorias = async (id=undefined) => setValues({
        ...values,
        categoria:id?(await axios.get(dominio+'/meli/categorias/'+props.category_id)).data:{},
        categorias:[{id:"MLB", lista:(await axios.get(dominio+'/meli/dominios/MLB/categorias')).data}]          
    });        

    useEffect(() => setCategorias(props.category_id), [props.category_id]);
    
    function addCategoria(index, i){                   
        if(i === "")
            setValues({...values, categorias:values.categorias.slice(0, index+1)});            
        else {
            var categoria = values.categorias[index].lista[i].id            
            axios.get(dominio+'/meli/categorias/'+categoria).then(response => {            
                if(response.data.children_categories.length===0) {                          
                    setValues({...values, categorias:values.categorias.slice(0, 1), categoria})
                    props.onChange(categoria)                     
                }
                else{
                    setValues({...values, categorias:values.categorias.slice(0, index+1).concat({id:categoria, lista:response.data.children_categories})});                                    
                    props.onChange(undefined)
                }                    
            })
        }
    }
    
    return (
        <>  
            <h5 className="h3">Categoria</h5>
            <div className='d-flex' style={{padding:'1.5em'}}>  
                <label style={{whiteSpace:'nowrap', display:'block'}}>Categoria : </label>
                {props.category_id?<div className="d-flex">
                        <p style={{marginBottom: '0', fontWeight: 'bolder', paddingLeft:'0.3em', paddingRight:'0.3em'}}>{values.categoria.name}</p>                        
                        <button onClick={event=>{event.preventDefault();props.onChange(undefined)}} disabled={props.disabled} style={{paddingTop: '0', height:'20px'}} className="btn btn-success"><BsPencil style={{paddingBottom: '0.3em'}} size={0}/></button>                        
                    </div>:                    
                    <div className="d-flex">
                    {
                        values.categorias.map((categoria, index) => { 
                            return (                                
                                <LabelSelect required={true} key={index} disabled={props.disabled} id={categoria.id} lista={categoria.lista} onChange={(i)=>addCategoria(index, i)} value="id" label={""} name = "name"/>                        
                            )
                        })
                    }
                </div>
                }          
                
            </div>
            <hr/>
        </>
    )
}

export default Categorias
