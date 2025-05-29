package com.petedu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class SimpleApplication {

    public static void main(String[] args) {
        System.setProperty("server.port", "8081");
        SpringApplication.run(SimpleApplication.class, args);
    }

    @GetMapping("/")
    public String home() {
        return "Spring Boot PetEdu Platform이 성공적으로 실행되었습니다!";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}