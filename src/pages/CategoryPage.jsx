import React from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import products from "../data/products";

// Styled Components

// Inside styled-components section

const CategoryTitle = styled.h2`
  font-size: 24px;
  font-weight: 400;
  color: #1D1F22;
  margin-bottom: 12px;
  text-align: left;
  grid-column: span 3;

  @media (max-width: 1024px) {
    grid-column: span 2;
  }

  @media (max-width: 640px) {
    grid-column: span 1;
    font-size: 20px;
  }
`;



const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 24px 48px;
  justify-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 220px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
  aspect-ratio: 3 / 4;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
`;

const AddToCartButton = styled.button`
  position: absolute;
  top: 190px;
  right: 12px;
  background-color: #5ECE7B;
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);

  svg {
    color: white;
    font-size: 14px;
  }

  &:hover {
    background-color: #45c768;
  }
`;

const ProductContent = styled.div`
  padding: 12px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProductName = styled.h3`
  font-size: 0.95rem;
  font-weight: 500;
  color: #1D1F22;
  margin: 0;
`;

const ProductPrice = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  color: #1D1F22;
  margin: 0;
`;



const ProductImageWrapper = styled.div`
  position: relative;
`;



const CategoryPage = () => {
  const { categoryName } = useParams();
  const { addToCart } = useCart();

  const filteredProducts = products.filter(
    (product) =>
      product.category &&
      product.category.toLowerCase() === categoryName?.toLowerCase()
  );

  return (
    
    <>
    <Grid>
  <CategoryTitle>{categoryName}</CategoryTitle>

  {filteredProducts.map((product) => (
    <CardWrapper key={product.id}>
      <AddToCartButton onClick={() => addToCart(product)} title="Add to Cart">
        <FaShoppingCart />
      </AddToCartButton>
      <Link to={`/product/${product.id}`}>
        <ProductImage src={product.image} alt={product.name} />
        <ProductContent>
          <ProductName>{product.name}</ProductName>
          <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
        </ProductContent>
      </Link>
    </CardWrapper>
  ))}
</Grid>
  </>
    );

};

export default CategoryPage;
