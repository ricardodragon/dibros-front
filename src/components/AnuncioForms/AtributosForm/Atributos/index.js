import axios from 'axios';
import { useEffect, useState } from 'react';
import LabelInput from '../../../LabelInput';
import LabelSelect from '../../../LabelSelect';


function Atributos(props){

    const [values, setValues] = useState({atributos:[]});
    

    async function setAtributos(){                                                    
        const atributos = (await axios.get('http://localhost:8080/atributos/'+props.categoria)).data
        const domainId = (await axios.get('http://localhost:8080/categorias/'+props.categoria)).data.settings.catalog_domain;                         
        
        for(var i in atributos.filter((value) => value.value_type=="string"))                                      
            try {
                const values = (await axios.get('http://localhost:8080/atributos/top/'+domainId+"/"+atributos[i].id)).data                                                       
                atributos[i].values = values.length>0?values:atributos[i].values
            }catch(err){}                          
        
        setValues({...values, atributos});               
    }

    useEffect(() => setAtributos() ,[props.categoria]);                             
        
    const setAtributoInput = (value_name, id) => {
        const a = values.atributos.filter(atributo => atributo.id == id)[0].values
            .filter(values => values.name.toUpperCase() == value_name.toUpperCase())[0]        
        const value_id = a==undefined?undefined:a.id;   
        value_name=value_name==undefined?"":value_name
        value_id?props.onChange({id, value_id}):props.onChange({id, value_name})
    }

    const setAtributoSelect = (event, id)=>{
        const value = JSON.parse(event.target.value);
        props.onChange({id, value_id:value.id}); 
    }

    return ( 
        <>            
            {                               
                values.atributos.map((atributo, index) => {
                    if(atributo.value_type=="boolean")
                        return <LabelSelect id={atributo.id} lista={atributo.values} value="id" name="name" label={atributo.name} onChange={setAtributoSelect}/>                        
                    return <span>                        
                        <LabelInput label={atributo.name} id={atributo.id} type="text" list={atributo.id+"-"+index} value={atributo.value} onChange={value=>setAtributoInput(value, atributo.id)}/>                        
                        <datalist id={atributo.id+"-"+index}>
                            {
                                atributo.values?atributo.values.map((value, index) => {                                    
                                    return <option value={value.name} key={index}/>
                                }):""
                            }       
                        </datalist>
                    </span>
                })
            }
        </>   
    )
}

export default Atributos
