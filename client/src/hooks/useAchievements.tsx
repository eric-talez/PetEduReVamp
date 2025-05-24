import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useAuth } from '../SimpleApp';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// 성취 배지 타입 정의
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  requiredPoints: number;
}

// 사용자 성취 배지 타입 정의
export interface UserAchievement {
  id: string;
  achievementId: string;
  userId: number;
  unlocked: boolean;
  unlockedAt: Date | null;
  progress: number;
  totalRequired: number;
}

// 성취 배지 컨텍스트 타입 정의
interface AchievementsContextType {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  checkAchievements: () => void;
  getAchievementById: (id: string) => Achievement | undefined;
  getUserAchievementById: (id: string) => UserAchievement | undefined;
  isAchievementUnlocked: (id: string) => boolean;
  getAchievementProgress: (id: string) => { current: number; total: number };
  fetchAchievements: () => Promise<void>;
}

// 기본 성취 배지 데이터
const defaultAchievements: Achievement[] = [
  {
    id: 'profile-complete',
    title: '프로필 완성',
    description: '모든 프로필 정보를 입력하여 완성했습니다.',
    icon: 'user',
    category: 'beginner',
    requiredPoints: 1
  },
  {
    id: 'first-login',
    title: '첫 로그인',
    description: '탈레즈에 처음으로 로그인했습니다.',
    icon: 'log-in',
    category: 'beginner',
    requiredPoints: 1
  },
  {
    id: 'first-course',
    title: '학습 시작',
    description: '첫 번째 강좌를 등록했습니다.',
    icon: 'book-open',
    category: 'beginner',
    requiredPoints: 1
  },
  {
    id: 'pet-register',
    title: '반려동물 등록',
    description: '반려동물 정보를 등록했습니다.',
    icon: 'dog',
    category: 'beginner',
    requiredPoints: 1
  },
  {
    id: 'first-community-post',
    title: '커뮤니티 참여',
    description: '첫 번째 커뮤니티 글을 작성했습니다.',
    icon: 'message-square',
    category: 'intermediate',
    requiredPoints: 1
  },
  {
    id: 'complete-onboarding',
    title: '온보딩 완료',
    description: '온보딩 가이드를 모두 완료했습니다.',
    icon: 'check-circle',
    category: 'beginner',
    requiredPoints: 1
  },
  {
    id: 'first-review',
    title: '첫 리뷰 작성',
    description: '첫 번째 리뷰를 작성했습니다.',
    icon: 'star',
    category: 'intermediate',
    requiredPoints: 1
  },
  {
    id: 'course-complete',
    title: '강좌 완료',
    description: '첫 번째 강좌를 완료했습니다.',
    icon: 'award',
    category: 'intermediate',
    requiredPoints: 1
  },
  {
    id: 'first-purchase',
    title: '첫 구매',
    description: '첫 번째 상품을 구매했습니다.',
    icon: 'shopping-bag',
    category: 'intermediate',
    requiredPoints: 1
  },
  {
    id: 'notification-setup',
    title: '알림 설정',
    description: '알림 설정을 맞춤화했습니다.',
    icon: 'bell',
    category: 'intermediate',
    requiredPoints: 1
  },
  {
    id: 'event-attendance',
    title: '이벤트 참가',
    description: '오프라인 이벤트에 참가했습니다.',
    icon: 'calendar',
    category: 'advanced',
    requiredPoints: 1
  },
  {
    id: 'all-features',
    title: '전체 기능 탐색',
    description: '탈레즈의 모든 주요 기능을 사용해 보았습니다.',
    icon: 'compass',
    category: 'expert',
    requiredPoints: 1
  }
];

// 성취 배지 컨텍스트 생성
const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

