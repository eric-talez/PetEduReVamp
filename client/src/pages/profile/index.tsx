import { useAuth } from "../../SimpleApp";

export default function ProfilePage() {
  const { userName, userRole } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">내 프로필</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
              {userName ? userName.substring(0, 1).toUpperCase() : "U"}
            </div>
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-semibold">{userName || "사용자"}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {userRole === 'admin' && '시스템 관리자'}
              {userRole === 'trainer' && '훈련사'}
              {userRole === 'institute-admin' && '기관 관리자'}
              {userRole === 'pet-owner' && '견주 회원'}
              {userRole === 'user' && '일반 회원'}
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">이메일</p>
                <p>user@example.com</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">연락처</p>
                <p>010-1234-5678</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">가입일</p>
                <p>2023년 8월 15일</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">최근 로그인</p>
                <p>2023년 10월 5일</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-4">내 활동 요약</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">수강 중인 강의</h4>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">등록된 반려견</h4>
              <p className="text-2xl font-bold">2</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">완료된 훈련</h4>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            프로필 편집
          </button>
        </div>
      </div>
    </div>
  );
}