package com.talez.shop.model;

/**
 * 카테고리 모델 클래스
 */
public class Category {
    private Long id;
    private String name;
    private String imageUrl;
    private Integer productCount;
    private String description;
    private Integer displayOrder;
    private Boolean isActive;

    // 생성자
    public Category() {
    }

    public Category(Long id, String name, String imageUrl, Integer productCount) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.productCount = productCount;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getProductCount() {
        return productCount;
    }

    public void setProductCount(Integer productCount) {
        this.productCount = productCount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}