import axios from 'axios';
import { useEffect, useState } from 'react';
import LabelInput from '../../../LabelInput';
import LabelSelect from '../../../LabelSelect';


function Atributos(props){

    const [values, setValues] = useState({atributos:[]});
    

    async function setAtributos(){                                                    
        const atributos = props.variacao?
            (await axios.get('http://localhost:8080/atributos/'+props.categoria)).data
                .filter((value) => value.tags.variation_attribute):
            (await axios.get('http://localhost:8080/atributos/'+props.categoria)).data;      
        const domainId = (await axios.get('http://localhost:8080/categorias/'+props.categoria)).data.settings.catalog_domain;                         
        
        for(var i in atributos.filter((value) => value.value_type=="string"))                                      
            try {
                const values = (await axios.get('http://localhost:8080/atributos/top/'+domainId+"/"+atributos[i].id)).data                                                       
                atributos[i].values = values.length>0?values:atributos[i].values
            }catch(err){}                          
        
        setValues({...values, atributos});               
    }

    useEffect(() => setAtributos() ,[props]);                             
            
    return ( 
        <>            
            {                               
                values.atributos.map((atributo, index) => {
                    if(atributo.value_type=="boolean")
                        return <p>
                            <LabelSelect id={atributo.id+"-"+props.variacao} lista={atributo.values} value="id" name="name" label={atributo.name} onChange={(event)=>{}}/>
                        </p>
                        return <p>                        
                            <LabelInput label={atributo.name} id={atributo.id+"-"+props.variacao} type="text" list={atributo.id+"-"+index+"-"+props.variacao} value={atributo.value}/>                        
                            <datalist id={atributo.id+"-"+index+"-"+props.variacao}>
                                {atributo.values?
                                    atributo.values.map((value, index) => {
                                        console.log(atributo.values)
                                        return <option value={value.name} key={index}/>
                                    }):""
                                }                                                        
                            </datalist>
                        </p>
                })
            }
        </>   
    )
}

export default Atributos
