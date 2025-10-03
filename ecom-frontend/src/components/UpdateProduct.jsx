import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const [image, setImage] = useState();
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
    imageName: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/product/${id}`);
        setUpdateProduct(res.data);

        try {
          const resImg = await api.get(`/product/${id}/image`, { responseType: "blob" });
          const file = new File([resImg.data], res.data.imageName || `product-${id}.bin`, { type: resImg.data.type });
          setImage(file);
        } catch {
          setImage(undefined);
        }
      } catch (e) {
        console.error("Error fetching product:", e);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateProduct((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    if (image) fd.append("imageFile", image);
    fd.append("product", new Blob([JSON.stringify(updateProduct)], { type: "application/json" }));
    try {
      await api.put(`/product/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  return (
    <main className="page--form">
      <div className="form-wrap">
        <h3 className="title">Update Product</h3>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label className="form-label"><h6>Name</h6></label>
            <input className="form-control" name="name" value={updateProduct.name || ""} onChange={handleChange} />
          </div>

          <div>
            <label className="form-label"><h6>Brand</h6></label>
            <input className="form-control" name="brand" value={updateProduct.brand || ""} onChange={handleChange} />
          </div>

          <div className="full">
            <label className="form-label"><h6>Description</h6></label>
            <input className="form-control" name="description" value={updateProduct.description || ""} onChange={handleChange} />
          </div>

          <div>
            <label className="form-label"><h6>Price</h6></label>
            <input type="number" className="form-control" name="price" value={updateProduct.price || ""} onChange={handleChange} />
          </div>

          <div>
            <label className="form-label"><h6>Category</h6></label>
            <select className="form-select" name="category" value={updateProduct.category || ""} onChange={handleChange}>
              <option value="Laptop">Laptop</option>
              <option value="Headphone">Headphone</option>
              <option value="Mobile">Mobile</option>
              <option value="Electronics">Electronics</option>
              <option value="Toys">Toys</option>
              <option value="Fashion">Fashion</option>
            </select>
          </div>

          <div>
            <label className="form-label"><h6>Stock Quantity</h6></label>
            <input type="number" className="form-control" name="stockQuantity" value={updateProduct.stockQuantity || ""} onChange={handleChange} />
          </div>

          <div className="full">
            <label className="form-label"><h6>Image</h6></label>
            <div className="image-preview mb-2">
              {image ? (
                <img src={URL.createObjectURL(image)} alt={updateProduct.imageName || "Product"} />
              ) : null}
            </div>
            <input className="form-control" type="file" onChange={handleImageChange} />
          </div>

          <div className="check-row full">
            <input className="form-check-input" type="checkbox" id="available"
                   name="productAvailable" checked={!!updateProduct.productAvailable}
                   onChange={handleChange} />
            <label className="form-check-label" htmlFor="available">Product Available</label>
          </div>

          <div className="form-actions full">
            <button className="btn btn-primary" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default UpdateProduct;
