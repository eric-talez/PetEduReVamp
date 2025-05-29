package com.petedu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
public class SimpleSpringBootApp {
    public static void main(String[] args) {
        SpringApplication.run(SimpleSpringBootApp.class, args);
    }
}

@Controller
class WebController {
    
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("userCount", 1250);
        model.addAttribute("petCount", 3400);
        model.addAttribute("courseCount", 150);
        model.addAttribute("trainerCount", 85);
        model.addAttribute("pageTitle", "PetEdu Platform - AI 반려동물 교육 플랫폼");
        return "index";
    }
    
    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("pageTitle", "대시보드 - PetEdu Platform");
        return "dashboard";
    }
    
    @GetMapping("/courses")
    public String courses(Model model) {
        model.addAttribute("pageTitle", "강좌 - PetEdu Platform");
        return "courses";
    }
}

@RestController
class ApiController {
    
    @GetMapping("/api/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "PetEdu Spring Boot");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    @GetMapping("/api/stats")
    public Map<String, Object> stats() {
        Map<String, Object> response = new HashMap<>();
        response.put("users", 1250);
        response.put("pets", 3400);
        response.put("courses", 150);
        response.put("trainers", 85);
        return response;
    }
}