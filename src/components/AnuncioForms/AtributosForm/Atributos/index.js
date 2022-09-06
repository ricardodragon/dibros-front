import { useEffect, useState } from 'react';
import LabelInput from '../../../Estrutura/LabelInput';
import LabelSelect from '../../../Estrutura/LabelSelect';
import axios from 'axios';


function Atributos(props){

    const dominio = "http://DESKTOP-DS0K2GT:8080"
    const [values, setValues] = useState({atributos:[]});
    

    async function setAtributos(){                                                    
        var atributos = (await axios.get(dominio+'/meli/atributos/'+props.categoria)).data.map(d=>{ return {...d, selected:d.tags.catalog_required}})
        atributos = atributos.map(a => { 
            var f = props.value.filter(aa=>a.id==aa.id);  
            return {...a, selected:(f.length&&f[0].selected)||a.selected||a.tags.catalog_required, value_id: f.length?f[0].value_id:a.value_id, value_name:f.length?f[0].value_name:a.value_name}
        });      
        props.onChange(atributos)
    }useEffect(() => setAtributos() ,[props.categoria]);                               

    return ( 
        <>                     
            {                               
                props.value.filter(s => s.selected).map((atributo, index) => {                      
                    if(atributo.value_type=="boolean")
                        return <LabelSelect disabled={props.disabled}  
                            id={atributo.id} label={atributo.name} 
                            lista={atributo.values.map(a=>{return {name:a.name, selected: false}})}                             
                            onChange={value_id=>props.onChange(props.value.filter(a=> a.id!=atributo.id).concat({...atributo, value_id:atributo.values[value_id].id, value_name:atributo.values[value_id].name}))}/>                        
                    return <>                        
                        <LabelInput disabled={props.disabled} value={atributo.value_name} 
                            label={atributo.name} id={atributo.id} type="text" list={atributo.id+"-"+index} 
                            onChange={value_name=>props.onChange(props.value.map(a=> a.id!=atributo.id?a:{...a, value_name}))}/>                        

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

// const domainId = (await axios.get('http://localhost:8080/meli/categorias/'+props.categoria)).data.settings.catalog_domain;                                 
// for(const i in atributos.filter((value) => value.value_type=="string")){
//     try {
//         const values = (await axios.get('http://localhost:8080/meli/atributos/top/'+domainId+"/"+atributos[i].id)).data                                                       
//         atributos[i].values = values.length>0?values:atributos[i].values
//     }catch(err){}
// };     