import axios from 'axios';
import { useEffect, useState } from 'react';

function Garantias(){
    
    const [garantias, setGarantias] = useState([]);

    const getGarantias = async () => 
        setGarantias(garantias.concat((await axios.get('http://localhost:8080/garantias/MLB5095')).data));
    

    useEffect(() => { getGarantias() }, []);

        
    return (        
        <div>
            {
                garantias.map((value, index) => {
                    if(value.id=="WARRANTY_TYPE") 
                        return (            
                            <span key={index} style={{float: "left", width: "31%",  padding: "1%"}}>
                                <label for="index">Tipo de garantia : </label>                    
                                <select name="index" id="index">                                                         
                                    {
                                        value.values.map((valor, i) => {
                                            return (<option id={i} name={valor.id} value={valor.id}>{valor.name}</option>)
                                        })
                                    }
                                </select>
                            </span>                
                        )
                    if(value.id=="WARRANTY_TIME") 
                        return (                                                            
                            <span key={index} style={{ width: "31%",  padding: "1%"}}>
                                <label for="garantia">Tempo da garantia : </label>
                                <input id="garantia" type="number"/>                        
                            </span>
                        )
                    if(value.id=="WARRANTY_TIME") 
                        return (
                            <span style={{width: "31%",  padding: "1%"}}>
                                <select name="garantias" id="garantias">                                                         
                                    {
                                        value.allowed_units.map((valor, i) => {
                                            return (<option id={i} name={valor.id} value={valor.id}>{valor.name}</option>)
                                        })
                                    }
                                </select>
                            </span>
                        )
                })
            }
        </div>
    )
}

export default Garantias
