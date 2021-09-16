import axios from 'axios';
import { useEffect, useState } from 'react';
import LabelSelect from '../LabelSelect';

function Categorias(props){

    const [values, setValues] = useState({categorias:[]});
      
    const setCategorias = async () => 
        setValues({...values,
            categorias:[{id:"MLB", lista:(await axios.get('http://localhost:8080/dominios/MLB/categorias')).data}]
        });

    useEffect(() => setCategorias(), []);
    
    function addCategoria(event, index){     
        if(event.target.value == ""){
            setValues({...values,            
                categorias:values.categorias.slice(0, index+1)
            });
            props.onChange(undefined)
        }else    
            axios.get('http://localhost:8080/categorias/'+event.target.value).then(response => {            
                if(response.data.children_categories.length==0) {          
                    setValues({
                        ...values,                     
                        categorias:values.categorias.slice(0, index+1)
                    });                
                    props.onChange(event.target.value) 
                }
                else{
                    setValues({...values,            
                        categorias:values.categorias.slice(0, index+1).concat({id:event.target.value, lista:response.data.children_categories})
                    });
                    props.onChange(undefined)
                }
            })
    }
    
    return (
        <>                        
            {
                values.categorias.map((categoria, index) => { 
                    return (
                        <LabelSelect id={index} lista={categoria.lista} onChange={(event)=>{addCategoria(event, index)}} value="id" label={""} name = "name"/>                        
                    )
                })
            }
        </>
    )
}

export default Categorias
