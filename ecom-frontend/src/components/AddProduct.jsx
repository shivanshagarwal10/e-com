import React, { useState } from "react";
import api from "../axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (image) formData.append("imageFile", image);
    formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));

    try {
      await api.post("/product", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product");
    }
  };

  return (
    <main className="page--form">
      <div className="form-wrap">
        <h3 className="title">Add Product</h3>

        <form className="form-grid" onSubmit={submitHandler}>
          <div>
            <label className="form-label"><h6>Name</h6></label>
            <input className="form-control" name="name" value={product.name} onChange={handleInputChange} />
          </div>

          <div>
            <label className="form-label"><h6>Brand</h6></label>
            <input className="form-control" name="brand" value={product.brand} onChange={handleInputChange} />
          </div>

          <div className="full">
            <label className="form-label"><h6>Description</h6></label>
            <input className="form-control" name="description" value={product.description} onChange={handleInputChange} />
          </div>

          <div>
            <label className="form-label"><h6>Price</h6></label>
            <input type="number" className="form-control" name="price" value={product.price} onChange={handleInputChange} />
          </div>

          <div>
            <label className="form-label"><h6>Category</h6></label>
            <select className="form-select" name="category" value={product.category} onChange={handleInputChange}>
              <option value="">Select category</option>
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
            <input type="number" className="form-control" name="stockQuantity" value={product.stockQuantity} onChange={handleInputChange} />
          </div>

          <div>
            <label className="form-label"><h6>Release Date</h6></label>
            <input type="date" className="form-control" name="releaseDate" value={product.releaseDate} onChange={handleInputChange} />
          </div>

          <div>
            <label className="form-label"><h6>Image</h6></label>
            <input type="file" className="form-control" onChange={handleImageChange} />
          </div>

          <div className="check-row full">
            <input className="form-check-input" type="checkbox" id="available" name="productAvailable"
                   checked={product.productAvailable} onChange={handleInputChange} />
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

export default AddProduct;
