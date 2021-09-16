import axios from "axios";
import { useEffect, useState } from "react";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from "@material-ui/core";

function Contas(props){

    const [values, setValues] = useState({})     

    async function setContas(){
        setValues({...values,            
            contas:(
                await axios.get('http://localhost:8080/conta/all?id='+JSON.parse(localStorage.getItem("usuario")).id)
            ).data.concat({user_id:"0", nickname:"Todas as contas"})
        })
    }

    useEffect(() => {         
        setContas();
    }, []);

    return (
        <Autocomplete autoHighlight id="contas-combo" options={values.contas} getOptionLabel={(o) => o.nickname}
            onChange={(event, conta) => { 
                           
                if(conta.user_id==="0")
                    props.onChange(values.contas.slice(0, values.contas.length-1))
                else
                    props.onChange([conta]) 
            }}
            renderInput={(params) => <TextField {...params} variant="outlined" />}
        />
        
    )
}

export default Contas
