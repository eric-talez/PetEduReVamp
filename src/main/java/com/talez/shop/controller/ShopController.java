package com.talez.shop.controller;

import com.talez.shop.model.Category;
import com.talez.shop.model.Product;
import com.talez.shop.service.CategoryService;
import com.talez.shop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * 쇼핑몰 페이지 컨트롤러
 */
@Controller
@RequestMapping("/shop")
public class ShopController {

    private final CategoryService categoryService;
    private final ProductService productService;

    @Autowired
    public ShopController(CategoryService categoryService, ProductService productService) {
        this.categoryService = categoryService;
        this.productService = productService;
    }

    /**
     * 쇼핑몰 메인 페이지
     */
    @GetMapping({"", "/"})
    public String shopHome(Model model) {
        // 카테고리 목록
        List<Category> categories = categoryService.getAllCategories();
        model.addAttribute("categories", categories);
        
        // 베스트 상품
        List<Product> bestProducts = productService.getBestProducts(4);
        model.addAttribute("bestProducts", bestProducts);
        
        // 신상품
        List<Product> newProducts = productService.getNewProducts(4);
        model.addAttribute("newProducts", newProducts);
        
        // 교육 연계 상품
        List<Product> eduProducts = productService.getEduProducts(4);
        model.addAttribute("eduProducts", eduProducts);
        
        return "shop/index";
    }

    /**
     * 상품 카테고리 페이지
     */
    @GetMapping("/category/{categoryName}")
    public String categoryPage(@PathVariable String categoryName, Model model) {
        // 카테고리 정보
        Category category = categoryService.getCategoryByName(categoryName);
        model.addAttribute("category", category);
        
        // 해당 카테고리의 상품 목록
        List<Product> products = productService.getProductsByCategory(categoryName);
        model.addAttribute("products", products);
        
        // 카테고리 목록 (사이드바용)
        List<Category> categories = categoryService.getAllCategories();
        model.addAttribute("categories", categories);
        
        return "shop/category";
    }

    /**
     * 상품 상세 페이지
     */
    @GetMapping("/product/{id}")
    public String productDetail(@PathVariable Long id, Model model) {
        // 상품 정보
        Product product = productService.getProductById(id);
        model.addAttribute("product", product);
        
        // 관련 상품 (같은 카테고리의 다른 상품)
        if (product != null) {
            List<Product> relatedProducts = productService.getProductsByCategory(product.getCategory());
            relatedProducts.removeIf(p -> p.getId().equals(product.getId())); // 현재 상품 제외
            
            // 최대 4개만 표시
            if (relatedProducts.size() > 4) {
                relatedProducts = relatedProducts.subList(0, 4);
            }
            
            model.addAttribute("relatedProducts", relatedProducts);
        }
        
        return "shop/product-detail";
    }

    /**
     * 베스트 상품 페이지
     */
    @GetMapping("/best")
    public String bestProducts(Model model) {
        List<Product> bestProducts = productService.getBestProducts(20);
        model.addAttribute("products", bestProducts);
        model.addAttribute("pageTitle", "베스트 상품");
        
        // 카테고리 목록 (사이드바용)
        List<Category> categories = categoryService.getAllCategories();
        model.addAttribute("categories", categories);
        
        return "shop/product-list";
    }

    /**
     * 신상품 페이지
     */
    @GetMapping("/new")
    public String newProducts(Model model) {
        List<Product> newProducts = productService.getNewProducts(20);
        model.addAttribute("products", newProducts);
        model.addAttribute("pageTitle", "신상품");
        
        // 카테고리 목록 (사이드바용)
        List<Category> categories = categoryService.getAllCategories();
        model.addAttribute("categories", categories);
        
        return "shop/product-list";
    }

    /**
     * 교육 연계 상품 페이지
     */
    @GetMapping("/edu-products")
    public String eduProducts(Model model) {
        List<Product> eduProducts = productService.getEduProducts(20);
        model.addAttribute("products", eduProducts);
        model.addAttribute("pageTitle", "교육 연계 상품");
        
        // 카테고리 목록 (사이드바용)
        List<Category> categories = categoryService.getAllCategories();
        model.addAttribute("categories", categories);
        
        return "shop/product-list";
    }

    /**
     * 상품 검색 페이지
     */
    @GetMapping("/search")
    public String searchProducts(@RequestParam(required = false) String query, Model model) {
        List<Product> searchResults = productService.searchProducts(query);
        model.addAttribute("products", searchResults);
        model.addAttribute("pageTitle", "'" + query + "' 검색 결과");
        model.addAttribute("query", query);
        
        // 카테고리 목록 (사이드바용)
        List<Category> categories = categoryService.getAllCategories();
        model.addAttribute("categories", categories);
        
        return "shop/product-list";
    }
}