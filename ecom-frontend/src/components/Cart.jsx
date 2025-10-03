// src/components/Cart.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";
import api from "../axios";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, user } = useContext(AppContext);

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // modal state
  const [showCheckout, setShowCheckout] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      try {
        // verify items still exist in backend
        const { data: products } = await api.get("/products");
        const ids = new Set(products.map((p) => p.id));
        const kept = cart.filter((it) => ids.has(it.id));

        const withImages = await Promise.all(
          kept.map(async (it) => {
            try {
              const res = await api.get(`/product/${it.id}/image`, {
                responseType: "blob",
              });
              return { ...it, imageUrl: URL.createObjectURL(res.data) };
            } catch {
              return { ...it, imageUrl: "" };
            }
          })
        );
        setCartItems(withImages);
      } catch {
        // if product list fails, just show current cart
        setCartItems(
          await Promise.all(
            cart.map(async (it) => {
              try {
                const res = await api.get(`/product/${it.id}/image`, {
                  responseType: "blob",
                });
                return { ...it, imageUrl: URL.createObjectURL(res.data) };
              } catch {
                return { ...it, imageUrl: "" };
              }
            })
          )
        );
      }
    };

    if (cart.length) fetchImagesAndUpdateCart();
    else setCartItems([]);
  }, [cart]);

  useEffect(() => {
    setTotalPrice(
      cartItems.reduce((sum, it) => sum + Number(it.price) * Number(it.quantity || 1), 0)
    );
  }, [cartItems]);

  const openCheckout = () => {
    if (!cartItems.length) return;
    if (!user) {
      alert("Please log in to continue to checkout.");
      navigate("/login");
      return;
    }
    setShowCheckout(true);
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      // If you later add a backend endpoint, post here.
      // await api.post("/orders", { items: cartItems });
      await new Promise((r) => setTimeout(r, 600)); // small UX delay
      clearCart();
      setShowCheckout(false);
      alert("Order placed successfully! 🎉");
    } catch (e) {
      alert("Something went wrong placing your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const formattedTotal = useMemo(
    () => new Intl.NumberFormat("en-IN").format(totalPrice),
    [totalPrice]
  );

  return (
    <main className="page" style={{ paddingTop: "6rem", paddingBottom: "2rem" }}>
      <div className="container">
        <div className="cart-card p-4 rounded-3 border" style={{ background: "var(--card-bg)" }}>
          <h5 className="mb-3">Shopping Bag</h5>
          <hr className="mt-0" />

          {cartItems.length === 0 ? (
            <div className="py-5 text-center text-muted">
              <h5>Your cart is empty</h5>
            </div>
          ) : (
            <>
              {cartItems.map((it) => (
                <div
                  key={it.id}
                  className="d-flex align-items-center py-3 border-bottom"
                  style={{ gap: 12 }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 8,
                      overflow: "hidden",
                      background: "#f2f2f2",
                    }}
                  >
                    {it.imageUrl ? (
                      <img
                        src={it.imageUrl}
                        alt={it.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : null}
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{it.name}</div>
                    <div className="text-muted small">{it.brand}</div>
                  </div>
                  <div className="me-3">x{it.quantity || 1}</div>
                  <div className="fw-semibold me-3">
                    ₹{Number(it.price) * Number(it.quantity || 1)}
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFromCart(it.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="d-flex justify-content-between align-items-center pt-3">
                <div className="text-muted">Total</div>
                <h5 className="mb-0">₹{formattedTotal}</h5>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-outline-secondary" onClick={clearCart}>
                  Clear cart
                </button>
                <button
                  className="btn btn-primary"
                  onClick={openCheckout}
                  disabled={!cartItems.length}
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      <div
        className={`modal fade ${showCheckout ? "show" : ""}`}
        style={{ display: showCheckout ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-modal={showCheckout ? "true" : "false"}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm checkout</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCheckout(false)}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <ul className="list-unstyled mb-3">
                {cartItems.map((it) => (
                  <li key={it.id} className="d-flex justify-content-between mb-2">
                    <span className="text-truncate" style={{ maxWidth: 260 }}>
                      {it.name} × {it.quantity || 1}
                    </span>
                    <span>₹{Number(it.price) * Number(it.quantity || 1)}</span>
                  </li>
                ))}
              </ul>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong>₹{formattedTotal}</strong>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={() => setShowCheckout(false)}>
                Keep shopping
              </button>
              <button className="btn btn-primary" onClick={placeOrder} disabled={placing}>
                {placing ? "Placing…" : "Place order"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for manual modal control */}
      {showCheckout && <div className="modal-backdrop fade show" onClick={() => setShowCheckout(false)} />}
    </main>
  );
};

export default Cart;
