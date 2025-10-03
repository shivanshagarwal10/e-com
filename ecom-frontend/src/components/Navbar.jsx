// src/components/Navbar.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";
import api from "../axios";
import logo from "../assets/logo.png"; 

const Navbar = ({ onSelectCategory }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AppContext);

  // ---- theme ----
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ---- search ----
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  // debounce search
  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await api.get(
          `/products/search?keyword=${encodeURIComponent(q.trim())}`
        );
        setResults(res.data || []);
        setOpen(true);
      } catch {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const categories = useMemo(
    () => ["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"],
    []
  );

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top bg-body-tertiary shadow-sm">
        <div className="container-fluid">
          {/* ---- BRAND (logo + text) ---- */}
          <Link
            className="navbar-brand d-flex align-items-center gap-2 fw-semibold"
            to="/"
            onClick={() => onSelectCategory?.("")}
          >
            <img
              src={logo}
              alt="eCom"
              width={50}
              height={50}
              className="brand-logo"
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {/* left: nav / categories */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/"
                  onClick={() => onSelectCategory?.("")}
                >
                  Home
                </Link>
              </li>

              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  Categories
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => onSelectCategory("")}
                    >
                      All
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  {categories.map((c) => (
                    <li key={c}>
                      <button
                        className="dropdown-item"
                        onClick={() => onSelectCategory(c)}
                      >
                        {c}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/add_product">Add Product</Link>
              </li>
            </ul>

            {/* center: search */}
            <div className="position-relative me-3" style={{ minWidth: 280 }}>
              <input
                className="form-control"
                placeholder="Search products…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => q && setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
              />
              {open && results.length > 0 && (
                <div className="search-dropdown">
                  {results.slice(0, 8).map((p) => (
                    <button
                      key={p.id}
                      className="search-item"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setOpen(false);
                        setQ("");
                        navigate(`/product/${p.id}`);
                      }}
                    >
                      <div className="text-truncate fw-semibold">{p.name}</div>
                      <div className="small text-muted">
                        {p.brand} · {p.category}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* right: theme + cart + auth */}
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                title="Toggle theme"
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>

              <Link to="/cart" className="btn btn-outline-primary">
                <i className="bi bi-cart me-1" /> Cart
              </Link>

              {!user ? (
                <>
                  <Link to="/login" className="btn btn-outline-primary">Login</Link>
                  <Link to="/register" className="btn btn-primary">Register</Link>
                </>
              ) : (
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    {user.name || user.email}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li className="px-3 py-2 text-muted small">{user.email}</li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={logout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
