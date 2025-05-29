package com.petedu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class PetEduApplication {

    public static void main(String[] args) {
        System.setProperty("server.port", "8081");
        SpringApplication.run(PetEduApplication.class, args);
    }

    @GetMapping("/")
    public String home() {
        return """
        <html>
        <head>
            <title>PetEdu Platform - Spring Boot</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
                .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .header { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                .status { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .endpoints { background: #f8f9fa; padding: 15px; border-radius: 5px; }
                a { color: #3498db; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="header">🐾 PetEdu Platform</h1>
                <p>Spring Boot 애플리케이션이 성공적으로 실행되었습니다!</p>
                
                <div class="status">
                    <h3>변환 상태:</h3>
                    <ul>
                        <li>✅ Spring Boot 2.7.18 프레임워크</li>
                        <li>✅ 내장 Tomcat 웹 서버</li>
                        <li>✅ 포트 8081에서 실행</li>
                        <li>✅ REST API 엔드포인트</li>
                        <li>✅ Thymeleaf 템플릿 엔진</li>
                    </ul>
                </div>
                
                <div class="endpoints">
                    <h3>사용 가능한 엔드포인트:</h3>
                    <ul>
                        <li><a href="/api/health">Health Check</a></li>
                        <li><a href="/api/status">시스템 상태</a></li>
                        <li><a href="/api/version">버전 정보</a></li>
                    </ul>
                </div>
                
                <p><strong>서버:</strong> Spring Boot on port 8081</p>
                <p><strong>환경:</strong> Development</p>
            </div>
        </body>
        </html>
        """;
    }

    @GetMapping("/api/health")
    public String health() {
        return "{ \"status\": \"UP\", \"service\": \"PetEdu Platform\", \"timestamp\": \"" + 
               java.time.Instant.now().toString() + "\" }";
    }

    @GetMapping("/api/status")
    public String status() {
        return "Spring Boot PetEdu Platform이 정상적으로 실행 중입니다.";
    }

    @GetMapping("/api/version")
    public String version() {
        return "{ \"application\": \"PetEdu Platform\", \"version\": \"1.0.0\", \"framework\": \"Spring Boot 2.7.18\" }";
    }
}