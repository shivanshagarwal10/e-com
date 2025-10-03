// backend/src/main/java/com/ecommerce/ecom_proj/model/Product.java
package com.ecommerce.ecom_proj.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String description;
    private String brand;

    private BigDecimal price;
    private String category;

    // Match <input type="date" /> -> "yyyy-MM-dd"
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate releaseDate;

    // Map frontend JSON keys to entity fields
    @JsonProperty("productAvailable")
    private boolean available;

    @JsonProperty("stockQuantity")
    private int quantity;

    private String imageName;
    private String imageType;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] imageData;
}
