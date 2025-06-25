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

  // 댓글 작성
  app.post('/api/community/posts/:id/comments', (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
      }

      const post = posts.find(p => p.id === postId);
      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      const newComment = {
        id: nextCommentId++,
        postId,
        content,
        authorId: 1,
        author: { id: 1, username: 'user', name: '반려인', avatar: null },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (!post.comments) {
        post.comments = [];
      }
      post.comments.push(newComment);

      res.status(201).json({ 
        message: '댓글이 작성되었습니다.',
        comment: newComment 
      });
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      res.status(500).json({ error: '댓글 작성에 실패했습니다.' });
    }
  });

  console.log('[Social Routes] 커뮤니티 API 라우트가 등록되었습니다.');
}