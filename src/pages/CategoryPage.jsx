// CategoryPage.jsx
// Lists products by category (or all) and allows quick "add to cart" from the grid.
// Data - GraphQL GET_PRODUCTS query (id, name, category, gallery, prices, attributes, inStock).

import React from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useQuery, gql } from "@apollo/client";

// GraphQL query: minimal fields for PLP + inStock for out-of-stock behavior.
const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      category
      inStock
      gallery
      prices { amount }
      attributes {
        name
        type
        items { displayValue value }
      }
    }
  }
`;

// Responsive grid for product cards.
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
  color: #1d1f22;
  margin: 24px 0 12px 0;
  padding-left: 48px;

  @media (max-width: 640px) {
    padding-left: 20px;
    font-size: 20px;
  }
`;

// Product card with hoverable add-to-cart button.
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

  a { text-decoration: none; }
`;

const ProductImageWrap = styled.div`
  position: relative;
`;

const ProductImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  filter: ${({ $dimmed }) => ($dimmed ? "grayscale(100%) opacity(0.6)" : "none")};
`;

const OutOfStockBadge = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  background: rgba(255,255,255,0.9);
  color: #8d8f9a;
  font-size: 14px;
  padding: 6px 10px;
  border-radius: 4px;
`;

const AddToCartButton = styled.button`
  position: absolute;
  top: 190px;
  right: 12px;
  background-color: #5ece7b;
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);

  svg { color: white; font-size: 14px; }

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
  color: #1d1f22;
  margin: 0;
`;

const ProductPrice = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  color: #1d1f22;
  margin: 0;
`;

function toKebab(s) {
  return String(s).toLowerCase().replace(/\s+/g, "-");
}

// Picks the first option for each attribute (default selection for Quick Shop).
function getDefaultSelections(attributes = []) {
  const selected = {};
  attributes.forEach((set) => {
    const name = set?.name;
    const first = set?.items?.[0];
    if (name && first) selected[name] = first.value ?? first.displayValue;
  });
  return selected;
}

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { addToCart } = useCart();
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  const cat = (categoryName || "all").toLowerCase();
  const capitalizedCategory = cat.charAt(0).toUpperCase() + cat.slice(1);

  if (loading) return <p style={{ padding: "48px" }}>Loading...</p>;
  if (error) return <p style={{ padding: "48px" }}>Error: {error.message}</p>;

  // If "all" show everything; otherwise filter by category (case-insensitive).
  const products = cat === "all"
    ? data.products
    : data.products.filter(p => (p.category || "").toLowerCase() === cat);

  return (
    <>
      <CategoryTitle>{capitalizedCategory}</CategoryTitle>
      <Grid>
        {products.map((product) => {
          const kebabName = toKebab(product.name);
          const price = product.prices?.[0]?.amount ?? 0;
          const inStock = product.inStock !== false; // default to true if undefined

          const defaults = getDefaultSelections(product.attributes || []);

          return (
            <CardWrapper key={product.id} data-testid={`product-${kebabName}`}>
              {/* Quick add-to-cart (only visible on hover, and only when in stock) */}
              {inStock && (
                <AddToCartButton
                  onClick={() =>
                    addToCart({
                      ...product,
                      selectedAttributes: defaults,
                      attributes: product.attributes || [],
                    })
                  }
                  title="Add to Cart"
                  aria-label={`Quick add ${product.name}`}
                >
                  <FaShoppingCart />
                </AddToCartButton>
              )}

              {/* PDP navigation is always available (even when out of stock) */}
              <Link to={`/product/${product.id}`}>
                <ProductImageWrap>
                  <ProductImage
                    src={
                      product.gallery?.[0] ||
                      `https://via.placeholder.com/220x220.png?text=${encodeURIComponent(product.name)}`
                    }
                    alt={product.name}
                    $dimmed={!inStock}
                  />
                  {!inStock && (
                    <OutOfStockBadge data-testid="product-out-of-stock">
                      OUT OF STOCK
                    </OutOfStockBadge>
                  )}
                </ProductImageWrap>

                <ProductContent>
                  <ProductName>{product.name}</ProductName>
                  <ProductPrice>${price.toFixed(2)}</ProductPrice>
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
