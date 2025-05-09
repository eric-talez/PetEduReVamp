package com.talez.shop.service;

import com.talez.shop.model.Category;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 카테고리 서비스 클래스
 * 실제 구현에서는 데이터베이스에서 카테고리 정보를 가져오겠지만,
 * 현재는 임시 데이터로 구현됩니다.
 */
@Service
public class CategoryService {

    /**
     * 모든 카테고리 목록을 가져옵니다.
     *
     * @return 카테고리 목록
     */
    public List<Category> getAllCategories() {
        return createSampleCategories();
    }

    /**
     * ID로 카테고리를 조회합니다.
     *
     * @param id 카테고리 ID
     * @return 카테고리 정보
     */
    public Category getCategoryById(Long id) {
        return createSampleCategories().stream()
                .filter(category -> category.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    /**
     * 이름으로 카테고리를 조회합니다.
     *
     * @param name 카테고리 이름
     * @return 카테고리 정보
     */
    public Category getCategoryByName(String name) {
        return createSampleCategories().stream()
                .filter(category -> category.getName().equals(name))
                .findFirst()
                .orElse(null);
    }

    /**
     * 샘플 카테고리 데이터를 생성합니다.
     * 실제 구현에서는 이 부분이 데이터베이스 조회로 대체됩니다.
     *
     * @return 샘플 카테고리 목록
     */
    private List<Category> createSampleCategories() {
        List<Category> categories = new ArrayList<>();
        
        // 카테고리 정보 (아이콘용 이미지 URL 사용)
        Category dogFood = new Category(1L, "강아지 사료", "/images/icons/dog-food-icon.svg", 45);
        dogFood.setDescription("다양한 브랜드의 건강한 강아지 사료");
        
        Category dogTreat = new Category(2L, "강아지 간식", "/images/icons/dog-treat-icon.svg", 38);
        dogTreat.setDescription("강아지를 위한 영양 간식과 육포");
        
        Category dogSupplies = new Category(3L, "강아지 용품", "/images/icons/dog-supply-icon.svg", 67);
        dogSupplies.setDescription("강아지 장난감, 목줄, 옷 등 다양한 용품");
        
        Category catFood = new Category(4L, "고양이 사료", "/images/icons/cat-food-icon.svg", 32);
        catFood.setDescription("고양이의 건강을 위한 프리미엄 사료");
        
        Category catTreat = new Category(5L, "고양이 간식", "/images/icons/cat-treat-icon.svg", 29);
        catTreat.setDescription("고양이가 좋아하는 다양한 간식");
        
        Category catSupplies = new Category(6L, "고양이 용품", "/images/icons/cat-supply-icon.svg", 52);
        catSupplies.setDescription("고양이 장난감, 스크래쳐, 캣타워 등");
        
        Category eduSupplies = new Category(7L, "교육용품", "/images/icons/edu-supply-icon.svg", 24);
        eduSupplies.setDescription("반려동물 훈련 및 교육을 위한 용품");
        
        Category birthdayItems = new Category(8L, "생일용품", "/images/icons/birthday-icon.svg", 18);
        birthdayItems.setDescription("반려동물 생일 파티를 위한 다양한 용품");
        
        // 카테고리 리스트에 추가
        categories.add(dogFood);
        categories.add(dogTreat);
        categories.add(dogSupplies);
        categories.add(catFood);
        categories.add(catTreat);
        categories.add(catSupplies);
        categories.add(eduSupplies);
        categories.add(birthdayItems);
        
        return categories;
    }
    
    /**
     * 아이콘 URL이 없는 경우를 위한 기본 아이콘 제공
     * 
     * @param categoryName 카테고리 이름
     * @return 기본 아이콘 URL
     */
    public String getDefaultIconUrl(String categoryName) {
        switch (categoryName.toLowerCase()) {
            case "강아지 사료":
                return "/images/icons/dog-food-icon.svg";
            case "강아지 간식":
                return "/images/icons/dog-treat-icon.svg";
            case "강아지 용품":
                return "/images/icons/dog-supply-icon.svg";
            case "고양이 사료":
                return "/images/icons/cat-food-icon.svg";
            case "고양이 간식":
                return "/images/icons/cat-treat-icon.svg";
            case "고양이 용품":
                return "/images/icons/cat-supply-icon.svg";
            case "교육용품":
                return "/images/icons/edu-supply-icon.svg";
            case "생일용품":
                return "/images/icons/birthday-icon.svg";
            default:
                return "/images/icons/default-icon.svg";
        }
    }
}