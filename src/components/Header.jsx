// Header.jsx
// Top navigation bar: category links (client-side), centered logo, and cart button.
// Styling via styled-components. Uses CartContext to toggle CartOverlay.

import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useCart } from "../context/CartContext";
import CartIcon from "../assets/cart.svg";
import Logo from "../assets/logo.svg";

// Layout containers for header sections (left nav, center logo, right actions).
const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
`;

const Left = styled.nav`
  display: flex;
  gap: 16px;
  flex: 1;
`;

const Center = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  position: relative;
`;

// Category link with active state underline/brand color.
const NavItem = styled(NavLink)`
  font-size: 1rem;
  text-decoration: none;
  color: #4a4a4a;
  position: relative;

  &.active { color: #5ECE7B; }
  &.active::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #5ECE7B;
  }
`;

const LogoImage = styled.img` height: 32px; `;

// Cart button (icon + optional badge).
const CartButton = styled.button`
  background: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CartCount = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #1d1f22;
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

/**
 * Header
 * Renders category navigation, centered brand logo, and cart toggle button.
 * Behavior:
 *  - Highlights active category link based on current pathname.
 *  - Toggles cart overlay via CartContext.setShowCart.
 * Accessibility:
 *  - Button uses an <img> with alt text; consider adding aria-expanded in future.
 */
const Header = () => {
  const location = useLocation();
  const categories = ["all", "tech", "clothes"]; // source of truth for nav tabs
  const { cartItems, setShowCart } = useCart();
  const cartCount = cartItems.length; // badge shows number of distinct items

  return (
    <HeaderWrapper>
      <Left>
        {categories.map((category) => {
          // Compute active state using pathname equality to preserve NavLink styling.
          const path = `/category/${category.toLowerCase()}`;
          const isActive = location.pathname === path;
          return (
            <NavItem
              to={path}
              key={category}
              className={isActive ? "active" : ""}
              data-testid={isActive ? "active-category-link" : "category-link"}
            >
              {category}
            </NavItem>
          );
        })}
      </Left>

      <Center>
        {/* Brand/logo in the middle */}
        <LogoImage src={Logo} alt="Logo" />
      </Center>

      <Right>
        <CartButton
          data-testid="cart-btn"
          onClick={(e) => {
            // Prevent any parent navigation if placed inside a link.
            e.preventDefault();
            e.stopPropagation();
            // Toggle overlay visibility.
            setShowCart((prev) => !prev);
          }}
        >
          <img src={CartIcon} alt="Cart Icon" width={20} height={20} />
          {/* Show quantity badge only when there are items */}
          {cartCount > 0 && <CartCount>{cartCount}</CartCount>}
        </CartButton>
      </Right>
    </HeaderWrapper>
  );
};

export default Header;
