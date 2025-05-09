package com.talez.shop.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 상품 모델 클래스
 */
public class Product {
    private Long id;
    private String name;
    private String description;
    private String brand;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer discountRate;
    private String mainImage;
    private String[] additionalImages;
    private String category;
    private String subCategory;
    private Boolean isBestSeller;
    private Boolean isNew;
    private Boolean isEduProduct;
    private Integer stock;
    private Float rating;
    private Integer reviewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 생성자
    public Product() {
    }

    public Product(Long id, String name, String description, String brand, BigDecimal price, 
                   BigDecimal originalPrice, Integer discountRate, String mainImage, 
                   String category, Float rating, Integer reviewCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.brand = brand;
        this.price = price;
        this.originalPrice = originalPrice;
        this.discountRate = discountRate;
        this.mainImage = mainImage;
        this.category = category;
        this.rating = rating;
        this.reviewCount = reviewCount;
    }

    // Getter와 Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }

    public Integer getDiscountRate() {
        return discountRate;
    }

    public void setDiscountRate(Integer discountRate) {
        this.discountRate = discountRate;
    }

    public String getMainImage() {
        return mainImage;
    }

    public void setMainImage(String mainImage) {
        this.mainImage = mainImage;
    }

    public String[] getAdditionalImages() {
        return additionalImages;
    }

    public void setAdditionalImages(String[] additionalImages) {
        this.additionalImages = additionalImages;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSubCategory() {
        return subCategory;
    }

    public void setSubCategory(String subCategory) {
        this.subCategory = subCategory;
    }

    public Boolean getIsBestSeller() {
        return isBestSeller;
    }

    public void setIsBestSeller(Boolean isBestSeller) {
        this.isBestSeller = isBestSeller;
    }

    public Boolean getIsNew() {
        return isNew;
    }

    public void setIsNew(Boolean isNew) {
        this.isNew = isNew;
    }

    public Boolean getIsEduProduct() {
        return isEduProduct;
    }

    public void setIsEduProduct(Boolean isEduProduct) {
        this.isEduProduct = isEduProduct;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Float getRating() {
        return rating;
    }

    public void setRating(Float rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}