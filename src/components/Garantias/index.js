import axios from 'axios';
import { useEffect, useState } from 'react';

function Garantias(props){
        
    const [values, setValues] = useState({})    

    const setGarantias = async () =>{ 
               
        const response = (await axios.get('http://localhost:8080/garantias/'+props.categoria)).data
        setValues({
            ...values,
            type:response.filter(value => { if(value.id=="WARRANTY_TYPE") return value})[0],
            time:response.filter(value => { if(value.id=="WARRANTY_TIME") return value})[0]
        })            

    }

    useEffect(() => { setGarantias() }, []);
    
        
    return (        
        <div>                                           
            <span style={{float: "left", width: "100%",  padding: "1%"}}>
                <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor="tipo-anuncio">Garantia : </label>                
                <label style={{padding: "1%"}} htmlFor="tipo_garantia">Tipo de garantia : </label>                    
                <select name="tipo_garantia" id="tipo_garantia">   
                    {                                                                              
                        values.type?values.type.values.map(value => {
                            return (<option key={value.id} id={value.id} name={value.id} value={value.id}>{value.name}</option>)
                        }):null
                    }
                </select>
                <label style={{padding: "1%"}} htmlFor="garantia">Tempo da garantia : </label>
                <input id="garantia" type="number"/>                                    
                <label style={{padding: "1%"}} htmlFor="garantia">Unidade tempo da garantia : </label>
                <select name="garantias" id="garantias">                                                         
                    {
                        values.time?values.time.allowed_units.map(value => {
                            return (<option key={value.id} id={value.id} name={value.id} value={value.id}>{value.name}</option>)
                        }):null
                    }
                </select>
            </span>
        </div>
    )
}export default Garantias