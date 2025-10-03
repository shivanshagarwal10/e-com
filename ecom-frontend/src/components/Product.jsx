// src/components/Product.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import api from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/product/${id}`);
        setProduct(res.data);
        try {
          const imgRes = await api.get(`/product/${id}/image`, { responseType: "blob" });
          setImageUrl(URL.createObjectURL(imgRes.data));
        } catch { /* ignore */ }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await api.delete(`/product/${id}`);
      removeFromCart(Number(id));
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  if (!product) {
    return <h2 className="text-center" style={{ padding: "10rem" }}>Loading...</h2>;
  }

  return (
    <div className="container product-page">
      <div className="row g-4 align-items-start">
        {/* image */}
        <div className="col-12 col-lg-6">
          <div className="product-hero">
            {imageUrl ? (
              <img src={imageUrl} alt={product.imageName} className="product-hero-img" />
            ) : (
              <div className="product-hero placeholder d-flex align-items-center justify-content-center">
                <span className="text-muted">No image</span>
              </div>
            )}
          </div>
        </div>

        {/* details */}
        <div className="col-12 col-lg-6">
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted">{product.category}</span>
            <div className="mb-2">
              <small className="text-muted">
                Listed: <i>{new Date(product.releaseDate).toLocaleDateString()}</i>
              </small>
            </div>
          </div>

          <h1 className="mt-1 mb-1 text-capitalize">{product.name}</h1>
          <i className="d-block mb-3">{product.brand}</i>

          <p className="fw-semibold mb-1">PRODUCT DESCRIPTION :</p>
          <p className="mb-3">{product.description}</p>

          <div className="d-flex align-items-center gap-3 mb-3">
            <span className="fs-3 fw-bold">₹{product.price}</span>
            <button
              className="btn btn-primary"
              disabled={!product.productAvailable}
              onClick={() => addToCart(product)}
            >
              {product.productAvailable ? "Add to cart" : "Out of Stock"}
            </button>
          </div>

          <h6 className="mb-4">
            Stock Available:{" "}
            <i className="text-success fw-bold">{product.stockQuantity}</i>
          </h6>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={() => navigate(`/product/update/${id}`)}
            >
              Update
            </button>
            <button className="btn btn-danger" type="button" onClick={deleteProduct}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
