// CartProvider.jsx
// Provides cart state and actions (add, increment, decrement, update attributes)
// to the component tree via CartContext. Persists cartItems to localStorage.

import React, { useState, useEffect } from "react";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage (lazy initializer to avoid extra parse work).
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  // Global overlay visibility state for the mini-cart.
  const [showCart, setShowCart] = useState(false);

  /**
   * addToCart
   * Adds a product with a specific attribute selection to the cart.
   * If the same product + same selectedAttributes exists, increments quantity.
   * Notes:
   * - Uses JSON.stringify on selectedAttributes for equality check (order-sensitive but fine here).
   * - Provides default attribute sets if product.attributes are missing.
   */
  const addToCart = (product, selectedAttributes = {}) => {
    const defaultAttributes = {
      Size: ["XS", "S", "M", "L"],
      Color: ["#f0f0f0", "#000", "#0f6657"],
    };
    const attributes = product.attributes ?? defaultAttributes;

    // Persist only the chosen values; null means "not chosen yet".
    const filledSelected = {
      Size: selectedAttributes.Size ?? null,
      Color: selectedAttributes.Color ?? null,
    };

    setCartItems((prev) => {
      // Look for an existing line item with the same product and attribute combo.
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          JSON.stringify(item.selectedAttributes) ===
            JSON.stringify(filledSelected)
      );

      if (existing) {
        // Same product+attributes -> increase quantity.
        return prev.map((item) =>
          item.id === product.id &&
          JSON.stringify(item.selectedAttributes) ===
            JSON.stringify(filledSelected)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // New line item with quantity=1; keep original product fields.
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

  /**
   * incrementQuantity
   * Increases the quantity of the item matching the given product id by 1.
   */
  const incrementQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  /**
   * decrementQuantity
   * Decreases the quantity of the item matching the given product id by 1.
   * Removes the item entirely if the resulting quantity is 0 or less.
   */
  const decrementQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /**
   * updateAttribute
   * Updates a single attribute (e.g., "Size", "Color") for the line item by product id.
   * Leaves other selected attributes unchanged.
   */
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

  // Persist cart to localStorage whenever cartItems changes.
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
        showCart,
        setShowCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
