import React from "react";
import styled from "styled-components";
import { useCart } from "../context/CartContext";

const Overlay = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.15);
  padding: 20px;
  width: 300px;
  z-index: 999;
  border-radius: 8px;
`;

const Product = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Img = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 12px;
  border-radius: 6px;
`;

const Info = styled.div`
  flex: 1;
  margin-right: 8px;
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: #e60023;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Total = styled.div`
  font-weight: bold;
  margin-top: 12px;
  text-align: right;
`;

const CartOverlay = () => {
  const { cartItems, removeFromCart } = useCart();

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <Overlay>
      <h4>Your Cart</h4>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
  <Product key={index}>
    <Img src={item.image} alt={item.name} />
    <Info>
      <div>{item.name}</div>
      <div>${item.price.toFixed(2)}</div>
    </Info>
    <RemoveButton onClick={() => removeFromCart(index)}>
      Remove
    </RemoveButton>
  </Product>
))}

          <Total>Total: ${total.toFixed(2)}</Total>
        </>
      )}
    </Overlay>
  );
};

export default CartOverlay;
