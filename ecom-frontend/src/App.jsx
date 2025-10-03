import "./App.css";
import React, { useState } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import UpdateProduct from "./components/UpdateProduct";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// 🔐 Auth pages + route guard
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function AppContent({ cart, setCart, selectedCategory, setSelectedCategory }) {
  const location = useLocation();

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // 🚫 Hide footer on auth pages
  const hideFooterOn = ["/login", "/register"];
  const hideFooter = hideFooterOn.includes(location.pathname);

  return (
    <div className="app-wrapper">
      <Navbar onSelectCategory={handleCategorySelect} />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={<Home addToCart={addToCart} selectedCategory={selectedCategory} />}
          />

          <Route
            path="/add_product"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/update/:id"
            element={
              <ProtectedRoute>
                <UpdateProduct />
              </ProtectedRoute>
            }
          />

          {/* Public routes */}
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      {/* ✅ Only render footer if not login/register */}
      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent
          cart={cart}
          setCart={setCart}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
