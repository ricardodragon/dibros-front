import { useEffect, useState } from 'react';
import LabelInput from '../../../LabelInput';
import LabelSelect from '../../../LabelSelect';
import axios from 'axios';


function Atributos(props){

    const [values, setValues] = useState({atributos:[]});
    

    async function setAtributos(){                                                    
        const atributos = (await axios.get('http://localhost:8080/meli/atributos/'+props.categoria)).data.filter(a=>props.variacao?(!a.tags.read_only && a.tags.variation_attribute):!a.tags.read_only)            
        const domainId = (await axios.get('http://localhost:8080/meli/categorias/'+props.categoria)).data.settings.catalog_domain;                                 
        for(const i in atributos.filter((value) => value.value_type=="string")){
            try {
                const values = (await axios.get('http://localhost:8080/meli/atributos/top/'+domainId+"/"+atributos[i].id)).data                                                       
                atributos[i].values = values.length>0?values:atributos[i].values
            }catch(err){}
        };                                           
        setValues({...values, atributos});               
    }useEffect(() => setAtributos() ,[props.categoria]);                               

    return ( 
        <>                     
            {                               
                values.atributos.map((atributo, index) => {                    
                    if(atributo.value_type=="boolean")
                        return <LabelSelect  
                            id={atributo.id} label={atributo.name} 
                            lista={atributo.values.map(v=>{return{selected:props.value.filter(a => a.id==atributo.id).length>0, id:v.id, name: v.name}})} 
                            onChange={value_id=>props.onChange({id:atributo.id, name: atributo.name, value_id, value_name:atributo.values.filter(a=>a.id==value_id)[0].name})}/>                        
                    return <>                        
                        <LabelInput value={props.value.filter(a => a.id==atributo.id).map(a=>a.value_name)[0]} 
                            label={atributo.name} id={atributo.id} type="text" list={atributo.id+"-"+index} 
                            onChange={value_name=>props.onChange({
                                id:atributo.id, name: atributo.name, 
                                value_id:atributo.values?atributo.values.filter(a=>a.name.toUpperCase()==value_name.toUpperCase())[0].id:undefined, 
                                value_name})}/>                        

                        <datalist id={atributo.id+"-"+index}>
                            {
                                atributo.values?atributo.values.map((value, index) => {                                    
                                    return <option value={value.name} key={index}/>
                                }):""
                            }       
                        </datalist>
                    </>
                })
            }
        </>   
    )
}

export default Atributos
