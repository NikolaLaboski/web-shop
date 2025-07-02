import React from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import products from "../data/products";

// Styled Components
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 40px;
  padding: 40px 32px;
  font-family: 'Raleway', sans-serif;
`;

const CardWrapper = styled.div`
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  transition: 0.3s ease;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 270px;
  object-fit: cover;
  display: block;
  border-radius: 12px 12px 0 0;
`;

const AddToCartButton = styled.button`
  position: absolute;
  top: 220px;
  right: 16px;
  background-color: #5ECE7B;
  border: none;
  border-radius: 50%;
  padding: 12px;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);

  svg {
    color: white;
    font-size: 16px;
  }

  &:hover {
    background-color: #45c768;
  }
`;

const ProductContent = styled.div`
  padding: 16px;
  text-align: left;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 400;
  margin-bottom: 6px;
  color: #1D1F22;
`;

const ProductPrice = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #1D1F22;
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
    <Grid>
      {filteredProducts.map((product) => (
        <CardWrapper key={product.id}>
          <AddToCartButton onClick={() => addToCart(product)} title="Add to Cart">
            <FaShoppingCart />
          </AddToCartButton>

          <Link
            to={`/product/${product.id}`}
            data-testid={`product-${product.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <ProductImage src={product.image} alt={product.name} />
            <ProductContent>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
            </ProductContent>
          </Link>
        </CardWrapper>
      ))}
    </Grid>
  );
};

export default CategoryPage;
