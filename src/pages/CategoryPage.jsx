import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useQuery, gql } from "@apollo/client";

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
  right: 16px;
  bottom: -26px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 0;
  background: #5ece7b;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 14px rgba(94,206,123,.35);
  z-index: 3;

  svg { color: #fff; font-size: 18px; }

  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition: opacity .25s ease, transform .25s ease;

  @media (hover: hover) and (pointer: fine) {
    opacity: 0;
    visibility: visible;
    transform: translateY(6px);

    ${CardWrapper}:hover & {
      opacity: 1;
      transform: translateY(0);
    }
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
  color: #1d1f22;
  margin: 0;
`;

const ProductPrice = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  color: #1d1f22;
  margin: 0;
`;

function kebabCase(s = "") {
  return String(s).trim().toLowerCase().replace(/\s+/g, "-");
}

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
  const location = useLocation();
  const { addToCart, setShowCart } = useCart();
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  const urlSlug = (location.pathname.split("/")[1] || "").toLowerCase();
  const cat = (categoryName || urlSlug || "all").toLowerCase();
  const capitalizedCategory = cat.charAt(0).toUpperCase() + cat.slice(1);

  if (loading) return <p style={{ padding: "48px" }}>Loading...</p>;
  if (error) return <p style={{ padding: "48px" }}>Error: {error.message}</p>;

  const products = cat === "all"
    ? data.products
    : data.products.filter(p => (p.category || "").toLowerCase() === cat);

  return (
    <>
      <CategoryTitle>{capitalizedCategory}</CategoryTitle>
      <Grid>
        {products.map((product) => {
          const price = product.prices?.[0]?.amount ?? 0;
          const inStock = product.inStock !== false;
          const defaults = getDefaultSelections(product.attributes || []);
          const testId = `product-${kebabCase(product.name)}`;

          return (
            <CardWrapper key={product.id} data-testid={testId}>
              {inStock && (
                <AddToCartButton
                  onClick={() => {
                    addToCart({
                      ...product,
                      selectedAttributes: defaults,
                      attributes: product.attributes || [],
                    });
                    setShowCart(true);
                  }}
                  title="Add to Cart"
                  aria-label={`Quick add ${product.name}`}
                >
                  <FaShoppingCart />
                </AddToCartButton>
              )}

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
