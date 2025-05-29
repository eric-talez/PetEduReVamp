package com.petedu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.beans.factory.annotation.Autowired;
import com.petedu.service.UserService;
import com.petedu.service.PetService;
import com.petedu.service.CourseService;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication(
    scanBasePackages = "com.petedu",
    exclude = {
        org.springframework.boot.autoconfigure.r2dbc.R2dbcAutoConfiguration.class,
        org.springframework.boot.autoconfigure.r2dbc.R2dbcDataAutoConfiguration.class
    }
)
@EnableJpaRepositories("com.petedu.repository")
@EntityScan("com.petedu.entity")
public class SimpleSpringBootApp {
    public static void main(String[] args) {
        System.setProperty("spring.profiles.active", "default");
        SpringApplication.run(SimpleSpringBootApp.class, args);
    }
}

@Controller
class WebController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PetService petService;
    
    @Autowired
    private CourseService courseService;
    
    @GetMapping("/")
    public String home(Model model) {
        long userCount = userService.getTotalUserCount();
        long petCount = petService.getTotalPetCount();
        long courseCount = courseService.getTotalCourseCount();
        long trainerCount = userService.getTrainerCount();
        
        model.addAttribute("userCount", userCount);
        model.addAttribute("petCount", petCount);
        model.addAttribute("courseCount", courseCount);
        model.addAttribute("trainerCount", trainerCount);
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