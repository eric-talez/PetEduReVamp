import { Router } from 'express';
import { db } from '../db';
import { posts, comments, likes, follows, users } from '@shared/schema';
import { eq, and, desc, isNull, sql } from 'drizzle-orm';
import { createPostSchema, createCommentSchema } from '@shared/schema';
import { z } from 'zod';

const router = Router();

// 인증 확인 미들웨어
const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  next();
};

// 게시글 목록 조회
router.get('/posts', async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 10 } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = db.select({
      post: posts,
      author: {
        id: users.id,
        username: users.username,
        name: users.name,
        avatar: users.avatar
      }
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .orderBy(desc(posts.createdAt))
    .limit(Number(limit))
    .offset(offset);
    
    // 카테고리 필터링 (있는 경우)
    if (category) {
      query = query.where(eq(posts.category, String(category)));
    }
    
    // 태그 필터링 (있는 경우)
    // JSON 배열 필드에서 특정 태그를 포함하는 게시글 검색 (PostgreSQL JSONB 기능 사용)
    // 임시로 태그 필터링을 비활성화하여 오류 방지
    /*if (tag) {
      query = query.where(sql`${posts.tags} ? ${String(tag)}`);
    }*/
    
    const result = await query;
    
    // 총 게시글 수 조회를 위한 별도 쿼리
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(posts);
    
    if (category) {
      countQuery = countQuery.where(eq(posts.category, String(category)));
    }
    
    // 임시로 태그 필터링 비활성화
    /*if (tag) {
      countQuery = countQuery.where(sql`${posts.tags} ? ${String(tag)}`);
    }*/
    
    const [{ count }] = await countQuery;
    
    // 결과 데이터 구조 변환
    const formattedPosts = result.map(({ post, author }) => ({
      ...post,
      author
    }));
    
    res.json({
      posts: formattedPosts,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    res.status(500).json({ message: '게시글 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

// 게시글 상세 조회
router.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.select({
      post: posts,
      author: {
        id: users.id,
        username: users.username,
        name: users.name,
        avatar: users.avatar
      }
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.id, parseInt(id)));
    
    if (!result) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    
    // 조회수 증가
    await db.update(posts)
      .set({ viewCount: result.post.viewCount + 1 })
      .where(eq(posts.id, parseInt(id)));
    
    // 게시글 댓글 조회
    const postComments = await db.select({
      comment: comments,
      author: {
        id: users.id,
        username: users.username,
        name: users.name,
        avatar: users.avatar
      }
    })
    .from(comments)
    .leftJoin(users, eq(comments.authorId, users.id))
    .where(and(
      eq(comments.postId, parseInt(id)),
      isNull(comments.parentId) // 최상위 댓글만 가져옴
    ))
    .orderBy(desc(comments.createdAt));
    
    // 대댓글 조회
    const childComments = await db.select({
      comment: comments,
      author: {
        id: users.id,
        username: users.username,
        name: users.name,
        avatar: users.avatar
      }
    })
    .from(comments)
    .leftJoin(users, eq(comments.authorId, users.id))
    .where(and(
      eq(comments.postId, parseInt(id)),
      sql`${comments.parentId} IS NOT NULL` // 부모 댓글이 있는 댓글만 (대댓글)
    ))
    .orderBy(comments.createdAt);
    
    // 댓글 데이터 구조 변환
    const formattedComments = postComments.map(({ comment, author }) => {
      const replies = childComments
        .filter(child => child.comment.parentId === comment.id)
        .map(child => ({
          ...child.comment,
          author: child.author
        }));
      
      return {
        ...comment,
        author,
        replies
      };
    });
    
    // 좋아요 정보 추가
    let userLiked = false;
    if (req.isAuthenticated()) {
      const [likeInfo] = await db.select()
        .from(likes)
        .where(and(
          eq(likes.postId, parseInt(id)), 
          eq(likes.userId, req.user.id)
        ));
      
      userLiked = !!likeInfo;
    }
    
    res.json({
      ...result.post,
      author: result.author,
      comments: formattedComments,
      userLiked
    });
  } catch (error) {
    console.error('게시글 상세 조회 오류:', error);
    res.status(500).json({ message: '게시글 정보를 불러오는 중 오류가 발생했습니다.' });
  }
});

// 게시글 작성
router.post('/posts', isAuthenticated, async (req, res) => {
  try {
    const postData = createPostSchema.parse(req.body);
    
    const [post] = await db.insert(posts)
      .values({
        ...postData,
        authorId: req.user.id
      })
      .returning();
    
    res.status(201).json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: error.errors 
      });
    }
    
    console.error('게시글 작성 오류:', error);
    res.status(500).json({ message: '게시글 작성 중 오류가 발생했습니다.' });
  }
});

