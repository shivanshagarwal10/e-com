// src/Context/Context.jsx
import api from "../axios";
import { useState, useEffect, createContext } from "react";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  user: null,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  refreshData: () => {},
  login: async () => {},
  registerUser: async () => {},
  logout: () => {},
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [flash, setFlash] = useState(null); 

  const refreshData = async () => {
    try {
      const res = await api.get("/products");
      setData(res.data);
    } catch (err) {
      setIsError(err.message);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // CART
  const addToCart = (product) => {
    const idx = cart.findIndex((item) => item.id === product.id);
    let next;
  
    if (idx !== -1) {
      next = cart.map((it, i) =>
        i === idx ? { ...it, quantity: it.quantity + 1 } : it
      );
      window.alert(`${product.name} quantity updated in cart.`);
    } else {
      next = [...cart, { ...product, quantity: 1 }];
      window.alert(`${product.name} added to cart successfully.`);
    }
  
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const removeFromCart = (productId) => {
    const next = cart.filter((it) => it.id !== productId);
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // AUTH
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const u = res.data; // { token, ...optional fields }
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    return u;
  };

  const registerUser = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    const u = res.data;
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    return u;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    alert("Logged out Successfully...!");
  };

  return (
    <AppContext.Provider
      value={{
        data,
        isError,
        cart,
        user,
        addToCart,
        removeFromCart,
        clearCart,
        refreshData,
        login,
        registerUser,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
