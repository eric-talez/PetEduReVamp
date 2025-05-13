import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  X,
  Image,
  Video,
  ClipboardList,
  Sparkles,
  Brain,
} from 'lucide-react';
interface Pet {
  id: number;
  name: string;
  avatar?: string;
  breed: string;
}
import { useToast } from '@/hooks/use-toast';
import ActivityRecorder, { Activity } from './ActivityRecorder';
import { TemplateType } from './TemplateSelector';

interface NotebookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pets: Pet[];
  onSubmit: (data: any) => void;
  onShowTemplateDialog: () => void;
  initialData?: any;
}

export default function NotebookDialog({
  open,
  onOpenChange,
  pets,
  onSubmit,
  onShowTemplateDialog,
  initialData
}: NotebookDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: '',
    content: '',
    petId: 0,
    mood: 'happy' as 'happy' | 'sad' | 'neutral' | 'excited' | 'tired',
    taggedItems: [] as string[],
    photos: [] as string[],
    videos: [] as string[],
    activities: {} as Activity
  });
  
  const [tagInput, setTagInput] = useState('');
  const [mediaPreview, setMediaPreview] = useState<{photos: string[], videos: string[]}>({photos: [], videos: []});
  const [useAIMode, setUseAIMode] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  // 초기 데이터로 폼 초기화
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setMediaPreview({
        photos: initialData.photos || [],
        videos: initialData.videos || []
      });
    } else {
      resetForm();
    }
  }, [initialData, open]);
  
  // 폼 초기화
  const resetForm = () => {
    setForm({
      title: '',
      content: '',
      petId: pets.length > 0 ? pets[0].id : 0,
      mood: 'happy',
      taggedItems: [],
      photos: [],
      videos: [],
      activities: {}
    });
    setMediaPreview({photos: [], videos: []});
    setTagInput('');
    setUseAIMode(false);
  };
  
  // 폼 제출
  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast({
        title: "제목을 입력해주세요",
        variant: "destructive"
      });
      return;
    }
    
    if (!form.petId) {
      toast({
        title: "반려견을 선택해주세요",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(form);
    resetForm();
    onOpenChange(false);
  };
  
  // 사진 파일 선택
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newPhotos: string[] = [];
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const photoUrl = event.target.result.toString();
            newPhotos.push(photoUrl);
            
            if (newPhotos.length === files.length) {
              setForm(prev => ({
                ...prev,
                photos: [...prev.photos, ...newPhotos]
              }));
              
              setMediaPreview(prev => ({
                ...prev,
                photos: [...prev.photos, ...newPhotos]
              }));
            }
          }
        };
        reader.readAsDataURL(file);
      });
      
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // 동영상 파일 선택
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newVideos: string[] = [];
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const videoUrl = event.target.result.toString();
            newVideos.push(videoUrl);
            
            if (newVideos.length === files.length) {
              setForm(prev => ({
                ...prev,
                videos: [...prev.videos, ...newVideos]
              }));
              
              setMediaPreview(prev => ({
                ...prev,
                videos: [...prev.videos, ...newVideos]
              }));
            }
          }
        };
        reader.readAsDataURL(file);
      });
      
      // 파일 입력 초기화
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };
  
  // 미디어 파일 제거
  const handleDeleteMedia = (type: 'photo' | 'video', index: number) => {
    if (type === 'photo') {
      setForm(prev => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index)
      }));
      
      setMediaPreview(prev => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index)
      }));
    } else {
      setForm(prev => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== index)
      }));
      
      setMediaPreview(prev => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== index)
      }));
    }
  };
  
  // AI로 내용 생성
  const generateAIContent = async () => {
    if (!form.petId) {
      toast({
        title: "반려견을 선택해주세요",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const pet = pets.find(p => p.id === form.petId);
      if (!pet) return;
      
      toast({
        title: "AI로 내용 생성 중...",
        description: "잠시만 기다려주세요."
      });
      
      const { generateNotebookEntry } = await import('@/lib/notebook-ai');
      const result = await generateNotebookEntry(
        pet.name,
        pet.breed,
        form.activities,
        form.content
      );
      
      setForm(prev => ({
        ...prev,
        title: result.title,
        content: result.content
      }));
      
      toast({
        title: "AI 생성 완료",
        description: "내용이 자동으로 생성되었습니다."
      });
    } catch (error) {
      console.error("AI 생성 오류:", error);
      toast({
        title: "AI 생성 실패",
        description: "내용 생성에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? '알림장 수정' : '새 알림장 작성'}</DialogTitle>
          <DialogDescription>
            {initialData ? '알림장을 수정합니다.' : '새로운 알림장을 작성합니다.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="petId">반려견 선택</Label>
            <Select 
              value={form.petId.toString()} 
              onValueChange={(value) => {
                setForm(prev => ({
                  ...prev,
                  petId: parseInt(value)
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="반려견을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {pets.map(pet => (
                  <SelectItem key={pet.id} value={pet.id.toString()}>
                    {pet.name} ({pet.breed})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <div className="flex gap-2">
              <Input
                id="title"
                value={form.title}
                onChange={e => setForm(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                placeholder="알림장 제목을 입력하세요"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setUseAIMode(!useAIMode)}
                className={useAIMode ? "bg-primary/20" : ""}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                AI 활용
              </Button>
            </div>
          </div>
          
          {useAIMode && (
            <ActivityRecorder 
              value={form.activities} 
              onChange={(activities) => {
                // 활동 정보를 텍스트로 변환
                const activityText = generateActivityText(activities);
                
                // 폼 업데이트
                setForm(prev => ({
                  ...prev,
                  activities,
                  // 기존 내용의 끝에 활동 텍스트 추가
                  content: activityText ? `${prev.content}\n\n${activityText}` : prev.content
                }));
                
                // 알림 표시
                toast({
                  title: "활동 정보가 추가되었습니다",
                  description: "선택한 활동이 알림장 내용에 추가되었습니다."
                });
              }}
            />
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="content">내용</Label>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={onShowTemplateDialog}
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  템플릿 사용
                </Button>
                {useAIMode && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={generateAIContent}
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    AI로 내용 생성
                  </Button>
                )}
              </div>
            </div>
            <Textarea
              id="content"
              value={form.content}
              onChange={e => setForm(prev => ({
                ...prev,
                content: e.target.value
              }))}
              placeholder="알림장 내용을 입력하세요"
              rows={8}
            />
          </div>
          <div className="space-y-2">
            <Label>기분</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={form.mood === 'happy' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setForm(prev => ({ ...prev, mood: 'happy' }))}
              >
                행복해요 😊
              </Button>
              <Button
                type="button"
                variant={form.mood === 'sad' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setForm(prev => ({ ...prev, mood: 'sad' }))}
              >
                슬퍼요 😢
              </Button>
              <Button
                type="button"
                variant={form.mood === 'neutral' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setForm(prev => ({ ...prev, mood: 'neutral' }))}
              >
                보통이에요 😐
              </Button>
              <Button
                type="button"
                variant={form.mood === 'excited' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setForm(prev => ({ ...prev, mood: 'excited' }))}
              >
                신나요 😃
              </Button>
              <Button
                type="button"
                variant={form.mood === 'tired' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setForm(prev => ({ ...prev, mood: 'tired' }))}
              >
                피곤해요 😴
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>관련 태그</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.taggedItems.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        taggedItems: prev.taggedItems.filter((_, i) => i !== index)
                      }));
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="태그 입력"
                onKeyDown={e => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    e.preventDefault();
                    setForm(prev => ({
                      ...prev,
                      taggedItems: [...prev.taggedItems, tagInput.trim()]
                    }));
                    setTagInput('');
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  if (tagInput.trim()) {
                    setForm(prev => ({
                      ...prev,
                      taggedItems: [...prev.taggedItems, tagInput.trim()]
                    }));
                    setTagInput('');
                  }
                }}
              >
                추가
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>미디어</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">사진</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image className="mr-2 h-4 w-4" />
                    사진 추가
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    multiple
                  />
                </div>
                {mediaPreview.photos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {mediaPreview.photos.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`미리보기 ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md cursor-pointer"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteMedia('photo', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">사진 없음</p>
                  </div>
                )}
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">동영상</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    동영상 추가
                  </Button>
                  <input
                    type="file"
                    ref={videoInputRef}
                    className="hidden"
                    accept="video/*"
                    onChange={handleVideoChange}
                    multiple
                  />
                </div>
                {mediaPreview.videos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {mediaPreview.videos.map((url, index) => (
                      <div key={index} className="relative group">
                        <video
                          src={url}
                          className="w-full h-24 object-cover rounded-md cursor-pointer"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteMedia('video', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">동영상 없음</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
          >
            취소
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {initialData ? '수정' : '작성'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}