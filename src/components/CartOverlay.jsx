// src/components/CartOverlay.jsx
import React from "react";
import styled from "styled-components";
import { useCart } from "../context/CartContext";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(57, 55, 72, 0.22);
  z-index: 998;
`;

const Overlay = styled.div`
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

  &:hover {
    color: #e60023;
  }
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
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 60%;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Img = styled.img`
  width: 120px;
  height: 160px;
  object-fit: cover;
  margin-top: 8px;
`;

const Name = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const Price = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const AttributeTitle = styled.div`
  font-size: 12px;
  margin-top: 4px;
`;

const SizeOptions = styled.div`
  display: flex;
  gap: 8px;
`;

const SizeBox = styled.div`
  padding: 4px 8px;
  border: 1px solid #1D1F22;
  font-size: 12px;
  cursor: default;
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 8px;
`;

const ColorBox = styled.div`
  width: 16px;
  height: 16px;
  background-color: ${(props) => props.color || "#ccc"};
  border: 1px solid #1D1F22;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const QtyBtn = styled.button`
  width: 32px;
  height: 32px;
  font-size: 18px;
  font-weight: bold;
  background: white;
  border: 1px solid #1D1F22;
  cursor: pointer;

  &:hover {
    background: #eee;
  }
`;

const Amount = styled.div`
  font-size: 14px;
`;

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

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const CartOverlay = ({ onClose }) => {
  const { cartItems, incrementQuantity, decrementQuantity } = useCart();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      <Backdrop onClick={onClose} />
      <Overlay>
        <CloseBtn onClick={onClose}>×</CloseBtn>
        <Header>My Bag, {totalItems} {totalItems === 1 ? "item" : "items"}</Header>

        {cartItems.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <Product key={item.id}>
                <Left>
                  <Name>{item.name}</Name>
                  <Price>${item.price.toFixed(2)}</Price>

                  <AttributeTitle>Size:</AttributeTitle>
                  <SizeOptions>
                    {["XS", "S", "M", "L"].map((size) => (
                      <SizeBox key={size}>{size}</SizeBox>
                    ))}
                  </SizeOptions>

                  <AttributeTitle>Color:</AttributeTitle>
                  <ColorOptions>
                    {["#f0f0f0", "#000", "#0f6657"].map((color, idx) => (
                      <ColorBox key={idx} color={color} />
                    ))}
                  </ColorOptions>
                </Left>

                <Right>
                  <Controls>
                    <QtyBtn onClick={() => incrementQuantity(item.id)}>+</QtyBtn>
                    <Amount>{item.quantity}</Amount>
                    <QtyBtn onClick={() => decrementQuantity(item.id)}>-</QtyBtn>
                  </Controls>
                  <Img src={item.image} alt={item.name} />
                </Right>
              </Product>
            ))}

            <Total>Total: ${total.toFixed(2)}</Total>
            <OrderButton disabled={cartItems.length === 0}>
              PLACE ORDER
            </OrderButton>
          </>
        )}
      </Overlay>
    </>
  );
};

export default CartOverlay;
