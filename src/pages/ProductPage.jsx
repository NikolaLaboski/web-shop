// ProductPage.jsx
// Shows detailed info for a single product, including gallery, attributes, price, and add-to-cart.
// Uses GraphQL to fetch product data by ID from route params.

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useCart } from "../context/CartContext";
import { useQuery, gql } from "@apollo/client";

// GraphQL: fetch one product by ID with attributes and gallery.
const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      description
      category
      gallery
      prices { amount }
      attributes {
        id
        name
        type
        items { displayValue value id }
      }
    }
  }
`;

const Container = styled.div`
  padding: 40px 24px;
  max-width: 1200px;
  margin: 0 auto;
`;
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 40px;
  }
`;
const LeftColumn = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;
const Gallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Thumb = styled.img`
  display: block;
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 4px;
`;
const MainImageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const MainImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
  max-height: 500px;
`;
const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 1px solid #ccc;
  color: #1d1f22;
  font-size: 22px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
  &:hover { background: #f5f5f5; }
`;
const LeftArrow = styled(ArrowButton)` left: 10px; `;
const RightArrow = styled(ArrowButton)` right: 10px; `;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  margin-top: 32px;
  @media (min-width: 768px) { margin-top: 0; }
`;
const Title = styled.h2` font-size: 1.75rem; font-weight: 600; margin: 0; `;
const Price = styled.p` font-size: 1.25rem; font-weight: bold; color: #1d1f22; `;
const Label = styled.p` margin: 0; font-weight: 500; font-size: 14px; `;
const Options = styled.div` display: flex; gap: 8px; margin-top: 4px; `;
const OptionButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #1d1f22;
  background-color: ${({ selected }) => (selected ? "#1d1f22" : "white")};
  color: ${({ selected }) => (selected ? "white" : "#1d1f22")};
  cursor: pointer;
`;
const ColorBox = styled.button`
  width: 24px; height: 24px;
  border: 2px solid ${({ selected }) => (selected ? "#5ECE7B" : "#1d1f22")};
  background-color: ${({ color }) => color};
  cursor: pointer;
