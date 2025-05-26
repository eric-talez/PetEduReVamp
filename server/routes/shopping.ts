import type { Express } from "express";
import { db } from "../db";
import { products, shopCategories, cartItems } from "@shared/schema";
import { eq, desc, and, gte, lte, count, like, or, inArray } from "drizzle-orm";

export function registerShoppingRoutes(app: Express) {
  // 상품 목록 가져오기 (검색 및 필터링 포함)
  app.get("/api/shopping/products", async (req, res) => {
    try {
      const { search, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
      
      let whereConditions: any[] = [];
      
      // 검색 조건 추가
      if (search) {
        whereConditions.push(
          or(
            like(products.name, `%${search}%`),
            like(products.description, `%${search}%`)
          )
        );
      }
      
      // 카테고리 필터
      if (category && category !== 'all') {
        whereConditions.push(eq(products.categoryId, parseInt(category as string)));
      }
      
      // 가격 범위 필터
      if (minPrice) {
        whereConditions.push(gte(products.price, parseInt(minPrice as string)));
      }
      if (maxPrice) {
        whereConditions.push(lte(products.price, parseInt(maxPrice as string)));
      }
      
      // 활성화된 상품만 표시
      whereConditions.push(eq(products.isActive, true));
      
      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;
      
      // 전체 개수 조회
      const totalResult = await db
        .select({ count: count() })
        .from(products)
        .where(whereClause);
      
      const total = totalResult[0]?.count || 0;
      
      // 페이지네이션과 함께 상품 목록 조회
      const offset = (Number(page) - 1) * Number(limit);
      
      const productList = await db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          discountPrice: products.discountPrice,
          categoryId: products.categoryId,
          images: products.images,
          tags: products.tags,
          stock: products.stock,
          isActive: products.isActive,
          rating: products.rating,
          reviewCount: products.reviewCount,
          createdAt: products.createdAt
        })
        .from(products)
        .where(whereClause)
        .orderBy(desc(products.createdAt))
        .limit(Number(limit))
        .offset(offset);
      
      res.json({
        products: productList,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 특정 상품 상세 정보 가져오기
  app.get("/api/shopping/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);
      
      if (!product[0]) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product[0]);
    } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 쇼핑 카테고리 목록 가져오기
  app.get("/api/shopping/categories", async (req, res) => {
    try {
      const categories = await db
        .select()
        .from(shopCategories)
        .where(eq(shopCategories.isActive, true))
        .orderBy(shopCategories.sortOrder);
      
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 장바구니에 상품 추가
  app.post("/api/shopping/cart", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const userId = req.user!.id;
      const { productId, quantity = 1 } = req.body;

      // 상품 존재 확인
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

      if (!product[0]) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // 재고 확인
      if (product[0].stock && product[0].stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }

      // 이미 장바구니에 있는지 확인
      const existingItem = await db
        .select()
        .from(cartItems)
        .where(and(
          eq(cartItems.userId, userId),
          eq(cartItems.productId, productId)
        ))
        .limit(1);

      if (existingItem[0]) {
        // 기존 아이템 수량 업데이트
        const updatedItem = await db
          .update(cartItems)
          .set({ 
            quantity: existingItem[0].quantity + quantity,
            updatedAt: new Date()
          })
          .where(eq(cartItems.id, existingItem[0].id))
          .returning();

        res.json(updatedItem[0]);
      } else {
        // 새 아이템 추가
        const newItem = await db
          .insert(cartItems)
          .values({
            userId,
            productId,
            quantity,
            createdAt: new Date()
          })
          .returning();

        res.status(201).json(newItem[0]);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 사용자의 장바구니 목록 가져오기
  app.get("/api/shopping/cart", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const userId = req.user!.id;

      const cartList = await db
        .select({
          id: cartItems.id,
          quantity: cartItems.quantity,
          addedAt: cartItems.addedAt,
          product: {
            id: products.id,
            name: products.name,
            price: products.price,
            discountPrice: products.discountPrice,
            images: products.images,
            stockQuantity: products.stockQuantity
          }
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.userId, userId))
        .orderBy(desc(cartItems.addedAt));

      res.json(cartList);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 장바구니 아이템 수량 업데이트
  app.patch("/api/shopping/cart/:itemId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const itemId = parseInt(req.params.itemId);
      const userId = req.user!.id;
      const { quantity } = req.body;

      if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than 0' });
      }

      const updatedItem = await db
        .update(cartItems)
        .set({ 
          quantity,
          updatedAt: new Date()
        })
        .where(and(
          eq(cartItems.id, itemId),
          eq(cartItems.userId, userId)
        ))
        .returning();

      if (!updatedItem[0]) {
        return res.status(404).json({ message: 'Cart item not found' });
      }

      res.json(updatedItem[0]);
    } catch (error) {
      console.error('Error updating cart item:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 장바구니에서 아이템 삭제
  app.delete("/api/shopping/cart/:itemId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const itemId = parseInt(req.params.itemId);
      const userId = req.user!.id;

      const deletedItem = await db
        .delete(cartItems)
        .where(and(
          eq(cartItems.id, itemId),
          eq(cartItems.userId, userId)
        ))
        .returning();

      if (!deletedItem[0]) {
        return res.status(404).json({ message: 'Cart item not found' });
      }

      res.json({ message: 'Item removed from cart' });
    } catch (error) {
      console.error('Error removing cart item:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 주문 생성 (결제 시스템은 나중에 구현)
  app.post("/api/shopping/orders", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const userId = req.user!.id;
      const { cartItemIds, shippingAddress, paymentMethod } = req.body;

      // 장바구니 아이템들 조회
      const items = await db
        .select({
          cartItem: cartItems,
          product: products
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(and(
          eq(cartItems.userId, userId),
          inArray(cartItems.id, cartItemIds)
        ));

      if (items.length === 0) {
        return res.status(400).json({ message: 'No valid cart items found' });
      }

      // 총 금액 계산
      const totalAmount = items.reduce((total, item) => {
        const price = item.product.discountPrice || item.product.price;
        return total + (price * item.cartItem.quantity);
      }, 0);

      // 주문 생성
      const order = await db
        .insert(orders)
        .values({
          userId,
          totalAmount,
          status: 'pending',
          shippingAddress: JSON.stringify(shippingAddress),
          paymentMethod,
          createdAt: new Date()
        })
        .returning();

      // 주문 아이템들 생성
      const orderItemsData = items.map(item => ({
        orderId: order[0].id,
        productId: item.product.id,
        quantity: item.cartItem.quantity,
        price: item.product.discountPrice || item.product.price
      }));

      await db.insert(orderItems).values(orderItemsData);

      // 장바구니에서 주문된 아이템들 삭제
      await db
        .delete(cartItems)
        .where(and(
          eq(cartItems.userId, userId),
          inArray(cartItems.id, cartItemIds)
        ));

      res.status(201).json(order[0]);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 사용자의 주문 목록 가져오기
  app.get("/api/shopping/orders", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const userId = req.user!.id;

      const orderList = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt));

      res.json(orderList);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 특정 주문 상세 정보 가져오기
  app.get("/api/shopping/orders/:orderId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const orderId = parseInt(req.params.orderId);
      const userId = req.user!.id;

      const order = await db
        .select()
        .from(orders)
        .where(and(
          eq(orders.id, orderId),
          eq(orders.userId, userId)
        ))
        .limit(1);

      if (!order[0]) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // 주문 아이템들 조회
      const items = await db
        .select({
          orderItem: orderItems,
          product: products
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, orderId));

      res.json({
        ...order[0],
        items
      });
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}