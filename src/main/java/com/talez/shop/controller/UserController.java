package com.talez.shop.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpSession;

/**
 * 사용자 관련 컨트롤러
 * 로그인, 회원가입, 마이페이지 등을 처리합니다.
 */
@Controller
@RequestMapping("/user")
public class UserController {

    /**
     * 로그인 페이지
     */
    @GetMapping("/login")
    public String loginPage() {
        return "user/login";
    }

    /**
     * 로그인 처리
     */
    @PostMapping("/login")
    public String login(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            HttpSession session,
            Model model) {
        
        // 실제 구현에서는 데이터베이스에서 사용자 정보를 조회하고 비밀번호를 검증해야 합니다.
        // 현재는 임시로 처리합니다.
        if ("admin".equals(username) && "password".equals(password)) {
            // 로그인 성공 시 세션에 사용자 정보 저장
            session.setAttribute("user", username);
            session.setAttribute("isAuthenticated", true);
            
            // 장바구니 수량 초기화 (실제로는 데이터베이스에서 조회)
            session.setAttribute("cartCount", 0);
            
            return "redirect:/shop";
        } else {
            // 로그인 실패
            model.addAttribute("error", "아이디 또는 비밀번호가 올바르지 않습니다.");
            return "user/login";
        }
    }

    /**
     * 로그아웃 처리
     */
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        // 세션 무효화
        session.invalidate();
        return "redirect:/shop";
    }

    /**
     * 테마 설정 변경
     */
    @PostMapping("/preferences/theme")
    public String updateThemePreference(
            @RequestParam("darkMode") boolean darkMode,
            HttpSession session) {
        
        // 다크 모드 설정을 세션에 저장
        session.setAttribute("darkMode", darkMode);
        
        // 이전 페이지로 리다이렉트 (헤더의 Referer 값 사용)
        return "redirect:/shop";
    }
}