import { JSDOM } from 'jsdom';

interface CrawledContent {
  title: string;
  content: string;
  summary: string;
  tags: string[];
  category: string;
  sourceUrl: string;
  publishedAt: string;
  author?: string;
  thumbnailUrl?: string;
}

export class ContentCrawler {
  
  // 언론사 페이지에서 반려견 관련 기사 URL들 추출
  async extractPetArticleUrls(journalistPageUrl: string): Promise<string[]> {
    try {
      const response = await fetch(journalistPageUrl);
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // 기사 링크들 추출
      const articleLinks = Array.from(document.querySelectorAll('a[href*="/article/"]'))
        .map(link => link.getAttribute('href'))
        .filter(href => href && href.includes('n.news.naver.com'))
        .map(href => href!.startsWith('http') ? href : `https://n.news.naver.com${href}`);

      console.log(`[언론사 페이지] 총 ${articleLinks.length}개 기사 링크 발견`);

      // 각 기사 제목을 확인하여 반려견 관련 기사만 필터링
      const petArticleUrls: string[] = [];
      
      for (const articleUrl of articleLinks) {
        try {
          const articleResponse = await fetch(articleUrl);
          const articleHtml = await articleResponse.text();
          const articleDom = new JSDOM(articleHtml);
          const articleDoc = articleDom.window.document;
          
          const titleElement = articleDoc.querySelector('h2.media_end_head_headline') || 
                              articleDoc.querySelector('.news_headline') ||
                              articleDoc.querySelector('h1') ||
                              articleDoc.querySelector('title');
          const title = titleElement?.textContent?.trim() || '';
          
          // 반려견 관련 키워드 체크
          if (this.isPetRelatedContent(title)) {
            petArticleUrls.push(articleUrl);
            console.log(`[반려견 기사 발견] ${title}`);
          }
          
          // 요청 간격 조절 (1초 대기)
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`기사 확인 실패: ${articleUrl}`, error);
        }
      }

      console.log(`[언론사 페이지] 총 ${petArticleUrls.length}개 반려견 관련 기사 발견`);
      return petArticleUrls;
      
    } catch (error) {
      console.error('언론사 페이지 크롤링 오류:', error);
      return [];
    }
  }

  // 반려견 관련 콘텐츠 판별
  private isPetRelatedContent(text: string): boolean {
    const petKeywords = [
      '반려견', '반려동물', '강아지', '개', '펫', '애완동물',
      '댕댕이', '댕냥이', '반려', '펫푸드', '사료',
      '훈련', '교육', '훈련사', '수의사', '동물병원',
      '비글', '골든리트리버', '말티즈', '포메라니안',
      '산책', '미용', '그루밍', '목욕', '간식',
      '입양', '분양', '보호소', '유기견', '구조',
      '캠핑', '여행', '호텔', '동반', '펜션'
    ];

    return petKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // 네이버 미디어 기사 크롤링
  async crawlNaverMedia(url: string): Promise<CrawledContent | null> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // 기사 제목
      const titleElement = document.querySelector('h2.media_end_head_headline') || 
                          document.querySelector('.news_headline') ||
                          document.querySelector('h1') ||
                          document.querySelector('title');
      const title = titleElement?.textContent?.trim() || '제목 없음';

      // 기사 내용
      const contentElement = document.querySelector('#dic_area') ||
                            document.querySelector('.news_article') ||
                            document.querySelector('.article_body');
      const content = contentElement?.textContent?.trim() || '';

      // 기사 요약 (첫 200자)
      const summary = content.substring(0, 200) + (content.length > 200 ? '...' : '');

      // 발행일
      const dateElement = document.querySelector('.media_end_head_info_datestamp_time') ||
                         document.querySelector('.date') ||
                         document.querySelector('time');
      const publishedAt = dateElement?.textContent?.trim() || new Date().toISOString();

      // 작성자
      const authorElement = document.querySelector('.media_end_head_journalist_name') ||
                           document.querySelector('.author') ||
                           document.querySelector('.byline');
      const author = authorElement?.textContent?.trim();

      // 썸네일 이미지
      const imageElement = document.querySelector('.end_photo_org img') ||
                          document.querySelector('.news_img img') ||
                          document.querySelector('img[src*="jpg"], img[src*="jpeg"], img[src*="png"]');
      const thumbnailUrl = imageElement?.getAttribute('src');

      // 반려견 관련 키워드 감지 및 카테고리 분류
      const petKeywords = this.extractPetKeywords(title + ' ' + content);
      const category = this.categorizePetContent(title + ' ' + content);

      return {
        title,
        content,
        summary,
        tags: petKeywords,
        category,
        sourceUrl: url,
        publishedAt,
        author,
        thumbnailUrl: thumbnailUrl || undefined
      };

    } catch (error) {
      console.error('크롤링 오류:', error);
      return null;
    }
  }

  // 반려견 관련 키워드 추출
  private extractPetKeywords(text: string): string[] {
    const keywords = [
      '반려견', '반려동물', '강아지', '개', '펫', '애완동물',
      '훈련', '교육', '훈련사', '트레이너', '사회화',
      '건강', '질병', '예방접종', '수의사', '동물병원',
      '행동', '문제행동', '짖음', '공격성', '분리불안',
      '산책', '운동', '놀이', '장난감', '간식',
      '입양', '분양', '보호소', '유기견', '구조',
      '품종', '골든리트리버', '말티즈', '포메라니안', '리트리버',
      '사료', '영양', '먹이', '급식', '식단',
      '미용', '목욕', '그루밍', '털', '브러싱',
      '여행', '펜션', '호텔', '동반', '이동',
      '보험', '법률', '규정', '등록', '인식표'
    ];

    const foundKeywords = keywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );

    return foundKeywords.slice(0, 10); // 최대 10개 키워드
  }

  // 반려견 관련 카테고리 분류
  private categorizePetContent(text: string): string {
    const categories = {
      '건강정보': ['건강', '질병', '예방접종', '수의사', '동물병원', '치료', '의료', '진료'],
      '훈련교육': ['훈련', '교육', '훈련사', '트레이너', '사회화', '행동교정', '복종훈련'],
      '행동분석': ['행동', '문제행동', '짖음', '공격성', '분리불안', '스트레스', '심리'],
      '생활정보': ['산책', '운동', '놀이', '장난감', '간식', '사료', '영양', '급식'],
      '미용관리': ['미용', '목욕', '그루밍', '털', '브러싱', '관리', '케어'],
      '법률정보': ['법률', '규정', '등록', '인식표', '보험', '책임', '의무'],
      '여행정보': ['여행', '펜션', '호텔', '동반', '이동', '캠핑', '휴가'],
      '입양분양': ['입양', '분양', '보호소', '유기견', '구조', '봉사', '후원'],
      '품종정보': ['품종', '골든리트리버', '말티즈', '포메라니안', '리트리버', '특성'],
      '일반정보': ['반려견', '반려동물', '강아지', '개', '펫', '애완동물']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()))) {
        return category;
      }
    }

    return '일반정보';
  }

  // 여러 URL 일괄 크롤링
  async crawlMultipleUrls(urls: string[]): Promise<CrawledContent[]> {
    const results: CrawledContent[] = [];
    
    for (const url of urls) {
      const content = await this.crawlNaverMedia(url);
      if (content) {
        results.push(content);
      }
      // 요청 간 딜레이 (서버 부하 방지)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }

  // 크롤링된 콘텐츠를 커뮤니티에 등록
  async postToCommunity(content: CrawledContent, storage: any): Promise<any> {
    // social.ts의 posts 배열에 직접 추가하기 위해 전역 변수 사용
    const posts = (global as any).socialPosts;
    const getNextPostId = (global as any).getNextPostId;
    
    if (!posts || !getNextPostId) {
      console.error('[커뮤니티 등록] 전역 posts 배열이 초기화되지 않았습니다.');
      return null;
    }
    
    const post = {
      id: getNextPostId(),
      title: content.title,
      content: content.summary,
      tag: content.category,
      category: content.category,
      authorId: 1,
      author: { id: 1, name: 'TALEZ 관리자' },
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      hidden: false,
      linkInfo: {
        url: content.sourceUrl,
        title: content.title,
        description: content.summary,
        image: content.thumbnailUrl
      }
    };

    posts.push(post);
    console.log(`[커뮤니티 등록] 게시글 추가 완료: ${post.id} - ${post.title}`);
    
    return post;
  }
}

export const contentCrawler = new ContentCrawler();