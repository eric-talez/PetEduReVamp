import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function NewCourseDialog({ open, onOpenChange, onSuccess }: NewCourseDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState('8');
  const [maxStudents, setMaxStudents] = useState('20');
  const [price, setPrice] = useState('350000');

  const handleSubmit = useCallback(() => {
    console.log('과정 생성 - 제출 데이터:', {
      title,
      description,
      type,
      level,
      duration: parseInt(duration),
      maxStudents: parseInt(maxStudents),
      price: parseInt(price),
    });

    toast({
      title: "교육 과정 생성",
      description: "새 교육 과정이 초안으로 생성되었습니다.",
    });

    // 폼 초기화
    setTitle('');
    setDescription('');
    setType('');
    setLevel('');
    setDuration('8');
    setMaxStudents('20');
    setPrice('350000');

    // 성공 콜백 호출
    if (onSuccess) {
      onSuccess();
    }

    // 다이얼로그 닫기
    onOpenChange(false);
  }, [title, description, type, level, duration, maxStudents, price, toast, onOpenChange, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>새 교육 과정 생성</DialogTitle>
          <DialogDescription>
            새로운 교육 과정 정보를 입력하세요. 나중에 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              과정명
            </Label>
            <Input
              id="title"
              placeholder="교육 과정 이름"
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              설명
            </Label>
            <Input
              id="description"
              placeholder="교육 과정에 대한 설명"
              className="col-span-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              유형
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type" className="col-span-3">
                <SelectValue placeholder="교육 과정 유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="기초 훈련">기초 훈련</SelectItem>
                <SelectItem value="문제행동 교정">문제행동 교정</SelectItem>
                <SelectItem value="사회화">사회화</SelectItem>
                <SelectItem value="특수 훈련">특수 훈련</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right">
              난이도
            </Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger id="level" className="col-span-3">
                <SelectValue placeholder="난이도 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">초급</SelectItem>
                <SelectItem value="intermediate">중급</SelectItem>
                <SelectItem value="advanced">고급</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              기간 (주)
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              placeholder="8"
              className="col-span-3"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxStudents" className="text-right">
              최대 수강생
            </Label>
            <Input
              id="maxStudents"
              type="number"
              min="1"
              placeholder="20"
              className="col-span-3"
              value={maxStudents}
              onChange={(e) => setMaxStudents(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              수강료
            </Label>
            <Input
              id="price"
              type="number"
              min="0"
              placeholder="350000"
              className="col-span-3"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSubmit}
          >
            과정 생성
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}