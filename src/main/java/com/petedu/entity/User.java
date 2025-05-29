package com.petedu.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;
    
    private String avatar;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    private String location;
    private String specialty;
    private Boolean isVerified = false;
    private Long instituteId;
    private String phone;
    private String ci;
    private String verificationName;
    private String verificationBirth;
    private String verificationPhone;
    private LocalDateTime verifiedAt;
    private String socialProvider;
    private String socialId;
    private String stripeCustomerId;
    private String stripeSubscriptionId;
    private String membershipTier;
    private LocalDateTime membershipExpiresAt;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pet> pets;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CourseEnrollment> enrollments;
    
    // Constructors
    public User() {}
    
    public User(String username, String password, String email, String name) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.name = name;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }
    
    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }
    
    public Long getInstituteId() { return instituteId; }
    public void setInstituteId(Long instituteId) { this.instituteId = instituteId; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getCi() { return ci; }
    public void setCi(String ci) { this.ci = ci; }
    
    public String getVerificationName() { return verificationName; }
    public void setVerificationName(String verificationName) { this.verificationName = verificationName; }
    
    public String getVerificationBirth() { return verificationBirth; }
    public void setVerificationBirth(String verificationBirth) { this.verificationBirth = verificationBirth; }
    
    public String getVerificationPhone() { return verificationPhone; }
    public void setVerificationPhone(String verificationPhone) { this.verificationPhone = verificationPhone; }
    
    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }
    
    public String getSocialProvider() { return socialProvider; }
    public void setSocialProvider(String socialProvider) { this.socialProvider = socialProvider; }
    
    public String getSocialId() { return socialId; }
    public void setSocialId(String socialId) { this.socialId = socialId; }
    
    public String getStripeCustomerId() { return stripeCustomerId; }
    public void setStripeCustomerId(String stripeCustomerId) { this.stripeCustomerId = stripeCustomerId; }
    
    public String getStripeSubscriptionId() { return stripeSubscriptionId; }
    public void setStripeSubscriptionId(String stripeSubscriptionId) { this.stripeSubscriptionId = stripeSubscriptionId; }
    
    public String getMembershipTier() { return membershipTier; }
    public void setMembershipTier(String membershipTier) { this.membershipTier = membershipTier; }
    
    public LocalDateTime getMembershipExpiresAt() { return membershipExpiresAt; }
    public void setMembershipExpiresAt(LocalDateTime membershipExpiresAt) { this.membershipExpiresAt = membershipExpiresAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<Pet> getPets() { return pets; }
    public void setPets(List<Pet> pets) { this.pets = pets; }
    
    public List<CourseEnrollment> getEnrollments() { return enrollments; }
    public void setEnrollments(List<CourseEnrollment> enrollments) { this.enrollments = enrollments; }
}

enum UserRole {
    USER, TRAINER, INSTITUTE_ADMIN, ADMIN
}