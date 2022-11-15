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
    "pk_test_51Lk8lnKsbDW2PTHgmmzQLLXDmYDVs9uZwd6c5QUXtzuGksAp9iol3afKVtcGNR8mVHjVL7iWfhDzdLCeWpEOGUNw00d1wjxV9F"
);

const CheckoutForm = ({ precio, setCupon }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState(null);
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
            if(result.paymentIntent.status === "succeeded") {
                handlePagoExitoso();       
            }
        });

        if (error) {
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

        const clientSecret = new URLSearchParams(window.location.search).get(
            'payment_intent_client_secret'
        );
        if (!stripe || !clientSecret) {
            return;
        }
      
          // Retrieve the "payment_intent_client_secret" query parameter appended to
          // your return_url by Stripe.js
        
        stripe.retrievePaymentIntent(clientSecret)
        .then(({paymentIntent}) => {
          // Inspect the PaymentIntent `status` to indicate the status of the payment
          // to your customer.
          //
          // Some payment methods will [immediately succeed or fail][0] upon
          // confirmation, while others will first enter a `processing` state.
          //
          // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
          switch (paymentIntent.status) {
            case 'succeeded':
              handlePagoExitoso();
              break;
  
            case 'processing':
              console.log("Payment processing. We'll update you when payment is received.");
              break;
  
            case 'requires_payment_method':
              // Redirect your user back to your payment page to attempt collecting
              // payment again
              console.log('Payment failed. Please try another payment method.');
              break;
  
            default:
              console.log('Something went wrong.');
              break;
          }
        });
    }, []);

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
            {/* Show error message to your customers */}
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
