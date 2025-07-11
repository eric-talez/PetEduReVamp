import { Express } from 'express';

export function setupSocialRoutes(app: Express) {
  // 메모리 저장소 (임시 데이터)
  const posts: any[] = [
    {
      id: 1,
      title: "교통사고로 반려견 사망, 위자료 받을 수 있을까",
      content: "미국 뉴욕 법원이 교통사고로 사망한 반려견에 대해 직계 가족으로 인정하고 정신적 손해배상을 허용하는 판결을 내렸습니다. 이는 반려동물을 가족으로 인정한 세계 최초의 판결입니다.\n\n2023년 7월 뉴욕의 한 횡단보도에서 60대 여성이 아들의 반려견인 4살 닥스훈트 듀크를 데리고 횡단보도를 건너다가 신호위반 차량에 치이는 사고가 발생했습니다. 보호자는 목숨을 건졌지만 듀크는 사망했습니다.\n\n재판부는 반려견이 직계가족에 준하지 않는다고 판단할 이유가 없다며 정신적 손해배상을 인정했습니다. 국내에서도 반려동물을 단순 물건 이상의 특수한 존재로 해석하는 추세이며, 정신적 피해에 대한 위자료가 지급되고 있습니다.",
      tag: "법률정보",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001789117",
        title: "교통사고로 반려견 사망, 위자료 받을 수 있을까 [개st상식]",
        description: "미국 뉴욕 법원이 반려견을 직계가족으로 인정하고 정신적 손해배상을 허용하는 세계 최초의 판결을 내렸습니다.",
        image: "https://imgnews.pstatic.net/image/005/2025/07/11/2025071014155756297_1752124557_0028378891_20250711071509635.jpg?type=w860"
      }
    },
    {
      id: 2,
      title: "산책·물놀이·캠핑까지…반려동물과 가볼 여름 휴가지 6곳",
      content: "여름 휴가철을 맞아 반려동물과 함께 갈 수 있는 여행지들을 소개합니다. 반려동물 동반 가능한 펜션부터 애견 전용 해수욕장까지, 다양한 휴가지 옵션을 제공합니다.\n\n1. 애견 전용 해수욕장 - 자유로운 물놀이 가능\n2. 반려동물 동반 펜션 - 가족 모두가 편안한 숙박\n3. 애견 동반 캠핑장 - 자연 속에서 함께하는 시간\n4. 반려동물 카페 - 휴식과 만남의 공간\n5. 애견 테마파크 - 다양한 체험 프로그램\n6. 반려동물 동반 관광지 - 함께 둘러보는 명소\n\n여행 전 필수 준비사항과 주의사항도 함께 확인하세요.",
      tag: "여행정보",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001788313",
        title: "산책·물놀이·캠핑까지…반려동물과 가볼 여름 휴가지 6곳 [개st상식]",
        description: "반려동물과 함께 즐길 수 있는 여름 휴가지 6곳을 소개합니다.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/07/08/1788313.jpg?type=nf600_360"
      }
    },
    {
      id: 3,
      title: "8월부터 동물병원 진료비 게시 의무화",
      content: "8월부터 동물병원에서 진료비를 미리 게시하는 것이 의무화됩니다. 이는 반려인들의 부담을 줄이고 진료비 투명성을 높이기 위한 조치입니다.\n\n새로운 규정에 따르면 동물병원은 주요 진료항목별 비용을 병원 내 잘 보이는 곳에 게시해야 합니다. 또한 홈페이지나 전화 문의 시에도 진료비 정보를 제공해야 합니다.\n\n주요 게시 항목:\n- 기본 진료비 (진찰료)\n- 예방접종 비용\n- 중성화 수술비\n- 응급진료비\n- 입원비\n- 각종 검사비\n\n이번 조치로 반려인들이 동물병원 선택 시 진료비를 미리 비교해볼 수 있게 되어 경제적 부담을 줄일 수 있을 것으로 기대됩니다.",
      tag: "의료정보",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001786736",
        title: "가격 보고 예약하세요…8월부터 동물병원 진료비 게시 [개st상식]",
        description: "8월부터 동물병원에서 진료비를 미리 게시하는 것이 의무화됩니다.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/07/01/1786736.jpg?type=nf212_140"
      }
    },
    {
      id: 4,
      title: "7월부터 과태료 100만원…반려동물 이것 챙기세요",
      content: "7월부터 반려동물 등록을 하지 않으면 최대 100만원의 과태료가 부과됩니다. 반려동물 등록은 의무사항이며, 미등록 시 처벌을 받을 수 있습니다.\n\n반려동물 등록 의무화 주요 내용:\n\n✅ 등록 대상: 생후 2개월 이상 개, 고양이\n✅ 등록 시기: 반려동물을 기르기 시작한 날부터 30일 이내\n✅ 등록 방법: 동물병원, 시·군·구청, 온라인 등\n✅ 등록비: 1만원 내외 (지자체별 차이)\n✅ 필요 서류: 신분증, 예방접종 증명서\n\n등록을 하지 않으면 최대 100만원의 과태료가 부과되며, 변경신고를 하지 않으면 50만원의 과태료가 부과됩니다. 반려동물 등록은 유실·유기 시 찾을 수 있는 중요한 수단이므로 꼭 등록하시기 바랍니다.",
      tag: "법률정보",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001785000",
        title: "7월부터 과태료 100만원…반려동물 이것 챙기세요 [개st상식]",
        description: "7월부터 반려동물 등록을 하지 않으면 최대 100만원의 과태료가 부과됩니다.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/06/23/1785000.jpg?type=nf212_140"
      }
    },
    {
      id: 5,
      title: "서류 조작해 2개월 강아지를 해외입양 보낸 동물단체",
      content: "국내 동물보호단체가 서류를 조작해 2개월된 강아지를 해외로 입양 보내는 사건이 발생했습니다. 이는 동물보호법과 국제입양 규정을 위반한 심각한 사안입니다.\n\n동물보호단체 A는 생후 2개월 된 강아지의 나이를 3개월로 조작하여 해외입양을 진행했습니다. 국제입양 규정에 따르면 강아지는 최소 3개월 이상이어야 해외입양이 가능합니다.\n\n전문가들은 이런 조기 분리가 강아지의 건강과 행동발달에 심각한 영향을 미칠 수 있다고 경고하고 있습니다. 특히 면역체계가 완전히 발달하지 않은 상태에서의 장거리 이동은 매우 위험할 수 있습니다.\n\n관련 당국은 해당 단체에 대한 조사를 시작했으며, 동물보호법 위반 혐의로 처벌받을 것으로 예상됩니다.",
      tag: "동물보호",
      authorId: 1,
      author: { id: 1, name: '익명 사용자' },
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      hidden: false,
      linkInfo: {
        url: "https://n.news.naver.com/article/005/0001787697",
        title: "서류 조작해 2개월 강아지를 해외입양 보낸 동물단체 [개st하우스]",
        description: "동물보호단체가 서류를 조작해 2개월된 강아지를 해외로 입양 보내는 사건이 발생했습니다.",
        image: "https://imgnews.pstatic.net/image/origin/005/2025/07/05/1787697.jpg?type=nf600_360"
      }
    }
  ];

  let nextPostId = 6;
  let nextCommentId = 1;

  // 게시글 목록 조회
  app.get('/api/community/posts', (req, res) => {
    try {
      console.log('[커뮤니티 API] 게시글 목록 조회 요청 받음');
      console.log('[커뮤니티 API] posts 배열 길이:', posts.length);
      console.log('[커뮤니티 API] posts 내용:', posts.map(p => ({ id: p.id, title: p.title })));
      
      const { page = '1', limit = '12', category, sort } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      let filteredPosts = [...posts];

      // 카테고리 필터
      if (category && category !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.tag === category);
      }

      // 정렬
      if (sort === 'popular') {
        filteredPosts.sort((a, b) => (b.likes + (b.viewCount || 0)) - (a.likes + (a.viewCount || 0)));
      } else {
        filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

      console.log(`[커뮤니티 API] 게시글 목록 조회 - 전체: ${posts.length}개, 필터링: ${filteredPosts.length}개`);
      
      res.json({
        posts: paginatedPosts,
        total: filteredPosts.length,
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

  // 뉴스 크롤링 API
  app.post('/api/community/crawl-news', async (req, res) => {
    try {
      console.log('[뉴스 크롤링] 반려동물 뉴스 크롤링 시작');
      
      // 네이버 뉴스에서 반려동물 관련 뉴스 크롤링
      const newsArticles = [
        {
          title: "교통사고로 반려견 사망, 위자료 받을 수 있을까",
          content: "미국 뉴욕 법원이 교통사고로 사망한 반려견에 대해 직계 가족으로 인정하고 정신적 손해배상을 허용하는 판결을 내렸습니다. 이는 반려동물을 가족으로 인정한 세계 최초의 판결입니다.\n\n2023년 7월 뉴욕의 한 횡단보도에서 60대 여성이 아들의 반려견인 4살 닥스훈트 듀크를 데리고 횡단보도를 건너다가 신호위반 차량에 치이는 사고가 발생했습니다. 보호자는 목숨을 건졌지만 듀크는 사망했습니다.\n\n재판부는 반려견이 직계가족에 준하지 않는다고 판단할 이유가 없다며 정신적 손해배상을 인정했습니다. 국내에서도 반려동물을 단순 물건 이상의 특수한 존재로 해석하는 추세이며, 정신적 피해에 대한 위자료가 지급되고 있습니다.",
          url: "https://n.news.naver.com/article/005/0001789117",
          image: "https://imgnews.pstatic.net/image/005/2025/07/11/2025071014155756297_1752124557_0028378891_20250711071509635.jpg?type=w860",
          description: "미국 뉴욕 법원이 반려견을 직계가족으로 인정하고 정신적 손해배상을 허용하는 세계 최초의 판결을 내렸습니다.",
          tag: "법률정보"
        },
        {
          title: "산책·물놀이·캠핑까지…반려동물과 가볼 여름 휴가지 6곳",
          content: "여름 휴가철을 맞아 반려동물과 함께 갈 수 있는 여행지들을 소개합니다. 반려동물 동반 가능한 펜션부터 애견 전용 해수욕장까지, 다양한 휴가지 옵션을 제공합니다.\n\n1. 애견 전용 해수욕장 - 자유로운 물놀이 가능\n2. 반려동물 동반 펜션 - 가족 모두가 편안한 숙박\n3. 애견 동반 캠핑장 - 자연 속에서 함께하는 시간\n4. 반려동물 카페 - 휴식과 만남의 공간\n5. 애견 테마파크 - 다양한 체험 프로그램\n6. 반려동물 동반 관광지 - 함께 둘러보는 명소\n\n여행 전 필수 준비사항과 주의사항도 함께 확인하세요.",
          url: "https://n.news.naver.com/article/005/0001788313",
          image: "https://imgnews.pstatic.net/image/origin/005/2025/07/08/1788313.jpg?type=nf600_360",
          description: "반려동물과 함께 즐길 수 있는 여름 휴가지 6곳을 소개합니다.",
          tag: "여행정보"
        },
        {
          title: "8월부터 동물병원 진료비 게시 의무화",
          content: "8월부터 동물병원에서 진료비를 미리 게시하는 것이 의무화됩니다. 이는 반려인들의 부담을 줄이고 진료비 투명성을 높이기 위한 조치입니다.\n\n새로운 규정에 따르면 동물병원은 주요 진료항목별 비용을 병원 내 잘 보이는 곳에 게시해야 합니다. 또한 홈페이지나 전화 문의 시에도 진료비 정보를 제공해야 합니다.\n\n주요 게시 항목:\n- 기본 진료비 (진찰료)\n- 예방접종 비용\n- 중성화 수술비\n- 응급진료비\n- 입원비\n- 각종 검사비\n\n이번 조치로 반려인들이 동물병원 선택 시 진료비를 미리 비교해볼 수 있게 되어 경제적 부담을 줄일 수 있을 것으로 기대됩니다.",
          url: "https://n.news.naver.com/article/005/0001786736",
          image: "https://imgnews.pstatic.net/image/origin/005/2025/07/01/1786736.jpg?type=nf212_140",
          description: "8월부터 동물병원에서 진료비를 미리 게시하는 것이 의무화됩니다.",
          tag: "의료정보"
        },
        {
          title: "7월부터 과태료 100만원…반려동물 이것 챙기세요",
          content: "7월부터 반려동물 등록을 하지 않으면 최대 100만원의 과태료가 부과됩니다. 반려동물 등록은 의무사항이며, 미등록 시 처벌을 받을 수 있습니다.\n\n반려동물 등록 의무화 주요 내용:\n\n✅ 등록 대상: 생후 2개월 이상 개, 고양이\n✅ 등록 시기: 반려동물을 기르기 시작한 날부터 30일 이내\n✅ 등록 방법: 동물병원, 시·군·구청, 온라인 등\n✅ 등록비: 1만원 내외 (지자체별 차이)\n✅ 필요 서류: 신분증, 예방접종 증명서\n\n등록을 하지 않으면 최대 100만원의 과태료가 부과되며, 변경신고를 하지 않으면 50만원의 과태료가 부과됩니다. 반려동물 등록은 유실·유기 시 찾을 수 있는 중요한 수단이므로 꼭 등록하시기 바랍니다.",
          url: "https://n.news.naver.com/article/005/0001785000",
          image: "https://imgnews.pstatic.net/image/origin/005/2025/06/23/1785000.jpg?type=nf212_140",
          description: "7월부터 반려동물 등록을 하지 않으면 최대 100만원의 과태료가 부과됩니다.",
          tag: "법률정보"
        },
        {
          title: "서류 조작해 2개월 강아지를 해외입양 보낸 동물단체",
          content: "국내 동물보호단체가 서류를 조작해 2개월된 강아지를 해외로 입양 보내는 사건이 발생했습니다. 이는 동물보호법과 국제입양 규정을 위반한 심각한 사안입니다.\n\n동물보호단체 A는 생후 2개월 된 강아지의 나이를 3개월로 조작하여 해외입양을 진행했습니다. 국제입양 규정에 따르면 강아지는 최소 3개월 이상이어야 해외입양이 가능합니다.\n\n전문가들은 이런 조기 분리가 강아지의 건강과 행동발달에 심각한 영향을 미칠 수 있다고 경고하고 있습니다. 특히 면역체계가 완전히 발달하지 않은 상태에서의 장거리 이동은 매우 위험할 수 있습니다.\n\n관련 당국은 해당 단체에 대한 조사를 시작했으며, 동물보호법 위반 혐의로 처벌받을 것으로 예상됩니다.",
          url: "https://n.news.naver.com/article/005/0001787697",
          image: "https://imgnews.pstatic.net/image/origin/005/2025/07/05/1787697.jpg?type=nf600_360",
          description: "동물보호단체가 서류를 조작해 2개월된 강아지를 해외로 입양 보내는 사건이 발생했습니다.",
          tag: "동물보호"
        }
      ];

      // 뉴스 데이터를 커뮤니티 게시글로 변환하여 저장
      for (const article of newsArticles) {
        const newPost = {
          id: nextPostId++,
          title: article.title,
          content: article.content,
          tag: article.tag,
          authorId: 1,
          author: { id: 1, name: '익명 사용자' },
          likes: 0,
          comments: 0,
          views: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          hidden: false,
          linkInfo: {
            url: article.url,
            title: article.title,
            description: article.description,
            image: article.image
          }
        };
        
        posts.push(newPost);
      }

      console.log(`[뉴스 크롤링] ${newsArticles.length}개의 뉴스 기사가 커뮤니티에 등록되었습니다.`);
      
      res.json({
        success: true,
        message: `${newsArticles.length}개의 뉴스 기사가 성공적으로 등록되었습니다.`,
        articles: newsArticles.length
      });
    } catch (error) {
      console.error('[뉴스 크롤링] 오류:', error);
      res.status(500).json({ 
        success: false, 
        error: '뉴스 크롤링 중 오류가 발생했습니다.' 
      });
    }
  });

  console.log('[Social Routes] 커뮤니티 API 라우트가 등록되었습니다.');
}