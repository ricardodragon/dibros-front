import axios from 'axios';
import { useEffect, useState } from 'react';

function Garantias(props){
        
    const [values, setValues] = useState({})    

    async function setGarantias(){            
               
        const response = (await axios.get('http://localhost:8080/garantias/'+props.categoria)).data
        setValues({
            ...values,
            type:response.filter(value => value.id=="WARRANTY_TYPE")[0],
            time:response.filter(value => value.id=="WARRANTY_TIME")[0]
        })            

    }

    useEffect(() => setGarantias() ,[props]);   
    
    
        
    return (        
        <div>                                                     
            <span style={{float: "left", width: "100%",  padding: "1%"}}>
                <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor="tipo-anuncio">Garantia : </label>                
                <label style={{padding: "1%"}} htmlFor="tipo_garantia">Tipo de garantia : </label>                    
                <select name="tipo_garantia" id="tipo_garantia" onChange={(event) => setValues({...values,tipoGarantia:event.target.value})}>   
                    {                                                                              
                        values.type?values.type.values.map(value => {
                            return (<option key={value.id} id={value.id} name={value.id} value={value.id}>{value.name}</option>)
                        }):null
                    }
                </select>                
                {   
                    values.tipoGarantia != "6150835"?
                    <>
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
                    </>:""
                }
            </span>
        </div>
    )
}export default Garantias