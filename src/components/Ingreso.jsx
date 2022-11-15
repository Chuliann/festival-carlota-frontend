import { useState } from "react";
import "../styles/ingreso.css";

const Ingreso = ({setActivarPagina}) => {

    const [campo, setCampo] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(campo != "") {
            await fetch("http://localhost/acceso/api/obtener_acceso.php", {
            header: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"codigo": campo}),
            method: 'POST'
            })
            .then(response => response.json())
            .then(data => handleIngreso(data.acceso))
        } else {
            
        }
        
    }

    const handleIngreso = (valor) => {
        if(valor) {
            localStorage.setItem("ingreso", true);
            setActivarPagina(true);
        }
    }

    return(
        <div className="ingreso">
            <div className="ingreso__modal">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <fieldset>
                        <legend>Ingrese el codigo secreto para acceder</legend>
                        <div class="form-group row d-flex align-items-center justify-content-center">
                            <label for="staticCode" class="col-sm-2 col-form-label">Codigo: </label>
                            <div class="col-sm-10">
                                <input id="staticCode" type="text" onChange={(e) => setCampo(e.target.value)}></input>
                            </div>
                            <button type="submit" class="btn btn-primary">Acceder</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default Ingreso;