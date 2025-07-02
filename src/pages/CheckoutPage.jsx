import React, { useState } from "react";
import styled from "styled-components";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";


const Wrapper = styled.div`
  max-width: 900px;
  margin: 60px auto;
  padding: 24px 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 32px;
  color: #1f1f1f;
`;

const CartList = styled.div`
  border-bottom: 1px solid #e2e2e2;
  margin-bottom: 32px;
  padding-bottom: 24px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 1rem;
`;

const Total = styled.div`
  text-align: right;
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 32px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

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

const Message = styled.div`
  margin-top: 24px;
  color: green;
  font-weight: 600;
  font-size: 1.1rem;
`;

const CheckoutPage = () => {
  const { cartItems, setCartItems } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !address.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    setSuccessMsg(`Thank you for your order, ${name}!`);
    setCartItems([]);

    // Optional: Redirect back to home after 3 seconds
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  return (
    <Wrapper>
      <Title>Checkout</Title>

      <CartList>
        {cartItems.map((item) => (
          <Item key={item.id}>
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </Item>
        ))}
        <Total>Total: ${total.toFixed(2)}</Total>
      </CartList>

      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
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
            placeholder="123 Main St, Skopje"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <Button type="submit">Place Order</Button>
      </Form>

      {successMsg && <Message>{successMsg}</Message>}

      <BackLink to="/">← Continue Shopping</BackLink>
    </Wrapper>
  );
};

export default CheckoutPage;
