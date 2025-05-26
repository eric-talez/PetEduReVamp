import { useState, useEffect } from 'react';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart,
  Calendar,
  Users,
  UserCheck,
  Plus,
  Search,
  Filter
} from 'lucide-react';

interface Assignment {
  id: number;
  petName: string;
  ownerName: string;
  trainerName: string;
  courseName: string;
  startDate: string;
  status: 'active' | 'completed' | 'pending';
  progress: number;
}

export default function InstitutePetAssignments() {
  const { userName } = useGlobalAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssignments = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockAssignments: Assignment[] = [
          {
            id: 1,
            petName: '콩이',
            ownerName: '김철수',
            trainerName: '김영수',
            courseName: '기본 훈련',
            startDate: '2024-05-15',
            status: 'active',
            progress: 60
          },
          {
            id: 2,
            petName: '바둑이',
            ownerName: '이영희',
            trainerName: '이서연',
            courseName: '퍼피 사회화',
            startDate: '2024-05-10',
            status: 'active',
            progress: 40
          }
        ];
        
        setAssignments(mockAssignments);
      } catch (error) {
        console.error('배정 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '반려견 배정 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAssignments();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <Heart className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">반려견 배정 정보 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">반려견 배정</h1>
          <p className="text-muted-foreground">반려견과 훈련사 배정을 관리하세요</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 배정
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                {assignment.petName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">보호자</p>
                  <p className="font-medium">{assignment.ownerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">담당 훈련사</p>
                  <p className="font-medium">{assignment.trainerName}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">진행률</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${assignment.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{assignment.progress}% 완료</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}