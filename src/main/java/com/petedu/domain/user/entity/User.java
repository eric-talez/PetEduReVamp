package com.petedu.domain.user.entity;

import com.petedu.domain.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User extends BaseTimeEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(unique = true, nullable = false)
    private String username;
    
    @NotBlank
    @Column(nullable = false)
    private String password;
    
    @Email
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotBlank
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;
    
    private String avatar;
    private String bio;
    private String location;
    private String specialty;
    
    @Column(name = "is_verified")
    private Boolean isVerified = false;
    
    // 소셜 로그인 관련 필드
    @Column(unique = true)
    private String ci;
    
    private Boolean verified = false;
    
    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
    
    @Column(name = "verification_name")
    private String verificationName;
    
    @Column(name = "verification_birth")
    private String verificationBirth;
    
    @Column(name = "verification_phone")
    private String verificationPhone;
    
    private String provider;
    
    @Column(name = "social_id")
    private String socialId;
    
    // 결제 관련 필드
    @Column(name = "stripe_customer_id")
    private String stripeCustomerId;
    
    @Column(name = "stripe_subscription_id")
    private String stripeSubscriptionId;
    
    @Column(name = "membership_tier")
    private String membershipTier;
    
    @Column(name = "membership_expires_at")
    private LocalDateTime membershipExpiresAt;
    
    @Column(name = "institute_id")
    private Long instituteId;
    
    // 기본 생성자
    protected User() {}
    
    // 생성자
    public User(String username, String password, String email, String name) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.name = name;
    }
    
    // 소셜 로그인용 생성자
    public User(String username, String email, String name, String provider, String socialId) {
        this.username = username;
        this.email = email;
        this.name = name;
        this.provider = provider;
        this.socialId = socialId;
        this.password = ""; // 소셜 로그인 사용자는 패스워드 없음
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    
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
    
    public String getCi() { return ci; }
    public void setCi(String ci) { this.ci = ci; }
    
    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }
    
    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }
    
    public String getVerificationName() { return verificationName; }
    public void setVerificationName(String verificationName) { this.verificationName = verificationName; }
    
    public String getVerificationBirth() { return verificationBirth; }
    public void setVerificationBirth(String verificationBirth) { this.verificationBirth = verificationBirth; }
    
    public String getVerificationPhone() { return verificationPhone; }
    public void setVerificationPhone(String verificationPhone) { this.verificationPhone = verificationPhone; }
    
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    
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
    
    public Long getInstituteId() { return instituteId; }
    public void setInstituteId(Long instituteId) { this.instituteId = instituteId; }
    
    // 비즈니스 메서드
    public boolean isSocialUser() {
        return provider != null && !provider.isEmpty();
    }
    
    public boolean hasRole(UserRole role) {
        return this.role == role;
    }
    
    public boolean isTrainer() {
        return role == UserRole.TRAINER;
    }
    
    public boolean isInstituteAdmin() {
        return role == UserRole.INSTITUTE_ADMIN;
    }
    
    public boolean isAdmin() {
        return role == UserRole.ADMIN;
    }
}