// 게시글 수정
router.put('/posts/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const postData = createPostSchema.parse(req.body);
    
    // 게시글 소유자 확인
    const [post] = await db.select()
      .from(posts)
      .where(eq(posts.id, parseInt(id)));
    
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    
    if (post.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '게시글을 수정할 권한이 없습니다.' });
    }
    
    const [updatedPost] = await db.update(posts)
      .set({
        ...postData,
        updatedAt: new Date()
      })
      .where(eq(posts.id, parseInt(id)))
      .returning();
    
    res.json(updatedPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: error.errors 
      });
    }
    
    console.error('게시글 수정 오류:', error);
    res.status(500).json({ message: '게시글 수정 중 오류가 발생했습니다.' });
  }
});

// 게시글 삭제
router.delete('/posts/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 게시글 소유자 확인
    const [post] = await db.select()
      .from(posts)
      .where(eq(posts.id, parseInt(id)));
    
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    
    if (post.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '게시글을 삭제할 권한이 없습니다.' });
    }
    
    // 게시글 삭제 (관련 댓글과 좋아요는 CASCADE 옵션으로 자동 삭제됨)
    await db.delete(posts)
      .where(eq(posts.id, parseInt(id)));
    
    res.json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    res.status(500).json({ message: '게시글 삭제 중 오류가 발생했습니다.' });
  }
});

// 댓글 작성
router.post('/posts/:postId/comments', isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const commentData = createCommentSchema.parse(req.body);
    
    // 게시글 존재 확인
    const [post] = await db.select()
      .from(posts)
      .where(eq(posts.id, parseInt(postId)));
    
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    
    // 댓글 작성 불가 게시글 확인
    if (post.allowComments === false) {
      return res.status(403).json({ message: '댓글 작성이 비활성화된 게시글입니다.' });
    }
    
    // 부모 댓글 확인 (대댓글인 경우)
    if (commentData.parentId) {
      const [parentComment] = await db.select()
        .from(comments)
        .where(eq(comments.id, commentData.parentId));
      
      if (!parentComment) {
        return res.status(404).json({ message: '부모 댓글을 찾을 수 없습니다.' });
      }
    }
    
    const [comment] = await db.insert(comments)
      .values({
        ...commentData,
        postId: parseInt(postId),
        authorId: req.user.id
      })
      .returning();
    
    // 게시글의 댓글 수 증가
    await db.update(posts)
      .set({ comments: post.comments + 1 })
      .where(eq(posts.id, parseInt(postId)));
    
    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: error.errors 
      });
    }
    
    console.error('댓글 작성 오류:', error);
    res.status(500).json({ message: '댓글 작성 중 오류가 발생했습니다.' });
  }
});

// 댓글 수정
router.put('/comments/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: '댓글 내용은 필수입니다.' });
    }
    
    // 댓글 소유자 확인
    const [comment] = await db.select()
      .from(comments)
      .where(eq(comments.id, parseInt(id)));
    
    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }
    
    if (comment.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '댓글을 수정할 권한이 없습니다.' });
    }
    
    const [updatedComment] = await db.update(comments)
      .set({
        content,
        isEdited: true,
        updatedAt: new Date()
      })
      .where(eq(comments.id, parseInt(id)))
      .returning();
    
    res.json(updatedComment);
  } catch (error) {
    console.error('댓글 수정 오류:', error);
    res.status(500).json({ message: '댓글 수정 중 오류가 발생했습니다.' });
  }
});

