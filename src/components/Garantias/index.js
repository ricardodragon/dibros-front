import axios from 'axios';
import { useEffect, useState } from 'react';

function Garantias(){
        
    const [type, setType] = useState({values: []})
    const [time, setTime] = useState({allowed_units: []});

    const getGarantias = async () => {
        const response = (await axios.get('http://localhost:8080/garantias/MLB5095')).data
        setType(response.filter(value => { if(value.id=="WARRANTY_TYPE") return value})[0])
        setTime(response.filter(value => { if(value.id=="WARRANTY_TIME") return value})[0])
        console.log(type)
    }

    useEffect(() => { getGarantias() }, []);
    
        
    return (        
        <div>                                 
            
            <span style={{float: "left", width: "31%"}}>
                <label htmlFor="tipo_garantia">Tipo de garantia : </label>                    
                <select name="tipo_garantia" id="tipo_garantia">   
                    {                                                                              
                        type.values.map(value => {
                            return (<option key={value.id} id={value.id} name={value.id} value={value.id}>{value.name}</option>)
                        })
                    }
                </select>
            </span>                
            
            <span style={{float: "right", width: "31%"}}>
                <label htmlFor="garantia">Tempo da garantia : </label>
                <input id="garantia" type="number"/>                        
            </span>
            
            <span style={{width: "31%"}}>
                <label htmlFor="garantia">Unidade tempo da garantia : </label>
                <select name="garantias" id="garantias">                                                         
                    {
                        time.allowed_units.map(value => {
                            return (<option key={value.id} id={value.id} name={value.id} value={value.id}>{value.name}</option>)
                        })
                    }
                </select>
            </span>
        </div>
    )
}export default Garantias