// CheckoutPage.jsx
// Displays the current cart items, collects basic customer info, and simulates order placement.
// Flow:
// 1) Show cart items with quantities and total.
// 2) Collect "Full Name" and "Shipping Address".
// 3) On submit: validate, clear cart, show thank-you, then redirect.

import React, { useState } from "react";
import styled from "styled-components";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

// Container for the checkout content
const Wrapper = styled.div`
  max-width: 900px;
  margin: 60px auto;
  padding: 24px 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
`;

// Page title
const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 32px;
  color: #1f1f1f;
`;

// List of cart items
const CartList = styled.div`
  border-bottom: 1px solid #e2e2e2;
  margin-bottom: 32px;
  padding-bottom: 24px;
`;

// Single line item row
const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 1rem;
`;

// Total row
const Total = styled.div`
  text-align: right;
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 16px;
`;

// Checkout form
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 32px;
`;

// Field label
const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

// Text input
const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

// Submit button
const Button = styled.button`
  margin-top: 12px;
  background-color: #007bff;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #005dc1;
  }
`;

// Link back to catalog
const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 16px;
  color: #007bff;
  text-decoration: underline;
  font-size: 0.95rem;

  &:hover {
    color: #005dc1;
  }
`;

// Success message text
const Message = styled.div`
  margin-top: 24px;
  color: green;
  font-weight: 600;
  font-size: 1.1rem;
`;

const CheckoutPage = () => {
  const { cartItems, setCartItems } = useCart(); // setCartItems used to clear the cart
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  // Helper: pick unit price from GraphQL-style data or fallback item.price
  const getItemUnitPrice = (item) =>
    item?.prices?.[0]?.amount ?? (typeof item?.price === "number" ? item.price : 0);

  // Accumulate total cost
  const total = cartItems.reduce(
    (acc, item) => acc + getItemUnitPrice(item) * (item.quantity || 0),
    0
  );

  /**
   * handleSubmit
   * Validates inputs, simulates an order, clears the cart, and redirects.
   * No network call here; this is a UI-only flow.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    setSuccessMsg(`Thank you for your order, ${name}!`);

    // Clear cart (if provider exposed the setter).
    if (typeof setCartItems === "function") {
      setCartItems([]);
    }

    // Redirect to "all" after a short delay for UX.
    setTimeout(() => {
      navigate("/category/all");
    }, 2000);
  };

  return (
    <Wrapper>
      <Title>Checkout</Title>

      {/* Cart summary block */}
      <CartList>
        {cartItems.map((item) => {
          const unit = getItemUnitPrice(item);
          return (
            <Item key={`${item.id}-${JSON.stringify(item.selectedAttributes)}`}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${(unit * item.quantity).toFixed(2)}</span>
            </Item>
          );
        })}
        <Total>Total: ${total.toFixed(2)}</Total>
      </CartList>

      {/* Basic shipping form */}
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Nicky Laboski"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="address">Shipping Address</Label>
          <Input
            id="address"
            type="text"
            placeholder="Ohrid, Macedonia"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <Button type="submit">Place Order</Button>
      </Form>

      {/* Success message (visible after placing order) */}
      {successMsg && <Message>{successMsg}</Message>}

      <BackLink to="/category/all">← Please buy some more :)</BackLink>
    </Wrapper>
  );
};

export default CheckoutPage;
