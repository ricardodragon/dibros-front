import axios from "axios";
import { useEffect, useState } from "react";
import LabelInput from "../Estrutura/LabelInput";

function Contas(props){

    const [values, setValues] = useState({contas:[]})     
    const dominio = "http://DESKTOP-DS0K2GT"
    
    async function setContas(){
        setValues({...values,            
            contas:(
                await axios.get(
                    dominio+':8080/meli/contas/all?id='+JSON.parse(localStorage.getItem("usuario")).id
                )
            ).data.concat({id:"0", email:"Todas as contas"})
        })
    }

    const setConta = (email) => {                                         
        const conta = values.contas.filter((value) => value.email==email)[0]
        if(!conta)
            props.onChange(undefined)
        else if(conta.id==="0")
            props.onChange(values.contas.slice(0, values.contas.length-1))
        else
            props.onChange([conta]) 
    }

    useEffect(() => {         
        setContas();
    }, []);

    return (
        <>            
            <LabelInput required label={props.label} placeholder="Digite a conta" id="conta" list="contas" type="text" onChange={setConta}/>            
            <datalist id="contas">                    
                {               
                    values.contas.map((value, index) => 
                        <option key={index} value={value.email}>{value.nickname}</option>)                    
                }
            </datalist>
        </>        
        
    )
}

export default Contas
