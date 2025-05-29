package com.petedu.repository;

import com.petedu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByCi(String ci);
    
    Optional<User> findBySocialProviderAndSocialId(String socialProvider, String socialId);
    
    @Query("SELECT u FROM User u WHERE u.role = 'TRAINER'")
    List<User> findAllTrainers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'TRAINER'")
    long countTrainers();
    
    @Query("SELECT u FROM User u WHERE u.isVerified = true")
    List<User> findVerifiedUsers();
    
    @Query("SELECT u FROM User u WHERE u.instituteId = :instituteId")
    List<User> findByInstituteId(Long instituteId);
}