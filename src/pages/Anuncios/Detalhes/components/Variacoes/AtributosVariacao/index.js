import { useEffect, useState } from 'react';
import axios from 'axios';

function 

AtributosVariacao(props){

    const dominio = process.env.REACT_APP_MELI_DOMAIN
    const [values, setValues] = useState({atributosSelect:[], attCombo:-1});
    
    async function setAtributos(){
        setValues({
            ...values,
            atributosSelect: (await axios.get(dominio+'/meli/atributos/'+props.categoria)).data.map(x=>x.value_id==-1?{...x,value_name:null,value_id:null}:x).filter(x=>props.variacao&&x.tags.variation_attribute||!props.variacao).filter(x=>!props.value.filter(y=>y.id==x.id).length),            
        })
    }useEffect(() => setAtributos() ,[props.categoria, props.value]);                               

    const addAtributo = event => {
        event.preventDefault();        
        props.onChange(props.value.filter(x=> values.attCombo==-1||x.id!=values.atributosSelect[values.attCombo].id).concat(values.atributosSelect.filter((x, index)=>values.attCombo==-1||index==values.attCombo)))        
        setValues({...values,atributosSelect:values.atributosSelect.filter((x, index)=>values.attCombo!=-1&&index!=values.attCombo)})
    }

    const excluirAtributo = (event,atributo) => {
        event.preventDefault();
        setValues({...values, atributosSelect:[...values.atributosSelect, atributo]})
        props.onChange(props.value.map(x=>x.id==atributo.id?{...x, value_id:null, value_name: null}:x))      
    }
    
    const editAtributo = (event, index) => { 
        event.preventDefault(); 
        const value_name = event.target.value==""?null:event.target.value;
        props.onChange(props.value.map((x,i)=>i==index?{...x, value_name, value_id:null}:x));
    }

    return ( 
        <>
            {/* {props.value.filter(x=> x.id=="GENDER").length>0?axios.post} */}
            <h5 className="h3">Atributos</h5> 
            <div style={{padding:'1.5em'}}>                
                <div className="row">
                    <label htmlFor="atributos" className='col-form-label col' style={{whiteSpace:"nowrap", overflow:"hidden"}}>Adicionar atributo</label>
                    <select id="atributos" className='col form-control form-control-sm' onChange={event=>{event.preventDefault();setValues({...values, attCombo:event.target.value})}}>                                                            
                        <option value={-1}>Todos</option>
                        {values.atributosSelect.map((value, index) => <option key={index} value={index}>{value.name}</option>)}
                    </select> 
                    <button disabled={props.disabled} onClick={addAtributo} className="col btn btn-sm btn-success">Adicionar</button>                                   
                    <hr className="mt-2"/>
                    {
                        props.value.map((x,index)=>{
                            if(x.value_type=="boolean") 
                                return <div className='col pb-2 pt-2'>                                                                      
                                    <label htmlFor={x.id} style={{whiteSpace: "nowrap", }}>{x.name}</label>
                                    <select id={x.id} className='form-control form-control-sm' disabled={props.disabled} onChange={value_id=>props.onChange(props.value.filter(a=> a.id!=x.id).concat({...x, value_id:x.values[value_id].id, value_name:x.values[value_id].name}))}>
                                        {x.values.map(v=><option value={v.id}>{v.name}</option>)}
                                    </select>                                    
                                    {/* <button disabled={props.disabled} onClick={event=>excluirAtributo(event,x)} className='w-100 btn btn-sm btn-danger'>X</button>                                     */}
                                </div>
                            else
                                return <div className='col pb-2 pt-2' >
                                    <label htmlFor={x.id} style={{whiteSpace: "nowrap", overflow:"hidden"}}>{x.name}</label>
                                    {<input list={x.id+"list"} id={x.id} disabled={props.disabled} className='form-control form-control-sm' value={x.value_name} onChange={event=>editAtributo(event,index)}></input>}                                             
                                    <datalist id={x.id+"list"}>                    
                                        {               
                                            x.values?x.values.map((value, inde) => 
                                                <option key={inde} value={value.id}>{value.email}</option>):""                    
                                    
                                        }
                                    </datalist>
                                    {/* <button disabled={props.disabled} onClick={event=>excluirAtributo(event,x)} className='w-100 btn btn-sm btn-danger'>X</button> */}
                                </div>
                        })
                    }
                </div>   
            </div>
            <hr/>
        </>
    )
}

export default AtributosVariacao


// <>                     
//     {                               
//         props.value.filter(s => s.selected).map((atributo, index) => {                      
//             if(atributo.value_type=="boolean")
//                 return <LabelSelect disabled={props.disabled}  
//                     id={atributo.id} label={atributo.name} 
//                     lista={atributo.values.map(a=>{return {name:a.name, selected: false}})}                             
//                     onChange={value_id=>props.onChange(props.value.filter(a=> a.id!=atributo.id)
//                         .concat({...atributo, value_id:atributo.values[value_id].id, value_name:atributo.values[value_id].name}))}/>                        
//             return <>                        
//                 <LabelInput disabled={props.disabled} value={atributo.value_name} 
//                     label={atributo.name} id={atributo.id} type="text" list={atributo.id+"-"+index} 
//                     onChange={value_name=>props.onChange(props.value.map(a=> a.id!=atributo.id?a:{...a, value_name}))}/>                        

//                 <datalist id={atributo.id+"-"+index}>
//                     {
//                         atributo.values?atributo.values.map((value, index) => {                                    
//                             return <option value={value.name} key={index}/>
//                         }):""
//                     }       
//                 </datalist>
//             </>
//         })
//     }
// </>  

// <Atributos disabled={props.disabled} value={props.value} onChange={event=>props.onChange(event)} 
                    //     categoria={props.categoria}/>        

// const domainId = (await axios.get('http://localhost:8080/meli/categorias/'+props.categoria)).data.settings.catalog_domain;                                 
// for(const i in atributos.filter((value) => value.value_type=="string")){
//     try {
//         const values = (await axios.get('http://localhost:8080/meli/atributos/top/'+domainId+"/"+atributos[i].id)).data                                                       
//         atributos[i].values = values.length>0?values:atributos[i].values
//     }catch(err){}
// };     