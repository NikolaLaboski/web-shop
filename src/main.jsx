import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import { CartProvider } from "./context/CartProvider";
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </ApolloProvider>
);
