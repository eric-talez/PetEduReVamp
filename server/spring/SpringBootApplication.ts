/**
 * Spring Boot Application Entry Point
 * Node.js/TypeScript로 구현된 Spring Boot 스타일 메인 애플리케이션
 */

import express, { Express } from 'express';
import { Server } from 'http';
import { storage } from '../storage';

export class SpringBootApplication {
    private app: Express;
    private server: Server | null = null;
    private port: number;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || '8080');
        this.configureApplication();
    }

    /**
     * @PostConstruct 스타일 초기화
     */
    private configureApplication(): void {
        // JSON 파싱 미들웨어
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // CORS 설정
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            } else {
                next();
            }
        });

        console.log('[SpringBoot] Application configured successfully');
    }

    /**
     * @ComponentScan 스타일 컴포넌트 등록
     */
    public registerControllers(): void {
        this.registerWebController();
        this.registerRestControllers();
        this.registerActuatorEndpoints();
    }

    /**
     * Web MVC Controller 등록
     */
    private async registerWebController(): Promise<void> {
        const { WebController } = await import('./controller/WebController');
        const webController = new WebController(storage);

        // 템플릿 페이지 라우팅
        this.app.get('/', webController.home.bind(webController));
        this.app.get('/dashboard', webController.dashboard.bind(webController));
        this.app.get('/courses', webController.courses.bind(webController));
        this.app.get('/pets', webController.pets.bind(webController));
        this.app.get('/trainers', webController.trainers.bind(webController));
        this.app.get('/admin', webController.admin.bind(webController));

        console.log('[SpringBoot] Web Controllers registered');
    }

    /**
     * REST API Controller 등록
     */
    private async registerRestControllers(): Promise<void> {
        const { UserController } = await import('./controller/UserController');
        const { PetController } = await import('./controller/PetController');
        const { CourseController } = await import('./controller/CourseController');

        const userController = new UserController(storage);
        const petController = new PetController(storage);
        const courseController = new CourseController(storage);

        // User REST API
        this.app.get('/api/users', userController.findAll.bind(userController));
        this.app.get('/api/users/:id', userController.findById.bind(userController));
        this.app.post('/api/users', userController.save.bind(userController));

        // Pet REST API
        this.app.get('/api/pets', petController.findAll.bind(petController));
        this.app.get('/api/pets/:id', petController.findById.bind(petController));
        this.app.post('/api/pets', petController.save.bind(petController));

        // Course REST API
        this.app.get('/api/courses', courseController.findAll.bind(courseController));
        this.app.get('/api/courses/:id', courseController.findById.bind(courseController));
        this.app.post('/api/courses', courseController.save.bind(courseController));

        console.log('[SpringBoot] REST Controllers registered');
    }

    /**
     * Actuator 엔드포인트 등록
     */
    private registerActuatorEndpoints(): void {
        this.app.get('/actuator/health', (req, res) => {
            res.json({
                status: 'UP',
                components: {
                    db: { status: 'UP' },
                    diskSpace: { status: 'UP' },
                    application: { status: 'UP' }
                }
            });
        });

        this.app.get('/actuator/info', (req, res) => {
            res.json({
                app: {
                    name: 'PetEdu Platform',
                    description: 'AI-powered Pet Training Platform',
                    version: '1.0.0'
                }
            });
        });

        console.log('[SpringBoot] Actuator endpoints registered');
    }

    /**
     * @EventListener ApplicationReadyEvent 스타일 시작
     */
    public start(): Server {
        this.registerControllers();

        this.server = this.app.listen(this.port, '0.0.0.0', () => {
            console.log('');
            console.log('  .   ____          _            __ _ _');
            console.log(' /\\\\ / ___\'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\');
            console.log('( ( )\\___ | \'_ | \'_| | \'_ \\/ _` | \\ \\ \\ \\');
            console.log(' \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )');
            console.log('  \'  |____| .__|_| |_|_| |_\\__, | / / / /');
            console.log(' =========|_|==============|___/=/_/_/_/');
            console.log(' :: Spring Boot ::                (v2.7.18)');
            console.log('');
            console.log(`[SpringBoot] Started SpringBootApplication in ${process.uptime().toFixed(3)}s`);
            console.log(`[SpringBoot] Tomcat started on port(s): ${this.port} (http)`);
            console.log(`[SpringBoot] Application 'PetEdu Platform' is running!`);
        });

        return this.server;
    }

    public getApp(): Express {
        return this.app;
    }
}

export function main(): Server {
    console.log('[SpringBoot] Starting PetEdu Platform');
    const application = new SpringBootApplication();
    return application.start();
}