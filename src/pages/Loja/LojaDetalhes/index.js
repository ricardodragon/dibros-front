import Template from "../../../estrutura/Template";

function LojaDetalhes(props){

    return(
        <Template>
            <header style={{paddingLeft: "9%"}}>
                <img alt={"Foto da loja : "} src="https://logodetimes.com/times/corinthians/logo-do-corinthians-512.png" style={{borderRadius: "50%", width:"3em", height:"3em"}}/>
                <h3 style={{display: "inline", fontSize:"11pt", paddingLeft:'2%'}}>Corinthans store</h3>                             
            </header>
            <nav id="menu-feed">
                <ul>
                    <li className="col-4" >📢 anuncios</li>
                    <li className="col-4" >📦 produtos</li>
                    <li className="col-4" >👥 colaboradores</li>
                </ul>
            </nav>
        </Template>
    )
}

export default LojaDetalhes;