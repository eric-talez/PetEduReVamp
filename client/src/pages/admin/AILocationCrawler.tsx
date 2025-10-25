
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Search, CheckCircle, XCircle, Loader2, Database, Map } from 'lucide-react';

export default function AILocationCrawler() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [crawlType, setCrawlType] = useState('training');
  const [region, setRegion] = useState('서울');
  const [keyword, setKeyword] = useState('');
  const [currentCrawlId, setCurrentCrawlId] = useState<number | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);

  // AI 크롤링 실행
  const crawlMutation = useMutation({
    mutationFn: async (params: { type: string; region: string; keyword?: string }) => {
      const response = await fetch('/api/admin/ai-crawler/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('크롤링 실패');
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentCrawlId(data.crawlId);
      toast({
        title: "크롤링 완료",
        description: `${data.count}개의 장소를 찾았습니다.`
      });
    },
    onError: () => {
      toast({
        title: "크롤링 실패",
        description: "장소 정보 수집에 실패했습니다.",
        variant: "destructive"
      });
    }
  });

  // 크롤링 결과 조회
  const { data: crawlResult } = useQuery({
    queryKey: ['/api/admin/ai-crawler/results', currentCrawlId],
    enabled: !!currentCrawlId,
    queryFn: async () => {
      const response = await fetch(`/api/admin/ai-crawler/results/${currentCrawlId}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('결과 조회 실패');
      return response.json();
    }
  });

  // 승인된 장소 목록
  const { data: approvedLocations } = useQuery({
    queryKey: ['/api/locations/approved'],
    queryFn: async () => {
      const response = await fetch('/api/locations/approved', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('장소 조회 실패');
      return response.json();
    }
  });

  // 장소 승인
  const approveMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/ai-crawler/approve/${currentCrawlId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedIds: selectedLocations }),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('승인 실패');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "승인 완료",
        description: `${selectedLocations.length}개 장소가 등록되었습니다.`
      });
      setSelectedLocations([]);
      queryClient.invalidateQueries({ queryKey: ['/api/locations/approved'] });
    }
  });

  const handleCrawl = () => {
    crawlMutation.mutate({
      type: crawlType,
      region,
      keyword: keyword || undefined
    });
  };

  const toggleSelection = (index: number) => {
    setSelectedLocations(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      training: '훈련소',
      cafe: '카페',
      hospital: '동물병원',
      hotel: '호텔',
      grooming: '미용실',
      park: '공원'
    };
    return labels[type] || type;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI 위치 정보 크롤러</h1>
          <p className="text-gray-600 mt-1">전국 반려견 관련 장소 정보를 AI로 자동 수집합니다</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Database className="w-4 h-4 mr-2" />
          등록된 장소: {approvedLocations?.count || 0}개
        </Badge>
      </div>

      {/* 크롤링 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>크롤링 설정</CardTitle>
          <CardDescription>수집할 장소 유형과 지역을 선택하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">장소 유형</label>
              <Select value={crawlType} onValueChange={setCrawlType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="training">훈련소</SelectItem>
                  <SelectItem value="cafe">카페</SelectItem>
                  <SelectItem value="hospital">동물병원</SelectItem>
                  <SelectItem value="hotel">호텔</SelectItem>
                  <SelectItem value="grooming">미용실</SelectItem>
                  <SelectItem value="park">공원</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">지역</label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전국">전국</SelectItem>
                  <SelectItem value="서울">서울</SelectItem>
                  <SelectItem value="경기">경기</SelectItem>
                  <SelectItem value="인천">인천</SelectItem>
                  <SelectItem value="부산">부산</SelectItem>
                  <SelectItem value="대구">대구</SelectItem>
                  <SelectItem value="대전">대전</SelectItem>
                  <SelectItem value="광주">광주</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">키워드 (선택)</label>
              <Input
                placeholder="특정 키워드 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleCrawl}
                disabled={crawlMutation.isPending}
                className="w-full"
              >
                {crawlMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    수집 중...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    AI 크롤링 시작
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 크롤링 결과 */}
      {crawlResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>크롤링 결과</CardTitle>
                <CardDescription>
                  {crawlResult.locations?.length}개의 장소가 발견되었습니다
                </CardDescription>
              </div>
              <Button
                onClick={() => approveMutation.mutate()}
                disabled={selectedLocations.length === 0 || approveMutation.isPending}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                선택 항목 승인 ({selectedLocations.length})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {crawlResult.locations?.map((location: any, index: number) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    selectedLocations.includes(index) ? 'bg-blue-50 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedLocations.includes(index)}
                      onCheckedChange={() => toggleSelection(index)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{location.name}</h4>
                        <Badge>{getTypeLabel(location.type)}</Badge>
                        {location.rating && (
                          <Badge variant="outline">⭐ {location.rating}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {location.address}
                      </p>
                      {location.phone && (
                        <p className="text-sm text-gray-600 mb-1">📞 {location.phone}</p>
                      )}
                      {location.hours && (
                        <p className="text-sm text-gray-600 mb-1">🕐 {location.hours}</p>
                      )}
                      {location.description && (
                        <p className="text-sm text-gray-500 mt-2">{location.description}</p>
                      )}
                      <div className="flex gap-1 mt-2">
                        {location.tags?.map((tag: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 등록된 장소 통계 */}
      {approvedLocations && (
        <Card>
          <CardHeader>
            <CardTitle>등록된 장소 통계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['training', 'cafe', 'hospital', 'hotel', 'grooming', 'park'].map(type => {
                const count = approvedLocations.locations?.filter(
                  (loc: any) => loc.type === type
                ).length || 0;
                return (
                  <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-gray-600">{getTypeLabel(type)}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
