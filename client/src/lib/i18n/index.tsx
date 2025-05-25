import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 지원하는 언어 목록
export type SupportedLanguage = 'ko' | 'en' | 'ja' | 'zh';

// 기본 언어 설정
export const DEFAULT_LANGUAGE: SupportedLanguage = 'ko';

// 언어 레이블 (언어 선택기에 표시될 이름)
export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
};

// 번역 키 타입 정의
type TranslationKey = string;

// 번역 테이블 타입 정의
type TranslationTable = Record<TranslationKey, string>;

// 다국어 컨텍스트 타입 정의
interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  isLoading: boolean;
}

// 번역 데이터를 저장할 객체
const translations: Record<SupportedLanguage, TranslationTable> = {
  ko: {},
  en: {},
  ja: {},
  zh: {},
};

// 다국어 컨텍스트 생성
export const I18nContext = createContext<I18nContextType>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (key) => key,
  isLoading: true,
});

// 다국어 Provider 컴포넌트
export function I18nProvider({ children }: { children: ReactNode }) {
  // 사용자 브라우저 언어 또는 저장된 설정에서 초기 언어 설정 가져오기
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    // 브라우저 저장소에서 언어 설정 가져오기
    const savedLanguage = localStorage.getItem('language') as SupportedLanguage;
    if (savedLanguage && Object.keys(LANGUAGE_LABELS).includes(savedLanguage)) {
      return savedLanguage;
    }

    // 브라우저 언어 감지
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
    if (Object.keys(LANGUAGE_LABELS).includes(browserLang)) {
      return browserLang;
    }

    // 기본 언어 반환
    return DEFAULT_LANGUAGE;
  });

  const [isLoading, setIsLoading] = useState(true);

  // 언어 변경 함수
  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  // 번역 함수
  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text = translations[language][key] || translations[DEFAULT_LANGUAGE][key] || key;

    // 파라미터 치환
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
      });
    }

    return text;
  };

  // 초기 번역 데이터 로드
  useEffect(() => {
    async function loadTranslations() {
      setIsLoading(true);
      try {
        // 한국어(기본) 번역 파일 로드
        const koResponse = await fetch('/locales/ko.json');
        const koData = await koResponse.json();
        translations.ko = koData;

        // 현재 선택된 언어가 기본 언어가 아니면 해당 언어 파일도 로드
        if (language !== 'ko') {
          try {
            const langResponse = await fetch(`/locales/${language}.json`);
            const langData = await langResponse.json();
            translations[language] = langData;
          } catch (e) {
            console.warn(`Failed to load translations for ${language}`, e);
          }
        }

        // HTML 언어 속성 설정
        document.documentElement.lang = language;
      } catch (error) {
        console.error('Failed to load translations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTranslations();
  }, [language]);

  // 컨텍스트 값 제공
  const contextValue: I18nContextType = {
    language,
    setLanguage,
    t,
    isLoading,
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

// 다국어 훅
export function useI18n() {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  
  return context;
}