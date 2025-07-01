import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<CategoryPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />

        {/* подоцна ќе додадеме ProductPage и CartOverlay */}
      </Routes>
    </div>
  );
};

export default App;
