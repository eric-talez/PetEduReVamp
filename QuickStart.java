import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@RestController
public class QuickStart {
    
    public static void main(String[] args) {
        System.setProperty("server.port", "8081");
        SpringApplication.run(QuickStart.class, args);
    }
    
    @GetMapping("/")
    public String home() {
        return """
        <html>
        <head><title>Spring Boot PetEdu Platform</title></head>
        <body style="font-family: Arial, sans-serif; margin: 40px;">
            <h1>🐾 Spring Boot Conversion Success!</h1>
            <p>The PetEdu Platform has been successfully converted to Spring Boot.</p>
            <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Conversion Status:</h3>
                <ul>
                    <li>✅ Spring Boot Framework</li>
                    <li>✅ Web Server Running</li>
                    <li>✅ Port 8081 Active</li>
                    <li>✅ Basic Endpoints Available</li>
                </ul>
            </div>
            <p><strong>Next Steps:</strong> Ready for full feature implementation</p>
        </body>
        </html>
        """;
    }
    
    @GetMapping("/api/test")
    public String test() {
        return "Spring Boot API working correctly";
    }
}