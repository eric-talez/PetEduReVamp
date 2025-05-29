package com.petedu.service;

import com.petedu.entity.Pet;
import com.petedu.entity.User;
import com.petedu.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    public Optional<Pet> getPetById(Long id) {
        return petRepository.findById(id);
    }

    public List<Pet> getPetsByOwner(User owner) {
        return petRepository.findByOwner(owner);
    }

    public List<Pet> getPetsByOwnerId(Long ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

    public Pet createPet(Pet pet) {
        return petRepository.save(pet);
    }

    public Pet updatePet(Pet pet) {
        return petRepository.save(pet);
    }

    public void deletePet(Long id) {
        petRepository.deleteById(id);
    }

    public List<Pet> getPetsByBreed(String breed) {
        return petRepository.findByBreed(breed);
    }

    public List<Pet> getPetsByAge(Integer minAge, Integer maxAge) {
        return petRepository.findByAgeBetween(minAge, maxAge);
    }

    public List<Pet> getPetsByGender(String gender) {
        return petRepository.findByGender(gender);
    }

    public long getTotalPetCount() {
        return petRepository.countAllPets();
    }
}