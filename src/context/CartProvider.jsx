import React, { useState, useEffect } from "react";
import { CartContext } from "./CartContext";

// ---- helpers за стабилен идентификатор на ставка (product + attributes) ----
const canon = (v) => String(v ?? "").trim().toLowerCase();
const valKey = (objOrVal) => {
  if (objOrVal && typeof objOrVal === "object") {
    return canon(objOrVal.id ?? objOrVal.value ?? objOrVal.displayValue);
  }
  return canon(objOrVal);
};
const canonicalizeAttrs = (attrs = {}) => {
  const keys = Object.keys(attrs);
  keys.sort();
  const norm = {};
  for (const k of keys) norm[k] = valKey(attrs[k]);
  return JSON.stringify(norm);
};
const makeItemKey = (productId, selectedAttributes = {}) =>
  `${productId}::${canonicalizeAttrs(selectedAttributes)}`;
// ---------------------------------------------------------------------------

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });
  const [showCart, setShowCart] = useState(false);

  // one-time нормализација: ако постојни ставки немаат itemKey → додади им
  useEffect(() => {
    let changed = false;
    const next = (cartItems || []).map((it) => {
      if (!it.itemKey) {
        changed = true;
        return { ...it, itemKey: makeItemKey(it.id, it.selectedAttributes || {}) };
      }
      return it;
    });
    if (changed) setCartItems(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = (product, selectedAttributes = {}) => {
    const defaultAttributes = {
      Size: ["XS", "S", "M", "L"],
      Color: ["#f0f0f0", "#000", "#0f6657"],
    };
    const attributes = product.attributes ?? defaultAttributes;

    // унифицирана форма на селектирани атрибути
    const filledSelected = {
      Size: selectedAttributes.Size ?? null,
      Capacity: selectedAttributes.Capacity ?? null,
      Color: selectedAttributes.Color ?? null,
    };

    const itemKey = makeItemKey(product.id, filledSelected);

    setCartItems((prev) => {
      const existing = prev.find((item) => item.itemKey === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.itemKey === itemKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          itemKey,
          quantity: 1,
          selectedAttributes: filledSelected,
          attributes,
        },
      ];
    });
  };

  // ↳ прифаќа и стар id за назад-компатибилност (CartOverlay ќе праќа itemKey)
  const incrementQuantity = (keyOrId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.itemKey === keyOrId || item.id === keyOrId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementQuantity = (keyOrId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.itemKey === keyOrId || item.id === keyOrId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Оставаме updateAttribute како што е достапен во контекст,
  // но го освежуваме itemKey ако некаде во апликацијата се повика.
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
              itemKey: makeItemKey(item.id, {
                ...item.selectedAttributes,
                [key]: value,
              }),
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
        updateAttribute, // останува достапно, но во minicart НЕ го користиме
        clearCart,
        showCart,
        setShowCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
