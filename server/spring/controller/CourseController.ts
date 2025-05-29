/**
 * @RestController
 * @RequestMapping("/api/courses")
 */

import { Request, Response } from 'express';
import { IStorage } from '../../storage';

export class CourseController {
    private storage: IStorage;

    constructor(storage: IStorage) {
        this.storage = storage;
    }

    /**
     * @GetMapping
     */
    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const courses = await this.storage.getAllCourses();
            res.json(courses);
        } catch (error) {
            console.error('[CourseController] Error finding all courses:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * @GetMapping("/{id}")
     */
    async findById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const course = await this.storage.getCourse(id);
            
            if (!course) {
                res.status(404).json({ error: 'Course not found' });
                return;
            }
            
            res.json(course);
        } catch (error) {
            console.error('[CourseController] Error finding course by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * @PostMapping
     */
    async save(req: Request, res: Response): Promise<void> {
        try {
            const courseData = req.body;
            const course = await this.storage.createCourse(courseData);
            res.status(201).json(course);
        } catch (error) {
            console.error('[CourseController] Error saving course:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}