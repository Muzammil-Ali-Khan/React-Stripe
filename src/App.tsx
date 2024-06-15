import './App.css'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './components/CheckoutForm';

// TODO: Replace below <Your Publishable Key> with the Publishable Key you got from your stripe account 
const stripePromise = loadStripe('<Your Publishable Key>');


function App() {
  const options = {};

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  )
}

export default App
