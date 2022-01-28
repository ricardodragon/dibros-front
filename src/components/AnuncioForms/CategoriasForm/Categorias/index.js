import axios from 'axios';
import { useEffect, useState } from 'react';
import LabelSelect from '../../../Estrutura/LabelSelect';

function Categorias(props){

    const [values, setValues] = useState({categorias:[]});
      
    const setCategorias = async () => 
        setValues({...values,
            categorias:[{id:"MLB", lista:(await axios.get('http://localhost:8080/meli/dominios/MLB/categorias')).data}]
        });

    useEffect(() => setCategorias(), [props.disabled]);
    
    function addCategoria(index, i){                   
        if(i == ""){
            setValues({...values,            
                categorias:values.categorias.slice(0, index+1)
            });
            props.onChange(undefined)
        }else {
            const categoria = values.categorias[index].lista[i].id   
            axios.get('http://localhost:8080/meli/categorias/'+categoria).then(response => {            
                if(response.data.children_categories.length==0) {          
                    setValues({
                        ...values,                     
                        categorias:values.categorias.slice(0, index+1)
                    });                
                    props.onChange(categoria) 
                }
                else{
                    setValues({...values,            
                        categorias:values.categorias.slice(0, index+1).concat({id:categoria, lista:response.data.children_categories})
                    });
                    props.onChange(undefined)
                }
            })
        }
    }
    
    return (
        <>                    
            <label style={{fontWeight:"bold", paddingLeft:"1%"}}>Categoria : </label>{props.categoria}    
            {
                values.categorias.map((categoria, index) => { 
                    return (                                                    
                        <LabelSelect disabled={props.disabled} id={categoria.id} lista={categoria.lista} onChange={(i)=>addCategoria(index, i)} value="id" label={""} name = "name"/>                        
                    )
                })
            }
        </>
    )
}

export default Categorias
