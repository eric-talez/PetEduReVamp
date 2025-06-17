
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface MenuAccessibilityReport {
  totalMenus: number;
  accessibleMenus: number;
  inaccessibleMenus: string[];
  missingIcons: string[];
  missingDescriptions: string[];
}

export const MenuAccessibilityChecker: React.FC = () => {
  const { userRole } = useAuth();
  const [report, setReport] = useState<MenuAccessibilityReport | null>(null);

  useEffect(() => {
    const checkMenuAccessibility = async () => {
      try {
        const response = await fetch('/api/menu-configuration');
        const menuConfig = await response.json();
        
        const accessibilityReport: MenuAccessibilityReport = {
          totalMenus: menuConfig.items.length,
          accessibleMenus: 0,
          inaccessibleMenus: [],
          missingIcons: [],
          missingDescriptions: []
        };

        menuConfig.items.forEach((item: any) => {
          // 역할 기반 접근성 체크
          if (item.roles.includes(userRole) || item.isPublic) {
            accessibilityReport.accessibleMenus++;
          } else {
            accessibilityReport.inaccessibleMenus.push(item.title);
          }

          // 아이콘 체크
          if (!item.icon) {
            accessibilityReport.missingIcons.push(item.title);
          }

          // 설명 체크 (접근성)
          if (!item.description && !item.title) {
            accessibilityReport.missingDescriptions.push(item.id);
          }
        });

        setReport(accessibilityReport);
        console.log('📊 메뉴 접근성 보고서:', accessibilityReport);
      } catch (error) {
        console.error('❌ 메뉴 접근성 체크 실패:', error);
      }
    };

    if (userRole) {
      checkMenuAccessibility();
    }
  }, [userRole]);

  // 개발 환경에서만 표시
  if (process.env.NODE_ENV !== 'development' || !report) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-sm text-xs z-50">
      <h3 className="font-bold text-green-600 mb-2">메뉴 접근성 보고서</h3>
      <div className="space-y-1">
        <p>총 메뉴: {report.totalMenus}개</p>
        <p className="text-green-600">접근 가능: {report.accessibleMenus}개</p>
        <p className="text-red-600">접근 불가: {report.inaccessibleMenus.length}개</p>
        {report.missingIcons.length > 0 && (
          <p className="text-orange-600">아이콘 누락: {report.missingIcons.length}개</p>
        )}
      </div>
    </div>
  );
};

export default MenuAccessibilityChecker;
