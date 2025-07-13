import React from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import products from "../data/products";

// Styled Components
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

const CategoryTitle = styled.h2`
  font-size: 24px;
  font-weight: 400;
  color: #1D1F22;
  margin: 24px 0 12px 0;
  padding-left: 48px;

  @media (max-width: 640px) {
    padding-left: 20px;
    font-size: 20px;
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

    button {
      opacity: 1;
      visibility: visible;
    }
  }

  a {
    text-decoration: none;
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

  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
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

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { addToCart } = useCart();

  const filteredProducts = products.filter(
    (product) =>
      product.category &&
      product.category.toLowerCase() === categoryName?.toLowerCase()
  );

  const capitalizedCategory =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  const defaultAttributes = {
    Size: ["XS", "S", "M", "L"],
    Color: ["#f0f0f0", "#000", "#0f6657"]
  };

  return (
    <>
      <CategoryTitle>{capitalizedCategory}</CategoryTitle>
      <Grid>
        {filteredProducts.map((product) => {
          const kebabName = product.name.toLowerCase().replace(/\s+/g, "-");

          return (
            <CardWrapper key={product.id} data-testid={`product-${kebabName}`}>
              <AddToCartButton
                onClick={() =>
                  addToCart(
                    {
                      ...product,
                      attributes: defaultAttributes
                    },
                    {
                      Size: defaultAttributes.Size[0],
                      Color: defaultAttributes.Color[0]
                    }
                  )
                }
                title="Add to Cart"
              >
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
          );
        })}
      </Grid>
    </>
  );
};

export default CategoryPage;
