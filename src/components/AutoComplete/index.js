import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';

export default function AutoComplete(props) {
    const [contas, setContas] = useState([]);

    const getContas = async () => {
        const response = await axios.get('http://localhost:8080/conta/all?id='+JSON.parse(localStorage.getItem("usuario")).id);
        setContas(contas.concat(response.data.content));
    }

    useEffect(() => { getContas() }, []);

    return (
        <Autocomplete autoHighlight id="contas-combo" options={contas} getOptionLabel={(o) => o.nickname}
            onChange={(event, newValue) => { props.setConta(newValue) }}
            style={{ width: 200 }} renderInput={ (params) => 
                <TextField {...params} label="Contas" variant="outlined" />
            }
        />
    );
}