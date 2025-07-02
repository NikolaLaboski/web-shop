// src/components/CartOverlay.jsx
import React from "react";
import styled from "styled-components";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

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

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  color: #333;

  &:hover {
    color: #e60023;
  }
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

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const QtyBtn = styled.button`
  background: #eee;
  border: none;
  padding: 2px 8px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #ccc;
  }
`;

const Total = styled.div`
  font-weight: bold;
  margin-top: 12px;
  text-align: right;
`;

const LinkButton = styled(Link)`
  display: block;
  margin-top: 16px;
  text-align: center;
  background-color: #007bff;
  color: white;
  padding: 12px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    background-color: #005dc1;
  }
`;

const CartOverlay = ({ onClose }) => {
  const { cartItems, incrementQuantity, decrementQuantity } = useCart();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Overlay>
      <CloseButton onClick={onClose}>×</CloseButton>
      <h4>Your Cart</h4>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <Product key={item.id}>
              <Img src={item.image} alt={item.name} />
              <Info>
                <div>{item.name}</div>
                <div>${item.price.toFixed(2)}</div>
                <div>Qty: {item.quantity}</div>
              </Info>
              <Controls>
                <QtyBtn onClick={() => decrementQuantity(item.id)}>-</QtyBtn>
                <QtyBtn onClick={() => incrementQuantity(item.id)}>+</QtyBtn>
              </Controls>
            </Product>
          ))}
          <Total>Total: ${total.toFixed(2)}</Total>
          <LinkButton to="/checkout">Proceed to Checkout</LinkButton>
        </>
      )}
    </Overlay>
  );
};

export default CartOverlay;
