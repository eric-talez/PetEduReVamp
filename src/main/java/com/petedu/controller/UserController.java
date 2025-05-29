package com.petedu.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.petedu.entity.User;
import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5000")
public class UserController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "PetEdu User Service");
        response.put("timestamp", new Date());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody Map<String, Object> userData) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Java 서비스에서 사용자 데이터를 받았습니다");
        response.put("receivedData", userData);
        response.put("processedAt", new Date());
        response.put("service", "Spring Boot");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> users = new ArrayList<>();
        
        Map<String, Object> user1 = new HashMap<>();
        user1.put("id", 1);
        user1.put("name", "Spring Boot User 1");
        user1.put("email", "user1@springboot.com");
        user1.put("source", "Java Service");
        
        Map<String, Object> user2 = new HashMap<>();
        user2.put("id", 2);
        user2.put("name", "Spring Boot User 2");
        user2.put("email", "user2@springboot.com");
        user2.put("source", "Java Service");
        
        users.add(user1);
        users.add(user2);
        
        return ResponseEntity.ok(users);
    }
}