import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import {Link} from "react-router-dom";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

import Mensaje from "./Mensaje";

import cartel from "../imgp/cartel.png";
import "bootswatch/dist/lux/bootstrap.min.css";
import { useEffect } from "react";

const stripePromise = loadStripe("pk_test_51Lk8lnKsbDW2PTHgmmzQLLXDmYDVs9uZwd6c5QUXtzuGksAp9iol3afKVtcGNR8mVHjVL7iWfhDzdLCeWpEOGUNw00d1wjxV9F");

const Comprar = () => {

    const [clientSecret, setClientSecret] = useState("");
    const [precio, setPrecio] = useState(0);
    const [error, setError] = useState(false);



    const handleSubmit = async (e) => {
        e.preventDefault();
        fetch('http://localhost/acceso/api/create-checkout-session.php', {
            method: 'POST',
        })
        .then(response => response.text())
        .then(data => console.log(data));
        
        return;
        if(precio >= 10) {
            const datos = {
                amount: parseFloat(precio * 100)
            }

            fetch("http://localhost/acceso/api/create-payment-intend.php", {
                header: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos),
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => guardarSecreto(data.secret));            
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

    const guardarSecreto = (secreto) => {
        const appearance = {
            theme: 'stripe'
        }
        let options = {
            appearance,
            clientSecret: secreto
        }

        setTimeout(() => {
            setClientSecret(secreto);
        }, 2500)
    }



    return (
        <>  

            {clientSecret ? (
                
                <Elements options={options} stripe={stripePromise}>
                    <div className="container p-4">
                        <div className="row">
                            <div className="col-md-6 offset-md-3">
                                <CheckoutForm />

                            </div>
                        </div>

                    </div>
                </Elements>
            ) :  (
                <div>
                    <Link to="/" className="button_back">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-big-left" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M20 15h-8v3.586a1 1 0 0 1 -1.707 .707l-6.586 -6.586a1 1 0 0 1 0 -1.414l6.586 -6.586a1 1 0 0 1 1.707 .707v3.586h8a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1z" />
                    </svg>
                    </Link>
                            <form onSubmit={handleSubmit} className="form__precio">
                                    <legend className="text-center">Cupon valido por 6hs para ver <br></br> "La piedra en el Zapato"</legend>

                                <img src={cartel} alt="cartel" className="comprar_image mg_auto"></img>

                                    <div className="form-group my-4 flex__">
                                        <h4>Ingrese un monto valido</h4>
                                        <p>(Minimo 10$)</p>
                                        <input step="0.01" onChange={(e) => setPrecio(e.target.value)} type="number" placeholder="1$"></input>
                                    </div>
                                    <button className="btn btn-success">Proceder al pago</button>
                            </form>
                        {error ? <Mensaje tipo="fracaso" algo={error}>Precio invalido</Mensaje> : null}    
                </div> 
            )}
        </>
    );
};

export default Comprar;
