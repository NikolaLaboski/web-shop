import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/category/women" />} />

        <Route path="/category" element={<Navigate to="/category/women" />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* подоцна ќе додадеме ProductPage и CartOverlay */}
      </Routes>
    </div>
  );
};

export default App;
