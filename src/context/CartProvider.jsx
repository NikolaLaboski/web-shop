// CartProvider.jsx
import React, { useState, useEffect } from "react";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });
  const [showCart, setShowCart] = useState(false);

  const addToCart = (product, selectedAttributes = {}) => {
    const defaultAttributes = {
      Size: ["XS", "S", "M", "L"],
      Color: ["#f0f0f0", "#000", "#0f6657"],
    };
    const attributes = product.attributes ?? defaultAttributes;

    // preserve Capacity too
    const filledSelected = {
      Size: selectedAttributes.Size ?? null,
      Capacity: selectedAttributes.Capacity ?? null,
      Color: selectedAttributes.Color ?? null,
    };

    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          JSON.stringify(item.selectedAttributes) ===
            JSON.stringify(filledSelected)
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id &&
          JSON.stringify(item.selectedAttributes) ===
            JSON.stringify(filledSelected)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            ...product,
            quantity: 1,
            selectedAttributes: filledSelected,
            attributes,
          },
        ];
      }
    });
  };

  const incrementQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const updateAttribute = (id, key, value) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              selectedAttributes: {
                ...item.selectedAttributes,
                [key]: value,
              },
            }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        incrementQuantity,
        decrementQuantity,
        updateAttribute,
        clearCart,
        showCart,
        setShowCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
