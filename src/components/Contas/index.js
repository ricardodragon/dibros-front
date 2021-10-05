import axios from "axios";
import { useEffect, useState } from "react";

function Contas(props){

    const [values, setValues] = useState({contas:[]})     

    async function setContas(){
        setValues({...values,            
            contas:(
                await axios.get(
                    'http://localhost:8080/conta/all?id='+JSON.parse(localStorage.getItem("usuario")).id
                )
            ).data.concat({id:"0", email:"Todas as contas"})
        })
    }

    const setConta = (event) => {                                         
        const conta = values.contas.filter((value) => value.email==event.target.value)[0]
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
            <input list="contas" type="text" onChange={setConta}/>
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
