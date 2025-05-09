package com.talez.shop.controller;

import com.talez.shop.model.Product;
import com.talez.shop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 장바구니 관련 컨트롤러
 */
@Controller
@RequestMapping("/cart")
public class CartController {

    private final ProductService productService;

    @Autowired
    public CartController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * 장바구니 페이지
     */
    @GetMapping({"", "/"})
    public String cartPage(HttpSession session, Model model) {
        // 장바구니 상품 목록 가져오기
        List<Map<String, Object>> cartItems = getCartItems(session);
        model.addAttribute("cartItems", cartItems);
        
        // 총 금액 계산
        int totalPrice = 0;
        for (Map<String, Object> item : cartItems) {
            totalPrice += ((Integer) item.get("price")) * ((Integer) item.get("quantity"));
        }
        model.addAttribute("totalPrice", totalPrice);
        
        return "shop/cart";
    }

    /**
     * 장바구니에 상품 추가 (AJAX)
     */
    @PostMapping("/add")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> addToCart(
            @RequestParam("productId") Long productId,
            @RequestParam("quantity") int quantity,
            HttpSession session) {
        
        // 세션에서 장바구니 가져오기
        List<Map<String, Object>> cart = getCartFromSession(session);
        
        // 상품 정보 가져오기
        Product product = productService.getProductById(productId);
        if (product == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "상품을 찾을 수 없습니다.");
            return ResponseEntity.badRequest().body(response);
        }
        
        // 이미 장바구니에 있는 상품인지 확인
        boolean productExists = false;
        for (Map<String, Object> item : cart) {
            if (item.get("productId").equals(productId)) {
                // 수량 업데이트
                int currentQuantity = (Integer) item.get("quantity");
                item.put("quantity", currentQuantity + quantity);
                productExists = true;
                break;
            }
        }
        
        // 새 상품이면 장바구니에 추가
        if (!productExists) {
            Map<String, Object> newItem = new HashMap<>();
            newItem.put("productId", productId);
            newItem.put("name", product.getName());
            newItem.put("price", product.getPrice().intValue());
            newItem.put("quantity", quantity);
            newItem.put("image", product.getMainImage());
            cart.add(newItem);
        }
        
        // 세션에 장바구니 저장
        session.setAttribute("cart", cart);
        
        // 장바구니 상품 수 업데이트
        int cartCount = 0;
        for (Map<String, Object> item : cart) {
            cartCount += (Integer) item.get("quantity");
        }
        session.setAttribute("cartCount", cartCount);
        
        // 응답 생성
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "상품이 장바구니에 추가되었습니다.");
        response.put("cartCount", cartCount);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 장바구니에서 상품 제거
     */
    @PostMapping("/remove")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> removeFromCart(
            @RequestParam("productId") Long productId,
            HttpSession session) {
        
        // 세션에서 장바구니 가져오기
        List<Map<String, Object>> cart = getCartFromSession(session);
        
        // 상품 제거
        cart.removeIf(item -> item.get("productId").equals(productId));
        
        // 세션에 장바구니 저장
        session.setAttribute("cart", cart);
        
        // 장바구니 상품 수 업데이트
        int cartCount = 0;
        for (Map<String, Object> item : cart) {
            cartCount += (Integer) item.get("quantity");
        }
        session.setAttribute("cartCount", cartCount);
        
        // 응답 생성
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "상품이 장바구니에서 제거되었습니다.");
        response.put("cartCount", cartCount);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 장바구니 상품 수량 업데이트
     */
    @PostMapping("/update")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateCartItem(
            @RequestParam("productId") Long productId,
            @RequestParam("quantity") int quantity,
            HttpSession session) {
        
        // 세션에서 장바구니 가져오기
        List<Map<String, Object>> cart = getCartFromSession(session);
        
        // 해당 상품 찾기 및 수량 업데이트
        boolean productFound = false;
        for (Map<String, Object> item : cart) {
            if (item.get("productId").equals(productId)) {
                item.put("quantity", quantity);
                productFound = true;
                break;
            }
        }
        
        if (!productFound) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "상품을 찾을 수 없습니다.");
            return ResponseEntity.badRequest().body(response);
        }
        
        // 세션에 장바구니 저장
        session.setAttribute("cart", cart);
        
        // 장바구니 상품 수 업데이트
        int cartCount = 0;
        for (Map<String, Object> item : cart) {
            cartCount += (Integer) item.get("quantity");
        }
        session.setAttribute("cartCount", cartCount);
        
        // 응답 생성
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "상품 수량이 업데이트되었습니다.");
        response.put("cartCount", cartCount);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 장바구니 비우기
     */
    @PostMapping("/clear")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> clearCart(HttpSession session) {
        // 장바구니 비우기
        session.setAttribute("cart", new ArrayList<>());
        session.setAttribute("cartCount", 0);
        
        // 응답 생성
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "장바구니가 비워졌습니다.");
        response.put("cartCount", 0);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 세션에서 장바구니 가져오기
     */
    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> getCartFromSession(HttpSession session) {
        List<Map<String, Object>> cart = (List<Map<String, Object>>) session.getAttribute("cart");
        if (cart == null) {
            cart = new ArrayList<>();
            session.setAttribute("cart", cart);
        }
        return cart;
    }

    /**
     * 장바구니 상품 목록 가져오기 (상품 정보 포함)
     */
    private List<Map<String, Object>> getCartItems(HttpSession session) {
        List<Map<String, Object>> cart = getCartFromSession(session);
        List<Map<String, Object>> cartItems = new ArrayList<>();
        
        for (Map<String, Object> item : cart) {
            Map<String, Object> cartItem = new HashMap<>(item);
            
            // 상품 정보 가져오기
            Long productId = (Long) item.get("productId");
            Product product = productService.getProductById(productId);
            
            if (product != null) {
                cartItem.put("product", product);
            }
            
            cartItems.add(cartItem);
        }
        
        return cartItems;
    }
}