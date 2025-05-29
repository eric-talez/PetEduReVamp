/**
 * @RestController
 * @RequestMapping("/api/users")
 */

import { Request, Response } from 'express';
import { IStorage } from '../../storage';

export class UserController {
    private storage: IStorage;

    constructor(storage: IStorage) {
        this.storage = storage;
    }

    /**
     * @GetMapping
     */
    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.storage.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error('[UserController] Error finding all users:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * @GetMapping("/{id}")
     */
    async findById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const user = await this.storage.getUser(id);
            
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            
            res.json(user);
        } catch (error) {
            console.error('[UserController] Error finding user by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * @PostMapping
     */
    async save(req: Request, res: Response): Promise<void> {
        try {
            const userData = req.body;
            const user = await this.storage.createUser(userData);
            res.status(201).json(user);
        } catch (error) {
            console.error('[UserController] Error saving user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}