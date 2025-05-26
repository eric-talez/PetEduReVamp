import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// 임시 데이터 - 실제로는 API에서 가져와야 함
const MOCK_INSTITUTES = [
  { id: 1, name: '서울 애견훈련소', type: '훈련소', status: '운영중' },
  { id: 2, name: '프렌들리 펫 아카데미', type: '훈련학원', status: '운영중' },
  { id: 3, name: '도그스쿨 프리미엄', type: '훈련학원', status: '운영중' },
  { id: 4, name: '우리동네 강아지학교', type: '훈련소', status: '일시중단' },
];

const DEFAULT_MENU_ITEMS = [
  { id: 1, name: '대시보드', category: '기본', defaultEnabled: true },
  { id: 2, name: '강의 관리', category: '기본', defaultEnabled: true },
  { id: 3, name: '훈련사 관리', category: '기본', defaultEnabled: true },
  { id: 4, name: '수강생 관리', category: '기본', defaultEnabled: true },
  { id: 5, name: '수익 관리', category: '기본', defaultEnabled: true },
  { id: 6, name: '영상 콘텐츠 관리', category: '훈련', defaultEnabled: true },
  { id: 7, name: '화상 훈련 일정', category: '훈련', defaultEnabled: true },
  { id: 8, name: '상품 관리', category: '상품', defaultEnabled: false },
  { id: 9, name: '추천인 관리', category: '상품', defaultEnabled: false },
  { id: 10, name: '위치 관리', category: '기본', defaultEnabled: true },
  { id: 11, name: '공지사항 관리', category: '홈페이지', defaultEnabled: false },
  { id: 12, name: '이벤트 관리', category: '홈페이지', defaultEnabled: false },
  { id: 13, name: '문의사항 관리', category: '고객지원', defaultEnabled: true },
  { id: 14, name: '회원 관리', category: '설정', defaultEnabled: true },
];

interface InstituteMenuConfig {
  instituteId: number;
  instituteName: string;
  enabledMenuIds: number[];
}

// 기관별 메뉴 구성 임시 데이터
const MOCK_MENU_CONFIGS: InstituteMenuConfig[] = [
  {
    instituteId: 1,
    instituteName: '서울 애견훈련소',
    enabledMenuIds: [1, 2, 3, 4, 5, 6, 7, 8, 10, 13, 14]
  },
  {
    instituteId: 2,
    instituteName: '프렌들리 펫 아카데미',
    enabledMenuIds: [1, 2, 3, 4, 5, 6, 7, 10, 13, 14]
  },
  {
    instituteId: 3,
    instituteName: '도그스쿨 프리미엄',
    enabledMenuIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  },
  {
    instituteId: 4,
    instituteName: '우리동네 강아지학교',
    enabledMenuIds: [1, 2, 3, 4, 5, 10, 13, 14]
  }
];

export default function InstituteMenuConfiguration() {
  const [institutes, setInstitutes] = useState(MOCK_INSTITUTES);
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU_ITEMS);
  const [menuConfigs, setMenuConfigs] = useState(MOCK_MENU_CONFIGS);
  const [selectedInstituteId, setSelectedInstituteId] = useState<number | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<InstituteMenuConfig | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 기관 검색 기능
  const filteredInstitutes = institutes.filter(institute => 
    institute.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 기관 선택 함수
  const handleInstituteSelect = (instituteId: number) => {
    setSelectedInstituteId(instituteId);
    const config = menuConfigs.find(config => config.instituteId === instituteId) || null;
    setSelectedConfig(config);
  };

  // 메뉴 활성화 상태 변경 함수
  const toggleMenuItem = (menuId: number) => {
    if (!selectedConfig) return;

    setSelectedConfig(prev => {
      if (!prev) return prev;
      
      const isCurrentlyEnabled = prev.enabledMenuIds.includes(menuId);
      const newEnabledMenuIds = isCurrentlyEnabled
        ? prev.enabledMenuIds.filter(id => id !== menuId)
        : [...prev.enabledMenuIds, menuId];
        
      return { ...prev, enabledMenuIds: newEnabledMenuIds };
    });
  };

  // 설정 저장 함수
  const saveMenuConfiguration = () => {
    if (!selectedConfig) return;
    
    setMenuConfigs(prev => 
      prev.map(config => 
        config.instituteId === selectedConfig.instituteId ? selectedConfig : config
      )
    );

    alert('메뉴 구성이 저장되었습니다.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">기관별 메뉴 구성</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 기관 목록 영역 */}
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>기관 목록</CardTitle>
              <CardDescription>
                메뉴를 구성할 기관을 선택해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="기관명 검색"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="border rounded-md max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>기관명</TableHead>
                      <TableHead>구분</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInstitutes.map(institute => (
                      <TableRow 
                        key={institute.id} 
                        onClick={() => handleInstituteSelect(institute.id)}
                        className={`cursor-pointer ${selectedInstituteId === institute.id ? 'bg-muted' : ''}`}
                      >
                        <TableCell className="font-medium">{institute.name}</TableCell>
                        <TableCell>{institute.type}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={institute.status === '운영중' ? 'default' : 'secondary'}
                          >
                            {institute.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredInstitutes.length === 0 && (
                  <div className="py-6 text-center text-muted-foreground">
                    검색 결과가 없습니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* 메뉴 구성 영역 */}
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedConfig ? `${selectedConfig.instituteName} 메뉴 구성` : '메뉴 구성'}
              </CardTitle>
              <CardDescription>
                {selectedConfig 
                  ? '기관에서 사용할 메뉴 항목을 선택하여 구성할 수 있습니다.'
                  : '왼쪽의 기관 목록에서 기관을 선택해주세요.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedConfig ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label className="mb-1 block">기관명</Label>
                      <div className="text-sm">{selectedConfig.instituteName}</div>
                    </div>
                    <div className="text-right">
                      <Button 
                        onClick={saveMenuConfiguration}
                        className="gap-1"
                      >
                        <Save className="h-4 w-4" />
                        설정 저장
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">사용</TableHead>
                          <TableHead>메뉴명</TableHead>
                          <TableHead>분류</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {menuItems.map(menuItem => {
                          const isEnabled = selectedConfig.enabledMenuIds.includes(menuItem.id);
                          return (
                            <TableRow key={menuItem.id}>
                              <TableCell>
                                <Checkbox 
                                  checked={isEnabled}
                                  onCheckedChange={() => toggleMenuItem(menuItem.id)}
                                  id={`menu-${menuItem.id}`}
                                />
                              </TableCell>
                              <TableCell>
                                <Label htmlFor={`menu-${menuItem.id}`} className="cursor-pointer">
                                  {menuItem.name}
                                </Label>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {menuItem.category}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (!selectedConfig) return;
                        const allMenuIds = menuItems.map(item => item.id);
                        setSelectedConfig({ ...selectedConfig, enabledMenuIds: allMenuIds });
                      }}
                    >
                      전체 선택
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (!selectedConfig) return;
                        const defaultMenuIds = menuItems
                          .filter(item => item.defaultEnabled)
                          .map(item => item.id);
                        setSelectedConfig({ ...selectedConfig, enabledMenuIds: defaultMenuIds });
                      }}
                    >
                      기본값으로 초기화
                    </Button>
                  </div>
                </>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  왼쪽의 기관 목록에서 기관을 선택해주세요.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}