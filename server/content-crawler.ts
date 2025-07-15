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
}

export const contentCrawler = new ContentCrawler();