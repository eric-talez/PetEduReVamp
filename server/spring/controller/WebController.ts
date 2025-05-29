/**
 * @Controller
 * Spring Boot Style Web MVC Controller
 */

import { Request, Response } from 'express';
import { IStorage } from '../../storage';

export class WebController {
    private storage: IStorage;

    constructor(storage: IStorage) {
        this.storage = storage;
    }

    /**
     * @GetMapping("/")
     */
    async home(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.storage.getAllUsers();
            const pets = await this.storage.getAllPets();
            const courses = await this.storage.getAllCourses();
            const trainers = await this.storage.getAllTrainers();

            const html = this.renderHomePage({
                userCount: users.length.toLocaleString(),
                petCount: pets.length.toLocaleString(),
                courseCount: courses.length.toLocaleString(),
                trainerCount: trainers.length.toLocaleString()
            });

            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        } catch (error) {
            console.error('[WebController] Error rendering home page:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * @GetMapping("/dashboard")
     */
    async dashboard(req: Request, res: Response): Promise<void> {
        try {
            const html = this.renderDashboardPage();
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        } catch (error) {
            console.error('[WebController] Error rendering dashboard:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * @GetMapping("/courses")
     */
    async courses(req: Request, res: Response): Promise<void> {
        try {
            const courses = await this.storage.getAllCourses();
            const html = this.renderCoursesPage(courses);
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        } catch (error) {
            console.error('[WebController] Error rendering courses:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * @GetMapping("/pets")
     */
    async pets(req: Request, res: Response): Promise<void> {
        try {
            const pets = await this.storage.getAllPets();
            const html = this.renderPetsPage(pets);
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        } catch (error) {
            console.error('[WebController] Error rendering pets:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * @GetMapping("/trainers")
     */
    async trainers(req: Request, res: Response): Promise<void> {
        try {
            const trainers = await this.storage.getAllTrainers();
            const html = this.renderTrainersPage(trainers);
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        } catch (error) {
            console.error('[WebController] Error rendering trainers:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * @GetMapping("/admin")
     */
    async admin(req: Request, res: Response): Promise<void> {
        try {
            const html = this.renderAdminPage();
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        } catch (error) {
            console.error('[WebController] Error rendering admin:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    private renderHomePage(data: any): string {
        return `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PetEdu Platform - Spring Boot</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
            <style>
                body { 
                    font-family: 'Inter', sans-serif; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    color: white;
                }
                .spring-badge {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #22c55e;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 25px;
                    font-weight: 600;
                    z-index: 1000;
                }
                .hero-section {
                    padding: 100px 0;
                    text-align: center;
                }
                .hero-title {
                    font-size: 4rem;
                    font-weight: 700;
                    margin-bottom: 20px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 30px;
                    margin: 60px 0;
                }
                .stat-card {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 30px;
                    text-align: center;
                }
                .stat-number {
                    font-size: 3rem;
                    font-weight: 700;
                    color: #FFD700;
                }
                .btn-spring {
                    background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
                    border: none;
                    color: white;
                    padding: 15px 40px;
                    border-radius: 50px;
                    font-weight: 600;
                    text-decoration: none;
                    display: inline-block;
                    margin: 10px;
                    transition: all 0.3s ease;
                }
                .btn-spring:hover {
                    transform: translateY(-3px);
                    color: white;
                }
            </style>
        </head>
        <body>
            <div class="spring-badge">
                <i class="fas fa-leaf me-2"></i>Spring Boot
            </div>
            
            <div class="container">
                <section class="hero-section">
                    <h1 class="hero-title">
                        <i class="fas fa-paw me-3"></i>PetEdu Platform
                    </h1>
                    <p class="lead mb-4">
                        Spring Boot 기반 AI 반려동물 교육 플랫폼
                    </p>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${data.userCount}</div>
                            <p>등록된 사용자</p>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${data.petCount}</div>
                            <p>관리 중인 반려동물</p>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${data.courseCount}</div>
                            <p>교육 과정</p>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${data.trainerCount}</div>
                            <p>전문 훈련사</p>
                        </div>
                    </div>
                    
                    <div class="mt-5">
                        <a href="/dashboard" class="btn-spring">
                            <i class="fas fa-chart-bar me-2"></i>대시보드
                        </a>
                        <a href="/courses" class="btn-spring">
                            <i class="fas fa-graduation-cap me-2"></i>강좌
                        </a>
                        <a href="/pets" class="btn-spring">
                            <i class="fas fa-dog me-2"></i>반려동물
                        </a>
                        <a href="/trainers" class="btn-spring">
                            <i class="fas fa-user-tie me-2"></i>훈련사
                        </a>
                    </div>
                </section>
            </div>
            
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
        `;
    }

    private renderDashboardPage(): string {
        return `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>대시보드 - PetEdu Platform</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { font-family: 'Inter', sans-serif; background: #f8fafc; }
                .spring-indicator { 
                    position: fixed; 
                    top: 20px; 
                    right: 20px; 
                    background: #22c55e; 
                    color: white; 
                    padding: 10px 20px; 
                    border-radius: 25px; 
                    font-weight: 600; 
                    z-index: 1000; 
                }
            </style>
        </head>
        <body>
            <div class="spring-indicator">Spring Boot</div>
            <div class="container mt-5">
                <h1>대시보드</h1>
                <p class="text-muted">Spring Boot 기반 대시보드입니다.</p>
                <div class="alert alert-success">
                    Spring Boot WebController가 성공적으로 렌더링했습니다.
                </div>
                <a href="/" class="btn btn-primary">홈으로 돌아가기</a>
            </div>
        </body>
        </html>
        `;
    }

    private renderCoursesPage(courses: any[]): string {
        const coursesHtml = courses.map(course => `
            <tr>
                <td>${course.id}</td>
                <td>${course.title || course.name}</td>
                <td>${course.description || '설명 없음'}</td>
                <td><span class="badge bg-success">활성</span></td>
            </tr>
        `).join('');

        return `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>강좌 - PetEdu Platform</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { font-family: 'Inter', sans-serif; background: #f8fafc; }
                .spring-indicator { 
                    position: fixed; 
                    top: 20px; 
                    right: 20px; 
                    background: #22c55e; 
                    color: white; 
                    padding: 10px 20px; 
                    border-radius: 25px; 
                    font-weight: 600; 
                    z-index: 1000; 
                }
            </style>
        </head>
        <body>
            <div class="spring-indicator">Spring Boot</div>
            <div class="container mt-5">
                <h1>강좌 관리</h1>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>강좌명</th>
                                <th>설명</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${coursesHtml || '<tr><td colspan="4">강좌가 없습니다.</td></tr>'}
                        </tbody>
                    </table>
                </div>
                <a href="/" class="btn btn-primary">홈으로 돌아가기</a>
            </div>
        </body>
        </html>
        `;
    }

    private renderPetsPage(pets: any[]): string {
        const petsHtml = pets.map(pet => `
            <tr>
                <td>${pet.id}</td>
                <td>${pet.name}</td>
                <td>${pet.breed}</td>
                <td>${pet.age}살</td>
            </tr>
        `).join('');

        return `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>반려동물 - PetEdu Platform</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { font-family: 'Inter', sans-serif; background: #f8fafc; }
                .spring-indicator { 
                    position: fixed; 
                    top: 20px; 
                    right: 20px; 
                    background: #22c55e; 
                    color: white; 
                    padding: 10px 20px; 
                    border-radius: 25px; 
                    font-weight: 600; 
                    z-index: 1000; 
                }
            </style>
        </head>
        <body>
            <div class="spring-indicator">Spring Boot</div>
            <div class="container mt-5">
                <h1>반려동물 관리</h1>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>이름</th>
                                <th>품종</th>
                                <th>나이</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${petsHtml || '<tr><td colspan="4">반려동물이 없습니다.</td></tr>'}
                        </tbody>
                    </table>
                </div>
                <a href="/" class="btn btn-primary">홈으로 돌아가기</a>
            </div>
        </body>
        </html>
        `;
    }

    private renderTrainersPage(trainers: any[]): string {
        const trainersHtml = trainers.map(trainer => `
            <tr>
                <td>${trainer.id}</td>
                <td>${trainer.name}</td>
                <td>${trainer.specialization || '일반'}</td>
                <td>${trainer.experience || '미정'}년</td>
            </tr>
        `).join('');

        return `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>훈련사 - PetEdu Platform</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { font-family: 'Inter', sans-serif; background: #f8fafc; }
                .spring-indicator { 
                    position: fixed; 
                    top: 20px; 
                    right: 20px; 
                    background: #22c55e; 
                    color: white; 
                    padding: 10px 20px; 
                    border-radius: 25px; 
                    font-weight: 600; 
                    z-index: 1000; 
                }
            </style>
        </head>
        <body>
            <div class="spring-indicator">Spring Boot</div>
            <div class="container mt-5">
                <h1>훈련사 관리</h1>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>이름</th>
                                <th>전문분야</th>
                                <th>경력</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${trainersHtml || '<tr><td colspan="4">훈련사가 없습니다.</td></tr>'}
                        </tbody>
                    </table>
                </div>
                <a href="/" class="btn btn-primary">홈으로 돌아가기</a>
            </div>
        </body>
        </html>
        `;
    }

    private renderAdminPage(): string {
        return `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>관리자 - PetEdu Platform</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { font-family: 'Inter', sans-serif; background: #f8fafc; }
                .spring-indicator { 
                    position: fixed; 
                    top: 20px; 
                    right: 20px; 
                    background: #22c55e; 
                    color: white; 
                    padding: 10px 20px; 
                    border-radius: 25px; 
                    font-weight: 600; 
                    z-index: 1000; 
                }
            </style>
        </head>
        <body>
            <div class="spring-indicator">Spring Boot</div>
            <div class="container mt-5">
                <h1>관리자 페이지</h1>
                <p class="text-muted">Spring Boot 기반 관리자 페이지입니다.</p>
                <div class="alert alert-info">
                    관리자 기능이 여기에 표시됩니다.
                </div>
                <a href="/" class="btn btn-primary">홈으로 돌아가기</a>
            </div>
        </body>
        </html>
        `;
    }
}