import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import products from "../data/products";
import { useCart } from "../context/CartContext";

// Styled components
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
`;

const Gallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Thumb = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 1px solid #ccc;
  cursor: pointer;
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

  &:hover {
    background: #f5f5f5;
  }
`;


const LeftArrow = styled(ArrowButton)`
  left: 10px;
`;

const RightArrow = styled(ArrowButton)`
  right: 10px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  margin-top: 32px;

  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
`;

const Price = styled.p`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1d1f22;
`;

const Label = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
`;

const Options = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

const OptionButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #1d1f22;
  background-color: ${({ selected }) => (selected ? "#1d1f22" : "white")};
  color: ${({ selected }) => (selected ? "white" : "#1d1f22")};
  cursor: pointer;
`;

const ColorBox = styled.button`
  width: 24px;
  height: 24px;
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

  &:hover {
    background-color: #45c768;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Description = styled.p`
  color: #555;
  font-size: 14px;
  line-height: 1.6;
`;

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === Number(id));

  const [selectedAttributes, setSelectedAttributes] = useState({
    Size: null,
    Color: null,
  });

  const gallery = product?.gallery || [product.image];
  const [imageIndex, setImageIndex] = useState(0);

  const sizes = ["XS", "S", "M", "L"];
  const colors = ["#f0f0f0", "#000", "#0f6657"];
  const canAdd = selectedAttributes.Size && selectedAttributes.Color;

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedAttributes,
      attributes: {
        Size: sizes,
        Color: colors,
      },
    });
  };

  if (!product) {
    return <div>Product not found.</div>;
  }

  const handlePrev = () => {
    setImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <Container>
      <Layout>
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
            <MainImage src={gallery[imageIndex]} alt={product.name} />
            {gallery.length > 1 && (
              <>
                <LeftArrow onClick={handlePrev}>‹</LeftArrow>
                <RightArrow onClick={handleNext}>›</RightArrow>
              </>
            )}
          </MainImageWrapper>
        </LeftColumn>

        <Info>
          <Title>{product.name}</Title>

          <div data-testid="product-attribute-size">
            <Label>SIZE:</Label>
            <Options>
              {sizes.map((size) => {
                const isSelected = selectedAttributes.Size === size;
                const kebab = size.toLowerCase();
                return (
                  <OptionButton
                    key={size}
                    selected={isSelected}
                    data-testid={
                      isSelected
                        ? `product-attribute-size-${kebab}-selected`
                        : `product-attribute-size-${kebab}`
                    }
                    onClick={() =>
                      setSelectedAttributes((prev) => ({
                        ...prev,
                        Size: size,
                      }))
                    }
                  >
                    {size}
                  </OptionButton>
                );
              })}
            </Options>
          </div>

          <div data-testid="product-attribute-color">
            <Label>COLOR:</Label>
            <Options>
              {colors.map((color) => {
                const isSelected = selectedAttributes.Color === color;
                const kebab = color.replace("#", "").toLowerCase();
                return (
                  <ColorBox
                    key={color}
                    color={color}
                    selected={isSelected}
                    data-testid={
                      isSelected
                        ? `product-attribute-color-${kebab}-selected`
                        : `product-attribute-color-${kebab}`
                    }
                    onClick={() =>
                      setSelectedAttributes((prev) => ({
                        ...prev,
                        Color: color,
                      }))
                    }
                  />
                );
              })}
            </Options>
          </div>

          <Label>PRICE:</Label>
          <Price>${product.price.toFixed(2)}</Price>

          <Button
            data-testid="add-to-cart"
            onClick={handleAddToCart}
            disabled={!canAdd}
          >
            ADD TO CART
          </Button>

          <Description data-testid="product-description">
            {product.description}
          </Description>
        </Info>
      </Layout>
    </Container>
  );
};

export default ProductPage;
