import { useState } from "react";
import { useAuth } from "../../SimpleApp";

interface SettingsPageProps {
  userRole?: string;
}

export default function SettingsPage({ userRole: propUserRole }: SettingsPageProps = {}) {
  const auth = useAuth();
  // props로 전달된 userRole이 있으면 그것을 사용하고, 없으면 auth에서 가져옴
  const userRole = propUserRole || auth.userRole;
  const userName = auth.userName;
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">설정</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* 사이드바 메뉴 */}
        <div className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveTab("account")}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === "account" 
                    ? "bg-primary text-white" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                계정 설정
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === "notifications" 
                    ? "bg-primary text-white" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                알림 설정
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab("privacy")}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === "privacy" 
                    ? "bg-primary text-white" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                개인정보 설정
              </button>
            </li>
            {userRole === 'trainer' && (
              <li>
                <button 
                  onClick={() => setActiveTab("trainer")}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === "trainer" 
                      ? "bg-primary text-white" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  훈련사 설정
                </button>
              </li>
            )}
            {userRole === 'institute-admin' && (
              <li>
                <button 
                  onClick={() => setActiveTab("institute")}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === "institute" 
                      ? "bg-primary text-white" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  기관 설정
                </button>
              </li>
            )}
          </ul>
        </div>
        
        {/* 컨텐츠 영역 */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {activeTab === "account" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">계정 설정</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">사용자 이름</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    defaultValue={userName || ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">이메일</label>
                  <input 
                    type="email" 
                    className="w-full p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    defaultValue="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">비밀번호 변경</label>
                  <input 
                    type="password" 
                    placeholder="현재 비밀번호"
                    className="w-full p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                  />
                  <input 
                    type="password" 
                    placeholder="새 비밀번호"
                    className="w-full p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                  />
                  <input 
                    type="password" 
                    placeholder="새 비밀번호 확인"
                    className="w-full p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    변경사항 저장
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">알림 설정</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b dark:border-gray-700 pb-2">
                  <div>
                    <p className="font-medium">이메일 알림</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">중요 소식 및 업데이트를 이메일로 받기</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="email-toggle" className="sr-only" defaultChecked />
                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-6"></span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b dark:border-gray-700 pb-2">
                  <div>
                    <p className="font-medium">SMS 알림</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">중요 알림을 SMS로 받기</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="sms-toggle" className="sr-only" defaultChecked />
                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-6"></span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b dark:border-gray-700 pb-2">
                  <div>
                    <p className="font-medium">앱 푸시 알림</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">모바일 앱 푸시 알림 허용</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="push-toggle" className="sr-only" defaultChecked />
                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-6"></span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    변경사항 저장
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "privacy" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">개인정보 설정</h2>
              <p className="mb-4">개인정보 공개 설정을 관리합니다.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b dark:border-gray-700 pb-2">
                  <div>
                    <p className="font-medium">프로필 공개</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">내 프로필을 다른 사용자에게 공개</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="profile-toggle" className="sr-only" defaultChecked />
                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-6"></span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b dark:border-gray-700 pb-2">
                  <div>
                    <p className="font-medium">연락처 공개</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">내 연락처 정보를 다른 사용자에게 공개</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="contact-toggle" className="sr-only" />
                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b dark:border-gray-700 pb-2">
                  <div>
                    <p className="font-medium">위치 정보 사용</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">내 위치 정보를 서비스 이용에 활용</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="location-toggle" className="sr-only" defaultChecked />
                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-6"></span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    변경사항 저장
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "trainer" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">훈련사 설정</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">전문 분야</label>
                  <select className="w-full p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>문제행동 교정</option>
                    <option>기본 복종훈련</option>
                    <option>어질리티</option>
                    <option>탐지견 훈련</option>
                    <option>공격성 교정</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">자격증 정보</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="자격증 번호 입력"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">자기소개</label>
                  <textarea 
                    className="w-full p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                    placeholder="훈련사 소개글을 작성해주세요"
                  ></textarea>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    변경사항 저장
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "institute" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">기관 설정</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">기관명</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="기관 이름"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">사업자 등록번호</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="000-00-00000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">주소</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                    placeholder="기본 주소"
                  />
                  <input 
                    type="text" 
                    className="w-full p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="상세 주소"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">기관 소개</label>
                  <textarea 
                    className="w-full p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                    placeholder="기관 소개글을 작성해주세요"
                  ></textarea>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    변경사항 저장
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}