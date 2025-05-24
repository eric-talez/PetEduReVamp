import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Award, 
  BookOpen, 
  Clock, 
  Compass, 
  Heart, 
  MessageCircle, 
  Star, 
  ThumbsUp, 
  Video,
  Calendar,
  Users,
  CheckCircle2,
  PawPrint,
  Pencil
} from 'lucide-react';
import { useAuth } from '../SimpleApp';
import { useToast } from './use-toast';

// 성취 배지 정의
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  condition: (userData: any) => boolean | number;
  maxProgress?: number;
  userRoles: string[]; // 적용되는 사용자 역할 (pet-owner, trainer, admin 등)
  category: 'training' | 'community' | 'system' | 'profile' | 'location';
}

// 사용자별 성취 배지 상태
export interface UserAchievement {
  id: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  shown: boolean; // 사용자에게 알림이 표시되었는지 여부
}

interface AchievementsContextType {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  checkAchievements: () => void;
  markAchievementAsShown: (id: string) => void;
  getNewUnlockedAchievements: () => UserAchievement[];
}

const AchievementsContext = createContext<AchievementsContextType | null>(null);

// 성취 배지 목록 정의
const achievementsList: Achievement[] = [
  // 시스템 사용 관련 배지
  {
    id: 'first-login',
    name: '첫 방문',
    description: '탈레즈에 처음 로그인하셨습니다.',
    icon: <Award className="text-white" />,
    level: 'bronze',
    condition: () => true, // 항상 달성 (첫 로그인시)
    userRoles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    category: 'system'
  },
  {
    id: 'profile-complete',
    name: '프로필 완성',
    description: '프로필 정보를 모두 입력하셨습니다.',
    icon: <CheckCircle2 className="text-white" />,
    level: 'bronze',
    condition: (userData) => {
      const requiredFields = ['name', 'email', 'phone', 'bio'];
      if (!userData.profile) return 0;
      
      const completedFields = requiredFields.filter(field => 
        userData.profile[field] && userData.profile[field].trim() !== ''
      );
      
      return completedFields.length / requiredFields.length;
    },
    maxProgress: 1,
    userRoles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    category: 'profile'
  },
  
  // 반려인용 배지
  {
    id: 'first-pet',
    name: '새 가족',
    description: '첫 반려동물 정보를 등록하셨습니다.',
    icon: <PawPrint className="text-white" />,
    level: 'bronze',
    condition: (userData) => userData.pets && userData.pets.length > 0,
    userRoles: ['pet-owner'],
    category: 'profile'
  },
  {
    id: 'video-watcher',
    name: '영상 학습자',
    description: '5개 이상의 훈련 영상을 시청하셨습니다.',
    icon: <Video className="text-white" />,
    level: 'silver',
    condition: (userData) => {
      return userData.videoProgress ? 
        Object.keys(userData.videoProgress).length : 0;
    },
    maxProgress: 5,
    userRoles: ['pet-owner'],
    category: 'training'
  },
  {
    id: 'class-attendee',
    name: '성실한 수강생',
    description: '3회 이상의 화상 수업에 참석하셨습니다.',
    icon: <Users className="text-white" />,
    level: 'silver',
    condition: (userData) => userData.attendedClasses || 0,
    maxProgress: 3,
    userRoles: ['pet-owner'],
    category: 'training'
  },
  
  // 훈련사용 배지
  {
    id: 'first-class',
    name: '첫 수업',
    description: '첫 화상 훈련 수업을 개설하셨습니다.',
    icon: <Video className="text-white" />,
    level: 'bronze',
    condition: (userData) => userData.createdClasses && userData.createdClasses.length > 0,
    userRoles: ['trainer'],
    category: 'training'
  },
  {
    id: 'notebook-writer',
    name: '세심한 기록',
    description: '10개 이상의 알림장을 작성하셨습니다.',
    icon: <Pencil className="text-white" />,
    level: 'gold',
    condition: (userData) => userData.writtenNotebooks || 0,
    maxProgress: 10,
    userRoles: ['trainer'],
    category: 'training'
  },
  
  // 모든 사용자용 공통 배지
  {
    id: 'location-explorer',
    name: '장소 탐험가',
    description: '10개 이상의 반려동물 친화 장소를 조회하셨습니다.',
    icon: <Compass className="text-white" />,
    level: 'silver',
    condition: (userData) => userData.viewedLocations || 0,
    maxProgress: 10,
    userRoles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    category: 'location'
  },
  {
    id: 'community-active',
    name: '커뮤니티 활동가',
    description: '5개 이상의 커뮤니티 게시글을 작성하셨습니다.',
    icon: <MessageCircle className="text-white" />,
    level: 'gold',
    condition: (userData) => userData.posts || 0,
    maxProgress: 5,
    userRoles: ['pet-owner', 'trainer', 'institute-admin', 'admin'],
    category: 'community'
  }
];

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const auth = useAuth();
  const { toast } = useToast();
  
  // 로컬 스토리지에서 사용자 성취 데이터 로드
  useEffect(() => {
    if (!auth.isAuthenticated) return;
    
    const savedData = localStorage.getItem(`talez_achievements_${auth.userRole}`);
    if (savedData) {
      try {
        setUserAchievements(JSON.parse(savedData));
      } catch (e) {
        console.error('성취 데이터 파싱 오류:', e);
        setUserAchievements([]);
      }
    } else {
      // 처음 로드시 기본 데이터 생성
      const initialAchievements = achievementsList
        .filter(a => a.userRoles.includes(auth.userRole || ''))
        .map(a => ({
          id: a.id,
          unlocked: false,
          progress: 0,
          shown: false
        }));
      
      setUserAchievements(initialAchievements);
    }
  }, [auth.isAuthenticated, auth.userRole]);
  
  // 성취 데이터 저장
  useEffect(() => {
    if (!auth.isAuthenticated || userAchievements.length === 0) return;
    
    localStorage.setItem(
      `talez_achievements_${auth.userRole}`,
      JSON.stringify(userAchievements)
    );
  }, [userAchievements, auth.userRole, auth.isAuthenticated]);
  
  // 사용자 성취 상태 확인 및 업데이트
  const checkAchievements = () => {
    if (!auth.isAuthenticated) return;
    
    // 실제 구현에서는 서버에서 사용자 데이터를 가져와 성취 조건 확인
    // 현재는 임시 데이터로 시뮬레이션
    const userData = {
      profile: {
        name: '반려인',
        email: 'user@example.com',
        phone: '010-1234-5678',
        bio: '반려견과 함께 성장하고 있습니다.'
      },
      pets: [{ name: '두리', breed: '포메라니안', age: 3 }],
      videoProgress: { 'video-1': 1, 'video-2': 0.5 },
      attendedClasses: 2,
      viewedLocations: 8,
      posts: 3
    };
    
    const updatedAchievements = [...userAchievements];
    const newlyUnlocked: string[] = [];
    
    achievementsList
      .filter(a => a.userRoles.includes(auth.userRole || ''))
      .forEach(achievement => {
        const userAchievement = updatedAchievements.find(ua => ua.id === achievement.id);
        
        if (!userAchievement) return;
        
        // 이미 달성한 경우 체크 건너뛰기
        if (userAchievement.unlocked) return;
        
        const conditionResult = achievement.condition(userData);
        const progress = typeof conditionResult === 'boolean' 
          ? (conditionResult ? 1 : 0)
          : conditionResult;
        
        // 달성 여부 확인
        const maxProgress = achievement.maxProgress || 1;
        const isUnlocked = progress >= maxProgress;
        
        // 상태 업데이트
        if (isUnlocked && !userAchievement.unlocked) {
          newlyUnlocked.push(achievement.name);
        }
        
        userAchievement.progress = progress;
        userAchievement.unlocked = isUnlocked;
        
        if (isUnlocked && !userAchievement.unlockedAt) {
          userAchievement.unlockedAt = new Date();
        }
      });
    
    // 상태 업데이트
    setUserAchievements(updatedAchievements);
    
    // 새로 달성한 배지가 있다면 알림 표시
    if (newlyUnlocked.length > 0) {
      toast({
        title: '🎉 새로운 배지 획득!',
        description: `${newlyUnlocked.join(', ')} 배지를 획득하였습니다.`,
        duration: 5000
      });
    }
  };
  
  // 배지 알림이 표시되었음을 기록
  const markAchievementAsShown = (id: string) => {
    setUserAchievements(prev => 
      prev.map(a => a.id === id ? { ...a, shown: true } : a)
    );
  };
  
  // 새로 획득했지만 아직 알림이 표시되지 않은 배지 가져오기
  const getNewUnlockedAchievements = () => {
    return userAchievements.filter(a => a.unlocked && !a.shown);
  };
  
  return (
    <AchievementsContext.Provider
      value={{
        achievements: achievementsList.filter(a => a.userRoles.includes(auth.userRole || '')),
        userAchievements,
        checkAchievements,
        markAchievementAsShown,
        getNewUnlockedAchievements
      }}
    >
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};