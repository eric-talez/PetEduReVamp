package com.petedu.domain.pet.entity;

import com.petedu.domain.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "pets")
public class Pet extends BaseTimeEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(nullable = false)
    private String name;
    
    @NotBlank
    @Column(nullable = false)
    private String breed;
    
    @Column(nullable = false)
    private Integer age;
    
    private Integer weight; // 그램 단위
    private String gender; // 'male', 'female'
    private String description;
    private String avatar;
    private String health;
    private String temperament;
    private String allergies;
    
    @Column(name = "owner_id", nullable = false)
    private Long ownerId;
    
    // 기본 생성자
    protected Pet() {}
    
    // 생성자
    public Pet(String name, String breed, Integer age, Long ownerId) {
        this.name = name;
        this.breed = breed;
        this.age = age;
        this.ownerId = ownerId;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }
    
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    
    public Integer getWeight() { return weight; }
    public void setWeight(Integer weight) { this.weight = weight; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    
    public String getHealth() { return health; }
    public void setHealth(String health) { this.health = health; }
    
    public String getTemperament() { return temperament; }
    public void setTemperament(String temperament) { this.temperament = temperament; }
    
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
}