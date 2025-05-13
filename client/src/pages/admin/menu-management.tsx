import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { 
  MenuConfiguration, 
  MenuGroup, 
  MenuItem, 
  DEFAULT_MENU_CONFIGURATION,
  MenuCategory
} from '@shared/menu-config';
import { GripVertical, Edit, Save, ArrowUp, ArrowDown, Plus, Trash2 } from 'lucide-react';

export default function MenuManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'groups' | 'items'>('groups');
  const [menuConfig, setMenuConfig] = useState<MenuConfiguration>(DEFAULT_MENU_CONFIGURATION);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [institutes, setInstitutes] = useState<Array<{id: number, name: string}>>([]);
  const [selectedInstituteId, setSelectedInstituteId] = useState<number | null>(null);
  
  // 편집 관련 상태
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [editGroup, setEditGroup] = useState<MenuGroup | null>(null);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [showGroupDialog, setShowGroupDialog] = useState(false);

  // 기관 목록 가져오기
  useEffect(() => {
    fetch('/api/institutes')
      .then(response => response.json())
      .then(data => {
        setInstitutes(data);
      })
      .catch(error => {
        console.error('기관 목록 가져오기 오류:', error);
        toast({
          title: '기관 목록 불러오기 실패',
          description: '기관 목록을 가져오는 중 오류가 발생했습니다.',
          variant: 'destructive'
        });
      });
  }, [toast]);

  // 메뉴 구성 가져오기
  useEffect(() => {
    setLoading(true);
    
    // 기관별 메뉴 구성 또는 전체 메뉴 구성 가져오기
    const url = selectedInstituteId 
      ? `/api/menu-configuration?instituteId=${selectedInstituteId}`
      : '/api/menu-configuration';
    
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('메뉴 구성을 가져오는 데 실패했습니다');
      })
      .then(data => {
        setMenuConfig(data);
      })
      .catch(error => {
        console.error('메뉴 구성 가져오기 오류:', error);
        // 오류 발생 시 기본 메뉴 구성 사용
        setMenuConfig(DEFAULT_MENU_CONFIGURATION);
        toast({
          title: '메뉴 구성 불러오기 실패',
          description: '서버에서 메뉴 구성을 가져오는 중 오류가 발생했습니다. 기본 구성을 사용합니다.',
          variant: 'destructive'
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedInstituteId, toast]);

  // 메뉴 구성 저장하기
  const saveMenuConfiguration = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/menu-configuration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          configuration: menuConfig,
          instituteId: selectedInstituteId,
          isActive: true
        }),
      });

      if (!response.ok) {
        throw new Error('메뉴 설정 저장 실패');
      }

      toast({
        title: '저장 완료',
        description: '메뉴 설정이 성공적으로 저장되었습니다.',
      });
    } catch (error) {
      console.error('메뉴 설정 저장 오류:', error);
      toast({
        title: '저장 실패',
        description: '메뉴 설정을 저장하는 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // 그룹 순서 변경 함수
  const moveGroup = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === menuConfig.groups.length - 1)
    ) {
      return;
    }

    const newGroups = [...menuConfig.groups];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // 순서 인덱스 교환
    const tempOrderIndex = newGroups[index].orderIndex;
    newGroups[index].orderIndex = newGroups[newIndex].orderIndex;
    newGroups[newIndex].orderIndex = tempOrderIndex;
    
    // 배열 내 위치 교환
    [newGroups[index], newGroups[newIndex]] = [newGroups[newIndex], newGroups[index]];
    
    // 정렬
    newGroups.sort((a, b) => a.orderIndex - b.orderIndex);
    
    setMenuConfig({
      ...menuConfig,
      groups: newGroups,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin'
    });
  };

  // 메뉴 항목 순서 변경 함수
  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === menuConfig.items.length - 1)
    ) {
      return;
    }

    const newItems = [...menuConfig.items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // 순서 인덱스 교환
    const tempOrderIndex = newItems[index].orderIndex;
    newItems[index].orderIndex = newItems[newIndex].orderIndex;
    newItems[newIndex].orderIndex = tempOrderIndex;
    
    // 배열 내 위치 교환
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    
    // 정렬
    newItems.sort((a, b) => a.orderIndex - b.orderIndex);
    
    setMenuConfig({
      ...menuConfig,
      items: newItems,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin'
    });
  };

  // 그룹 업데이트 함수
  const updateGroup = (group: MenuGroup) => {
    if (!group) return;
    
    const updatedGroups = menuConfig.groups.map(g => 
      g.id === group.id ? group : g
    );
    
    setMenuConfig({
      ...menuConfig,
      groups: updatedGroups,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin'
    });
    
    setShowGroupDialog(false);
    setEditGroup(null);
  };
  
  // 메뉴 항목 업데이트 함수
  const updateItem = (item: MenuItem) => {
    if (!item) return;
    
    const updatedItems = menuConfig.items.map(i => 
      i.id === item.id ? item : i
    );
    
    setMenuConfig({
      ...menuConfig,
      items: updatedItems,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin'
    });
    
    setShowItemDialog(false);
    setEditItem(null);
  };

  // 그룹 활성화/비활성화 토글
  const toggleGroupActive = (groupId: string) => {
    const updatedGroups = menuConfig.groups.map(group =>
      group.id === groupId 
        ? { ...group, isActive: !group.isActive }
        : group
    );
    
    setMenuConfig({
      ...menuConfig,
      groups: updatedGroups,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin'
    });
  };
  
  // 메뉴 항목 활성화/비활성화 토글
  const toggleItemActive = (itemId: string) => {
    const updatedItems = menuConfig.items.map(item =>
      item.id === itemId 
        ? { ...item, isActive: !item.isActive }
        : item
    );
    
    setMenuConfig({
      ...menuConfig,
      items: updatedItems,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin'
    });
  };

  // 그룹 편집 다이얼로그 열기
  const openGroupEditDialog = (group: MenuGroup) => {
    setEditGroup({...group});
    setShowGroupDialog(true);
  };
  
  // 항목 편집 다이얼로그 열기
  const openItemEditDialog = (item: MenuItem) => {
    setEditItem({...item});
    setShowItemDialog(true);
  };

  // 새 그룹 추가
  const addNewGroup = () => {
    const maxOrderIndex = menuConfig.groups.length > 0
      ? Math.max(...menuConfig.groups.map(g => g.orderIndex)) + 10
      : 10;
    
    // 새 그룹 ID는 기존 MenuCategory 중 하나를 사용
    const newGroup: MenuGroup = {
      id: 'admin', // 기본값으로 admin 사용
      title: '새 메뉴 그룹',
      icon: 'list',
      orderIndex: maxOrderIndex,
      isActive: true,
      isPublic: false,
      roles: ['admin'],
      isOpen: false,
      instituteId: selectedInstituteId
    };
    
    setEditGroup(newGroup);
    setShowGroupDialog(true);
  };
  
  // 새 항목 추가
  const addNewItem = () => {
    const maxOrderIndex = menuConfig.items.length > 0
      ? Math.max(...menuConfig.items.map(i => i.orderIndex)) + 10
      : 10;
    
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      title: '새 메뉴 항목',
      path: '/new-path',
      icon: 'link',
      type: 'internal',
      category: 'main' as MenuCategory, // 명시적으로 MenuCategory 타입 지정
      roles: ['admin'],
      orderIndex: maxOrderIndex,
      isActive: true,
      isPublic: false,
      instituteId: selectedInstituteId
    };
    
    setEditItem(newItem);
    setShowItemDialog(true);
  };
  
  // 그룹 저장
  const saveGroup = () => {
    if (!editGroup) return;
    
    // 새 그룹일 경우 추가
    if (!menuConfig.groups.some(g => g.id === editGroup.id)) {
      setMenuConfig({
        ...menuConfig,
        groups: [...menuConfig.groups, editGroup],
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin'
      });
    } else {
      // 기존 그룹 업데이트
      updateGroup(editGroup);
    }
    
    setShowGroupDialog(false);
    setEditGroup(null);
  };
  
  // 항목 저장
  const saveItem = () => {
    if (!editItem) return;
    
    // 새 항목일 경우 추가
    if (!menuConfig.items.some(i => i.id === editItem.id)) {
      setMenuConfig({
        ...menuConfig,
        items: [...menuConfig.items, editItem],
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin'
      });
    } else {
      // 기존 항목 업데이트
      updateItem(editItem);
    }
    
    setShowItemDialog(false);
    setEditItem(null);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>메뉴 관리</CardTitle>
          <CardDescription>
            메뉴 구조 및 권한 설정을 관리합니다. 기관별로 메뉴를 따로 설정할 수 있습니다.
          </CardDescription>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Label htmlFor="institute-select">기관 선택:</Label>
              <Select
                value={selectedInstituteId?.toString() || 'system'} 
                onValueChange={(val) => setSelectedInstituteId(val === 'system' ? null : parseInt(val))}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="전체 시스템 메뉴" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">전체 시스템 메뉴</SelectItem>
                  {institutes.map(institute => (
                    <SelectItem 
                      key={institute.id} 
                      value={institute.id.toString()}
                    >
                      {institute.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={saveMenuConfiguration} 
              disabled={saving || loading}
            >
              {saving ? '저장 중...' : '설정 저장'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">메뉴 구성 로딩 중...</span>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'groups' | 'items')}>
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="groups" className="flex-1">메뉴 그룹</TabsTrigger>
                <TabsTrigger value="items" className="flex-1">메뉴 항목</TabsTrigger>
              </TabsList>

              {/* 메뉴 그룹 관리 */}
              <TabsContent value="groups">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">메뉴 그룹 관리</h3>
                    <Button variant="outline" size="sm" onClick={addNewGroup}>
                      <Plus className="mr-1 h-4 w-4" /> 새 그룹 추가
                    </Button>
                  </div>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">순서</TableHead>
                          <TableHead className="w-[150px]">ID</TableHead>
                          <TableHead>그룹명</TableHead>
                          <TableHead>아이콘</TableHead>
                          <TableHead className="w-[100px]">활성화</TableHead>
                          <TableHead className="w-[100px]">공개</TableHead>
                          <TableHead className="w-[200px]">액션</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {menuConfig.groups.map((group, index) => (
                          <TableRow key={group.id}>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center">
                                <GripVertical className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{group.orderIndex}</span>
                              </div>
                              <div className="flex gap-1 mt-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6" 
                                  onClick={() => moveGroup(index, 'up')}
                                  disabled={index === 0}
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6" 
                                  onClick={() => moveGroup(index, 'down')}
                                  disabled={index === menuConfig.groups.length - 1}
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs">{group.id}</TableCell>
                            <TableCell>{group.title}</TableCell>
                            <TableCell>{group.icon}</TableCell>
                            <TableCell className="text-center">
                              <Switch 
                                checked={group.isActive} 
                                onCheckedChange={() => toggleGroupActive(group.id)} 
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Switch 
                                checked={group.isPublic} 
                                disabled
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => openGroupEditDialog(group)}
                                >
                                  <Edit className="h-4 w-4 mr-1" /> 편집
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* 메뉴 항목 관리 */}
              <TabsContent value="items">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">메뉴 항목 관리</h3>
                    <Button variant="outline" size="sm" onClick={addNewItem}>
                      <Plus className="mr-1 h-4 w-4" /> 새 항목 추가
                    </Button>
                  </div>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">순서</TableHead>
                          <TableHead>메뉴명</TableHead>
                          <TableHead>경로</TableHead>
                          <TableHead>그룹</TableHead>
                          <TableHead className="w-[80px]">활성화</TableHead>
                          <TableHead className="w-[80px]">공개</TableHead>
                          <TableHead className="w-[150px]">액션</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {menuConfig.items.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center">
                                <GripVertical className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{item.orderIndex}</span>
                              </div>
                              <div className="flex gap-1 mt-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6" 
                                  onClick={() => moveItem(index, 'up')}
                                  disabled={index === 0}
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6" 
                                  onClick={() => moveItem(index, 'down')}
                                  disabled={index === menuConfig.items.length - 1}
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>{item.title}</TableCell>
                            <TableCell className="font-mono text-xs">{item.path}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell className="text-center">
                              <Switch 
                                checked={item.isActive} 
                                onCheckedChange={() => toggleItemActive(item.id)} 
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Switch 
                                checked={item.isPublic} 
                                disabled
                              />
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => openItemEditDialog(item)}
                              >
                                <Edit className="h-4 w-4 mr-1" /> 편집
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* 그룹 편집 다이얼로그 */}
      <Dialog open={showGroupDialog} onOpenChange={setShowGroupDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>메뉴 그룹 {editGroup?.id?.startsWith('group-') ? '추가' : '편집'}</DialogTitle>
            <DialogDescription>
              메뉴 그룹 정보를 수정하세요. 그룹 ID는 변경할 수 없습니다.
            </DialogDescription>
          </DialogHeader>

          {editGroup && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="group-title" className="text-right">그룹명</Label>
                <Input
                  id="group-title"
                  className="col-span-3"
                  value={editGroup.title}
                  onChange={(e) => setEditGroup({...editGroup, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="group-icon" className="text-right">아이콘</Label>
                <Input
                  id="group-icon"
                  className="col-span-3"
                  value={editGroup.icon}
                  onChange={(e) => setEditGroup({...editGroup, icon: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="group-order" className="text-right">순서</Label>
                <Input
                  id="group-order"
                  type="number"
                  className="col-span-3"
                  value={editGroup.orderIndex}
                  onChange={(e) => setEditGroup({...editGroup, orderIndex: parseInt(e.target.value)})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">활성화</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="group-active"
                    checked={editGroup.isActive}
                    onCheckedChange={(checked) => setEditGroup({...editGroup, isActive: checked})}
                  />
                  <Label htmlFor="group-active">메뉴 그룹 활성화</Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">공개 여부</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="group-public"
                    checked={editGroup.isPublic}
                    onCheckedChange={(checked) => setEditGroup({...editGroup, isPublic: checked})}
                  />
                  <Label htmlFor="group-public">비로그인 사용자도 볼 수 있음</Label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGroupDialog(false)}>
              취소
            </Button>
            <Button onClick={saveGroup}>
              <Save className="h-4 w-4 mr-1" /> 저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 메뉴 항목 편집 다이얼로그 */}
      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>메뉴 항목 {editItem?.id?.startsWith('item-') ? '추가' : '편집'}</DialogTitle>
            <DialogDescription>
              메뉴 항목 정보를 수정하세요. 항목 ID는 변경할 수 없습니다.
            </DialogDescription>
          </DialogHeader>

          {editItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item-title" className="text-right">메뉴명</Label>
                <Input
                  id="item-title"
                  className="col-span-3"
                  value={editItem.title}
                  onChange={(e) => setEditItem({...editItem, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item-path" className="text-right">경로</Label>
                <Input
                  id="item-path"
                  className="col-span-3"
                  value={editItem.path}
                  onChange={(e) => setEditItem({...editItem, path: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item-icon" className="text-right">아이콘</Label>
                <Input
                  id="item-icon"
                  className="col-span-3"
                  value={editItem.icon}
                  onChange={(e) => setEditItem({...editItem, icon: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item-group" className="text-right">그룹</Label>
                <Select
                  value={editItem.category}
                  onValueChange={(val) => setEditItem({...editItem, category: val as MenuCategory})}
                >
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="그룹 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuConfig.groups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item-order" className="text-right">순서</Label>
                <Input
                  id="item-order"
                  type="number"
                  className="col-span-3"
                  value={editItem.orderIndex}
                  onChange={(e) => setEditItem({...editItem, orderIndex: parseInt(e.target.value)})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item-type" className="text-right">링크 유형</Label>
                <Select
                  value={editItem.type}
                  onValueChange={(val: 'internal' | 'external') => setEditItem({...editItem, type: val})}
                >
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="링크 유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">내부 링크</SelectItem>
                    <SelectItem value="external">외부 링크</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">활성화</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="item-active"
                    checked={editItem.isActive}
                    onCheckedChange={(checked) => setEditItem({...editItem, isActive: checked})}
                  />
                  <Label htmlFor="item-active">메뉴 항목 활성화</Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">공개 여부</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="item-public"
                    checked={editItem.isPublic}
                    onCheckedChange={(checked) => setEditItem({...editItem, isPublic: checked})}
                  />
                  <Label htmlFor="item-public">비로그인 사용자도 볼 수 있음</Label>
                </div>
              </div>
              {editItem.type === 'external' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">새 창에서 열기</Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch
                      id="item-new-window"
                      checked={editItem.openInNewWindow || false}
                      onCheckedChange={(checked) => setEditItem({...editItem, openInNewWindow: checked})}
                    />
                    <Label htmlFor="item-new-window">새 탭/창에서 링크 열기</Label>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowItemDialog(false)}>
              취소
            </Button>
            <Button onClick={saveItem}>
              <Save className="h-4 w-4 mr-1" /> 저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}