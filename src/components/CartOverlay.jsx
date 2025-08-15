// src/components/CartOverlay.jsx
// Mini-cart overlay kept always mounted; visibility toggled so tests can assert hidden/visible.

import React from "react";
import styled from "styled-components";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Backdrop = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 80px; /* keep header visible */
  bottom: 0;
  background: rgba(57, 55, 72, 0.22);
  z-index: 998;
`;

const Container = styled.div``;

const OverlayPanel = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  background: white;
  width: 360px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 999;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.15);

  @media (max-width: 480px) {
    width: 90%;
    right: 5%;
    padding: 16px;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #333;

  &:hover { color: #e60023; }
`;

const Header = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  gap: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 60%;
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Img = styled.img`
  width: 120px;
  height: 160px;
  object-fit: cover;

  @media (max-width: 480px) {
    width: 100px;
    height: 140px;
  }
`;

const Name = styled.div` font-size: 16px; font-weight: 500; `;
const Price = styled.div` font-size: 14px; font-weight: 600; `;

const AttributeTitle = styled.div` font-size: 12px; margin-top: 4px; `;
const OptionsRow = styled.div` display: flex; gap: 8px; flex-wrap: wrap; `;

const SizeBox = styled.div`
  padding: 4px 8px;
  border: 1px solid ${({ selected }) => (selected ? "#1D1F22" : "#ccc")};
  font-size: 12px;
  background: ${({ selected }) => (selected ? "#1D1F22" : "white")};
  color: ${({ selected }) => (selected ? "white" : "#1D1F22")};
`;

