import axios from 'axios';
import { useEffect, useState } from 'react';
import LabelInput from '../LabelInput';
import LabelSelect from '../LabelSelect';

function Atributos(props){

    const [values, setValues] = useState({atributos:[]});
    

    async function setAtributos(){                                                    
        const atributos = (await axios.get('http://localhost:8080/atributos/'+props.categoria)).data;                               
        const domainId = (await axios.get('http://localhost:8080/categorias/'+props.categoria)).data.settings.catalog_domain;                         
        for(var i in atributos.filter((value) => { if(value.value_type=="string" ) return value}))                                      
            try {
                atributos[i].values = (await axios.get('http://localhost:8080/atributos/top/'+domainId+"/"+atributos[i].id)).data                                                       
            }catch(err){}                          

        
        setValues({...values, atributos});               
    }

    useEffect(() => 
        setAtributos()  
    ,[props]);                             
            
    return ( 
        <>            
            {                               
                values.atributos.map((atributo, index) => {                     
                    if(atributo.value_type=="boolean")                    
                        return <span style={{float: "left", width: "100%",  padding: "1%"}} key={index}>
                            <LabelSelect id={atributo.id+""+index} lista={atributo.values} value="id" name="name" label={atributo.name} onChange={(event)=>{}}/>
                        </span>                
                    else if(atributo.value_type=="string")
                        return <span style={{float: "left", width: "100%",  padding: "1%"}} key={index}>
                            <LabelInput  
                                id={index} value="id" name="name" 
                                label={atributo.name}
                                onChange={(event) => {}} 
                                type="text"/>
                            {atributo.values?<LabelSelect id={atributo.id+""+index} lista={atributo.values} value="id" name="name" label={atributo.name} onChange={(event)=>{}}/>:""}                                    
                        </span>                    
                })
            }
        </>   
    )
}

export default Atributos
