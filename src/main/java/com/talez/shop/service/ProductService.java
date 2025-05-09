package com.talez.shop.service;

import com.talez.shop.model.Product;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 상품 서비스 클래스
 * 실제 구현에서는 데이터베이스에서 상품 정보를 가져오겠지만,
 * 현재는 임시 데이터로 구현됩니다.
 */
@Service
public class ProductService {

    /**
     * 모든 상품 목록을 가져옵니다.
     *
     * @return 상품 목록
     */
    public List<Product> getAllProducts() {
        return createSampleProducts();
    }

    /**
     * ID로 상품을 조회합니다.
     *
     * @param id 상품 ID
     * @return 상품 정보
     */
    public Product getProductById(Long id) {
        return createSampleProducts().stream()
                .filter(product -> product.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    /**
     * 베스트셀러 상품 목록을 가져옵니다.
     *
     * @param limit 최대 항목 수
     * @return 베스트셀러 상품 목록
     */
    public List<Product> getBestProducts(int limit) {
        List<Product> products = createSampleProducts();
        
        // 베스트셀러 표시가 된 상품만 필터링
        List<Product> bestProducts = products.stream()
                .filter(product -> Boolean.TRUE.equals(product.getIsBestSeller()))
                .limit(limit)
                .collect(Collectors.toList());
        
        // 결과가 없으면 리뷰가 많은 순으로 정렬
        if (bestProducts.isEmpty()) {
            bestProducts = products.stream()
                    .sorted((p1, p2) -> p2.getReviewCount().compareTo(p1.getReviewCount()))
                    .limit(limit)
                    .collect(Collectors.toList());
        }
        
        return bestProducts;
    }

    /**
     * 신상품 목록을 가져옵니다.
     *
     * @param limit 최대 항목 수
     * @return 신상품 목록
     */
    public List<Product> getNewProducts(int limit) {
        List<Product> products = createSampleProducts();
        
        // 신상품 표시가 된 상품만 필터링
        List<Product> newProducts = products.stream()
                .filter(product -> Boolean.TRUE.equals(product.getIsNew()))
                .limit(limit)
                .collect(Collectors.toList());
        
        // 결과가 없으면 임의의 항목 반환
        if (newProducts.isEmpty()) {
            newProducts = products.stream()
                    .limit(limit)
                    .collect(Collectors.toList());
        }
        
        return newProducts;
    }

    /**
     * 교육 연계 상품 목록을 가져옵니다.
     *
     * @param limit 최대 항목 수
     * @return 교육 연계 상품 목록
     */
    public List<Product> getEduProducts(int limit) {
        List<Product> products = createSampleProducts();
        
        // 교육 연계 표시가 된 상품만 필터링
        List<Product> eduProducts = products.stream()
                .filter(product -> Boolean.TRUE.equals(product.getIsEduProduct()))
                .limit(limit)
                .collect(Collectors.toList());
        
        // 결과가 없으면 임의의 항목 반환
        if (eduProducts.isEmpty()) {
            eduProducts = products.stream()
                    .limit(limit)
                    .collect(Collectors.toList());
        }
        
        return eduProducts;
    }

    /**
     * 카테고리별 상품 목록을 가져옵니다.
     *
     * @param categoryName 카테고리 이름
     * @return 해당 카테고리의 상품 목록
     */
    public List<Product> getProductsByCategory(String categoryName) {
        return createSampleProducts().stream()
                .filter(product -> product.getCategory().equals(categoryName))
                .collect(Collectors.toList());
    }

    /**
     * 브랜드별 상품 목록을 가져옵니다.
     *
     * @param brandName 브랜드 이름
     * @return 해당 브랜드의 상품 목록
     */
    public List<Product> getProductsByBrand(String brandName) {
        return createSampleProducts().stream()
                .filter(product -> product.getBrand().equals(brandName))
                .collect(Collectors.toList());
    }

    /**
     * 상품 검색 기능을 제공합니다.
     *
     * @param query 검색어
     * @return 검색 결과 상품 목록
     */
    public List<Product> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        String lowerQuery = query.toLowerCase();
        
        return createSampleProducts().stream()
                .filter(product -> 
                    product.getName().toLowerCase().contains(lowerQuery) ||
                    product.getDescription().toLowerCase().contains(lowerQuery) ||
                    product.getBrand().toLowerCase().contains(lowerQuery) ||
                    product.getCategory().toLowerCase().contains(lowerQuery)
                )
                .collect(Collectors.toList());
    }

    /**
     * 샘플 상품 데이터를 생성합니다.
     * 실제 구현에서는 이 부분이 데이터베이스 조회로 대체됩니다.
     *
     * @return 샘플 상품 목록
     */
    private List<Product> createSampleProducts() {
        List<Product> products = new ArrayList<>();
        
        // 강아지 훈련 장난감
        Product product1 = new Product(
            1L, 
            "프리미엄 기능성 강아지 훈련 장난감", 
            "반려견의 지능 개발과 훈련에 효과적인 프리미엄 기능성 장난감입니다. 내구성이 뛰어나며 세척이 용이합니다.",
            "테일즈", 
            new BigDecimal("29800"), 
            new BigDecimal("38000"), 
            22, 
            "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3", 
            "강아지 용품",
            5.0f, 
            128
        );
        product1.setIsBestSeller(true);
        product1.setIsEduProduct(true);
        
        // 강아지 간식
        Product product2 = new Product(
            2L, 
            "프리미엄 유기농 반려동물 수제 간식 세트", 
            "100% 유기농 원료로 만든 건강한 수제 간식 세트입니다. 첨가물이 없어 알러지가 있는 반려동물에게도 안전합니다.",
            "내추럴코어", 
            new BigDecimal("25500"), 
            new BigDecimal("30000"), 
            15, 
            "https://images.unsplash.com/photo-1589924920114-de15293c7529?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3", 
            "강아지 간식",
            4.8f, 
            96
        );
        product2.setIsBestSeller(true);
        
        // 고양이 자동 급식기
        Product product3 = new Product(
            3L, 
            "스마트 자동 급식기 - 앱 연동 가능", 
            "앱으로 원격 제어가 가능한 스마트 자동 급식기입니다. 정해진 시간에 정확한 양의 사료를 공급하며, 급식 알림과 사료 잔량 체크 기능을 제공합니다.",
            "펫테크", 
            new BigDecimal("75000"), 
            new BigDecimal("75000"), 
            0, 
            "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3", 
            "고양이 용품",
            4.7f, 
            75
        );
        product3.setIsNew(true);
        
        // 반려동물 캐리어
        Product product4 = new Product(
            4L, 
            "프리미엄 반려동물 캐리어 - 기내 반입 가능", 
            "안전하고 편안한 프리미엄 반려동물 캐리어입니다. 대부분의 항공사 기내 반입 규격에 맞게 설계되었으며, 통풍이 잘되고 내구성이 뛰어납니다.",
            "애니홈", 
            new BigDecimal("48300"), 
            new BigDecimal("69000"), 
            30, 
            "https://images.unsplash.com/photo-1560743641-3914f2c45636?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3", 
            "강아지 용품",
            4.9f, 
            154
        );
        product4.setIsBestSeller(true);
        
        // 고양이 스크래처
        Product product5 = new Product(
            5L, 
            "다기능 고양이 스크래처 타워", 
            "여러 층으로 구성된 고양이 스크래처 타워입니다. 스크래칭, 놀이, 휴식이 모두 가능한 다기능 제품으로 내구성이 뛰어납니다.",
            "캣랜드", 
            new BigDecimal("89000"), 
            new BigDecimal("119000"), 
            25, 
            "https://images.unsplash.com/photo-1587558790701-9fd90d3030fc?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3", 
            "고양이 용품",
            4.6f, 
            87
        );
        product5.setIsNew(true);
        
        // 강아지 훈련 클리커
        Product product6 = new Product(
            6L, 
            "프로페셔널 강아지 훈련 클리커 세트", 
            "전문 훈련사들이 사용하는 고품질 클리커 훈련 세트입니다. 효과적인 칭찬 훈련을 위한 필수 아이템으로 상세한 사용 설명서가 포함되어 있습니다.",
            "트레이닝프로", 
            new BigDecimal("18500"), 
            new BigDecimal("18500"), 
            0, 
            "https://images.unsplash.com/photo-1601758124331-9433eec2a052?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3", 
            "강아지 용품",
            4.5f, 
            62
        );
        product6.setIsEduProduct(true);
        
        // 반려동물 샴푸
        Product product7 = new Product(
            7L, 
            "저자극성 유기농 반려동물 샴푸", 
            "민감한 피부를 가진 반려동물을 위한 저자극성 유기농 샴푸입니다. 100% 천연 성분으로 만들어져 피부 자극이 적고 부드러운 모질을 유지해줍니다.",
            "네이처펫", 
            new BigDecimal("22000"), 
            new BigDecimal("22000"), 
            0, 
            "https://images.unsplash.com/photo-1598609054956-c297fe4e7ba0?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3", 
            "강아지 용품",
            4.3f, 
            45
        );
        product7.setIsNew(true);
        
        // 강아지 하네스
        Product product8 = new Product(
            8L, 
            "안전 반사 기능 강화 하네스", 
            "야간 산책 시 안전을 위한 반사 기능이 강화된 하네스입니다. 고급 패브릭과 스테인리스 고리를 사용하여 내구성과 편안함을 모두 갖췄습니다.",
            "세이프티퍼스트", 
            new BigDecimal("35000"), 
            new BigDecimal("42000"), 
            17, 
            "https://images.unsplash.com/photo-1600369671271-dce6b7bbc5ed?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3", 
            "강아지 용품",
            4.4f, 
            78
        );
        product8.setIsBestSeller(true);
        
        products.add(product1);
        products.add(product2);
        products.add(product3);
        products.add(product4);
        products.add(product5);
        products.add(product6);
        products.add(product7);
        products.add(product8);
        
        return products;
    }
}