const ColorBox = styled.div`
  width: 16px;
  height: 16px;
  background-color: ${(props) => props.color || "#ccc"};
  border: 2px solid ${({ selected }) => (selected ? "#5ECE7B" : "#1D1F22")};
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const QtyBtn = styled.button`
  width: 32px; height: 32px;
  font-size: 18px; font-weight: bold;
  background: white; border: 1px solid #1D1F22; cursor: pointer;
  &:hover { background: #eee; }
`;

const Amount = styled.div` font-size: 14px; `;

const Total = styled.div`
  font-weight: bold;
  font-size: 16px;
  text-align: right;
  margin-top: 8px;
`;

const OrderButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 16px;
  background-color: #5ECE7B;
  color: white;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  &:disabled { background-color: #ccc; cursor: not-allowed; }
`;

/** Normalize attribute sets for overlay badges (read-only / clickable as you prefer) */
function getAttrSetMap(item) {
  if (item && item.attributes && !Array.isArray(item.attributes)) {
    return {
      Size: item.attributes.Size || [],
      Capacity: item.attributes.Capacity || [],
      Color: item.attributes.Color || [],
    };
  }
  const map = { Size: [], Capacity: [], Color: [] };
  if (Array.isArray(item?.attributes)) {
    item.attributes.forEach((set) => {
      const name = (set.name || "").toLowerCase();
      if (name === "size") map.Size = (set.items || []).map((it) => it.displayValue || it.value);
      if (name === "capacity") map.Capacity = (set.items || []).map((it) => it.displayValue || it.value);
      if (name === "color") map.Color = (set.items || []).map((it) => it.value);
    });
  }
  return map;
}

export default function CartOverlay(props) {
  // Accept props (visible/onClose) but fallback to Context so both styles work.
  const {
    cartItems,
    incrementQuantity,
    decrementQuantity,
    updateAttribute,
    placeOrder,
    clearCart,
    showCart,
    setShowCart,
  } = useCart();

  const navigate = useNavigate();

  const isOpen =
    typeof props.visible === "boolean" ? props.visible : !!showCart;

  const close = () => {
    if (typeof props.onClose === "function") props.onClose();
    else setShowCart(false);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const total = cartItems.reduce(
    (acc, item) => acc + ((item?.prices?.[0]?.amount ?? 0) * item.quantity),
    0
  );

  const handlePlaceOrder = async () => {
    try {
      if (typeof placeOrder === "function") {
        await placeOrder(cartItems);
      } else if (typeof clearCart === "function") {
        clearCart();
      }
    } finally {
      close();
      navigate("/checkout");
    }
  };

  return (
    <Container
      data-testid="cart-overlay"
      aria-hidden={!isOpen}
      style={{ visibility: isOpen ? "visible" : "hidden" }}
    >
      {/* keep children mounted, but hide/show them for precise sizing */}
      <Backdrop onClick={close} style={{ display: isOpen ? "block" : "none" }} />
      <OverlayPanel style={{ display: isOpen ? "block" : "none" }}>
        <CloseBtn onClick={close}>×</CloseBtn>

        <Header>
          My Bag, {totalItems} {totalItems === 1 ? "Item" : "Items"}
        </Header>

        {cartItems.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            {cartItems.map((item, index) => {
              const { Size, Capacity, Color } = getAttrSetMap(item);
              const selected = item.selectedAttributes || {};
              const price = item?.prices?.[0]?.amount ?? 0;
              const key = `${item.id}-${index}`;

              return (
                <Product key={key}>
                  <Left>
                    <Name>{item.name}</Name>
                    <Price>${price.toFixed(2)}</Price>

                    {Size.length > 0 && (
                      <>
                        <AttributeTitle>Size:</AttributeTitle>
                        <OptionsRow data-testid="cart-item-attribute-size">
                          {Size.map((size) => {
                            const isSel = selected.Size === size;
                            const kebab = String(size).toLowerCase();
                            return (
                              <SizeBox
                                key={size}
                                selected={isSel}
                                data-testid={
                                  isSel
                                    ? `cart-item-attribute-size-${kebab}-selected`
                                    : `cart-item-attribute-size-${kebab}`
                                }
                                onClick={() => updateAttribute?.(item.id, "Size", size)}
                              >
                                {size}
                              </SizeBox>
                            );
                          })}
                        </OptionsRow>
                      </>
                    )}

                    {Capacity.length > 0 && (
                      <>
                        <AttributeTitle>Capacity:</AttributeTitle>
                        <OptionsRow data-testid="cart-item-attribute-capacity">
                          {Capacity.map((cap) => {
                            const isSel = selected.Capacity === cap;
                            const kebab = String(cap).toLowerCase();
                            return (
                              <SizeBox
                                key={cap}
                                selected={isSel}
                                data-testid={
                                  isSel
                                    ? `cart-item-attribute-capacity-${kebab}-selected`
                                    : `cart-item-attribute-capacity-${kebab}`
                                }
                                onClick={() => updateAttribute?.(item.id, "Capacity", cap)}
                              >
                                {cap}
                              </SizeBox>
                            );
                          })}
                        </OptionsRow>
                      </>
                    )}

                    {Color.length > 0 && (
                      <>
                        <AttributeTitle>Color:</AttributeTitle>
                        <OptionsRow data-testid="cart-item-attribute-color">
                          {Color.map((clr) => {
                            const colorKey = String(clr).replace("#", "").toLowerCase();
                            const isSel = selected.Color === clr;
                            return (
                              <ColorBox
                                key={clr}
                                color={clr}
                                selected={isSel}
                                data-testid={
                                  isSel
                                    ? `cart-item-attribute-color-${colorKey}-selected`
                                    : `cart-item-attribute-color-${colorKey}`
                                }
                                onClick={() => updateAttribute?.(item.id, "Color", clr)}
                              />
                            );
                          })}
                        </OptionsRow>
                      </>
                    )}
                  </Left>

                  <RightWrapper>
                    <Controls>
                      <QtyBtn
                        onClick={() => incrementQuantity(item.id)}
                        data-testid="cart-item-amount-increase"
                      >
                        +
                      </QtyBtn>
                      <Amount data-testid="cart-item-amount">
                        {item.quantity}
                      </Amount>
                      <QtyBtn
                        onClick={() => decrementQuantity(item.id)}
                        data-testid="cart-item-amount-decrease"
                      >
                        −
                      </QtyBtn>
                    </Controls>
                    <Img src={item.image || item.gallery?.[0]} alt={item.name} />
                  </RightWrapper>
                </Product>
              );
            })}

            <Total data-testid="cart-total">Total: ${total.toFixed(2)}</Total>
            <OrderButton onClick={handlePlaceOrder} disabled={cartItems.length === 0}>
              PLACE ORDER
            </OrderButton>
          </>
        )}
      </OverlayPanel>
    </Container>
  );
}
