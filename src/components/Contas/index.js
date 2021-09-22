import axios from "axios";
import { useEffect, useState } from "react";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from "@material-ui/core";

function Contas(props){

    const [values, setValues] = useState({contas:[]})     

    async function setContas(){
        setValues({...values,            
            contas:(
                await axios.get('http://localhost:8080/conta/all?id='+JSON.parse(localStorage.getItem("usuario")).id)
            ).data.concat({id:"0", nickname:"Todas as contas"})
        })
    }

    useEffect(() => {         
        setContas();
    }, []);

    return (
        <Autocomplete 
            fullWidth={ false } 
            autoComplete={ true }             
            id="contas-combo" 
            options={values.contas} 
            getOptionLabel={(o) => o.nickname}
            getOptionSelected={(option, value) => option.id === value.id}
            onChange={(event, conta) => {                                 
                if(!conta)
                    props.onChange(undefined)
                else if(conta.id==="0")
                    props.onChange(values.contas.slice(0, values.contas.length-1))
                else
                    props.onChange([conta]) 
            }}
            renderInput={(params) => <TextField {...params} variant="outlined" />}
        />
        
    )
}

export default Contas
