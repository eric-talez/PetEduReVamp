package com.petedu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
public class MinimalSpringBootApp {
    public static void main(String[] args) {
        SpringApplication.run(MinimalSpringBootApp.class, args);
    }
}

@RestController
class SimpleController {
    
    @GetMapping("/")
    public String home() {
        return "PetEdu Platform - Spring Boot Backend is Running";
    }
    
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