package com.petedu.domain.user.service;

import com.petedu.domain.user.entity.User;
import com.petedu.domain.user.entity.UserRole;
import com.petedu.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User createUser(String username, String email, String name, String password) {
        // 중복 체크
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User(username, passwordEncoder.encode(password), email, name);
        return userRepository.save(user);
    }
    
    public User createSocialUser(String username, String email, String name, String provider, String socialId) {
        User user = new User(username, email, name, provider, socialId);
        return userRepository.save(user);
    }
    
    @Transactional(readOnly = true)
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<User> findBySocialId(String provider, String socialId) {
        return userRepository.findByProviderAndSocialId(provider, socialId);
    }
    
    @Transactional(readOnly = true)
    public List<User> findByRole(UserRole role) {
        return userRepository.findByRole(role);
    }
    
    public User updateUser(Long userId, String name, String email, String bio, String location) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setName(name);
        user.setEmail(email);
        user.setBio(bio);
        user.setLocation(location);
        
        return userRepository.save(user);
    }
    
    public User updateUserRole(Long userId, UserRole role, Long trainerId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setRole(role);
        if (trainerId != null) {
            user.setInstituteId(trainerId);
        }
        
        return userRepository.save(user);
    }
    
    public User verifyUser(Long userId, String ci, String verificationName, 
                          String verificationBirth, String verificationPhone) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setCi(ci);
        user.setVerified(true);
        user.setVerificationName(verificationName);
        user.setVerificationBirth(verificationBirth);
        user.setVerificationPhone(verificationPhone);
        
        return userRepository.save(user);
    }
}