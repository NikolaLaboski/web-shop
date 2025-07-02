// src/components/Header.jsx
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import styled from "styled-components";
import { useCart } from "../context/CartContext";
import CartOverlay from "./CartOverlay";
import Logo from "../assets/logo.svg";

// Styled Components
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

const NavItem = styled(NavLink)`
  font-size: 1rem;
  text-decoration: none;
  color: #4a4a4a;
  position: relative;

  &.active {
    color: #5ECE7B;
    font-weight: 600;
  }

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

const LogoImage = styled.img`
  height: 32px;
`;

const CartButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
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
  const categories = ["Women", "Men", "Kids"];
  const { cartItems } = useCart();
  const cartCount = cartItems.length;

  return (
    <>
      <HeaderWrapper>
        <Left>
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
        </Left>

        <Center>
          <LogoImage src={Logo} alt="Logo" />
        </Center>

        <Right>
          <CartButton
            data-testid="cart-btn"
            onClick={() => setShowCart((prev) => !prev)}
          >
            <FaShoppingCart size={22} />
            {cartCount > 0 && <CartCount>{cartCount}</CartCount>}
          </CartButton>
        </Right>
      </HeaderWrapper>

      {showCart && <CartOverlay onClose={() => setShowCart(false)} />}
    </>
  );
};

export default Header;
