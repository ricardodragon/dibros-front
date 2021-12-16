import axios from 'axios';
import { useEffect, useState } from 'react';
import LabelSelect from '../../../LabelSelect';

function Categorias(props){

    const [values, setValues] = useState({categorias:[]});
      
    const setCategorias = async () => 
        setValues({...values,
            categorias:[{id:"MLB", lista:(await axios.get('http://localhost:8080/meli/dominios/MLB/categorias')).data}]
        });

    useEffect(() => setCategorias(), []);
    
    function addCategoria(event, index){     
        if(event.target.value == ""){
            setValues({...values,            
                categorias:values.categorias.slice(0, index+1)
            });
            props.onChange(undefined)
        }else {
            const categoria = JSON.parse(event.target.value)   
            axios.get('http://localhost:8080/meli/categorias/'+categoria.id).then(response => {            
                if(response.data.children_categories.length==0) {          
                    setValues({
                        ...values,                     
                        categorias:values.categorias.slice(0, index+1)
                    });                
                    props.onChange(categoria.id) 
                }
                else{
                    setValues({...values,            
                        categorias:values.categorias.slice(0, index+1).concat({id:categoria.id, lista:response.data.children_categories})
                    });
                    props.onChange(undefined)
                }
            })
        }
    }
    
    return (
        <>                        
            {
                values.categorias.map((categoria, index) => { 
                    return (
                        <LabelSelect id={index+categoria.id} lista={categoria.lista} onChange={(event)=>{addCategoria(event, index)}} value="id" label={""} name = "name"/>                        
                    )
                })
            }
        </>
    )
}

export default Categorias
