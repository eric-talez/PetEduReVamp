package com.petedu.controller;

import com.petedu.service.UserService;
import com.petedu.service.PetService;
import com.petedu.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private PetService petService;
    
    @Autowired
    private CourseService courseService;

    @GetMapping("/")
    public String home(Model model) {
        // 통계 데이터 조회
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
        model.addAttribute("courses", courseService.getAllActiveCourses());
        model.addAttribute("pageTitle", "강좌 - PetEdu Platform");
        return "courses";
    }

    @GetMapping("/pets")
    public String pets(Model model) {
        model.addAttribute("pets", petService.getAllPets());
        model.addAttribute("pageTitle", "반려동물 관리 - PetEdu Platform");
        return "pets";
    }

    @GetMapping("/trainers")
    public String trainers(Model model) {
        model.addAttribute("trainers", userService.getAllTrainers());
        model.addAttribute("pageTitle", "훈련사 - PetEdu Platform");
        return "trainers";
    }

    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("pageTitle", "로그인 - PetEdu Platform");
        return "auth/login";
    }

    @GetMapping("/register")
    public String register(Model model) {
        model.addAttribute("pageTitle", "회원가입 - PetEdu Platform");
        return "auth/register";
    }

    @GetMapping("/admin")
    public String admin(Model model) {
        model.addAttribute("pageTitle", "관리자 - PetEdu Platform");
        return "admin/index";
    }
}