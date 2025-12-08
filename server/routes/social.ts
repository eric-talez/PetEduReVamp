import { Express } from 'express';
import { notificationService } from '../notifications/notification-service';
import { csrfProtection } from '../middleware/csrf';
import { db } from '../db';
import { posts as postsTable, users } from '../../shared/schema';
import { eq, desc, sql } from 'drizzle-orm';

export function setupSocialRoutes(app: Express) {
  // In-memory storage for comments (to be migrated to database separately)
  const commentsStore: Map<number, any[]> = new Map();
  let nextCommentId = 1;

  // Helper function to get comments for a post
  const getPostComments = (postId: number) => {
    return commentsStore.get(postId) || [];
  };

  // Helper function to set comments for a post
  const setPostComments = (postId: number, comments: any[]) => {
    commentsStore.set(postId, comments);
  };

  // 게시글 목록 조회
  app.get('/api/community/posts', async (req, res) => {
    try {
      console.log('[커뮤니티 API] 게시글 목록 조회 요청 받음');
      
      const { page = '1', limit = '12', category, sort, q: searchQuery } = req.query;
      
      console.log(`[커뮤니티 API] 요청 파라미터:`, { page, limit, category, sort, searchQuery });
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      // Build query with user join - using correct column names from actual database
      let allPosts = await db.select({
        id: postsTable.id,
        title: postsTable.title,
        content: postsTable.content,
        authorId: postsTable.authorId,
        category: postsTable.category,
        tag: postsTable.tag,
        image: postsTable.image,
        views: postsTable.views,
        likes: postsTable.likes,
        comments: postsTable.comments,
        locationName: postsTable.locationName,
        locationAddress: postsTable.locationAddress,
        locationLatitude: postsTable.locationLatitude,
        locationLongitude: postsTable.locationLongitude,
        isDeleted: postsTable.isDeleted,
        createdAt: postsTable.createdAt,
        updatedAt: postsTable.updatedAt,
        authorName: users.name,
        authorUsername: users.username,
        authorAvatar: users.avatar,
      })
      .from(postsTable)
      .leftJoin(users, eq(postsTable.authorId, users.id))
      .where(eq(postsTable.isDeleted, false))
      .orderBy(desc(postsTable.createdAt));

      let filteredPosts = [...allPosts];

      // Search query filter
      if (searchQuery && typeof searchQuery === 'string') {
        let decodedQuery = searchQuery;
        try {
          decodedQuery = decodeURIComponent(searchQuery);
        } catch (e) {
          decodedQuery = searchQuery;
        }
        const queryLower = decodedQuery.toLowerCase();
        console.log(`[커뮤니티 API] 검색 쿼리 "${searchQuery}" 받음`);
        console.log(`[커뮤니티 API] 디코딩된 검색 쿼리 "${decodedQuery}" 처리`);
        
        filteredPosts = filteredPosts.filter(post => {
          const titleMatch = post.title?.toLowerCase().includes(queryLower);
          const contentMatch = post.content?.toLowerCase().includes(queryLower);
          const categoryMatch = post.category?.toLowerCase().includes(queryLower);
          const tagMatch = post.tag?.toLowerCase().includes(queryLower);
          const authorMatch = post.authorName?.toLowerCase().includes(queryLower);
          
          return titleMatch || contentMatch || categoryMatch || tagMatch || authorMatch;
        });
        
        console.log(`[커뮤니티 API] 검색 쿼리 "${searchQuery}" 적용 - 결과: ${filteredPosts.length}개`);
      }

      // Category filter
      if (category && category !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === category || post.tag === category);
      }

      // Sorting
      if (sort === 'popular') {
        filteredPosts.sort((a, b) => ((b.likes || 0) + (b.views || 0)) - ((a.likes || 0) + (a.views || 0)));
      } else {
        filteredPosts.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      }

      // Pagination
      const paginatedPosts = filteredPosts.slice(offset, offset + limitNum);

      // Transform posts for response
      const transformedPosts = paginatedPosts.map(post => {
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          authorId: post.authorId,
          tag: post.tag || post.category || '',
          category: post.category,
          image: post.image,
          views: post.views || 0,
          viewCount: post.views || 0,
          likes: post.likes || 0,
          comments: getPostComments(post.id).length,
          commentsCount: post.comments || 0,
          locationName: post.locationName,
          locationAddress: post.locationAddress,
          locationLatitude: post.locationLatitude,
          locationLongitude: post.locationLongitude,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          hidden: post.isDeleted,
          author: {
            id: post.authorId,
            name: post.authorName || '익명 사용자',
            username: post.authorUsername,
            avatar: post.authorAvatar,
          },
        };
      });

      console.log(`[커뮤니티 API] 게시글 목록 조회 - 전체: ${allPosts.length}개, 필터링: ${filteredPosts.length}개`);
      
      res.json({
        posts: transformedPosts,
        total: filteredPosts.length,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(filteredPosts.length / limitNum),
          totalItems: filteredPosts.length,
          hasNext: offset + limitNum < filteredPosts.length,
          hasPrev: pageNum > 1
        }
      });
    } catch (error) {
      console.error('게시글 목록 조회 오류:', error);
      res.status(500).json({ error: '게시글을 불러오는데 실패했습니다.' });
    }
  });

  // 게시글 상세 조회
  app.get('/api/community/posts/:id', async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      
      const [post] = await db.select({
        id: postsTable.id,
        title: postsTable.title,
        content: postsTable.content,
        authorId: postsTable.authorId,
        category: postsTable.category,
        tag: postsTable.tag,
        image: postsTable.image,
        views: postsTable.views,
        likes: postsTable.likes,
        comments: postsTable.comments,
        locationName: postsTable.locationName,
        locationAddress: postsTable.locationAddress,
        locationLatitude: postsTable.locationLatitude,
        locationLongitude: postsTable.locationLongitude,
        isDeleted: postsTable.isDeleted,
        createdAt: postsTable.createdAt,
        updatedAt: postsTable.updatedAt,
        authorName: users.name,
        authorUsername: users.username,
        authorAvatar: users.avatar,
      })
      .from(postsTable)
      .leftJoin(users, eq(postsTable.authorId, users.id))
      .where(eq(postsTable.id, postId));

      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      // Increment view count
      await db.update(postsTable)
        .set({ views: sql`${postsTable.views} + 1` })
        .where(eq(postsTable.id, postId));

      const transformedPost = {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        tag: post.tag || post.category || '',
        category: post.category,
        image: post.image,
        views: (post.views || 0) + 1,
        viewCount: (post.views || 0) + 1,
        likes: post.likes || 0,
        comments: getPostComments(post.id),
        commentsCount: post.comments || 0,
        locationName: post.locationName,
        locationAddress: post.locationAddress,
        locationLatitude: post.locationLatitude,
        locationLongitude: post.locationLongitude,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        hidden: post.isDeleted,
        author: {
          id: post.authorId,
          name: post.authorName || '익명 사용자',
          username: post.authorUsername,
          avatar: post.authorAvatar,
        },
      };

      res.json({ post: transformedPost });
    } catch (error) {
      console.error('게시글 상세 조회 오류:', error);
      res.status(500).json({ error: '게시글을 불러오는데 실패했습니다.' });
    }
  });

  // 게시글 작성
  app.post('/api/community/posts', csrfProtection, async (req, res) => {
    try {
      const { 
        title, content, category = '일반', tag, image,
        locationName, locationAddress, locationLatitude, locationLongitude 
      } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: '제목과 내용을 입력해주세요.' });
      }

      // Get authorId from session or default to null
      const authorId = req.session?.user?.id || null;

      const [newPost] = await db.insert(postsTable).values({
        title,
        content,
        category: category,
        tag: tag || category,
        image: image || null,
        authorId,
        views: 0,
        likes: 0,
        comments: 0,
        locationName: locationName || null,
        locationAddress: locationAddress || null,
        locationLatitude: locationLatitude || null,
        locationLongitude: locationLongitude || null,
        isDeleted: false,
      }).returning();

      // Fetch author info
      let authorInfo = { id: authorId, name: '반려인', username: 'user', avatar: null };
      if (authorId) {
        const [author] = await db.select({
          id: users.id,
          name: users.name,
          username: users.username,
          avatar: users.avatar,
        }).from(users).where(eq(users.id, authorId));
        if (author) {
          authorInfo = author;
        }
      }

      const transformedPost = {
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        authorId: newPost.authorId,
        tag: newPost.tag || newPost.category || '',
        category: newPost.category,
        image: newPost.image,
        views: 0,
        viewCount: 0,
        likes: 0,
        comments: [],
        createdAt: newPost.createdAt,
        updatedAt: newPost.updatedAt,
        hidden: false,
        author: authorInfo,
        locationName: newPost.locationName,
        locationAddress: newPost.locationAddress,
        locationLatitude: newPost.locationLatitude,
        locationLongitude: newPost.locationLongitude,
      };

      res.status(201).json({ 
        message: '게시글이 작성되었습니다.',
        post: transformedPost 
      });
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      res.status(500).json({ error: '게시글 작성에 실패했습니다.' });
    }
  });

  // 게시글 삭제
  app.delete('/api/community/posts/:id', csrfProtection, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      
      const [post] = await db.select().from(postsTable).where(eq(postsTable.id, postId));

      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      await db.delete(postsTable).where(eq(postsTable.id, postId));
      
      // Also remove comments from memory
      commentsStore.delete(postId);

      res.json({ message: '게시글이 삭제되었습니다.' });
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      res.status(500).json({ error: '게시글 삭제에 실패했습니다.' });
    }
  });

  // 게시글 좋아요 토글
  app.post('/api/community/posts/:id/like', csrfProtection, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      
      const [post] = await db.select().from(postsTable).where(eq(postsTable.id, postId));

      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      // Increment likes
      const [updatedPost] = await db.update(postsTable)
        .set({ likes: sql`${postsTable.likes} + 1` })
        .where(eq(postsTable.id, postId))
        .returning();

      // Send notification to post author
      if (post.authorId && post.authorId !== req.session?.user?.id) {
        try {
          await notificationService.sendNotification({
            userId: post.authorId,
            type: 'system',
            title: '새로운 좋아요',
            message: `회원님의 게시글 "${post.title?.substring(0, 30)}${(post.title?.length || 0) > 30 ? '...' : ''}"에 좋아요가 추가되었습니다.`,
            actionUrl: `/community/posts/${post.id}`,
            data: { postId: post.id }
          });
        } catch (notifyError) {
          console.error('[좋아요] 알림 발송 실패:', notifyError);
        }
      }

      res.json({ 
        message: '좋아요가 추가되었습니다.',
        likes: updatedPost.likes,
        postId: post.id
      });
    } catch (error) {
      console.error('좋아요 처리 오류:', error);
      res.status(500).json({ error: '좋아요 처리에 실패했습니다.' });
    }
  });

  // 게시글 수정
  app.put('/api/community/posts/:id', csrfProtection, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { title, content, category, tag, image } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: '제목과 내용을 입력해주세요.' });
      }

      const [existingPost] = await db.select().from(postsTable).where(eq(postsTable.id, postId));
      
      if (!existingPost) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      const [updatedPost] = await db.update(postsTable)
        .set({
          title,
          content,
          category: category || existingPost.category,
          tag: tag || category || existingPost.tag,
          image: image !== undefined ? image : existingPost.image,
          updatedAt: new Date(),
        })
        .where(eq(postsTable.id, postId))
        .returning();

      // Fetch author info
      let authorInfo = { id: updatedPost.authorId, name: '익명 사용자', username: null, avatar: null };
      if (updatedPost.authorId) {
        const [author] = await db.select({
          id: users.id,
          name: users.name,
          username: users.username,
          avatar: users.avatar,
        }).from(users).where(eq(users.id, updatedPost.authorId));
        if (author) {
          authorInfo = author;
        }
      }

      const transformedPost = {
        id: updatedPost.id,
        title: updatedPost.title,
        content: updatedPost.content,
        authorId: updatedPost.authorId,
        tag: updatedPost.tag || updatedPost.category || '',
        category: updatedPost.category,
        image: updatedPost.image,
        views: updatedPost.views || 0,
        likes: updatedPost.likes || 0,
        comments: getPostComments(updatedPost.id),
        createdAt: updatedPost.createdAt,
        updatedAt: updatedPost.updatedAt,
        hidden: updatedPost.isDeleted,
        author: authorInfo,
      };

      res.json({ 
        message: '게시글이 수정되었습니다.',
        post: transformedPost
      });
    } catch (error) {
      console.error('게시글 수정 오류:', error);
      res.status(500).json({ error: '게시글 수정에 실패했습니다.' });
    }
  });

  // 댓글 목록 조회 (in-memory)
  app.get('/api/community/posts/:id/comments', async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      
      // Check if post exists
      const [post] = await db.select({ id: postsTable.id }).from(postsTable).where(eq(postsTable.id, postId));

      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      const comments = getPostComments(postId);

      res.json({ 
        comments: comments,
        total: comments.length
      });
    } catch (error) {
      console.error('댓글 조회 오류:', error);
      res.status(500).json({ error: '댓글을 불러오는데 실패했습니다.' });
    }
  });

  // 댓글 작성 (in-memory)
  app.post('/api/community/posts/:id/comments', csrfProtection, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { content, parentId } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
      }

      if (content.length > 1000) {
        return res.status(400).json({ error: '댓글은 1000자 이내로 작성해주세요.' });
      }

      // Check if post exists
      const [post] = await db.select().from(postsTable).where(eq(postsTable.id, postId));
      
      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      const newComment = {
        id: nextCommentId++,
        postId,
        content: content.trim(),
        authorId: req.session?.user?.id || 1,
        author: { 
          id: req.session?.user?.id || 1, 
          username: req.session?.user?.username || 'user', 
          name: req.session?.user?.name || '반려인', 
          avatar: null 
        },
        parentId: parentId || null,
        likes: 0,
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const comments = getPostComments(postId);

      if (parentId) {
        const parentComment = comments.find(c => c.id === parentId);
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          parentComment.replies.push(newComment);
        } else {
          return res.status(404).json({ error: '상위 댓글을 찾을 수 없습니다.' });
        }
      } else {
        comments.push(newComment);
      }

      setPostComments(postId, comments);

      // Update comments count in database
      await db.update(postsTable)
        .set({ comments: sql`${postsTable.comments} + 1` })
        .where(eq(postsTable.id, postId));

      // Send notification to post author
      if (post.authorId && post.authorId !== newComment.authorId) {
        try {
          await notificationService.sendNotification({
            userId: post.authorId,
            type: 'system',
            title: '새로운 댓글',
            message: `회원님의 게시글 "${post.title?.substring(0, 30)}${(post.title?.length || 0) > 30 ? '...' : ''}"에 새 댓글이 달렸습니다.`,
            actionUrl: `/community/posts/${post.id}`,
            data: { postId: post.id, commentId: newComment.id }
          });
        } catch (notifyError) {
          console.error('[댓글] 알림 발송 실패:', notifyError);
        }
      }

      res.status(201).json({ 
        message: parentId ? '대댓글이 작성되었습니다.' : '댓글이 작성되었습니다.',
        comment: newComment 
      });
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      res.status(500).json({ error: '댓글 작성에 실패했습니다.' });
    }
  });

  // 댓글 삭제 (in-memory)
  app.delete('/api/community/posts/:postId/comments/:commentId', csrfProtection, async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const commentId = parseInt(req.params.commentId);

      // Check if post exists
      const [post] = await db.select({ id: postsTable.id }).from(postsTable).where(eq(postsTable.id, postId));
      
      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      const comments = getPostComments(postId);

      if (comments.length === 0) {
        return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
      }

      // Find and delete comment
      const commentIndex = comments.findIndex(c => c.id === commentId);
      if (commentIndex !== -1) {
        comments.splice(commentIndex, 1);
        setPostComments(postId, comments);
        
        // Update comments count
        await db.update(postsTable)
          .set({ comments: sql`GREATEST(${postsTable.comments} - 1, 0)` })
          .where(eq(postsTable.id, postId));
          
        return res.json({ message: '댓글이 삭제되었습니다.' });
      }

      // Find and delete reply
      for (const comment of comments) {
        if (comment.replies) {
          const replyIndex = comment.replies.findIndex((r: any) => r.id === commentId);
          if (replyIndex !== -1) {
            comment.replies.splice(replyIndex, 1);
            setPostComments(postId, comments);
            
            await db.update(postsTable)
              .set({ comments: sql`GREATEST(${postsTable.comments} - 1, 0)` })
              .where(eq(postsTable.id, postId));
              
            return res.json({ message: '답글이 삭제되었습니다.' });
          }
        }
      }

      return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
      res.status(500).json({ error: '댓글 삭제에 실패했습니다.' });
    }
  });

  // 댓글 좋아요 (in-memory)
  app.post('/api/community/posts/:postId/comments/:commentId/like', csrfProtection, async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const commentId = parseInt(req.params.commentId);

      const [post] = await db.select({ id: postsTable.id }).from(postsTable).where(eq(postsTable.id, postId));
      
      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      const comments = getPostComments(postId);

      // Find comment
      const comment = comments.find(c => c.id === commentId);
      if (comment) {
        comment.likes = (comment.likes || 0) + 1;
        setPostComments(postId, comments);
        return res.json({ message: '댓글에 좋아요가 추가되었습니다.', likes: comment.likes });
      }

      // Find reply
      for (const c of comments) {
        if (c.replies) {
          const reply = c.replies.find((r: any) => r.id === commentId);
          if (reply) {
            reply.likes = (reply.likes || 0) + 1;
            setPostComments(postId, comments);
            return res.json({ message: '답글에 좋아요가 추가되었습니다.', likes: reply.likes });
          }
        }
      }

      return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    } catch (error) {
      console.error('댓글 좋아요 오류:', error);
      res.status(500).json({ error: '좋아요 처리에 실패했습니다.' });
    }
  });

  console.log('[Social Routes] 커뮤니티 소셜 라우트가 등록되었습니다.');
}
