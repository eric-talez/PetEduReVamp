import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  MenuConfiguration, 
  MenuGroup, 
  MenuItem, 
  DEFAULT_MENU_CONFIGURATION 
} from '@shared/menu-config';

export default function MenuManagement() {
  console.log('[DEBUG] 상세 MenuManagement 컴포넌트 렌더링 시작');
  const [activeTab, setActiveTab] = useState<'groups' | 'items'>('groups');
  const [menuConfig, setMenuConfig] = useState<MenuConfiguration>(DEFAULT_MENU_CONFIGURATION);

  useEffect(() => {
    console.log('[DEBUG] MenuManagement useEffect 실행');
    
    // 기본 메뉴 구성 로드
    setMenuConfig(DEFAULT_MENU_CONFIGURATION);
    
    // 서버에서 메뉴 구성 가져오기
    fetch('/api/menu-configuration')
      .then(response => {
        console.log('[DEBUG] 메뉴 구성 응답:', response.status);
        if (response.ok) {
          return response.json();
        }
        throw new Error('메뉴 구성을 가져오는 데 실패했습니다');
      })
      .then(data => {
        console.log('[DEBUG] 메뉴 구성 데이터:', data);
        setMenuConfig(data);
      })
      .catch(error => {
        console.error('[DEBUG] 메뉴 구성 가져오기 오류:', error);
      });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>메뉴 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'groups' | 'items')}>
            <TabsList className="mb-4">
              <TabsTrigger value="groups">메뉴 그룹</TabsTrigger>
              <TabsTrigger value="items">메뉴 항목</TabsTrigger>
            </TabsList>
            <TabsContent value="groups">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">메뉴 그룹 관리</h3>
                <div className="border rounded-md p-4">
                  <p>그룹 수: {menuConfig.groups.length}</p>
                  <ul className="mt-2 space-y-2">
                    {menuConfig.groups.map(group => (
                      <li key={group.id} className="p-2 border rounded">
                        {group.title} ({group.id})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="items">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">메뉴 항목 관리</h3>
                <div className="border rounded-md p-4">
                  <p>항목 수: {menuConfig.items.length}</p>
                  <ul className="mt-2 space-y-2">
                    {menuConfig.items.map(item => (
                      <li key={item.id} className="p-2 border rounded">
                        {item.title} ({item.path})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="mt-4">
            <Button variant="outline">저장</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}