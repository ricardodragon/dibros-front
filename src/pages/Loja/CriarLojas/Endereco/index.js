import axios from '../../../../config/api/api';

function Endereco(props) {

    const getLocation = (event) => {
        event.preventDefault();
        props.setValues({...props.values, load:true});
        navigator.geolocation?navigator.geolocation.getCurrentPosition(position=>
            axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=pt-BR`).then(r=>
                props.setValues({...props.values, loja:{...props.values.loja, enderecoLojaDTO:{...props.values.loja.enderecoLojaDTO, ...convertNominatim(r.data)}, load:false}})),
            (error) => props.setValues({...props.values, erro:"erro ao buscar localização"}),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        ):console.log("Geolocation is not supported by this browser.");
    }
        
    const buscarCep = (event) => {
        event.preventDefault();
        props.setValues({...props.values, load:true});
        axios.get("https://brasilapi.com.br/api/cep/v2/"+props.values.enderecoLojaDTO.cep).then(r=> 
            props.setValues({...props.values, loja:{...props.values, loja:{...props.values.loja, endereco:{...props.values.loja.enderecoLojaDTO, ...convertBrasilapi(r.data)}, load:false}}})
        )
    }
    
    const convertNominatim = (endereco) => ({latitude:endereco.lat, longitude:endereco.lon, estado:endereco.address["ISO3166-2-lvl4"].split('-')[1], cidade:endereco.address.city, cep:endereco.address.postcode.replace(/\D/g, ""), bairro:endereco.address.suburb, rua:endereco.name})
    const convertBrasilapi = (endereco) => ({latitude:endereco.location.coordinates.latitude, longitude:endereco.location.coordinates.longitude, estado:endereco.state, cidade:endereco.city, cep:endereco.cep, bairro:endereco.neighborhood, rua:endereco.street})

    return (<>
        <fieldset style={{textAlign:"center"}}>
            <button style={{whiteSpace:"nowrap", fontSize:"8pt", fontWeight:"bold"}} onClick={getLocation}>📍 </button>            
            ou                          
            <input required style={{whiteSpace:"nowrap", fontSize:"8pt", width:"25%", fontWeight:"bold"}} id="cep" placeholder="digite o cep" value={props.values.loja.enderecoLojaDTO.cep ?? ''} type="number" onChange={event=>props.setValues({...props.values, loja:{...props.values.loja, enderecoLojaDTO:{...props.values.loja.enderecoLojaDTO, cep:event.target.value}}})}/>                                                                      
            <button onClick={buscarCep} style={{cursor:"pointer", position: "absolute", border: "none", left:"58%", backgroundColor: "rgb(249 249 249 / 0%)"}}/>
        </fieldset>
        <fieldset id="endereco">                          
            <fieldset>
                <label>rua</label>
                <input type='text' required readOnly value={props.values.loja.enderecoLojaDTO.rua || ''}/>
                <label>numero</label>
                <input type='text' required value={props.values.loja.enderecoLojaDTO.numero ?? ''} onChange={event=> props.setValues({...props.values, loja:{...props.values.loja, enderecoLojaDTO:{...props.values.loja.enderecoLojaDTO, numero:event.target.value}}})}/>
                <label>bairro</label>
                <input type='text' required readOnly value={props.values.loja.enderecoLojaDTO.bairro || ''}/>
                <label>complemento</label>
                <input type='text' value={props.values.loja.enderecoLojaDTO.complemento || ''} onChange={event=> props.setValues({...props.values, loka:{...props.values.loja, enderecoLojaDTO:{...props.values.loja.enderecoLojaDTO, complemento:event.target.value}}})}/>
            </fieldset>
            <fieldset>
                <label>estado</label>
                <input type='text' required readOnly value={props.values.loja.enderecoLojaDTO.estado || ''}/>
                <label>cidade</label>
                <input type='text' required readOnly value={props.values.loja.enderecoLojaDTO.cidade || ''}/>
            </fieldset>
        </fieldset>
    </>)
}

export default Endereco;