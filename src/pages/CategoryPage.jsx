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

/* ---------- Layout / Figma-like spacing ---------- */
const Page = styled.div`
  /* Figma canvas е 1440; содржината ~1240 со по ~100px странични маргини */
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 100px 80px; /* без топ-падинг, простор долу */

  @media (max-width: 1280px) {
    max-width: 100%;
    padding: 0 24px 64px;
  }
`;

const CategoryTitle = styled.h2`
  /* Figma: Raleway 42 / 160% / weight 400 / #1D1F22 */
  font-weight: 400;
  font-size: 42px;
  line-height: 160%;
  color: #1d1f22;

  /* Поголем „воздух“ од хедерот и чист лев раб */
  margin: 160px 0 40px 0;

  @media (max-width: 900px) {
    font-size: 32px;
    margin: 100px 0 28px 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 386px); /* точната Figma ширина на картите */
  justify-content: space-between;          /* рамномерно по ширина */
  row-gap: 56px;                           /* вертикално растојание од Figma */

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(300px, 1fr));
    column-gap: 32px;
    row-gap: 48px;
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    row-gap: 40px;
  }
`;

/* ---------- Card ---------- */
const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 444px;                  /* Figma висина */
  background: #fff;

  /* IMPORTANT: Figma card нема border и нема radius */
  border: none;
  border-radius: 0;

  /* Figma shadow: 0 0 35 rgba(168,172,176,0.19) постојано (не само на hover) */
  box-shadow: 0 0 35px rgba(168, 172, 176, 0.19);

  /* Нема подигнување/бордер промена на hover во Figma.
     Оставаме само reveal на quick-add копчето. */
  transition: opacity .2s ease;

  a { text-decoration: none; color: inherit; display: block; }
`;

const ProductImageWrap = styled.div`
  position: relative;
  /* во Figma сликата е edge-to-edge во рамката, без внатрешен padding */
  padding: 0;
`;

const ProductImageFrame = styled.div`
  width: 100%;
  height: 330px;      /* визуелната висина на image area */
  border-radius: 0;   /* нема radius во Figma */
  overflow: hidden;
  background: #f3f3f3;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: ${({ $dimmed }) => ($dimmed ? "grayscale(100%) opacity(.6)" : "none")};
`;

const OutOfStockBadge = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;                          /* точно во центар */
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.92);
  color: rgba(141, 143, 154, 1);     /* Figma сива */
  font-weight: 400;
  font-size: 24px;                   /* поголем текст */
  letter-spacing: 0;
  padding: 6px 10px;
  border-radius: 0;                  /* без заоблување */
  text-transform: uppercase;
  pointer-events: none;
`;

const AddToCartButton = styled.button`
  position: absolute;
  bottom: 16px;  /* поблиску до аголот */
  right: 16px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 0;
  background: #5ece7b;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 14px rgba(94, 206, 123, .35);
  z-index: 3;

  svg { color: #fff; font-size: 18px; }

  opacity: 0;
  visibility: hidden;
  transform: translateY(6px);
  transition: opacity .25s ease, transform .25s ease, visibility 0s;

  ${CardWrapper}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const ProductContent = styled.div`
  /* чист текст простор под сликата, без внатрешни рамки */
  padding: 12px 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProductName = styled.h3`
  margin: 0;
  font-weight: 300;
  font-size: 18px;
  color: #1d1f22;
`;

const ProductPrice = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  color: #1d1f22;
`;

/* ---------- Utils ---------- */
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

/* ---------- Page ---------- */
const CategoryPage = () => {
  const { categoryName } = useParams();
  const location = useLocation();
  const { addToCart, setShowCart } = useCart();
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  const urlSlug = (location.pathname.split("/")[1] || "").toLowerCase();
  const cat = (categoryName || urlSlug || "all").toLowerCase();
  const capitalizedCategory = cat.charAt(0).toUpperCase() + cat.slice(1);

  if (loading) return <Page><CategoryTitle>Loading…</CategoryTitle></Page>;
  if (error) return <Page><CategoryTitle>Error: {error.message}</CategoryTitle></Page>;

  const products = cat === "all"
    ? data.products
    : data.products.filter(p => (p.category || "").toLowerCase() === cat);

  return (
    <Page>
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
                    data-quick-add
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
                  <ProductImageFrame>
                    <ProductImage
                      src={
                        product.gallery?.[0] ||
                        `https://via.placeholder.com/386x330.png?text=${encodeURIComponent(product.name)}`
                      }
                      alt={product.name}
                      $dimmed={!inStock}
                    />
                  </ProductImageFrame>

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
    </Page>
  );
};

export default CategoryPage;
