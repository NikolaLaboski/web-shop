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
  border: 1px solid ${({ selected }) => (selected ? "#1D1F22" : "#ccc")};
  font-size: 12px;
  background: ${({ selected }) => (selected ? "#1D1F22" : "white")};
  color: ${({ selected }) => (selected ? "white" : "#1D1F22")};
  cursor: pointer;
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 8px;
`;

const ColorBox = styled.div`
  width: 16px;
  height: 16px;
  background-color: ${(props) => props.color || "#ccc"};
  border: 2px solid ${({ selected }) => (selected ? "#5ECE7B" : "#1D1F22")};
  cursor: pointer;
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

// ... [imports and styles stay the same]

const CartOverlay = ({ onClose }) => {
  const {
    cartItems,
    incrementQuantity,
    decrementQuantity,
    updateAttribute,
  } = useCart();

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
        <Header>
          My Bag, {totalItems} {totalItems === 1 ? "item" : "items"}
        </Header>

        {cartItems.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            {cartItems.map((item, index) => {
              const selectedSize = item.selectedAttributes?.Size;
              const selectedColor = item.selectedAttributes?.Color;
              const sizes = item.attributes?.Size || [];
              const colors = item.attributes?.Color || [];

              const key = `${item.id}-${selectedSize || "?"}-${selectedColor || "?"}-${index}`;

              return (
                <Product key={key}>
                  <Left>
                    <Name>{item.name}</Name>
                    <Price>${item.price.toFixed(2)}</Price>

                    {sizes.length > 0 && (
                      <>
                        <AttributeTitle>Size:</AttributeTitle>
                        <SizeOptions data-testid="cart-item-attribute-size">
                          {sizes.map((size) => (
                            <SizeBox
                              key={size}
                              selected={selectedSize === size}
                              data-testid={
                                selectedSize === size
                                  ? `cart-item-attribute-size-${size.toLowerCase()}-selected`
                                  : `cart-item-attribute-size-${size.toLowerCase()}`
                              }
                              onClick={() =>
                                updateAttribute(item.id, "Size", size)
                              }
                            >
                              {size}
                            </SizeBox>
                          ))}
                        </SizeOptions>
                      </>
                    )}

                    {colors.length > 0 && (
                      <>
                        <AttributeTitle>Color:</AttributeTitle>
                        <ColorOptions data-testid="cart-item-attribute-color">
                          {colors.map((color) => {
                            const colorKey = color.replace("#", "").toLowerCase();
                            const isSelected = selectedColor === color;

                            return (
                              <ColorBox
                                key={color}
                                color={color}
                                selected={isSelected}
                                data-testid={
                                  isSelected
                                    ? `cart-item-attribute-color-${colorKey}-selected`
                                    : `cart-item-attribute-color-${colorKey}`
                                }
                                onClick={() =>
                                  updateAttribute(item.id, "Color", color)
                                }
                              />
                            );
                          })}
                        </ColorOptions>
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
                    <Img src={item.image} alt={item.name} />
                  </RightWrapper>
                </Product>
              );
            })}

            <Total data-testid="cart-total">Total: ${total.toFixed(2)}</Total>
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

