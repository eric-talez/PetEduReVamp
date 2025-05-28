package com.petedu.domain.user.repository;

import com.petedu.domain.user.entity.User;
import com.petedu.domain.user.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByCi(String ci);
    
    Optional<User> findByProviderAndSocialId(String provider, String socialId);
    
    List<User> findByRole(UserRole role);
    
    List<User> findByInstituteId(Long instituteId);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByCi(String ci);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.instituteId = :instituteId")
    List<User> findByRoleAndInstituteId(@Param("role") UserRole role, @Param("instituteId") Long instituteId);
    
    @Query("SELECT u FROM User u WHERE u.verified = true AND u.role = :role")
    List<User> findVerifiedUsersByRole(@Param("role") UserRole role);
}