import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Spinner from "./Spinner.jsx";

const stripePromise = loadStripe(
    "pk_live_51Lk8lnKsbDW2PTHgW8twzg2yV6iXLLmJYRsJhZerPvh0LCHkGJx7NnhCcIDKGWhupUGxAXNPMK9iECwNcv3zHB7A00MeDTXgqN"
);

const CheckoutForm = ({ precio, setCupon }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();
        setIsLoading(true);

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const { error } = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: "https://normalismorural.com/comprar",
            },
            redirect: 'if_required'
        })
        .then(function(result) {
            setIsLoading(false);
            switch (result.paymentIntent.status) {
                case 'succeeded':
                    handlePagoExitoso();
                    break;
        
                  case 'processing':
                    setErrorMessage("El pago se esta procesando. Te avisaremos cuando llegue.");
                    break;
        
                  case 'requires_payment_method':
                    // Redirect your user back to your payment page to attempt collecting
                    // payment again
                    setErrorMessage('Pago fallido. Intente otro metodo.');
                    break;
        
                default:
                    setErrorMessage('Algo fue mal.');
                break;
            }
        });

        if (error) {
            setIsLoading(false);
            console.log(error);
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (for example, payment
            // details incomplete)
            setErrorMessage(error.message);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };

    const handlePagoExitoso = async () => {
        await fetch('https://normalismorural.com/acceso/api/generar_cupon.php', {
            method: 'POST',
            body: JSON.stringify({
                'pago': "exito"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            setCupon(data);
            localStorage.setItem('cupon_normalismo', data);    
        });
        location.reload();
    }

    useEffect(() => {
        setIsLoading(false);
    }, []);

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            {isLoading ? (
                <Spinner></Spinner>
            ) : (
                <button
                    disabled={!stripe}
                    id="submit"
                    className="btn btn-success"
                >
                    {`Pagar ${precio}mxn`}
                </button>
            )}
            {errorMessage && <div className="alert alert-dismissible alert-danger">{errorMessage}</div>}
        </form>
    );
};

const Checkout = ({ clientSecret, precio, setCupon }) => {
    const options = {
        clientSecret,
        appearance: {
            theme: "stripe",
        },
    };


    

    return (
        <div>
            <Elements options={options} stripe={stripePromise}>
                <CheckoutForm setCupon={setCupon} precio={precio} />
            </Elements>
        </div>
    );
};

export default Checkout;
