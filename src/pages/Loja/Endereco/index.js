import { useEffect, useState } from "react";
import axios from '../../../config/api/api';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import loader from "./../../../assets/loadinfo.gif";
import CardEndereco from "./CardEndereco";

function LojaEndereco() {

    const [values, setValues] = useState({endereco:{selecionado:false}})    
    const { id } = useParams();

    useEffect(() => axios.get("/loja/lojas/endereco/"+id).then(response=>setValues({enderecos:response.data, endereco:{selecionado:false}})), [id])

    const getLocation = (event) => {
        event.preventDefault();
        setValues({...values, load:true});
        navigator.geolocation?navigator.geolocation.getCurrentPosition(position=>
            axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=pt-BR`).then(r=>
                setValues({...values, endereco:{...values.endereco, ...convertNominatim(r.data)}, load:false})),
            (error) => setValues({...values, erro:"erro ao buscar localização"}),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        ):console.log("Geolocation is not supported by this browser.");
    }

    const buscarCep = (event) => {
        event.preventDefault();
        setValues({...values, load:true});
        axios.get("https://brasilapi.com.br/api/cep/v2/"+values.endereco.cep).then(r=> 
            setValues({...values, endereco:{...values.endereco, ...convertBrasilapi(r.data)}, load:false})
        )
    }

    const criar = (event, endereco) => {
        event.preventDefault();
        axios.post("/loja/lojas/endereco", {...endereco, lojaId:id}).then(r=>console.log(r.data))
    }

    const alterar = (event) => {
        event.preventDefault();
        // axios.put("/loja/endereco", values.endereco).then(r=>console.log(r.data))
    }

    const convertNominatim = (endereco) => ({latitude:endereco.lat, longitude:endereco.lon, estado:endereco.address["ISO3166-2-lvl4"].split('-')[1], cidade:endereco.address.city, cep:endereco.address.postcode.replace(/\D/g, ""), bairro:endereco.address.suburb, rua:endereco.name})
    const convertBrasilapi = (endereco) => ({latitude:endereco.location.coordinates.latitude, longitude:endereco.location.coordinates.longitude, estado:endereco.state, cidade:endereco.city, cep:endereco.cep, bairro:endereco.neighborhood, rua:endereco.street})

    return (<>
        {values.load&&<div className='loader-loja'><img src={loader} alt="loading..."/></div>}
        <form onSubmit={buscarCep}>
            <fieldset style={{textAlign:"center"}}>
                <button style={{whiteSpace:"nowrap", fontSize:"8pt", fontWeight:"bold"}} onClick={getLocation}>📍 </button>            
                ou                          
                <input required style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} id="cep" placeholder="digite o cep" value={values.endereco.cep ?? ''} type="number" onChange={event=>setValues({...values, endereco:{selecionado:values.endereco.selecionado,cep:event.target.value}})}/>                                                                      
                <input type='submit' value="buscar" style={{cursor:"pointer", position: "absolute", border: "none", left:"58%", backgroundColor: "rgb(249 249 249 / 0%)"}}/>
            </fieldset>
        </form> 
        <CardEndereco endereco={values.endereco} criar={criar}/>
        {values.enderecos&&values.enderecos.map(e=>
            <CardEndereco endereco={e} alterar={alterar}/>
        )}
    </>)
}

export default LojaEndereco;