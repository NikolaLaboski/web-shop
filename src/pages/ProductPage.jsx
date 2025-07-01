import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import products from "../data/products";
import { useCart } from "../context/CartContext";

// Styled components
const Container = styled.div`
  padding: 40px 24px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 24px;
  color: #222;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Image = styled.img`
  width: 100%;
  max-width: 480px;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Price = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  color: #007bff;
`;

const Description = styled.p`
  color: #555;
  line-height: 1.6;
`;

const Button = styled.button`
  margin-top: 16px;
  background-color: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #005dc1;
  }
`;

const NotFound = styled.div`
  padding: 32px;
  text-align: center;
  color: red;
  font-size: 1.2rem;
`;

const ProductPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  const { addToCart } = useCart();


  if (!product) {
    return <NotFound>Product not found.</NotFound>;
  }

  return (
    <Container>
      <Title>{product.name}</Title>
      <Layout>
        <Image src={product.image} alt={product.name} />
        <Info>
          <Price>${product.price.toFixed(2)}</Price>
          <Description>{product.description}</Description>
          <Button data-testid="add-to-cart" onClick={() => addToCart(product)}>
  Add to Cart
</Button>

        </Info>
      </Layout>
    </Container>
  );
};

export default ProductPage;
