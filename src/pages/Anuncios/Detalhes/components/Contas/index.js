import axios from "axios";
import { useEffect, useState } from "react";
import LabelInput from '../../../../../estrutura/LabelInput';


function Contas(props){

    const [values, setValues] = useState({contas:[]})     
    const dominio = process.env.REACT_APP_MELI_DOMAIN
    
    async function setContas(){
        setValues({...values,            
            contas:(
                await axios.get(
                    dominio+'/meli/contas/all?id='+JSON.parse(localStorage.getItem("usuario")).id
                )
            ).data.concat({id:"0", email:"Todas as contas"})
        })
    }

    const setConta = (email) => {  
        console.log(email)                                       
        const conta = values.contas.filter((value) => value.email===email)[0]
        if(!conta)
            props.onChange(undefined)
        else if(conta.id==="0")
            props.onChange(values.contas.slice(0, values.contas.length-1))
        else
            props.onChange([conta]) 
    }

    useEffect(()=>setContas(), []);

    return (
        <>  
            <h5 className="h3">Conta</h5>
            <div style={{padding:'1.5em'}}>
                <LabelInput lassName="form-control" required label={props.label} placeholder="Digite a conta" id="conta" list="contas" type="text" onChange={setConta}/>            
                <datalist id="contas">                    
                    {               
                        values.contas.map((value, index) => 
                            <option key={index} value={value.email}>{value.nickname}</option>)                    
                    }
                </datalist>
            </div>          
            <hr/>
        </>        
        
    )
}

export default Contas
