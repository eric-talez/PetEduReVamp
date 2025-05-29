package com.petedu.repository;

import com.petedu.entity.Course;
import com.petedu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    List<Course> findByIsActiveTrue();
    
    List<Course> findByCategory(String category);
    
    List<Course> findByInstructor(User instructor);
    
    List<Course> findByInstructorId(Long instructorId);
    
    @Query("SELECT c FROM Course c WHERE c.level = :level AND c.isActive = true")
    List<Course> findByLevelAndActive(String level);
    
    @Query("SELECT c FROM Course c WHERE c.title LIKE %:keyword% OR c.description LIKE %:keyword%")
    List<Course> findByKeyword(String keyword);
    
    @Query("SELECT COUNT(c) FROM Course c WHERE c.isActive = true")
    long countActiveCourses();
}