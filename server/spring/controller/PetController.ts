/**
 * @RestController
 * @RequestMapping("/api/pets")
 */

import { Request, Response } from 'express';
import { IStorage } from '../../storage';

export class PetController {
    private storage: IStorage;

    constructor(storage: IStorage) {
        this.storage = storage;
    }

    /**
     * @GetMapping
     */
    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const pets = await this.storage.getAllPets();
            res.json(pets);
        } catch (error) {
            console.error('[PetController] Error finding all pets:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * @GetMapping("/{id}")
     */
    async findById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const pet = await this.storage.getPet(id);
            
            if (!pet) {
                res.status(404).json({ error: 'Pet not found' });
                return;
            }
            
            res.json(pet);
        } catch (error) {
            console.error('[PetController] Error finding pet by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * @PostMapping
     */
    async save(req: Request, res: Response): Promise<void> {
        try {
            const petData = req.body;
            const pet = await this.storage.createPet(petData);
            res.status(201).json(pet);
        } catch (error) {
            console.error('[PetController] Error saving pet:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}