`;
const Button = styled.button`
  background-color: #5ece7b;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  &:hover { background-color: #45c768; }
  &:disabled { background-color: #ccc; cursor: not-allowed; }
`;
const Description = styled.div`
  color: #555; font-size: 14px; line-height: 1.6;
`;

/** 
 * normalizeGallery
 * Ensures the gallery is an array of URLs.
 * Accepts array, JSON-stringified array, or comma/space-separated string of URLs.
 * Returns [] if nothing valid is provided.
 */
function normalizeGallery(g) {
  if (Array.isArray(g)) return g;
  if (typeof g === "string") {
    // Try JSON array in string
    try {
      const parsed = JSON.parse(g);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    // Split by commas/whitespace and keep valid URLs
    const parts = g
      .split(/[\s,]+/)
      .map(s => s.trim())
      .filter(u => /^https?:\/\//i.test(u));
    if (parts.length) return parts;
  }
  return [];
}

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  // Query product from backend with network-only fetch first time, then cache.
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first"
  });

  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [imageIndex, setImageIndex] = useState(0);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product = data?.product;
  if (!product) return <div>Product not found.</div>;

  const gallery = normalizeGallery(product.gallery);
  console.log("GALLERY FROM BACKEND:", product.gallery, "→ normalized:", gallery);

  const price = product.prices?.[0]?.amount ?? 0;

  // Separate attribute sets by type/name for rendering.
  const attrs = product.attributes || [];
  const sizeSet = attrs.find(a => a.name?.toLowerCase() === "size");
  const capacitySet = attrs.find(a => a.name?.toLowerCase() === "capacity");
  const colorSet = attrs.find(a => a.name?.toLowerCase() === "color");

  // Category-based required attribute logic: tech requires capacity/color; others require size.
  const isTech = product.category?.toLowerCase() === "tech";
  const requiredKeys = [];
  if (isTech) {
    if (capacitySet) requiredKeys.push("Capacity");
    if (colorSet) requiredKeys.push("Color");
  } else {
    if (sizeSet) requiredKeys.push("Size");
  }

  // Only allow add-to-cart if all required attributes have been chosen.
  const canAdd =
    requiredKeys.length === 0 ||
    requiredKeys.every((k) => !!selectedAttributes[k]);

  // Add product to cart with first gallery image and selected attributes.
  const handleAddToCart = () => {
    addToCart(
      { ...product, image: gallery[0], prices: product.prices },
      selectedAttributes
    );
  };

  // Gallery navigation handlers.
  const handlePrev = () =>
    setImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  const handleNext = () =>
    setImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));

  return (
    <Container>
      <Layout>
        {/* Left side: thumbnails + main image */}
        <LeftColumn>
          <Gallery>
            {gallery.map((img, index) => (
              <Thumb
                key={index}
                src={img}
                alt={`preview-${index}`}
                onClick={() => setImageIndex(index)}
              />
            ))}
          </Gallery>

          <MainImageWrapper>
            <MainImage src={gallery[imageIndex] || ""} alt={product.name} />
            {gallery.length > 1 && (
              <>
                <LeftArrow onClick={handlePrev}>‹</LeftArrow>
                <RightArrow onClick={handleNext}>›</RightArrow>
              </>
            )}
          </MainImageWrapper>
        </LeftColumn>

        {/* Right side: product info, attributes, and add-to-cart */}
        <Info>
          <Title>{product.name}</Title>

          {/* Size selector for non-tech products */}
          {!isTech && sizeSet && (
            <div data-testid="product-attribute-size">
              <Label>SIZE:</Label>
              <Options>
                {sizeSet.items.map((it) => {
                  const val = it.displayValue || it.value;
                  const isSelected = selectedAttributes.Size === val;
                  const kebab = String(val).toLowerCase();
                  return (
                    <OptionButton
                      key={it.id || val}
                      selected={isSelected}
                      data-testid={
                        isSelected
                          ? `product-attribute-size-${kebab}-selected`
                          : `product-attribute-size-${kebab}`
                      }
                      onClick={() =>
                        setSelectedAttributes((prev) => ({ ...prev, Size: val }))
                      }
                    >
                      {val}
                    </OptionButton>
                  );
                })}
              </Options>
            </div>
          )}

          {/* Capacity selector for tech products */}
          {isTech && capacitySet && (
            <div data-testid="product-attribute-size">
              <Label>CAPACITY:</Label>
              <Options>
                {capacitySet.items.map((it) => {
                  const val = it.displayValue || it.value;
                  const isSelected = selectedAttributes.Capacity === val;
                  const kebab = String(val).toLowerCase();
                  return (
                    <OptionButton
                      key={it.id || val}
                      selected={isSelected}
                      data-testid={
                        isSelected
                          ? `product-attribute-size-${kebab}-selected`
                          : `product-attribute-size-${kebab}`
                      }
                      onClick={() =>
                        setSelectedAttributes((prev) => ({ ...prev, Capacity: val }))
                      }
                    >
                      {val}
                    </OptionButton>
                  );
                })}
              </Options>
            </div>
          )}

          {/* Color selector for tech products */}
          {isTech && colorSet && (
            <div data-testid="product-attribute-color">
              <Label>COLOR:</Label>
              <Options>
                {colorSet.items.map((it) => {
                  const val = it.value;
                  const isSelected = selectedAttributes.Color === val;
                  const kebab = String(val).replace("#", "").toLowerCase();
                  return ( 
                    <ColorBox
                      key={it.id || val}
                      color={val}
                      selected={isSelected}
                      data-testid={
                        isSelected
                          ? `product-attribute-color-${kebab}-selected`
                          : `product-attribute-color-${kebab}`
                      }
                      onClick={() =>
                        setSelectedAttributes((prev) => ({ ...prev, Color: val }))
                      }
                    />
                  );
                })}
              </Options>
            </div>
          )}

          <Label>PRICE:</Label>
          <Price>${price.toFixed(2)}</Price>

          <Button data-testid="add-to-cart" onClick={handleAddToCart} disabled={!canAdd}>
            ADD TO CART
          </Button>

          {/* Render HTML description from backend; ensure source is trusted */}
          <Description
            data-testid="product-description"
            dangerouslySetInnerHTML={{ __html: product.description || "" }}
          />
        </Info>
      </Layout>
    </Container>
  );
};

export default ProductPage;
