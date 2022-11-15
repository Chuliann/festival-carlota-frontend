import { useState } from "react";
import {Link} from "react-router-dom";
import Checkout from './Checkout.jsx';
import Spinner from './Spinner.jsx';
import Mensaje from "./Mensaje.jsx";

import cartel from "../imgp/cartel.png";
import "bootswatch/dist/lux/bootstrap.min.css";
import { useEffect } from "react";

import "../styles/comprar.css";
import logo from "../imgp/logo.png";



const Comprar = () => {

    const [clientSecret, setClientSecret] = useState("");
    const [precio, setPrecio] = useState(0);
    const [cargando, setCargando] = useState(false);
    /* const [mail, setMail] = useState(""); */
    const [error, setError] = useState(false);
    const [cupon, setCupon] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);



    const handleSubmit = async (e) => {
        e.preventDefault();


        if(precio >= 10) {
            let datos = {
                amount: parseFloat(precio * 100)
            }
            setCargando(true);
            fetch("https://normalismorural.com/acceso/api/create-payment-intend.php", {
                header: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos),
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => guardarSecreto(data));            
        } else {
            activarError();
        }
    }

    const activarError = () => {
        setError(true);
        setTimeout(() => {
           setError(false); 
        }, 2500);
    }

    const guardarSecreto = (data) => {
        setCargando(false);
        setClientSecret(data.secret);
    }

    useEffect(() => {
        const cuponLocal = localStorage.getItem('cupon_normalismo');
        if(cuponLocal) {
            setCupon(cuponLocal);
            setModalAbierto(true);
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("cupon_normalismo", cupon);
        location.reload();
    }, [cupon])

    return (
        <div>  
            {cupon && modalAbierto ? (
                <div className="modalCodigo toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <strong className="me-auto">Codigo:</strong>
                        <button type="button" className="btn-close ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close" onClick={() => setModalAbierto(false)}>
                            <span aria-hidden="true"></span>
                        </button>
                    </div>
                    <div className="toast-body">
                        {cupon}
                    </div>
                </div>
            ) : null}
            <div className="comprar__navbar">
            <Link to="/" className="button_back">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-corner-down-left" width="35" height="35" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M18 6v6a3 3 0 0 1 -3 3h-10l4 -4m0 8l-4 -4" />
                    </svg>
                    <p>Volver</p>
            </Link>
            <img src={logo}></img>
            </div>
                
            <div className="comprar__section">
                <div className="comprar__info">
                    <img src={cartel} alt="cartel" className="comprar_image"></img>
                    <h2 className="text-center">Cupon valido por 24hs para ver <br></br> "La piedra en el Zapato"</h2>
                    <p> <span className="negrita">Instrucciones:</span><br></br> Ingrese el precio que desea pagar para ver la pelicula y proceda al pago. <br></br>Una vez confirmado el pago, le facilitaremos el codigo para poder ver la pelicula. <br></br> Al momento de ingresar el codigo, tendra 24 horas para ver la pelicula. <br></br> <cite>ADVERTENCIA:</cite> El cupon es de 1 solo uso. </p>
                    
                </div>
                {!clientSecret ? (
                    <div>
                        {cargando ? (
                            <Spinner></Spinner>
                        ) : (
                            <form onSubmit={handleSubmit} className="form__precio">
                                <legend className="text-center">Cupon para ver <br></br> "La piedra en el Zapato"</legend>
                                <p className="text-center"><cite>(El monto minimo es 10mxn debido a procesamiento de impuestos)</cite></p>
                                <div className="form__campo">
                                    <label>Ingrese un monto valido</label>
                                    <input step=".1" onChange={(e) => setPrecio(e.target.value)} type="number" placeholder="10$"></input>
                                </div>
                                {/* <div className="form__campo">
                                    <label>Mail: (opcional)</label>
                                    <input type="email" onChange={(e) => setMail(e.target.value)}></input>
                                </div> */}
                                <button className="btn btn-success">Proceder al pago</button>
                            </form>
                        )}
                        
                        {error ? <Mensaje tipo="fracaso" algo={error}>Precio invalido</Mensaje> : null}    
                    </div> 
                ) : (
                    <Checkout setCupon={setCupon} clientSecret={clientSecret} precio={precio} />
                )}

            </div>
                
        </div>
    );
};

export default Comprar;
