package com.petedu.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;

@RestController
@RequestMapping("/actuator")
@CrossOrigin(origins = "http://localhost:5000")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "PetEdu Platform");
        response.put("version", "1.0.0");
        response.put("timestamp", new Date());
        
        Map<String, Object> components = new HashMap<>();
        components.put("application", "UP");
        components.put("diskSpace", "UP");
        components.put("ping", "UP");
        
        response.put("components", components);
        
        return ResponseEntity.ok(response);
    }
}