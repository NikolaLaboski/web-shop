// src/components/CartOverlay.jsx
import React from "react";
import styled from "styled-components";
import { useCart } from "../context/CartContext";
import { gql, useMutation } from "@apollo/client";

const PLACE_ORDER = gql`
  mutation Place($items: [OrderItemInput!]!) {
    createOrder(items: $items)
  }
`;

const Backdrop = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 80px;
  bottom: 0;
  background: rgba(57, 55, 72, 0.22);
  z-index: 998;
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  z-index: 997;
`;

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
const OptionsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
const SizeBox = styled.div`
  padding: 4px 8px;
  border: 1px solid ${({ $selected }) => ($selected ? "#1D1F22" : "#ccc")};
  font-size: 12px;
  background: ${({ $selected }) => ($selected ? "#1D1F22" : "white")};
  color: ${({ $selected }) => ($selected ? "white" : "#1D1F22")};
`;
const ColorBox = styled.div`
  width: 18px;
  height: 18px;
  background-color: ${(props) => props.$color || "#ccc"};
  border: 2px solid ${({ $selected }) => ($selected ? "#5ECE7B" : "#1D1F22")};
  border-radius: 4px;
  box-shadow: ${({ $selected }) =>
    $selected ? "0 0 0 3px rgba(94, 206, 123, 0.5)" : "none"};
  transition: all 0.2s ease-in-out;
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
  border: 1px solid #1d1f22;
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
  background-color: #5ece7b;
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

// ---------- helpers ----------
function getAttrSetMap(item) {
  if (item && item.attributes && !Array.isArray(item.attributes)) {
    const toItems = (arr = []) =>
      (arr || []).map((v) => ({
        id: String(v),
        value: String(v),
        displayValue: String(v),
      }));
    return {
      Size: toItems(item.attributes.Size),
      Capacity: toItems(item.attributes.Capacity),
      Color: toItems(item.attributes.Color),
    };
  }
  const map = { Size: [], Capacity: [], Color: [] };
  if (Array.isArray(item?.attributes)) {
    item.attributes.forEach((set) => {
      const name = (set.name || "").toLowerCase();
      const items = (set.items || []).map((it) => ({
        id: it.id ?? it.value ?? it.displayValue,
        value: it.value,
        displayValue: it.displayValue ?? it.value,
      }));
      if (name === "size") map.Size = items;
      if (name === "capacity") map.Capacity = items;
      if (name === "color") map.Color = items;
    });
  }
  return map;
}
const canon = (v) => String(v ?? "").trim().toLowerCase();
const valKey = (objOrVal) =>
  objOrVal && typeof objOrVal === "object"
    ? canon(objOrVal.id ?? objOrVal.value ?? objOrVal.displayValue)
    : canon(objOrVal);
const isSelected = (sel, opt) => valKey(sel) === valKey(opt);
// --------------------------------

export default function CartOverlay() {
  const {
    cartItems,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    showCart,
    setShowCart,
  } = useCart();
  const [placeOrder, { loading }] = useMutation(PLACE_ORDER);

  const totalItems = cartItems.reduce((a, i) => a + i.quantity, 0);
  const total = cartItems.reduce(
    (a, i) => a + ((i?.prices?.[0]?.amount ?? 0) * i.quantity),
    0
  );

  const close = () => setShowCart(false);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    const items = cartItems.map((ci) => ({
      product_id: ci.id,
      quantity: ci.quantity,
    }));

    try {
      const { data } = await placeOrder({ variables: { items } });
      if (data?.createOrder) {
        clearCart?.();
        close(); // само затвора, без alert
      } else {
        console.error("Order failed");
      }
    } catch (e) {
      console.error("Error placing order", e);
    }
  };

  return (
    <Container
      data-testid="cart-overlay"
      aria-hidden={!showCart}
      style={{ visibility: showCart ? "visible" : "hidden" }}
    >
      {showCart && (
        <>
          <Backdrop onClick={close} />
          <OverlayPanel>
            <CloseBtn onClick={close}>×</CloseBtn>
            <Header>
              My Bag, {totalItems} {totalItems === 1 ? "Item" : "Items"}
            </Header>

            {cartItems.length === 0 ? (
              <p>No items in cart.</p>
            ) : (
              <>
                {cartItems.map((item, idx) => {
                  const { Size, Capacity, Color } = getAttrSetMap(item);
                  const selected = item.selectedAttributes || {};
                  const price = item?.prices?.[0]?.amount ?? 0;
                  const key = `${item.id}-${idx}`;

                  return (
                    <Product key={key}>
                      <Left>
                        <Name>{item.name}</Name>
                        <Price>${price.toFixed(2)}</Price>

                        {Size.length > 0 && (
                          <>
                            <AttributeTitle>Size:</AttributeTitle>
                            <OptionsRow data-testid="cart-item-attribute-size">
                              {Size.map((it) => {
                                const sel = isSelected(selected.Size, it);
                                const kebab = String(
                                  it.displayValue || it.value
                                ).toLowerCase();
                                return (
                                  <SizeBox
                                    key={it.id}
                                    $selected={sel}
                                    data-testid={
                                      sel
                                        ? `cart-item-attribute-size-${kebab}-selected`
                                        : `cart-item-attribute-size-${kebab}`
                                    }
                                  >
                                    {it.displayValue || it.value}
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
                              {Capacity.map((it) => {
                                const sel = isSelected(selected.Capacity, it);
                                const kebab = String(
                                  it.displayValue || it.value
                                ).toLowerCase();
                                return (
                                  <SizeBox
                                    key={it.id}
                                    $selected={sel}
                                    data-testid={
                                      sel
                                        ? `cart-item-attribute-capacity-${kebab}-selected`
                                        : `cart-item-attribute-capacity-${kebab}`
                                    }
                                  >
                                    {it.displayValue || it.value}
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
                              {Color.map((it) => {
                                const colorKey = String(
                                  (it.value || it.displayValue || "").replace(
                                    "#",
                                    ""
                                  )
                                ).toLowerCase();
                                const sel = isSelected(selected.Color, it);
                                return (
                                  <ColorBox
                                    key={it.id}
                                    $color={it.value}
                                    $selected={sel}
                                    data-testid={
                                      sel
                                        ? `cart-item-attribute-color-${colorKey}-selected`
                                        : `cart-item-attribute-color-${colorKey}`
                                    }
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
                            onClick={() =>
                              incrementQuantity(item.itemKey || item.id)
                            }
                            data-testid="cart-item-amount-increase"
                          >
                            +
                          </QtyBtn>
                          <Amount data-testid="cart-item-amount">
                            {item.quantity}
                          </Amount>
                          <QtyBtn
                            onClick={() =>
                              decrementQuantity(item.itemKey || item.id)
                            }
                            data-testid="cart-item-amount-decrease"
                          >
                            −
                          </QtyBtn>
                        </Controls>
                        <Img
                          src={item.image || item.gallery?.[0]}
                          alt={item.name}
                        />
                      </RightWrapper>
                    </Product>
                  );
                })}

                <Total data-testid="cart-total">
                  Total: ${total.toFixed(2)}
                </Total>
                <OrderButton
                  onClick={handlePlaceOrder}
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? "PLACING…" : "PLACE ORDER"}
                </OrderButton>
              </>
            )}
          </OverlayPanel>
        </>
      )}
    </Container>
  );
}
