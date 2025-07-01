import React from 'react'
import ReactDOM from 'react-dom/client'
import { CartProvider } from "./context/CartProvider";


import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CartProvider>
        <App />
      </CartProvider>
  </BrowserRouter>
)
