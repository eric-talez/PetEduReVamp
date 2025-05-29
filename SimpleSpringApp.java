import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,
    HibernateJpaAutoConfiguration.class,
    SecurityAutoConfiguration.class
})
@RestController
public class SimpleSpringApp {
    
    public static void main(String[] args) {
        System.setProperty("server.port", "8081");
        SpringApplication.run(SimpleSpringApp.class, args);
    }
    
    @GetMapping("/")
    public String home() {
        return """
        <html>
        <head><title>Spring Boot PetEdu Platform</title></head>
        <body>
            <h1>🐾 Spring Boot PetEdu Platform</h1>
            <p>성공적으로 실행되었습니다!</p>
            <ul>
                <li><a href="/api/test">API 테스트</a></li>
                <li><a href="/status">상태 확인</a></li>
            </ul>
            <p>포트: 8081</p>
        </body>
        </html>
        """;
    }
    
    @GetMapping("/api/test")
    public String apiTest() {
        return "Spring Boot API가 정상 작동합니다!";
    }
    
    @GetMapping("/status")
    public String status() {
        return "Spring Boot 애플리케이션이 정상 실행 중입니다.";
    }
}