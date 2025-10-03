import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data?.length) {
      (async () => {
        const updated = await Promise.all(
          data.map(async (p) => {
            try {
              const res = await api.get(`/product/${p.id}/image`, { responseType: "blob" });
              const imageUrl = URL.createObjectURL(res.data);
              return { ...p, imageUrl };
            } catch {
              return { ...p, imageUrl: "" };
            }
          })
        );
        setProducts(updated);
      })();
    } else {
      setProducts([]);
    }
  }, [data]);

  // NEW: case-insensitive category filtering
  const filtered = useMemo(() => {
    if (!selectedCategory) return products;
    const cat = String(selectedCategory).toLowerCase();
    return products.filter((p) => String(p.category || "").toLowerCase() === cat);
  }, [products, selectedCategory]);

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
        <img src={unplugged} alt="Error" style={{ width: 100, height: 100 }} />
      </h2>
    );
  }

  return (
    <div
      className="grid"
      style={{
        marginTop: "64px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 20,
        padding: 20,
      }}
    >
      {filtered.length === 0 ? (
        <h2 className="text-center d-flex justify-content-center align-items-center">
          No Products Available
        </h2>
      ) : (
        filtered.map((p) => (
          <div
            key={p.id}
            className="card mb-3"
            style={{
              width: "100%",
              boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: p.productAvailable ? "var(--card-bg)" : "#ccc",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Link to={`/product/${p.id}`} className="text-decoration-none text-reset">
              <div className="card-img-wrap">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="card-img" />
                ) : (
                  <div className="card-img placeholder d-flex align-items-center justify-content-center">
                    <span className="text-muted">No image</span>
                  </div>
                )}
              </div>

              <div className="card-body d-flex flex-column">
                <div>
                  <h5 className="card-title mb-2 text-truncate">{p.name}</h5>
                  <i className="card-brand small text-muted">~ {p.brand}</i>
                </div>

                <hr className="my-2" />
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="mb-0 fw-semibold">
                    <i className="bi bi-currency-rupee" />
                    {p.price}
                  </h5>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(p);
                    }}
                    disabled={!p.productAvailable}
                  >
                    {p.productAvailable ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
