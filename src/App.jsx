import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import CartOverlay from "./components/CartOverlay";

import { gql, useMutation } from "@apollo/client";
import { useCart } from "./context/CartContext";

const CREATE_ORDER = gql`
  mutation CreateOrder($customer_name: String!, $products: [OrderItemInput!]!, $total_price: Float!) {
    createOrder(customer_name: $customer_name, products: $products, total_price: $total_price)
  }
`;

const TestOrderPage = () => {
  const [createOrder] = useMutation(CREATE_ORDER);

  useEffect(() => {
    createOrder({
      variables: {
        customer_name: "Nikola Laboski",
        products: [
          { product_id: 1, quantity: 2 },
          { product_id: 2, quantity: 1 }
        ],
        total_price: 59.97
      }
    })
      .then(res => console.log("ORDER SUCCESS:", res.data.createOrder))
      .catch(err => console.error("ORDER ERROR:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Testing createOrder mutation</h1>
      <p>Check the console.</p>
    </div>
  );
};

const App = () => {
  const { showCart, setShowCart } = useCart();

  return (
    <div>
      <Header />
      <CartOverlay visible={showCart} onClose={() => setShowCart(false)} />

      
<Routes>
  <Route path="/" element={<Navigate to="/all" />} />
  <Route path="/category" element={<Navigate to="/all" />} />

  {/* both forms work */}
  <Route path="/:categoryName" element={<CategoryPage />} />
  <Route path="/category/:categoryName" element={<CategoryPage />} />

  <Route path="/product/:id" element={<ProductPage />} />
  <Route path="/checkout" element={<CheckoutPage />} />
</Routes>



   
    </div>
  );
};

export default App;
