import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { createUserSchema, createPetSchema, createCourseSchema } from "@shared/schema";
import { registerCommissionRoutes } from "./commission/routes";
import { registerTrainerRoutes } from "./trainers/routes";
import { registerCourseRoutes } from "./courses/routes";
import { registerInstituteRoutes } from "./institutes/routes";
import { registerLocationRoutes } from "./location/routes";
import { registerVideoCallRoutes } from "./videocall/routes";
import { registerMenuRoutes } from "./menu/routes";
import { WebSocketServer } from 'ws';
import { MessagingService } from './messaging/service';

// 타입은 server/types.d.ts에 정의되어 있습니다.

export async function registerRoutes(app: Express): Promise<Server> {
  // Register all modular routes
  registerCommissionRoutes(app);
  registerTrainerRoutes(app);
  registerCourseRoutes(app);
  registerInstituteRoutes(app);
  registerLocationRoutes(app);
  registerVideoCallRoutes(app);
  registerMenuRoutes(app);
  
  // 로그 메시지
  console.log('[server] API routes registered');
  // ===== Auth Routes =====
  
  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, we'd properly hash and compare the password
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user in session (removing password field)
      const { password: _, ...userWithoutPassword } = user;
      req.session.user = userWithoutPassword;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
  
  // Get current user info
  app.get("/api/auth/me", (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    return res.status(200).json(req.session.user);
  });
  
  // Register new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = createUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }

      // 기관 코드가 제공된 경우 검증
      if (userData.instituteCode) {
        const institute = await storage.getInstituteByCode(userData.instituteCode);
        if (!institute) {
          return res.status(400).json({ message: "Invalid institute code" });
        }
        userData.role = 'trainer';
        userData.instituteId = institute.id;
      }
      
      const newUser = await storage.createUser(userData);
      
      // Don't return the password
      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== User Routes =====
  
  // 프로필 업데이트
  app.patch("/api/users/profile", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.session.user.id;
      const { name, email, phone, bio, location, avatar } = req.body;
      
      // 프로필 정보 업데이트
      const updatedUser = await storage.updateUserProfile(userId, {
        name,
        email,
        phone,
        bio,
        location,
        avatar
      });
      
      // 세션 업데이트
      req.session.user = {
        ...req.session.user,
        name: updatedUser.name,
        email: updatedUser.email
      };
      
      // 비밀번호는 응답에서 제외
      const { password: _, ...userWithoutPassword } = updatedUser;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user profile:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get user profile
  app.get("/api/users/:id", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return the password
      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== Pet Routes =====
  
  // Get user's pets
  app.get("/api/pets", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.session.user.id;
      const pets = await storage.getPetsByUserId(userId);
      
      return res.status(200).json(pets);
    } catch (error) {
      console.error("Get pets error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get specific pet
  app.get("/api/pets/:id", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const petId = parseInt(req.params.id);
      const pet = await storage.getPet(petId);
      
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      
      // Check if pet belongs to the logged-in user
      if (pet.userId !== req.session.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      return res.status(200).json(pet);
    } catch (error) {
      console.error("Get pet error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Create new pet
  app.post("/api/pets", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const petData = createPetSchema.parse(req.body);
      
      // Assign the current user as the pet owner
      petData.userId = req.session.user.id;
      
      const newPet = await storage.createPet(petData);
      return res.status(201).json(newPet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      
      console.error("Create pet error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== Course Routes =====
  
  // Get all courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      return res.status(200).json(courses);
    } catch (error) {
      console.error("Get courses error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get course by ID
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      return res.status(200).json(course);
    } catch (error) {
      console.error("Get course error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get user's enrolled courses
  app.get("/api/user/courses", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.session.user.id;
      const courses = await storage.getCoursesByUserId(userId);
      
      return res.status(200).json(courses);
    } catch (error) {
      console.error("Get user courses error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Enroll in a course
  app.post("/api/courses/:id/enroll", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const courseId = parseInt(req.params.id);
      const userId = req.session.user.id;
      
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const enrollment = await storage.enrollUserInCourse(userId, courseId);
      return res.status(201).json(enrollment);
    } catch (error) {
      console.error("Enroll in course error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Create new course (for trainers)
  app.post("/api/courses", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is a trainer
      if (req.session.user.role !== "trainer" && req.session.user.role !== "institute-admin" && req.session.user.role !== "admin") {
        return res.status(403).json({ message: "Only trainers can create courses" });
      }
      
      const courseData = createCourseSchema.parse(req.body);
      
      // Set the trainer ID as the current user
      courseData.trainerId = req.session.user.id;
      
      const newCourse = await storage.createCourse(courseData);
      return res.status(201).json(newCourse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      
      console.error("Create course error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== Trainer Routes =====
  
  // Get all trainers
  app.get("/api/trainers", async (req, res) => {
    try {
      const trainers = await storage.getAllTrainers();
      return res.status(200).json(trainers);
    } catch (error) {
      console.error("Get trainers error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get trainer by ID
  app.get("/api/trainers/:id", async (req, res) => {
    try {
      const trainerId = parseInt(req.params.id);
      const trainer = await storage.getTrainer(trainerId);
      
      if (!trainer) {
        return res.status(404).json({ message: "Trainer not found" });
      }
      
      return res.status(200).json(trainer);
    } catch (error) {
      console.error("Get trainer error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== User Management Routes =====
  
  // Upgrade user to pet owner
  app.post("/api/users/:id/upgrade-to-pet-owner", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is institute admin
      if (req.session.user.role !== "institute-admin") {
        return res.status(403).json({ message: "Only institute admins can upgrade users" });
      }
      
      const userId = parseInt(req.params.id);
      const { trainerId } = req.body;
      
      // Validate trainer belongs to institute
      const trainer = await storage.getTrainer(trainerId);
      if (!trainer || trainer.instituteId !== req.session.user.instituteId) {
        return res.status(400).json({ message: "Invalid trainer" });
      }
      
      // Upgrade user
      const updatedUser = await storage.updateUserRole(userId, 'pet-owner', trainerId);
      
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Upgrade user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // 사용자 검색 API 엔드포인트
  app.get("/api/users/search", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          message: '검색어가 필요합니다.'
        });
      }
      
      // 검색 로직 구현 (이름, 이메일, 역할 등으로 검색)
      // 실제 구현에서는 데이터베이스 쿼리를 사용하여 검색
      // 예시: const users = await db.select().from(users).where(like(users.name, `%${query}%`));
      
      // 임시 구현 (메모리 스토리지에서 필터링)
      const sampleUsers = [
        { id: 2, name: '김훈련', role: 'trainer', avatar: null, email: 'trainer@example.com' },
        { id: 3, name: '이반려', role: 'pet-owner', avatar: null, email: 'pet-owner@example.com' },
        { id: 4, name: '박기관', role: 'institute-admin', avatar: null, email: 'institute@example.com' },
        { id: 5, name: '최관리', role: 'admin', avatar: null, email: 'admin2@example.com' },
        { id: 6, name: '홍길동', role: 'pet-owner', avatar: null, email: 'hong@example.com' },
        { id: 7, name: '김철수', role: 'trainer', avatar: null, email: 'kim@example.com' },
        { id: 8, name: '이영희', role: 'pet-owner', avatar: null, email: 'lee@example.com' },
      ];
      
      const searchResults = sampleUsers.filter(user => 
        user.name.includes(query) || 
        user.role.includes(query) ||
        user.email.includes(query)
      );
      
      return res.status(200).json({
        success: true,
        users: searchResults
      });
    } catch (error) {
      console.error('사용자 검색 오류:', error);
      return res.status(500).json({
        success: false,
        message: '사용자 검색 중 오류가 발생했습니다.'
      });
    }
  });
  
  // Institute and trainer routes are now in separate modules
  
  // ===== 쇼핑 API 엔드포인트 =====
  
  // 상품 카테고리 목록 가져오기
  app.get("/api/shop/categories", (req, res) => {
    try {
      const categories = [
        { id: 1, name: "사료", slug: "food", count: 32 },
        { id: 2, name: "간식", slug: "treats", count: 28 },
        { id: 3, name: "장난감", slug: "toys", count: 45 },
        { id: 4, name: "의류", slug: "clothing", count: 20 },
        { id: 5, name: "목줄/하네스", slug: "leashes", count: 15 },
        { id: 6, name: "위생용품", slug: "hygiene", count: 22 },
        { id: 7, name: "건강관리", slug: "health", count: 18 },
        { id: 8, name: "훈련용품", slug: "training", count: 12 }
      ];
      
      return res.status(200).json({ categories });
    } catch (error) {
      console.error("Get shop categories error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // 인기 반려견 품종 목록 가져오기
  app.get("/api/shop/popular-breeds", (req, res) => {
    try {
      const breeds = [
        { id: 1, name: "말티즈", slug: "maltese", count: 145 },
        { id: 2, name: "푸들", slug: "poodle", count: 132 },
        { id: 3, name: "포메라니안", slug: "pomeranian", count: 98 },
        { id: 4, name: "시츄", slug: "shih-tzu", count: 87 },
        { id: 5, name: "비숑 프리제", slug: "bichon-frise", count: 76 },
        { id: 6, name: "웰시 코기", slug: "welsh-corgi", count: 65 },
        { id: 7, name: "치와와", slug: "chihuahua", count: 52 },
        { id: 8, name: "댕댕이", slug: "mixed-breed", count: 189 }
      ];
      
      return res.status(200).json({ breeds });
    } catch (error) {
      console.error("Get popular breeds error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // 상품 목록 가져오기 (필터링 지원)
  app.get("/api/shop/products", async (req, res) => {
    try {
      // 필터링 파라미터 가져오기
      const { category, breed, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
      
      // 상품 목록 (예시 데이터)
      const products = [
        {
          id: 1,
          name: "프리미엄 강아지 사료",
          description: "영양 균형이 완벽한 프리미엄 사료",
          price: 45000,
          discountRate: 10,
          image: "/images/products/dog-food-premium.jpg",
          category: "food",
          rating: 4.8,
          reviewCount: 142,
          inStock: true,
          attributes: {
            weight: "3kg",
            flavor: "닭고기",
            suitableFor: ["all", "small", "medium"]
          }
        },
        {
          id: 2,
          name: "강아지 덴탈 간식",
          description: "치아 건강에 좋은 덴탈 간식",
          price: 12000,
          discountRate: 0,
          image: "/images/products/dog-treats-dental.jpg",
          category: "treats",
          rating: 4.5,
          reviewCount: 89,
          inStock: true,
          attributes: {
            weight: "300g",
            flavor: "치즈",
            suitableFor: ["all", "small", "medium", "large"]
          }
        },
        {
          id: 3,
          name: "인터랙티브 장난감",
          description: "반려견의 지능 발달에 도움이 되는 장난감",
          price: 28000,
          discountRate: 15,
          image: "/images/products/dog-toy-interactive.jpg",
          category: "toys",
          rating: 4.7,
          reviewCount: 76,
          inStock: true,
          attributes: {
            material: "고무, 플라스틱",
            size: "중형",
            suitableFor: ["all", "medium", "large"]
          }
        },
        {
          id: 4,
          name: "강아지 겨울 패딩",
          description: "추운 겨울을 따뜻하게 보낼 수 있는 패딩",
          price: 35000,
          discountRate: 20,
          image: "/images/products/dog-clothing-winter.jpg",
          category: "clothing",
          rating: 4.6,
          reviewCount: 52,
          inStock: true,
          attributes: {
            size: ["XS", "S", "M", "L", "XL"],
            color: ["레드", "네이비", "블랙"],
            material: "면, 폴리에스터",
            suitableFor: ["small", "medium"]
          }
        },
        {
          id: 5,
          name: "편안한 강아지 하네스",
          description: "산책할 때 편안하게 착용할 수 있는 하네스",
          price: 25000,
          discountRate: 5,
          image: "/images/products/dog-harness.jpg",
          category: "leashes",
          rating: 4.9,
          reviewCount: 112,
          inStock: true,
          attributes: {
            size: ["S", "M", "L"],
            color: ["블랙", "블루", "그린"],
            material: "나일론, 메쉬",
            suitableFor: ["all", "small", "medium", "large"]
          }
        },
        {
          id: 6,
          name: "강아지 샴푸",
          description: "피부 자극이 적은 천연 성분 샴푸",
          price: 18000,
          discountRate: 0,
          image: "/images/products/dog-shampoo.jpg",
          category: "hygiene",
          rating: 4.7,
          reviewCount: 95,
          inStock: true,
          attributes: {
            volume: "500ml",
            type: "저자극성",
            suitableFor: ["all", "sensitive-skin"]
          }
        }
      ];
      
      // 페이지네이션 계산
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      
      // 응답 데이터 구성
      const response = {
        products: products.slice(startIndex, endIndex),
        total: products.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(products.length / Number(limit))
      };
      
      return res.status(200).json(response);
    } catch (error) {
      console.error("Get products error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // 상품 상세 정보 가져오기
  app.get("/api/shop/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      // 예시 상품 상세 데이터
      const products = [
        {
          id: 1,
          name: "프리미엄 강아지 사료",
          description: "영양 균형이 완벽한 프리미엄 사료",
          longDescription: "이 프리미엄 사료는 성장기 강아지부터 성견까지 모든 연령대의 강아지에게 적합합니다. 필수 영양소와 비타민, 미네랄이 풍부하게 함유되어 있어 반려견의 건강한 성장과 유지에 도움을 줍니다. 인공 색소와 방부제를 첨가하지 않은 자연 그대로의 맛을 느낄 수 있습니다.",
          price: 45000,
          discountRate: 10,
          images: [
            "/images/products/dog-food-premium.jpg",
            "/images/products/dog-food-premium-2.jpg",
            "/images/products/dog-food-premium-3.jpg"
          ],
          category: "food",
          rating: 4.8,
          reviewCount: 142,
          inStock: true,
          attributes: {
            weight: "3kg",
            flavor: "닭고기",
            suitableFor: ["all", "small", "medium"],
            ingredients: "닭고기, 현미, 고구마, 당근, 블루베리, 비타민 E, 오메가3, 오메가6",
            nutritionalInfo: "단백질 26%, 지방 15%, 섬유질 4%, 수분 10%",
            feedingGuide: "체중 5kg 미만: 1일 100g, 체중 5-10kg: 1일 200g, 체중 10kg 이상: 1일 300g"
          },
          relatedProducts: [2, 6, 7],
          reviews: [
            { id: 1, user: "강아지집사", rating: 5, content: "우리 강아지가 정말 잘 먹어요!", date: "2023-04-15" },
            { id: 2, user: "멍멍이맘", rating: 4, content: "품질은 좋은데 가격이 조금 비싸요", date: "2023-03-22" }
          ]
        }
      ];
      
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      console.error("Get product detail error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // 장바구니에 상품 추가
  app.post("/api/shop/cart", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { productId, quantity } = req.body;
      
      if (!productId || !quantity) {
        return res.status(400).json({ message: "Product ID and quantity are required" });
      }
      
      // 간단한 성공 응답
      return res.status(200).json({ 
        success: true, 
        message: "Product added to cart",
        cart: {
          userId: req.session.user.id,
          items: [{ productId, quantity }]
        } 
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // 장바구니 정보 가져오기
  app.get("/api/shop/cart", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // 간단한 장바구니 데이터 반환
      return res.status(200).json({
        userId: req.session.user.id,
        items: [],
        subtotal: 0,
        total: 0
      });
    } catch (error) {
      console.error("Get cart error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // 추천인 코드 확인
  app.post("/api/shop/check-referral", async (req, res) => {
    try {
      const { referralCode } = req.body;
      
      if (!referralCode) {
        return res.status(400).json({ message: "Referral code is required" });
      }
      
      // 예시 추천인 코드
      const validCodes = ["TALES2024", "WELCOME10", "PETFRIEND"];
      
      const isValid = validCodes.includes(referralCode);
      
      return res.status(200).json({
        valid: isValid,
        discount: isValid ? 10 : 0,
        message: isValid ? "Valid referral code. 10% discount applied." : "Invalid referral code."
      });
    } catch (error) {
      console.error("Check referral code error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket 서버 초기화
  const wss = new WebSocketServer({
    server: httpServer,
    path: '/ws'  // WebSocket 연결 경로 (클라이언트에서도 같은 경로 사용)
  });

  // 메시징 서비스 초기화
  const messagingService = new MessagingService(wss, storage);

  console.log('[server] WebSocket server initialized at /ws');
  
  return httpServer;
}
