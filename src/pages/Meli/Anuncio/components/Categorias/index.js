import axios from '../../../../../config/api/api';
import { useEffect, useState } from 'react';
import LabelSelect from "../../../../../estrutura/LabelSelect";

function Categorias(props){

    const [values, setValues] = useState({categorias:[], categoria:{}});
    const host = process.env.REACT_APP_URL;

    useEffect(() => 
        props.category_id?
            axios.get('/meli/categorias/'+props.category_id).then(res => 
                axios.get('/meli/dominios/MLB/categorias')
                    .then(resp => setValues({categorias:[{id:"MLB", lista:resp.data}], categoria:res.data}))
            )
        :axios.get('/meli/dominios/MLB/categorias')
            .then(resp => setValues({categorias:[{id:"MLB", lista:resp.data}], categoria:{}}))
    , [props.category_id, host]);
    
    function addCategoria(index, i){                   
        if(i === "")
            setValues({...values, categorias:values.categorias.slice(0, index+1)});            
        else {
            var categoria = values.categorias[index].lista[i].id            
            axios.get('/meli/categorias/'+categoria).then(response => {            
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
                {values.categoria.name?<div className="d-flex">
                        <p style={{marginBottom: '0', fontWeight: 'bolder', paddingLeft:'0.3em', paddingRight:'0.3em'}}>{values.categoria.name}</p>                        
                        <button onClick={event=>{event.preventDefault();props.onChange(undefined)}} disabled={props.disabled} style={{paddingTop: '0', height:'20px'}} className="btn btn-success"> 🖊️ </button>                        
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
