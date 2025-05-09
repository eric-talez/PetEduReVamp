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
        
        categories.add(new Category(1L, "강아지 사료", "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", 45));
        categories.add(new Category(2L, "강아지 간식", "https://images.unsplash.com/photo-1585671962151-940be0defc3d?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", 38));
        categories.add(new Category(3L, "강아지 용품", "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", 67));
        categories.add(new Category(4L, "고양이 사료", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", 32));
        categories.add(new Category(5L, "고양이 간식", "https://images.unsplash.com/photo-1606491048802-8342506d6471?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", 29));
        categories.add(new Category(6L, "고양이 용품", "https://images.unsplash.com/photo-1570458436416-b8fcccfe883f?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", 52));
        
        return categories;
    }
}