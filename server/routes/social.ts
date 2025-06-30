import { Express } from 'express';

export function setupSocialRoutes(app: Express) {
  // 메모리 저장소 (임시 데이터)
  const posts: any[] = [
    {
      id: 1,
      title: "강아지 기본 훈련 방법",
      content: "앉아, 기다려, 이리와 같은 기본 명령어를 가르치는 효과적인 방법을 소개합니다.",
      tag: "훈련팁",
      authorId: 1,
      author: { id: 1, username: 'trainer1', name: '김민수 훈련사', avatar: null },
      likes: 12,
      comments: [],
      viewCount: 156,
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
      category: "훈련팁"
    },
    {
      id: 2,
      title: "반려견 건강 관리 팁",
      content: "일상에서 실천할 수 있는 반려견 건강 관리 방법들을 정리했습니다.",
      tag: "건강관리",
      authorId: 2,
      author: { id: 2, username: 'petowner1', name: '박지혜', avatar: null },
      likes: 8,
      comments: [],
      viewCount: 89,
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000),
      category: "건강관리"
    }
  ];

  let nextPostId = 3;
  let nextCommentId = 1;

  // 게시글 목록 조회
  app.get('/api/community/posts', (req, res) => {
    try {
      const { page = '1', limit = '12', category, sort } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      let filteredPosts = [...posts];

      // 카테고리 필터
      if (category && category !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === category);
      }

      // 정렬
      if (sort === 'popular') {
        filteredPosts.sort((a, b) => (b.likes + b.viewCount) - (a.likes + a.viewCount));
      } else {
        filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

      res.json({
        posts: paginatedPosts,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(filteredPosts.length / limitNum),
          totalItems: filteredPosts.length,
          hasNext: endIndex < filteredPosts.length,
          hasPrev: pageNum > 1
        }
      });
    } catch (error) {
      console.error('게시글 목록 조회 오류:', error);
      res.status(500).json({ error: '게시글을 불러오는데 실패했습니다.' });
    }
  });

  // 게시글 상세 조회
  app.get('/api/community/posts/:id', (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = posts.find(p => p.id === postId);

      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      // 조회수 증가
      post.viewCount = (post.viewCount || 0) + 1;

      res.json({ post });
    } catch (error) {
      console.error('게시글 상세 조회 오류:', error);
      res.status(500).json({ error: '게시글을 불러오는데 실패했습니다.' });
    }
  });

  // 게시글 작성
  app.post('/api/community/posts', (req, res) => {
    try {
      const { title, content, category = '일반', tag } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: '제목과 내용을 입력해주세요.' });
      }

      const newPost = {
        id: nextPostId++,
        title,
        content,
        category,
        tag: tag || '',
        authorId: 1, // 임시 사용자 ID
        author: { id: 1, username: 'user', name: '반려인', avatar: null },
        likes: 0,
        comments: [],
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      posts.unshift(newPost);

      res.status(201).json({ 
        message: '게시글이 작성되었습니다.',
        post: newPost 
      });
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      res.status(500).json({ error: '게시글 작성에 실패했습니다.' });
    }
  });

  // 게시글 삭제
  app.delete('/api/community/posts/:id', (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const postIndex = posts.findIndex(p => p.id === postId);

      if (postIndex === -1) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      posts.splice(postIndex, 1);

      res.json({ message: '게시글이 삭제되었습니다.' });
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      res.status(500).json({ error: '게시글 삭제에 실패했습니다.' });
    }
  });

  // 게시글 좋아요 토글
  app.post('/api/community/posts/:id/like', (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = posts.find(p => p.id === postId);

      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      // 간단한 좋아요 토글 (실제로는 사용자별 좋아요 상태 관리 필요)
      post.likes = Math.max(0, (post.likes || 0) + 1);

      res.json({ 
        message: '좋아요가 추가되었습니다.',
        likes: post.likes,
        postId: post.id
      });
    } catch (error) {
      console.error('좋아요 처리 오류:', error);
      res.status(500).json({ error: '좋아요 처리에 실패했습니다.' });
    }
  });

  // 게시글 수정
  app.put('/api/community/posts/:id', (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { title, content, category, tag } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: '제목과 내용을 입력해주세요.' });
      }

      const postIndex = posts.findIndex(p => p.id === postId);
      if (postIndex === -1) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      posts[postIndex] = {
        ...posts[postIndex],
        title,
        content,
        category: category || posts[postIndex].category,
        tag: tag || posts[postIndex].tag,
        updatedAt: new Date()
      };

      res.json({ 
        message: '게시글이 수정되었습니다.',
        post: posts[postIndex]
      });
    } catch (error) {
      console.error('게시글 수정 오류:', error);
      res.status(500).json({ error: '게시글 수정에 실패했습니다.' });
    }
  });

  // 댓글 목록 조회
  app.get('/api/community/posts/:id/comments', (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = posts.find(p => p.id === postId);

      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      res.json({ 
        comments: post.comments || [],
        total: (post.comments || []).length
      });
    } catch (error) {
      console.error('댓글 조회 오류:', error);
      res.status(500).json({ error: '댓글을 불러오는데 실패했습니다.' });
    }
  });

  // 댓글 작성
  app.post('/api/community/posts/:id/comments', (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { content, parentId } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
      }

      if (content.length > 1000) {
        return res.status(400).json({ error: '댓글은 1000자 이내로 작성해주세요.' });
      }

      const post = posts.find(p => p.id === postId);
      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      const newComment = {
        id: nextCommentId++,
        postId,
        content: content.trim(),
        authorId: 1,
        author: { id: 1, username: 'user', name: '반려인', avatar: null },
        parentId: parentId || null,
        likes: 0,
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (!post.comments) {
        post.comments = [];
      }

      // 대댓글인 경우
      if (parentId) {
        const parentComment = post.comments.find(c => c.id === parentId);
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          parentComment.replies.push(newComment);
        } else {
          return res.status(404).json({ error: '상위 댓글을 찾을 수 없습니다.' });
        }
      } else {
        post.comments.push(newComment);
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

  // 댓글 삭제
  app.delete('/api/community/posts/:postId/comments/:commentId', (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const commentId = parseInt(req.params.commentId);

      const post = posts.find(p => p.id === postId);
      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      if (!post.comments) {
        return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
      }

      // 댓글 찾기 및 삭제
      const commentIndex = post.comments.findIndex(c => c.id === commentId);
      if (commentIndex !== -1) {
        post.comments.splice(commentIndex, 1);
        return res.json({ message: '댓글이 삭제되었습니다.' });
      }

      // 대댓글 찾기 및 삭제
      for (const comment of post.comments) {
        if (comment.replies) {
          const replyIndex = comment.replies.findIndex(r => r.id === commentId);
          if (replyIndex !== -1) {
            comment.replies.splice(replyIndex, 1);
            return res.json({ message: '대댓글이 삭제되었습니다.' });
          }
        }
      }

      res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
      res.status(500).json({ error: '댓글 삭제에 실패했습니다.' });
    }
  });

  // 댓글 좋아요
  app.post('/api/community/posts/:postId/comments/:commentId/like', (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const commentId = parseInt(req.params.commentId);

      const post = posts.find(p => p.id === postId);
      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      // 댓글 찾기
      let targetComment = null;
      for (const comment of post.comments || []) {
        if (comment.id === commentId) {
          targetComment = comment;
          break;
        }
        // 대댓글에서도 찾기
        if (comment.replies) {
          const reply = comment.replies.find(r => r.id === commentId);
          if (reply) {
            targetComment = reply;
            break;
          }
        }
      }

      if (!targetComment) {
        return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
      }

      targetComment.likes = Math.max(0, (targetComment.likes || 0) + 1);

      res.json({ 
        message: '댓글 좋아요가 추가되었습니다.',
        likes: targetComment.likes,
        commentId: targetComment.id
      });
    } catch (error) {
      console.error('댓글 좋아요 처리 오류:', error);
      res.status(500).json({ error: '댓글 좋아요 처리에 실패했습니다.' });
    }
  });

  console.log('[Social Routes] 커뮤니티 API 라우트가 등록되었습니다.');
}