package com.petedu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @GetMapping("/")
    public String home() {
        return """
        <html>
        <head><title>PetEdu Platform - Spring Boot</title></head>
        <body style="font-family: Arial, sans-serif; margin: 40px;">
            <h1>🐾 PetEdu Platform</h1>
            <p>Spring Boot application is running successfully!</p>
            <div style="margin: 20px 0;">
                <h3>Available Endpoints:</h3>
                <ul>
                    <li><a href="/api/status">API Status</a></li>
                    <li><a href="/api/health">Health Check</a></li>
                </ul>
            </div>
            <p><strong>Server:</strong> Spring Boot on port 8081</p>
        </body>
        </html>
        """;
    }

    @GetMapping("/api/status")
    public String apiStatus() {
        return "Spring Boot API is running correctly";
    }

    @GetMapping("/api/health")
    public String health() {
        return "Application is healthy";
    }
}