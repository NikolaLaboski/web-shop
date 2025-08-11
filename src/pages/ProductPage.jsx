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
// ... останатите styled компоненти како што ти се во кодот ...

/**
 * normalizeGallery
 */
function normalizeGallery(g) {
  if (Array.isArray(g)) return g;
  if (typeof g === "string") {
    try {
      const parsed = JSON.parse(g);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    const parts = g
      .split(/[\s,]+/)
      .map(s => s.trim())
      .filter(u => /^https?:\/\//i.test(u));
    if (parts.length) return parts;
  }
  return [];
}

/**
 * parseDescriptionSafe
 */
function parseDescriptionSafe(html = "") {
  if (!html || typeof html !== "string") return null;
  const normalized = html.replace(/<br\s*\/?>/gi, "\n");
  const temp = document.createElement("div");
  temp.innerHTML = normalized;
  const nodes = [];
  temp.childNodes.forEach((node, idx) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) nodes.push(<p key={`t-${idx}`}>{text}</p>);
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      if (tag === "p") {
        nodes.push(<p key={`p-${idx}`}>{inlineChildren(node)}</p>);
      } else if (tag === "ul") {
        nodes.push(
          <ul key={`ul-${idx}`}>{Array.from(node.children).map((li, i) => <li key={i}>{inlineChildren(li)}</li>)}</ul>
        );
      } else if (tag === "ol") {
        nodes.push(
          <ol key={`ol-${idx}`}>{Array.from(node.children).map((li, i) => <li key={i}>{inlineChildren(li)}</li>)}</ol>
        );
      } else {
        nodes.push(<p key={`f-${idx}`}>{node.textContent}</p>);
      }
    }
  });
  return <>{nodes}</>;
}

function inlineChildren(el) {
  const parts = [];
  el.childNodes.forEach((n, i) => {
    if (n.nodeType === Node.TEXT_NODE) {
      parts.push(n.textContent);
    } else if (n.nodeType === Node.ELEMENT_NODE) {
      const t = n.tagName.toLowerCase();
      if (t === "strong" || t === "b") {
        parts.push(<strong key={i}>{inlineChildren(n)}</strong>);
      } else if (t === "em" || t === "i") {
        parts.push(<em key={i}>{inlineChildren(n)}</em>);
      } else if (t === "br") {
        parts.push(<br key={i} />);
      } else {
        parts.push(n.textContent);
      }
    }
  });
  return parts;
}

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart, setShowCart } = useCart();
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
  const price = product.prices?.[0]?.amount ?? 0;
  const attrs = product.attributes || [];
  const sizeSet = attrs.find(a => a.name?.toLowerCase() === "size");
  const capacitySet = attrs.find(a => a.name?.toLowerCase() === "capacity");
  const colorSet = attrs.find(a => a.name?.toLowerCase() === "color");
  const isTech = product.category?.toLowerCase() === "tech";
  const requiredKeys = [];
  if (isTech) {
    if (capacitySet) requiredKeys.push("Capacity");
    if (colorSet) requiredKeys.push("Color");
  } else {
    if (sizeSet) requiredKeys.push("Size");
  }
  const canAdd =
    requiredKeys.length === 0 ||
    requiredKeys.every((k) => !!selectedAttributes[k]);

  const handleAddToCart = () => {
    addToCart(
      { ...product, image: gallery[0], prices: product.prices },
      selectedAttributes
    );
    if (typeof setShowCart === "function") setShowCart(true);
  };
  const handlePrev = () =>
    setImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  const handleNext = () =>
    setImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));

  return (
    <Container data-testid={`product-${product.id.toLowerCase()}`}>
      <Layout>
        {/* Gallery */}
        <div data-testid="product-gallery">
          {/* */}
        </div>

        {/* Info */}
        <div>
          <h2>{product.name}</h2>
          
        </div>
      </Layout>
    </Container>
  );
};

export default ProductPage;
