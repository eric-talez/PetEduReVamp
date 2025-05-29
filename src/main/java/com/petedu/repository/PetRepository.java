package com.petedu.repository;

import com.petedu.entity.Pet;
import com.petedu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    
    List<Pet> findByOwner(User owner);
    
    List<Pet> findByOwnerId(Long ownerId);
    
    List<Pet> findByBreed(String breed);
    
    @Query("SELECT p FROM Pet p WHERE p.age BETWEEN :minAge AND :maxAge")
    List<Pet> findByAgeBetween(Integer minAge, Integer maxAge);
    
    @Query("SELECT p FROM Pet p WHERE p.gender = :gender")
    List<Pet> findByGender(String gender);
    
    @Query("SELECT COUNT(p) FROM Pet p")
    long countAllPets();
}