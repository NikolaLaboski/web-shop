// ProductPage.jsx
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useCart } from "../context/CartContext";
import { useQuery, gql } from "@apollo/client";

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
        items { id value displayValue }
      }
    }
  }
`;


const THUMB_W = 84;
const GAP = 16;
/* ---------- Styled (Figma-like) ---------- */

const Container = styled.div`
  padding: 40px 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;

  @media (min-width: 900px) {
    grid-template-columns: 1.1fr 1fr;
    gap: 48px;
    align-items: start;
  }
`;

const GalleryWrap = styled.div`
  position: relative;
  @media (min-width: 900px) {
    padding-left: ${THUMB_W + GAP}px;
    min-height: 520px;
  }
`;

const MainImage = styled.img`
  width: 100%;
  max-height: 520px;
  object-fit: contain;
  background: #f7f7f7;
  border-radius: 12px;
  display: block;
`;



const Thumbs = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;

  @media (min-width: 900px) {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: ${THUMB_W}px;
    margin-top: 0;
    flex-direction: column;
    align-items: stretch;
    overflow-y: auto;
    padding-right: 2px;
    z-index: 2; /* below Arrow (3) */
  }
`;


const Thumb = styled.button`
  width: 70px;
  height: 70px;
  padding: 0;
  cursor: pointer;
  border: 2px solid ${(p) => (p.$active ? "#5ece7b" : "transparent")};
  border-radius: 8px;
  background: #fff;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
    display: block;
  }

  @media (min-width: 900px) {
    width: 72px;
    height: 72px;
  }
`;

// ↓ replace your Arrow styled with this
const Arrow = styled.button`
  position: absolute;
  top: 12px;
  left: 12px;
  ${p => p.$right && "left: auto; right: 12px;"}
  padding: 8px 10px;
  border: 0;
  border-radius: 8px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  cursor: pointer;
  z-index: 3; /* always above thumbs/main image */

  /* On desktop, move the LEFT arrow to the right of the thumbnail rail */
  @media (min-width: 900px) {
    ${p => !p.$right && `left: calc(${THUMB_W + GAP}px + 12px);`}
  }
`;


const Info = styled.div``;

const Title = styled.h2`
  font-size: 24px;
  line-height: 1.25;
  margin: 0 0 12px;
`;

const Group = styled.div`
  margin: 18px 0;
`;

const GroupLabel = styled.div`
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 10px;
`;

const Options = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Opt = styled.button`
  min-width: 44px;
  padding: 10px 14px;
  border: 1px solid #1d1f22;
  border-radius: 6px;
  background: ${(p) => (p.$active ? "#1d1f22" : "#fff")};
  color: ${(p) => (p.$active ? "#fff" : "#1d1f22")};
  cursor: pointer;
`;

const Swatch = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid ${(p) => (p.$active ? "#5ece7b" : "#dedede")};
  background: ${(p) => p.$color || "#000"};
`;

const PriceRow = styled.div`
  margin: 22px 0 24px;
  font-weight: 700;
  font-size: 20px;
