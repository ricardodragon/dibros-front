import axios from 'axios';
import { useEffect, useState } from 'react';

function Categorias(props){

    const [values, setValues] = useState({categorias:[]});
      
    const getCategorias = async () => 
        setValues({...values,
            categorias:[{id:"MLB", lista:(await axios.get('http://localhost:8080/dominios/MLB/categorias')).data}]
        });

    useEffect(() => getCategorias(), []);
    
    function addCategoria(event, index){          
        axios.get('http://localhost:8080/categorias/'+event.target.value).then(response => {            
            if(response.data.children_categories.length==0) {          
                setValues({
                    ...values,                     
                    categorias:values.categorias.slice(0, index+1)
                });                
                props.onChange(event.target.value) 
            }
            else
                setValues({...values,            
                    categorias:values.categorias.slice(0, index+1).concat({id:event.target.value, lista:response.data.children_categories})
                }); 
        })
    }
    
    return (
        <>                        
            {
                values.categorias.map((categoria, index) => { 
                    return (<select onChange={(event)=>{addCategoria(event, index)}}>
                        <option selected></option>
                        {   
                            categoria.lista.map((value, index) => {                        
                                return (
                                    <option key={index} name={index} value={value.id}>{value.name}</option>
                                )
                            })
                        }
                    </select> )
                })
            }
        </>
    )
}

export default Categorias
