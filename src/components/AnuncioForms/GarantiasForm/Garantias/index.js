import axios from 'axios';
import { useEffect, useState } from 'react';
import LabelInput from '../../../Estrutura/LabelInput';
import LabelSelect from '../../../Estrutura/LabelSelect';

function Garantias(props){
        
    const [values, setValues] = useState({type:[], time:[], unit:"dias"})    
    const dominio = "http://DESKTOP-DS0K2GT"

    async function setGarantias(){                    
        const response = (await axios.get(dominio+':8080/meli/garantias/'+props.categoria)).data        
        setValues({
            ...values,
            type:response.filter(value => value.id=="WARRANTY_TYPE")[0].values,
            time:response.filter(value => value.id=="WARRANTY_TIME")[0].allowed_units
        })            
    }

    useEffect(() => setGarantias() ,[props.categoria]);           
        
    const setType = (event) => {        
        const tipoGarantia = JSON.parse(event.target.value);        
        setValues({...values,tipoGarantia})        
        props.setTipoGarantia({id:"WARRANTY_TYPE", value_id:tipoGarantia.id})        
    }

    const setTime = (event) =>                                               
        props.setTipoGarantia({id:"WARRANTY_TIME", value_id:event+" "+values.unit})        
    
    return (        
        <div>                                                     
            <span style={{float: "left", width: "100%",  padding: "1%"}}>                
                <LabelSelect 
                    id="tipo_garantia" lista={values.type} 
                    name="name" value="id" label={"Tipo de garantia"} 
                    onChange={setType}/>                                           
                {                       
                    values.tipoGarantia!=undefined && values.tipoGarantia.id != "6150835"?
                    <>                        
                        <LabelInput onChange={setTime} label="Tempo da garantia" id="tempo_garantia" type="number"/>
                        <LabelSelect  
                            id="un_tempo_garantia" lista={values.time} 
                            name="name"value="id" label="Unidade tempo da garantia" 
                            onChange={event => setValues({...values, unit:JSON.parse(event.target.value).id})}/>               
                    </>:""
                }
            </span>
        </div>
    )
}export default Garantias