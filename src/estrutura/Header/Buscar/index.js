import './buscar.css'

function Buscar(){

        return (<>
            <div className="select-container">
                <select className="select-scroll" size="1" onFocus="this.size=5;" onblur="this.size=1;" onChange="this.size=1; this.blur();">
                    <option value="" disabled selected hidden>Selecione uma opção</option>
                    <option value="1">Opção Muito Longa 1</option>
                    <option value="2">Opção Muito Longa 2</option>
                    <option value="3">Opção Muito Longa 3</option>
                </select>
            </div>
        </>);
}
export default Buscar;