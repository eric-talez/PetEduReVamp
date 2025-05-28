package com.petedu.web.controller;

import com.petedu.security.UserPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.HashMap;
import java.util.Map;

@Controller
public class HomeController {
    
    @GetMapping("/")
    public String home(Model model, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        // 페이지 메타데이터 설정
        model.addAttribute("pageTitle", "홈");
        model.addAttribute("pageDescription", "AI 기반 반려동물 훈련 플랫폼");
        model.addAttribute("currentPage", "home");
        
        // 사용자 정보 설정
        if (userPrincipal != null) {
            model.addAttribute("isAuthenticated", true);
            model.addAttribute("user", createUserModel(userPrincipal));
        } else {
            model.addAttribute("isAuthenticated", false);
        }
        
        // 통계 정보
        Map<String, String> stats = new HashMap<>();
        stats.put("totalUsers", "1,000+");
        stats.put("totalTrainers", "50+");
        stats.put("totalCourses", "200+");
        stats.put("totalInstitutes", "20+");
        model.addAttribute("stats", stats);
        
        return "pages/home";
    }
    
    @GetMapping("/about")
    public String about(Model model, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        model.addAttribute("pageTitle", "서비스 소개");
        model.addAttribute("currentPage", "about");
        
        if (userPrincipal != null) {
            model.addAttribute("isAuthenticated", true);
            model.addAttribute("user", createUserModel(userPrincipal));
        } else {
            model.addAttribute("isAuthenticated", false);
        }
        
        return "pages/about";
    }
    
    @GetMapping("/contact")
    public String contact(Model model, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        model.addAttribute("pageTitle", "문의하기");
        model.addAttribute("currentPage", "contact");
        
        if (userPrincipal != null) {
            model.addAttribute("isAuthenticated", true);
            model.addAttribute("user", createUserModel(userPrincipal));
        } else {
            model.addAttribute("isAuthenticated", false);
        }
        
        return "pages/contact";
    }
    
    private Map<String, Object> createUserModel(UserPrincipal userPrincipal) {
        Map<String, Object> userModel = new HashMap<>();
        userModel.put("id", userPrincipal.getId());
        userModel.put("name", userPrincipal.getUsername());
        userModel.put("email", userPrincipal.getEmail());
        userModel.put("role", userPrincipal.getRole());
        userModel.put("avatar", "/images/default-avatar.png");
        return userModel;
    }
}