import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { FcCheckmark, FcHighPriority } from "react-icons/fc";
import { MdRefresh } from "react-icons/md";
import LabelInput from "../../../estrutura/LabelInput";
import "./detalhes.css"

function Detalhes(){
    
    let {idAnuncio, userId} = useParams();  

    const [values, setValues] = useState({anuncio:{title:'', price:0, available_quantity:0, variations:[], attributes:[], category_id:''}, disable: true, loader:true});                  
    
    const setVisits = () => axios.get(process.env.REACT_APP_MELI_DOMAIN+'/meli/anuncios/visits/'+userId+'/'+idAnuncio).then(r => setValues({...values, visits: r.data[idAnuncio]}));

    const setAnuncio = useCallback(()=>{        
        if(idAnuncio==="0"){setValues({anuncio:{title:'', price:0, available_quantity:0, attributes:[], variations:[]}, loader:false, disable: false}); return}
        axios.get(process.env.REACT_APP_MELI_DOMAIN+'/meli/anuncios/'+idAnuncio+'?userId='+userId)
            .then(anuncio=> {
                anuncio.data.variations = anuncio.data.variations?.map(v=>{return{...v, picture_ids:anuncio.data.pictures.filter(p=>v.picture_ids.includes(p.id))}});
                anuncio.data.pictures = anuncio.data.pictures?.filter(p => anuncio.data.variations.filter(v => v.picture_ids.map(pi=>pi.id).includes(p.id)).length===0)                        
                axios.get(process.env.REACT_APP_MELI_DOMAIN+'/meli/atributos/'+anuncio.data.category_id)
                    .then(res => {anuncio.data.attributes = res.data.map(x=> { if(anuncio.data.attributes.filter(y=>y.id===x.id).length){ const {value_id, value_name} = anuncio.data.attributes.filter(y=>y.id===x.id)[0]; return {...x, value_id, value_name}}else return x});setValues({anuncio:anuncio.data, disable: false, loader:false})})                
            })
    }, [idAnuncio, userId])

    useEffect(()=> { setAnuncio() },[setAnuncio])

    return ( 
        // values.loader?<div style={{ position: "absolute", width:"100%", height:"100%", backgroundColor:"white", zIndex:"1000" }}>
        //     <div className="spinner-border p-5" style={{width: "3rem",height: "3rem", margin:"10% 0 0 30%"}} role="status">
        //         <span className="visually-hidden">Loading...</span>
        //     </div>                 
        // </div>: 
        <>           
            <div className={"alert alert-success "+(values.ok?"":"visually-hidden")} role="alert"><FcCheckmark/> Anuncio enviado com sucesso</div>
            <div className={"alert alert-danger "+(values.erro?"":"visually-hidden")} role="alert"><FcHighPriority/>Erro: {values.erro}</div>
            <LabelInput readonly={true} label="Visitas" disabled={true} value={0}/>
            <button className="btn btn-sm btn-success" onClick={event=>{event.preventDefault();setVisits()}}><MdRefresh/></button>                                                                                                                                                                
        </>        
    )
}
export default Detalhes