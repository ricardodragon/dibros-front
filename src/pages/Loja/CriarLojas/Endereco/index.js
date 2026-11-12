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
        axios.get("https://brasilapi.com.br/api/cep/v2/"+props.values.loja.enderecoLojaDTO.cep).then(r=> 
            props.setValues({...props.values, loja:{...props.values.loja, enderecoLojaDTO:{...props.values.loja.enderecoLojaDTO, ...convertBrasilapi(r.data)}, load:false}})
        )
    }
    
    const convertNominatim = (endereco) => ({latitude:endereco.lat, longitude:endereco.lon, estado:endereco.address["ISO3166-2-lvl4"].split('-')[1], cidade:endereco.address.city, cep:endereco.address.postcode.replace(/\D/g, ""), bairro:endereco.address.suburb, rua:endereco.name})
    const convertBrasilapi = (endereco) => ({latitude:endereco.location.coordinates.latitude, longitude:endereco.location.coordinates.longitude, estado:endereco.state, cidade:endereco.city, cep:endereco.cep, bairro:endereco.neighborhood, rua:endereco.street})

    const inputCep = event => props.setValues({ ...props.values, loja: { ...props.values.loja, enderecoLojaDTO: { cep: event.target.value.replace(/\D/g, '').slice(0, 8) } } });

    return (<>
        <fieldset style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap", padding: "12px 16px" }}>
            <button type="button" style={{ width: "auto", padding: "6px 18px", borderRadius: "18px", border: "none", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }} onClick={getLocation}>
                📍
            </button>
            <span style={{ color: "#ccc", fontWeight: "bold" }}>ou</span>
            <input required type="text" inputMode="numeric" pattern="[0-9]*" maxLength={8} style={{ width: "160px", padding: "6px 12px", borderRadius: "6px", boxSizing: "border-box" }} id="cep" placeholder="digite o cep" value={props.values.loja.enderecoLojaDTO.cep ?? ''} onChange={inputCep}/>

            <button disabled={(props.values.loja.enderecoLojaDTO.cep??'').length!==8} onClick={buscarCep} type="button" style={{ width: "auto", padding: "6px 18px", borderRadius: "18px", border: "none", backgroundColor: "#1976d2", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
                Buscar
            </button>
        </fieldset>
        <fieldset>
            <label htmlFor='rua'>rua
                <input id="rua" type='text' required readOnly value={props.values.loja.enderecoLojaDTO.rua || ''}/>
            </label>
            <label htmlFor='numero'>numero
                <input id="numero" type='text' required value={props.values.loja.enderecoLojaDTO.numero ?? ''} onChange={event=> props.setValues({...props.values, loja:{...props.values.loja, enderecoLojaDTO:{...props.values.loja.enderecoLojaDTO, numero:event.target.value}}})}/>
            </label>
            <label htmlFor='bairro'>bairro
                <input id="bairro" type='text' required readOnly value={props.values.loja.enderecoLojaDTO.bairro || ''}/>
            </label>
            <label htmlFor='complemento'>complemento
                <input id="complemento" type='text' value={props.values.loja.enderecoLojaDTO.complemento || ''} onChange={event=> props.setValues({...props.values, loja:{...props.values.loja, enderecoLojaDTO:{...props.values.loja.enderecoLojaDTO, complemento:event.target.value}}})}/>
            </label>
        </fieldset>
        <fieldset>
            <label htmlFor='estado'>estado
                <input id="estado" type='text' required readOnly value={props.values.loja.enderecoLojaDTO.estado || ''}/>
            </label>
            <label htmlFor='cidade'>cidade
                <input id="cidade" type='text' required readOnly value={props.values.loja.enderecoLojaDTO.cidade || ''}/>
            </label>
        </fieldset>
    </>)
}

export default Endereco;