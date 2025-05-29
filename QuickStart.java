import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class QuickStart {
    
    public static void main(String[] args) {
        System.setProperty("server.port", "8081");
        SpringApplication.run(QuickStart.class, args);
    }
    
    @GetMapping("/")
    public String home() {
        return "<h1>Spring Boot PetEdu Platform</h1><p>성공적으로 실행되었습니다!</p><a href='/api/test'>API 테스트</a>";
    }
    
    @GetMapping("/api/test")
    public String apiTest() {
        return "Spring Boot API가 정상 작동합니다!";
    }
}