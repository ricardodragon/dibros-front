import { useEffect, useState } from "react";
import Header from "../Header"
import Menu from "../Menu"
import "./template.css"

function Template(props){
      
    return (
        <>
            <Header/>            
            <Menu/>            
            <div className="conteudo">
                <div className="container">
                    <h1>{props.nome}</h1>
                    {props.children}                    
                </div>
            </div>                        
        </>
    )
}

export default Template