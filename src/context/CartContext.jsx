// CartContext.jsx
// Defines the React Context used to share cart state/actions across the app.
// CartContext (provider uses this) and useCart() convenience hook.

import React, { createContext, useContext } from "react"; 

export const CartContext = createContext();
// Hook to consume the cart context; assumes a matching Provider is mounted above.
export const useCart = () => useContext(CartContext);
