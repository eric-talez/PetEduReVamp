import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Plus, Upload, Image, ExternalLink } from 'lucide-react';

interface Event {
  id: number;
  name: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  startDate: string;
  endDate: string;
  time: string;
  description: string;
  category: string;
  price: string | number;
  attendees: number;
  maxAttendees: number;
  organizer: string;
  status: string;
  tags: string[];
  sourceUrl: string;
  thumbnailUrl: string;
  lastUpdated?: string;
}

export default function EventManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showThumbnailDialog, setShowThumbnailDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const { toast } = useToast();

  // 이벤트 목록 불러오기
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('GET', '/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('이벤트 목록 조회 오류:', error);
      toast({
        title: "오류",
        description: "이벤트 목록을 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 썸네일 업로드 함수
  const uploadThumbnail = async (eventId: number, file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('thumbnail', file);

      const response = await fetch(`/api/events/${eventId}/thumbnail`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "성공",
          description: "썸네일이 성공적으로 업로드되었습니다.",
        });
        
        // 이벤트 목록 새로고침
        await fetchEvents();
        
        setShowThumbnailDialog(false);
        setThumbnailFile(null);
        setThumbnailPreview('');
      } else {
        throw new Error(data.error || '썸네일 업로드 실패');
      }
    } catch (error) {
      console.error('썸네일 업로드 오류:', error);
      toast({
        title: "오류",
        description: "썸네일 업로드에 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "오류",
          description: "파일 크기가 너무 큽니다. 10MB 이하의 파일을 선택해주세요.",
          variant: "destructive"
        });
        return;
      }

      // 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        toast({
          title: "오류",
          description: "이미지 파일만 업로드 가능합니다.",
          variant: "destructive"
        });
        return;
      }

      setThumbnailFile(file);
      
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 썸네일 업로드 대화상자 열기
  const openThumbnailDialog = (event: Event) => {
    setSelectedEvent(event);
    setShowThumbnailDialog(true);
    setThumbnailFile(null);
    setThumbnailPreview('');
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '예정': return 'bg-blue-100 text-blue-800';
      case '진행중': return 'bg-green-100 text-green-800';
      case '완료': return 'bg-gray-100 text-gray-800';
      case '취소': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '전시회': return '🏆';
      case '지역축제': return '🎉';
      case '자연체험': return '🌳';
      default: return '📅';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">이벤트 관리</h1>
          <p className="text-gray-600">축제 및 이벤트를 관리하고 썸네일을 업로드하세요.</p>
        </div>
        <Button onClick={() => setShowEventDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          새 이벤트 추가
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">이벤트 목록</TabsTrigger>
          <TabsTrigger value="analytics">통계</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              <span className="ml-2 text-muted-foreground">로딩 중...</span>
            </div>
          ) : events.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">등록된 이벤트가 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* 썸네일 영역 */}
                      <div className="flex-shrink-0">
                        {event.thumbnailUrl ? (
                          <div className="relative">
                            <img 
                              src={event.thumbnailUrl} 
                              alt={event.name}
                              className="w-24 h-24 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="absolute -top-2 -right-2 w-8 h-8 p-0"
                              onClick={() => openThumbnailDialog(event)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openThumbnailDialog(event)}
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* 이벤트 정보 */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{getCategoryIcon(event.category)}</span>
                              <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                                {event.status}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold">{event.name}</h3>
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location.address}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openThumbnailDialog(event)}
                            >
                              <Image className="h-4 w-4 mr-1" />
                              썸네일
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedEvent(event);
                                setShowEventDialog(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              수정
                            </Button>
                            {event.sourceUrl && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(event.sourceUrl, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {event.startDate === event.endDate ? 
                              event.startDate : 
                              `${event.startDate} ~ ${event.endDate}`
                            }
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-1" />
                            {event.attendees}/{event.maxAttendees}
                          </div>
                          <div className="text-gray-600">
                            {event.price === '무료' ? '무료' : `${event.price}원`}
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {event.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {event.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{event.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>이벤트 통계</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{events.length}</div>
                  <div className="text-sm text-gray-600">총 이벤트</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {events.filter(e => e.status === '예정').length}
                  </div>
                  <div className="text-sm text-gray-600">예정</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {events.filter(e => e.status === '진행중').length}
                  </div>
                  <div className="text-sm text-gray-600">진행중</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {events.filter(e => e.status === '완료').length}
                  </div>
                  <div className="text-sm text-gray-600">완료</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 썸네일 업로드 대화상자 */}
      <Dialog open={showThumbnailDialog} onOpenChange={setShowThumbnailDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>썸네일 업로드</DialogTitle>
            <DialogDescription>
              {selectedEvent?.name}의 썸네일을 업로드하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* 현재 썸네일 */}
            {selectedEvent?.thumbnailUrl && (
              <div>
                <Label className="text-sm font-medium">현재 썸네일</Label>
                <img 
                  src={selectedEvent.thumbnailUrl} 
                  alt="현재 썸네일"
                  className="w-full h-32 object-cover rounded border mt-2"
                />
              </div>
            )}

            {/* 파일 선택 */}
            <div>
              <Label htmlFor="thumbnail-upload" className="text-sm font-medium">
                새 썸네일 선택
              </Label>
              <Input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG, GIF 파일만 업로드 가능 (최대 10MB)
              </p>
            </div>

            {/* 미리보기 */}
            {thumbnailPreview && (
              <div>
                <Label className="text-sm font-medium">미리보기</Label>
                <img 
                  src={thumbnailPreview} 
                  alt="미리보기"
                  className="w-full h-32 object-cover rounded border mt-2"
                />
              </div>
            )}

            {/* 업로드 버튼 */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowThumbnailDialog(false)}
              >
                취소
              </Button>
              <Button
                onClick={() => {
                  if (selectedEvent && thumbnailFile) {
                    uploadThumbnail(selectedEvent.id, thumbnailFile);
                  }
                }}
                disabled={!thumbnailFile || isUploading}
              >
                {isUploading ? '업로드 중...' : '업로드'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}