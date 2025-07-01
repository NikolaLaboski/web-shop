import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import styled from "styled-components";
import { useCart } from "../context/CartContext";
import CartOverlay from "./CartOverlay";

// Styled components
const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Logo = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
`;

const Nav = styled.nav`
  display: flex;
  gap: 24px;
`;

const NavItem = styled(NavLink)`
  font-size: 1rem;
  text-decoration: none;
  color: #4a4a4a;
  position: relative;

  &.active {
    color: #007bff;
    font-weight: 600;
  }

  &.active::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #007bff;
  }
`;

const CartButton = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
`;

const CartCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e60023;
  color: white;
  font-size: 10px;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Header = () => {
  const location = useLocation();
  const [showCart, setShowCart] = useState(false);
  const categories = ["Apparel", "Footwear", "Electronics", "Accessories"];
  const { cartItems } = useCart();
  const cartCount = cartItems.length;

  return (
    <>
      <HeaderWrapper>
        <Logo>My eCommerce App</Logo>

        <Nav>
          {categories.map((category) => {
            const path = `/category/${category.toLowerCase()}`;
            const isActive = location.pathname === path;

            return (
              <NavItem
                to={path}
                key={category}
                className={isActive ? "active" : ""}
                data-testid={
                  isActive ? "active-category-link" : "category-link"
                }
              >
                {category}
              </NavItem>
            );
          })}
        </Nav>

        <CartButton data-testid="cart-btn" onClick={() => setShowCart(!showCart)}>
          <FaShoppingCart size={22} />
          {cartCount > 0 && <CartCount>{cartCount}</CartCount>}
        </CartButton>
      </HeaderWrapper>

      {showCart && <CartOverlay />}
    </>
  );
};

export default Header;