// 성취 배지 제공자 컴포넌트
export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const auth = useAuth();
  const { toast } = useToast();

  // 성취 배지 데이터 가져오기
  const fetchAchievements = useCallback(async () => {
    try {
      // API가 아직 구현되지 않았으므로 모의 데이터 사용
      // 실제 구현 시 아래 주석을 해제하고 모의 데이터를 제거
      /*
      const response = await apiRequest('GET', '/api/achievements');
      const data = await response.json();
      setAchievements(data.achievements);
      */
      
      setAchievements(defaultAchievements);
      
      // 사용자 성취 배지 데이터 가져오기 (인증된 사용자인 경우만)
      if (auth.isAuthenticated) {
        try {
          // API가 아직 구현되지 않았으므로 모의 데이터 사용
          // 실제 구현 시 아래 주석을 해제하고 모의 데이터를 제거
          /*
          const userResponse = await apiRequest('GET', '/api/user/achievements');
          const userData = await userResponse.json();
          setUserAchievements(userData.achievements);
          */
          
          // 임시 데이터 - 실제 구현에서는 API 호출로 대체
          const mockUserAchievements: UserAchievement[] = defaultAchievements.map(achievement => ({
            id: `ua-${achievement.id}`,
            achievementId: achievement.id,
            userId: auth.user?.id || 0,
            unlocked: ['first-login', 'profile-complete', 'complete-onboarding'].includes(achievement.id),
            unlockedAt: ['first-login', 'profile-complete', 'complete-onboarding'].includes(achievement.id) ? new Date() : null,
            progress: ['first-login', 'profile-complete', 'complete-onboarding'].includes(achievement.id) ? 
              achievement.requiredPoints : 
              Math.floor(Math.random() * achievement.requiredPoints),
            totalRequired: achievement.requiredPoints
          }));
          
          setUserAchievements(mockUserAchievements);
        } catch (error) {
          console.error('사용자 성취 배지를 가져오는 중 오류 발생:', error);
        }
      }
    } catch (error) {
      console.error('성취 배지를 가져오는 중 오류 발생:', error);
    }
  }, [auth.isAuthenticated, auth.user?.id]);
  
  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  // ID로 성취 배지 찾기
  const getAchievementById = useCallback(
    (id: string) => achievements.find(a => a.id === id),
    [achievements]
  );

  // ID로 사용자 성취 배지 찾기
  const getUserAchievementById = useCallback(
    (id: string) => userAchievements.find(ua => ua.achievementId === id),
    [userAchievements]
  );

  // 성취 배지 잠금 해제 여부 확인
  const isAchievementUnlocked = useCallback(
    (id: string) => {
      const userAchievement = userAchievements.find(ua => ua.achievementId === id);
      return userAchievement ? userAchievement.unlocked : false;
    },
    [userAchievements]
  );

  // 성취 배지 진행 상황 가져오기
  const getAchievementProgress = useCallback(
    (id: string) => {
      const userAchievement = userAchievements.find(ua => ua.achievementId === id);
      return {
        current: userAchievement ? userAchievement.progress : 0,
        total: userAchievement ? userAchievement.totalRequired : 1
      };
    },
    [userAchievements]
  );

  // 새로운 성취 배지 확인 및 업데이트
  const checkAchievements = useCallback(() => {
    if (!auth.isAuthenticated) return;
    
    // 실제 구현에서는 API 호출로 서버에서 체크
    // 여기서는 간단한 클라이언트 체크만 수행
    
    // 성취 배지 데이터 복사
    const updatedUserAchievements = [...userAchievements];
    let newAchievementsUnlocked = false;
    
    // 예시: 첫 로그인 성취 배지 체크
    const firstLoginAchievement = updatedUserAchievements.find(ua => ua.achievementId === 'first-login');
    if (firstLoginAchievement && !firstLoginAchievement.unlocked) {
      firstLoginAchievement.unlocked = true;
      firstLoginAchievement.unlockedAt = new Date();
      firstLoginAchievement.progress = firstLoginAchievement.totalRequired;
      newAchievementsUnlocked = true;
      
      // 새 성취 배지 알림
      toast({
        title: '🎉 새로운 성취 달성!',
        description: '첫 로그인 배지를 획득했습니다.',
      });
    }
    
    // 업데이트된 사용자 성취 배지 상태 저장
    if (newAchievementsUnlocked) {
      setUserAchievements(updatedUserAchievements);
      
      // 실제 구현에서는 API 호출로 서버에 업데이트
      // apiRequest('POST', '/api/user/achievements/update', { achievements: updatedUserAchievements });
    }
  }, [auth.isAuthenticated, userAchievements, toast]);

  return (
    <AchievementsContext.Provider
      value={{
        achievements,
        userAchievements,
        checkAchievements,
        getAchievementById,
        getUserAchievementById,
        isAchievementUnlocked,
        getAchievementProgress,
        fetchAchievements
      }}
    >
      {children}
    </AchievementsContext.Provider>
  );
}

// 성취 배지 컨텍스트 사용 훅
export function useAchievements() {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error('useAchievements는 AchievementsProvider 내에서 사용해야 합니다');
  }
  return context;
}