`;

const AddBtn = styled.button`
  margin-top: 12px;
  padding: 14px 18px;
  border: 0;
  border-radius: 10px;
  font-weight: 700;
  color: #fff;
  background: ${(p) => (p.disabled ? "#99e0b3" : "#5ece7b")};
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
`;
/* ---------- End Styled ---------- */

/* ---------- Helpers ---------- */
function kebabCase(s = "") {
  return String(s).trim().toLowerCase().replace(/\s+/g, "-");
}
function normalizeGallery(g) {
  if (Array.isArray(g)) return g;
  if (typeof g === "string") {
    try {
      const p = JSON.parse(g);
      if (Array.isArray(p)) return p;
    } catch {}
    const parts = g
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter((u) => /^https?:\/\//i.test(u));
    if (parts.length) return parts;
  }
  return [];
}
function parseDescriptionSafe(html = "") {
  if (!html || typeof html !== "string") return null;
  const normalized = html.replace(/<br\s*\/?>/gi, "\n");
  const temp = document.createElement("div");
  temp.innerHTML = normalized;
  const nodes = [];
  temp.childNodes.forEach((node, idx) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent.trim();
      if (t) nodes.push(<p key={`t-${idx}`}>{t}</p>);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      if (tag === "p") {
        nodes.push(<p key={`p-${idx}`}>{node.textContent}</p>);
      } else if (tag === "ul") {
        nodes.push(
          <ul key={`ul-${idx}`}>
            {Array.from(node.children).map((li, i) => (
              <li key={i}>{li.textContent}</li>
            ))}
          </ul>
        );
      } else if (tag === "ol") {
        nodes.push(
          <ol key={`ol-${idx}`}>
            {Array.from(node.children).map((li, i) => (
              <li key={i}>{li.textContent}</li>
            ))}
          </ol>
        );
      } else {
        nodes.push(<p key={`f-${idx}`}>{node.textContent}</p>);
      }
    }
  });
  return <>{nodes}</>;
}
/* ---------- End Helpers ---------- */

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart, setShowCart } = useCart();

  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // hooks first
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const product = data?.product;
  const attrs = product?.attributes ?? [];
  const gallery = useMemo(
    () => normalizeGallery(product?.gallery),
    [product?.gallery]
  );
  const price = useMemo(
    () => Number(product?.prices?.[0]?.amount ?? 0),
    [product?.prices]
  );

  const sizeSet = useMemo(
    () => attrs.find((a) => a.name?.toLowerCase() === "size"),
    [attrs]
  );
  const capacitySet = useMemo(
    () => attrs.find((a) => a.name?.toLowerCase() === "capacity"),
    [attrs]
  );
  const colorSet = useMemo(
    () => attrs.find((a) => a.name?.toLowerCase() === "color"),
    [attrs]
  );
  const isTech = (product?.category ?? "").toLowerCase() === "tech";

  const requiredKeys = useMemo(() => {
    const req = [];
    if (isTech) {
      if (capacitySet) req.push("Capacity");
      if (colorSet) req.push("Color");
    } else {
      if (sizeSet) req.push("Size");
    }
    return req;
  }, [isTech, sizeSet, capacitySet, colorSet]);

  const canAdd =
    requiredKeys.length === 0 ||
    requiredKeys.every((k) => !!selectedAttributes[k]);

  const setAttr = (attrName, valueObj) =>
    setSelectedAttributes((prev) => ({ ...prev, [attrName]: valueObj }));

  const handlePrev = () =>
    setImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  const handleNext = () =>
    setImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));

  const add = () => {
    const img = gallery[imageIndex] || "";
    if (product) {
      addToCart({ ...product, image: img, prices: product.prices }, selectedAttributes);
      if (typeof setShowCart === "function") setShowCart(true);
    }
  };

  // early returns after hooks
  if (loading) return <Container><p>Loading…</p></Container>;
  if (error) return <Container><p>Error: {error.message}</p></Container>;
  if (!product) return <Container><p>Product not found.</p></Container>;

  return (
    <Container data-testid={`product-${kebabCase(product.id)}`}>
      <Layout>
        <GalleryWrap data-testid="product-gallery">
          {gallery.length > 0 && (
            <>
              <MainImage src={gallery[imageIndex]} alt={product.name} />
              {gallery.length > 1 && (
                <>
                  <Arrow onClick={handlePrev} aria-label="Prev">
                    ‹
                  </Arrow>
                  <Arrow onClick={handleNext} $right aria-label="Next">
                    ›
                  </Arrow>
                </>
              )}
              <Thumbs>
                {gallery.map((src, i) => (
                  <Thumb
                    key={i}
                    onClick={() => setImageIndex(i)}
                    $active={i === imageIndex}
                  >
                    <img src={src} alt={`${product.name} ${i + 1}`} />
                  </Thumb>
                ))}
              </Thumbs>
            </>
          )}
        </GalleryWrap>

        <Info>
          <Title>{product.name}</Title>

          {sizeSet && (
            <Group data-testid={`product-attribute-${kebabCase(sizeSet.name)}`}>
              <GroupLabel>{sizeSet.name}</GroupLabel>
              <Options>
                {sizeSet.items.map((it) => (
                  <Opt
                    key={it.id}
                    onClick={() => setAttr(sizeSet.name, it)}
                    $active={selectedAttributes[sizeSet.name]?.id === it.id}
                  >
                    {it.displayValue || it.value}
                  </Opt>
                ))}
              </Options>
            </Group>
          )}

          {capacitySet && (
            <Group data-testid={`product-attribute-${kebabCase(capacitySet.name)}`}>
              <GroupLabel>{capacitySet.name}</GroupLabel>
              <Options>
                {capacitySet.items.map((it) => (
                  <Opt
                    key={it.id}
                    onClick={() => setAttr(capacitySet.name, it)}
                    $active={selectedAttributes[capacitySet.name]?.id === it.id}
                  >
                    {it.displayValue || it.value}
                  </Opt>
                ))}
              </Options>
            </Group>
          )}

          {colorSet && (
            <Group data-testid={`product-attribute-${kebabCase(colorSet.name)}`}>
              <GroupLabel>{colorSet.name}</GroupLabel>
              <Options>
                {colorSet.items.map((it) => (
                  <Swatch
                    key={it.id}
                    onClick={() => setAttr(colorSet.name, it)}
                    $active={selectedAttributes[colorSet.name]?.id === it.id}
                    $color={it.value}
                    title={it.displayValue || it.value}
                  />
                ))}
              </Options>
            </Group>
          )}

          <PriceRow>Price: ${price.toFixed(2)}</PriceRow>

          <AddBtn
            data-testid="add-to-cart"
            disabled={!canAdd}
            onClick={add}
            aria-disabled={!canAdd}
          >
            {canAdd ? "Add to Cart" : "Select required options"}
          </AddBtn>

          <Group data-testid="product-description" style={{ marginTop: 24 }}>
            {parseDescriptionSafe(product.description)}
          </Group>
        </Info>
      </Layout>
    </Container>
  );
}