// 댓글 삭제
router.delete('/comments/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 댓글 소유자 확인
    const [comment] = await db.select()
      .from(comments)
      .where(eq(comments.id, parseInt(id)));
    
    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }
    
    if (comment.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '댓글을 삭제할 권한이 없습니다.' });
    }
    
    // 댓글이 부모 댓글인지 확인
    const childComments = await db.select()
      .from(comments)
      .where(eq(comments.parentId, parseInt(id)));
    
    // 대댓글이 있는 경우 내용만 삭제 처리
    if (childComments.length > 0) {
      await db.update(comments)
        .set({
          content: '삭제된 댓글입니다.',
          isEdited: true
        })
        .where(eq(comments.id, parseInt(id)));
      
      return res.json({ message: '댓글이 삭제되었습니다.' });
    }
    
    // 대댓글이 없는 경우 완전히 삭제
    await db.delete(comments)
      .where(eq(comments.id, parseInt(id)));
    
    // 게시글의 댓글 수 감소
    await db.update(posts)
      .set({ 
        comments: sql`${posts.comments} - 1` 
      })
      .where(eq(posts.id, comment.postId));
    
    res.json({ message: '댓글이 삭제되었습니다.' });
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    res.status(500).json({ message: '댓글 삭제 중 오류가 발생했습니다.' });
  }
});

// 게시글 좋아요 토글
router.post('/posts/:id/like', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // 게시글 존재 확인
    const [post] = await db.select()
      .from(posts)
      .where(eq(posts.id, parseInt(id)));
    
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    
    // 이미 좋아요했는지 확인
    const [existingLike] = await db.select()
      .from(likes)
      .where(and(
        eq(likes.postId, parseInt(id)),
        eq(likes.userId, userId)
      ));
    
    if (existingLike) {
      // 좋아요 취소
      await db.delete(likes)
        .where(eq(likes.id, existingLike.id));
      
      // 게시글 좋아요 수 감소
      await db.update(posts)
        .set({ likes: post.likes - 1 })
        .where(eq(posts.id, parseInt(id)));
      
      return res.json({ liked: false, likes: post.likes - 1 });
    } else {
      // 좋아요 추가
      await db.insert(likes)
        .values({
          userId,
          postId: parseInt(id)
        });
      
      // 게시글 좋아요 수 증가
      await db.update(posts)
        .set({ likes: post.likes + 1 })
        .where(eq(posts.id, parseInt(id)));
      
      return res.json({ liked: true, likes: post.likes + 1 });
    }
  } catch (error) {
    console.error('좋아요 토글 오류:', error);
    res.status(500).json({ message: '좋아요 처리 중 오류가 발생했습니다.' });
  }
});

// 댓글 좋아요 토글
router.post('/comments/:id/like', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // 댓글 존재 확인
    const [comment] = await db.select()
      .from(comments)
      .where(eq(comments.id, parseInt(id)));
    
    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }
    
    // 이미 좋아요했는지 확인
    const [existingLike] = await db.select()
      .from(likes)
      .where(and(
        eq(likes.commentId, parseInt(id)),
        eq(likes.userId, userId)
      ));
    
    if (existingLike) {
      // 좋아요 취소
      await db.delete(likes)
        .where(eq(likes.id, existingLike.id));
      
      // 댓글 좋아요 수 감소
      await db.update(comments)
        .set({ likes: comment.likes - 1 })
        .where(eq(comments.id, parseInt(id)));
      
      return res.json({ liked: false, likes: comment.likes - 1 });
    } else {
      // 좋아요 추가
      await db.insert(likes)
        .values({
          userId,
          commentId: parseInt(id)
        });
      
      // 댓글 좋아요 수 증가
      await db.update(comments)
        .set({ likes: comment.likes + 1 })
        .where(eq(comments.id, parseInt(id)));
      
      return res.json({ liked: true, likes: comment.likes + 1 });
    }
  } catch (error) {
    console.error('댓글 좋아요 토글 오류:', error);
    res.status(500).json({ message: '좋아요 처리 중 오류가 발생했습니다.' });
  }
});

