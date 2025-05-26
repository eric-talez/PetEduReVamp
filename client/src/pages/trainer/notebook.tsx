import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Edit, Trash2, BookOpen, Calendar, User } from "lucide-react";
import { useState } from "react";

export default function TrainerNotebook() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // 샘플 노트북 데이터
  const notes = [
    {
      id: 1,
      title: "골든 리트리버 - 기본 복종 훈련",
      student: "김철수",
      pet: "Max",
      category: "basic-training",
      date: "2024-01-20",
      content: "오늘은 앉기와 기다리기 명령을 집중적으로 훈련했습니다. Max는 앉기에 대해서는 90% 성공률을 보였으나...",
      tags: ["복종훈련", "골든리트리버", "기초"]
    },
    {
      id: 2,
      title: "말티즈 - 짖음 교정 훈련",
      student: "이영희",
      pet: "Luna",
      category: "behavior-correction",
      date: "2024-01-19",
      content: "방문자에 대한 과도한 짖음을 줄이기 위한 훈련을 진행했습니다. 조용히 하기 명령에 대한 반응이...",
      tags: ["행동교정", "말티즈", "짖음"]
    },
    {
      id: 3,
      title: "시베리안 허스키 - 산책 훈련",
      student: "박민수",
      pet: "Storm",
      category: "leash-training",
      date: "2024-01-18",
      content: "끌림 없는 산책을 위한 리드줄 훈련을 실시했습니다. 허스키 특성상 에너지가 많아서...",
      tags: ["산책훈련", "허스키", "리드줄"]
    }
  ];

  const getCategoryBadge = (category: string) => {
    const categoryMap: Record<string, { label: string; className: string }> = {
      'basic-training': { label: '기초훈련', className: 'bg-blue-100 text-blue-800' },
      'behavior-correction': { label: '행동교정', className: 'bg-orange-100 text-orange-800' },
      'leash-training': { label: '산책훈련', className: 'bg-green-100 text-green-800' },
      'agility': { label: '민첩성', className: 'bg-purple-100 text-purple-800' }
    };
    
    const categoryInfo = categoryMap[category] || { label: category, className: 'bg-gray-100 text-gray-800' };
    return (
      <Badge className={categoryInfo.className}>
        {categoryInfo.label}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">훈련 노트북</h1>
          <p className="text-muted-foreground">훈련 과정과 진행 상황을 기록하고 관리합니다</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 훈련 기록 작성
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 훈련 기록</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              +12 이번주 신규
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 훈련생</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              현재 훈련 진행 중
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번주 세션</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              +3 지난주 대비
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료율</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              목표 달성률
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>훈련 기록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목, 훈련생, 반려동물명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="카테고리 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="basic-training">기초훈련</SelectItem>
                <SelectItem value="behavior-correction">행동교정</SelectItem>
                <SelectItem value="leash-training">산책훈련</SelectItem>
                <SelectItem value="agility">민첩성</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              고급 필터
            </Button>
          </div>

          {/* 노트 카드 목록 */}
          <div className="grid gap-4">
            {notes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>훈련생: {note.student}</span>
                        <span>반려동물: {note.pet}</span>
                        <span>{note.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(note.category)}
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {note.content}
                  </p>
                  <div className="flex gap-2">
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}