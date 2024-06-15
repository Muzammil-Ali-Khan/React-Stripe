import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import "./CheckoutForm.css";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const createPaymentIntent = async () => {
      const response = await fetch(
        "https://api.stripe.com/v1/payment_intents",
        {
          method: "POST",
          headers: {
            // TODO: Replace below <Your Secret/Private Key> with the Secret Key you got from your stripe account
            Authorization: `Bearer <Your Secret/Private Key>`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            amount: "1000", // Amount in cents
            currency: "usd",
          }),
        }
      );
      const data = await response.json();
      return data.client_secret;
    };

    const clientSecret = await createPaymentIntent();
    setClientSecret(clientSecret);

    const result = await stripe?.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements?.getElement(CardElement),
      },
    });

    if (result?.error) {
      setError(result?.error?.message ?? "");
      setProcessing(false);
    } else {
      if (result?.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded!");
      }
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={cardElementOptions} />
      <button disabled={!stripe || processing}>Pay</button>
      {error && <div>{error}</div>}
    </form>
  );
};

export default CheckoutForm;