// 사용자 팔로우 토글
router.post('/users/:id/follow', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const followerId = req.user.id;
    
    // 자기 자신을 팔로우할 수 없음
    if (parseInt(id) === followerId) {
      return res.status(400).json({ message: '자기 자신을 팔로우할 수 없습니다.' });
    }
    
    // 팔로우할 사용자 존재 확인
    const [userToFollow] = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(id)));
    
    if (!userToFollow) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    
    // 이미 팔로우했는지 확인
    const [existingFollow] = await db.select()
      .from(follows)
      .where(and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, parseInt(id))
      ));
    
    if (existingFollow) {
      // 팔로우 취소
      await db.delete(follows)
        .where(eq(follows.id, existingFollow.id));
      
      return res.json({ following: false });
    } else {
      // 팔로우 추가
      await db.insert(follows)
        .values({
          followerId,
          followingId: parseInt(id)
        });
      
      return res.json({ following: true });
    }
  } catch (error) {
    console.error('팔로우 토글 오류:', error);
    res.status(500).json({ message: '팔로우 처리 중 오류가 발생했습니다.' });
  }
});

// 팔로워 목록 조회
router.get('/users/:id/followers', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);
    
    // 사용자의 팔로워 목록 조회
    const followers = await db.select({
      follower: {
        id: users.id,
        username: users.username,
        name: users.name,
        avatar: users.avatar,
        bio: users.bio
      },
      followSince: follows.createdAt
    })
    .from(follows)
    .innerJoin(users, eq(follows.followerId, users.id))
    .where(eq(follows.followingId, parseInt(id)))
    .orderBy(desc(follows.createdAt))
    .limit(Number(limit))
    .offset(offset);
    
    // 총 팔로워 수 조회
    const [{ count }] = await db.select({ 
      count: sql<number>`count(*)` 
    })
    .from(follows)
    .where(eq(follows.followingId, parseInt(id)));
    
    // 현재 로그인한 사용자가 이 팔로워들을 팔로우하는지 확인
    const followerIds = followers.map(f => f.follower.id);
    let userFollows = [];
    
    if (req.isAuthenticated() && followerIds.length > 0) {
      userFollows = await db.select()
        .from(follows)
        .where(and(
          eq(follows.followerId, req.user.id),
          sql`${follows.followingId} IN (${followerIds.join(',')})`
        ));
    }
    
    // 결과 데이터 구조 변환
    const formattedFollowers = followers.map(({ follower, followSince }) => ({
      ...follower,
      followSince,
      isFollowedByUser: req.isAuthenticated() 
        ? userFollows.some(f => f.followingId === follower.id)
        : false
    }));
    
    res.json({
      followers: formattedFollowers,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('팔로워 목록 조회 오류:', error);
    res.status(500).json({ message: '팔로워 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

// 팔로잉 목록 조회
router.get('/users/:id/following', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);
    
    // 사용자가 팔로우하는 사람들의 목록 조회
    const following = await db.select({
      following: {
        id: users.id,
        username: users.username,
        name: users.name,
        avatar: users.avatar,
        bio: users.bio
      },
      followSince: follows.createdAt
    })
    .from(follows)
    .innerJoin(users, eq(follows.followingId, users.id))
    .where(eq(follows.followerId, parseInt(id)))
    .orderBy(desc(follows.createdAt))
    .limit(Number(limit))
    .offset(offset);
    
    // 총 팔로잉 수 조회
    const [{ count }] = await db.select({ 
      count: sql<number>`count(*)` 
    })
    .from(follows)
    .where(eq(follows.followerId, parseInt(id)));
    
    // 현재 로그인한 사용자가 이 사람들을 팔로우하는지 확인
    const followingIds = following.map(f => f.following.id);
    let userFollows = [];
    
    if (req.isAuthenticated() && followingIds.length > 0) {
      userFollows = await db.select()
        .from(follows)
        .where(and(
          eq(follows.followerId, req.user.id),
          sql`${follows.followingId} IN (${followingIds.join(',')})`
        ));
    }
    
    // 결과 데이터 구조 변환
    const formattedFollowing = following.map(({ following, followSince }) => ({
      ...following,
      followSince,
      isFollowedByUser: req.isAuthenticated() 
        ? userFollows.some(f => f.followingId === following.id)
        : false
    }));
    
    res.json({
      following: formattedFollowing,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('팔로잉 목록 조회 오류:', error);
    res.status(500).json({ message: '팔로잉 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

export default router;