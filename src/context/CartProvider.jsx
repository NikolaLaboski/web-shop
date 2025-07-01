// src/context/CartProvider.jsx
import React, { useState, useEffect } from "react";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  const removeFromCart = (indexToRemove) => {
    setCartItems((prev) => prev.filter((_, i) => i !== indexToRemove));
  };
  

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
