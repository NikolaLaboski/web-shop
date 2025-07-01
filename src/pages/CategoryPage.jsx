// src/pages/CategoryPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import products from "../data/products";

// Styled components
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  padding: 32px;
`;

const Card = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: 0.2s ease;
  background: white;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const ProductContent = styled.div`
  padding: 16px;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const ProductPrice = styled.p`
  color: #007bff;
  font-size: 1rem;
  font-weight: 500;
`;

const CategoryPage = () => {
  const { categoryName } = useParams();

  const filteredProducts = products.filter(
    (product) =>
      product.category &&
      product.category.toLowerCase() === categoryName?.toLowerCase()
  );

  return (
    <Grid>
      {filteredProducts.map((product) => (
        <Card key={product.id}>
          <Link
            to={`/product/${product.id}`}
            data-testid={`product-${product.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            <ProductImage src={product.image} alt={product.name} />
            <ProductContent>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
            </ProductContent>
          </Link>
        </Card>
      ))}
    </Grid>
  );
};

export default CategoryPage;
