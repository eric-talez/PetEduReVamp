import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Check, Copy, Mail, Plus, Send, Trash, Upload, User, UserPlus, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Papa from 'papaparse';

// 초대 상태 타입
type InviteStatus = 'pending' | 'sent' | 'accepted' | 'expired';

// 초대장 타입
interface Invitation {
  id: string;
  email: string;
  name: string;
  role: string;
  status: InviteStatus;
  createdAt: string;
  expiresAt: string;
  sentAt?: string;
  acceptedAt?: string;
  inviteCode: string;
}

// 역할 옵션
const roleOptions = [
  { value: 'pet-owner', label: '반려인' },
  { value: 'trainer', label: '훈련사' },
  { value: 'institute-admin', label: '기관 관리자' },
];

// 임시 초대장 데이터
const sampleInvitations: Invitation[] = [
  {
    id: '1',
    email: 'kim@example.com',
    name: '김테스터',
    role: 'pet-owner',
    status: 'pending',
    createdAt: '2025-05-01T12:00:00Z',
    expiresAt: '2025-05-15T12:00:00Z',
    inviteCode: 'INV-1234-ABCD',
  },
  {
    id: '2',
    email: 'park@example.com',
    name: '박훈련',
    role: 'trainer',
    status: 'sent',
    createdAt: '2025-05-02T14:00:00Z',
    sentAt: '2025-05-02T14:05:00Z',
    expiresAt: '2025-05-16T14:00:00Z',
    inviteCode: 'INV-5678-EFGH',
  },
  {
    id: '3',
    email: 'lee@example.com',
    name: '이사용자',
    role: 'pet-owner',
    status: 'accepted',
    createdAt: '2025-05-03T09:00:00Z',
    sentAt: '2025-05-03T09:10:00Z',
    acceptedAt: '2025-05-04T10:30:00Z',
    expiresAt: '2025-05-17T09:00:00Z',
    inviteCode: 'INV-9012-IJKL',
  },
  {
    id: '4',
    email: 'choi@example.com',
    name: '최기관',
    role: 'institute-admin',
    status: 'expired',
    createdAt: '2025-04-20T11:00:00Z',
    sentAt: '2025-04-20T11:15:00Z',
    expiresAt: '2025-05-04T11:00:00Z',
    inviteCode: 'INV-3456-MNOP',
  },
];

// 상태별 배지 스타일
const statusBadgeStyles: Record<InviteStatus, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
  pending: { variant: "outline", label: "대기 중" },
  sent: { variant: "secondary", label: "발송됨" },
  accepted: { variant: "default", label: "수락됨" },
  expired: { variant: "destructive", label: "만료됨" },
};

// 날짜 포맷팅 함수
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 새 초대장 양식
interface InviteFormData {
  email: string;
  name: string;
  role: string;
  message?: string;
}

export default function InviteManagement() {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>(sampleInvitations);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bulkInviteDialogOpen, setBulkInviteDialogOpen] = useState(false);
  const [newInviteDialogOpen, setNewInviteDialogOpen] = useState(false);
  const [bulkInviteData, setBulkInviteData] = useState<string>('');
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [sendImmediately, setSendImmediately] = useState(true);
  const [newInvite, setNewInvite] = useState<InviteFormData>({
    email: '',
    name: '',
    role: 'pet-owner',
    message: '',
  });

  // 초대장 필터링
  const filteredInvitations = invitations.filter((invite) => {
    // 상태 필터링
    if (filterStatus !== 'all' && invite.status !== filterStatus) {
      return false;
    }
    
    // 역할 필터링
    if (filterRole !== 'all' && invite.role !== filterRole) {
      return false;
    }
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        invite.email.toLowerCase().includes(query) ||
        invite.name.toLowerCase().includes(query) ||
        invite.inviteCode.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // 새 초대장 생성
  const handleCreateInvite = () => {
    if (!newInvite.email || !newInvite.name || !newInvite.role) {
      toast({
        title: "필수 정보 누락",
        description: "이메일, 이름, 역할은 필수 항목입니다.",
        variant: "destructive",
      });
      return;
    }
    
    const now = new Date();
    const expires = new Date();
    expires.setDate(now.getDate() + 14); // 14일 후 만료
    
    const newInvitation: Invitation = {
      id: `${invitations.length + 1}`,
      email: newInvite.email,
      name: newInvite.name,
      role: newInvite.role,
      status: sendImmediately ? 'sent' : 'pending',
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      sentAt: sendImmediately ? now.toISOString() : undefined,
      inviteCode: `INV-${Math.floor(1000 + Math.random() * 9000)}-${Array.from(Array(4), () => 
        String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('')}`,
    };
    
    setInvitations([...invitations, newInvitation]);
    
    toast({
      title: "초대장 생성 완료",
      description: sendImmediately 
        ? `${newInvite.email}로 초대장이 발송되었습니다.` 
        : `${newInvite.email}에 대한 초대장이 생성되었습니다.`,
    });
    
    // 폼 초기화
    setNewInvite({
      email: '',
      name: '',
      role: 'pet-owner',
      message: '',
    });
    
    setNewInviteDialogOpen(false);
  };

  // 초대장 재발송
  const handleResendInvite = (id: string) => {
    setInvitations(invitations.map(invite => {
      if (invite.id === id) {
        return {
          ...invite,
          status: 'sent',
          sentAt: new Date().toISOString(),
        };
      }
      return invite;
    }));
    
    toast({
      title: "초대장 재발송 완료",
      description: "선택한 초대장이 재발송되었습니다.",
    });
  };

  // 초대장 삭제
  const handleDeleteInvite = (id: string) => {
    setInvitations(invitations.filter(invite => invite.id !== id));
    
    toast({
      title: "초대장 삭제 완료",
      description: "선택한 초대장이 삭제되었습니다.",
    });
  };

  // 초대 코드 복사
  const handleCopyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    
    toast({
      title: "초대 코드 복사됨",
      description: "초대 코드가 클립보드에 복사되었습니다.",
    });
  };

  // CSV 파일 처리
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const csvText = results.data
          .map((row: any) => `${row.email},${row.name},${row.role || 'pet-owner'}`)
          .join('\n');
        
        setBulkInviteData(csvText);
        setCsvPreview(results.data.slice(0, 5));
        setShowPreview(true);
      },
      error: () => {
        toast({
          title: "CSV 파일 처리 오류",
          description: "CSV 파일을 처리하는 동안 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    });
  };

  // 대량 초대장 처리
  const handleBulkInvite = () => {
    if (!bulkInviteData.trim()) {
      toast({
        title: "데이터 없음",
        description: "초대할 사용자 데이터가 없습니다.",
        variant: "destructive",
      });
      return;
    }
    
    const lines = bulkInviteData.trim().split('\n');
    const now = new Date();
    const expires = new Date();
    expires.setDate(now.getDate() + 14); // 14일 후 만료
    
    const newInvites = lines.map((line, index) => {
      const [email, name, role] = line.split(',').map(item => item.trim());
      
      return {
        id: `bulk-${invitations.length + index + 1}`,
        email: email || `user${index + 1}@example.com`,
        name: name || `사용자 ${index + 1}`,
        role: role || 'pet-owner',
        status: sendImmediately ? 'sent' : 'pending',
        createdAt: now.toISOString(),
        expiresAt: expires.toISOString(),
        sentAt: sendImmediately ? now.toISOString() : undefined,
        inviteCode: `INV-${Math.floor(1000 + Math.random() * 9000)}-${Array.from(Array(4), () => 
          String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('')}`,
      } as Invitation;
    });
    
    setInvitations([...invitations, ...newInvites]);
    
    toast({
      title: "대량 초대장 처리 완료",
      description: `${newInvites.length}개의 초대장이 ${sendImmediately ? '발송' : '생성'}되었습니다.`,
    });
    
    setBulkInviteData('');
    setCsvPreview([]);
    setShowPreview(false);
    setBulkInviteDialogOpen(false);
  };

  // 대기 중인 모든 초대장 발송
  const handleSendAllPending = () => {
    const pendingCount = invitations.filter(invite => invite.status === 'pending').length;
    
    if (pendingCount === 0) {
      toast({
        title: "대기 중인 초대장 없음",
        description: "발송할 대기 중인 초대장이 없습니다.",
        variant: "destructive",
      });
      return;
    }
    
    setInvitations(invitations.map(invite => {
      if (invite.status === 'pending') {
        return {
          ...invite,
          status: 'sent',
          sentAt: new Date().toISOString(),
        };
      }
      return invite;
    }));
    
    toast({
      title: "대기 중인 초대장 발송 완료",
      description: `${pendingCount}개의 대기 중인 초대장이 발송되었습니다.`,
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">초대장 관리</h1>
        <p className="text-muted-foreground">
          베타 테스터 및 새 사용자 초대를 관리합니다. 개별 또는 대량으로 초대장을 발송할 수 있습니다.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="w-full sm:w-auto">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="pending">대기 중</SelectItem>
                <SelectItem value="sent">발송됨</SelectItem>
                <SelectItem value="accepted">수락됨</SelectItem>
                <SelectItem value="expired">만료됨</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto">
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="역할 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 역할</SelectItem>
                <SelectItem value="pet-owner">반려인</SelectItem>
                <SelectItem value="trainer">훈련사</SelectItem>
                <SelectItem value="institute-admin">기관 관리자</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto">
            <Input
              placeholder="이메일, 이름 또는 코드 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleSendAllPending}
            className="sm:whitespace-nowrap"
          >
            <Mail className="mr-2 h-4 w-4" />
            대기 중인 초대장 모두 발송
          </Button>
          
          <Dialog open={newInviteDialogOpen} onOpenChange={setNewInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="sm:whitespace-nowrap">
                <UserPlus className="mr-2 h-4 w-4" />
                새 초대장 생성
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>새 초대장 생성</DialogTitle>
                <DialogDescription>
                  새로운 사용자를 플랫폼에 초대합니다. 모든 필수 정보를 입력하세요.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">이메일 주소 *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={newInvite.email}
                    onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    placeholder="홍길동"
                    value={newInvite.name}
                    onChange={(e) => setNewInvite({ ...newInvite, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">역할 *</Label>
                  <Select
                    value={newInvite.role}
                    onValueChange={(value) => setNewInvite({ ...newInvite, role: value })}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="역할 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">초대 메시지 (선택사항)</Label>
                  <Textarea
                    id="message"
                    placeholder="초대 이메일에 포함될 개인 메시지를 입력하세요."
                    value={newInvite.message}
                    onChange={(e) => setNewInvite({ ...newInvite, message: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="send-immediately"
                    checked={sendImmediately}
                    onCheckedChange={setSendImmediately}
                  />
                  <Label htmlFor="send-immediately">생성 후 바로 발송</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewInviteDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleCreateInvite}>
                  초대장 생성
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={bulkInviteDialogOpen} onOpenChange={setBulkInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="sm:whitespace-nowrap">
                <Upload className="mr-2 h-4 w-4" />
                대량 초대
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>대량 초대</DialogTitle>
                <DialogDescription>
                  CSV 파일을 업로드하거나 텍스트 형식으로 이메일 목록을 입력하세요.
                  <br />
                  형식: 이메일,이름,역할 (한 줄에 한 명)
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">CSV 파일 업로드</TabsTrigger>
                  <TabsTrigger value="manual">수동 입력</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="space-y-4">
                  <div className="flex justify-center items-center border-2 border-dashed rounded-md p-6">
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        CSV 파일 선택 또는 여기에 드래그
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (최대 1MB, 헤더 포함)
                      </span>
                      <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleCsvUpload}
                      />
                    </label>
                  </div>
                  {showPreview && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">미리보기 (처음 5개 항목)</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>이메일</TableHead>
                            <TableHead>이름</TableHead>
                            <TableHead>역할</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {csvPreview.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.email}</TableCell>
                              <TableCell>{row.name}</TableCell>
                              <TableCell>
                                {row.role || 'pet-owner'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="manual" className="space-y-4">
                  <Textarea
                    placeholder="이메일,이름,역할&#10;user1@example.com,홍길동,pet-owner&#10;trainer@example.com,김훈련,trainer"
                    value={bulkInviteData}
                    onChange={(e) => setBulkInviteData(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <div className="text-sm text-muted-foreground">
                    <p>각 줄에 한 명의 정보를 입력하세요. 형식: 이메일,이름,역할</p>
                    <p>역할이 지정되지 않은 경우 기본값은 'pet-owner'입니다.</p>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  id="bulk-send-immediately"
                  checked={sendImmediately}
                  onCheckedChange={setSendImmediately}
                />
                <Label htmlFor="bulk-send-immediately">생성 후 바로 발송</Label>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBulkInviteDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleBulkInvite}>
                  대량 초대 처리
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>초대장 목록</CardTitle>
          <CardDescription>
            현재 {filteredInvitations.length}개의 초대장이 표시되고 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이메일</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>역할</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>초대 코드</TableHead>
                  <TableHead>만료일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvitations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      초대장이 없거나 필터 조건에 맞는 초대장이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvitations.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell>{invite.email}</TableCell>
                      <TableCell>{invite.name}</TableCell>
                      <TableCell>
                        {
                          roleOptions.find(r => r.value === invite.role)?.label || 
                          invite.role
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeStyles[invite.status].variant}>
                          {statusBadgeStyles[invite.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">
                            {invite.inviteCode}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopyInviteCode(invite.inviteCode)}
                            aria-label="초대 코드 복사"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={
                          new Date(invite.expiresAt) < new Date() 
                            ? "text-destructive" 
                            : ""
                        }>
                          {formatDate(invite.expiresAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {(invite.status === 'pending' || invite.status === 'expired') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResendInvite(invite.id)}
                              aria-label="초대장 발송"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteInvite(invite.id)}
                            aria-label="초대장 삭제"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            총 {invitations.length}개 중 {filteredInvitations.length}개 표시됨
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setFilterStatus('all')}>
              필터 초기화
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>초대 링크 및 코드</CardTitle>
          <CardDescription>
            공유 가능한 초대 링크와 코드를 생성하고 관리합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="invite-link">초대 링크</Label>
              <div className="flex gap-2">
                <Input
                  id="invite-link"
                  readOnly
                  value={`${window.location.origin}/auth?invite=GLOBAL_BETA_CODE`}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/auth?invite=GLOBAL_BETA_CODE`);
                    toast({
                      title: "링크 복사됨",
                      description: "초대 링크가 클립보드에 복사되었습니다.",
                    });
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  복사
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                이 링크는 모든 베타 테스터에게 제공할 수 있는 일반 초대 링크입니다.
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="invite-code">일반 초대 코드</Label>
              <div className="flex gap-2">
                <Input
                  id="invite-code"
                  readOnly
                  value="GLOBAL_BETA_CODE"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText("GLOBAL_BETA_CODE");
                    toast({
                      title: "코드 복사됨",
                      description: "초대 코드가 클립보드에 복사되었습니다.",
                    });
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  복사
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                가입 페이지에서 이 코드를 입력하면 누구나 베타 테스트에 참여할 수 있습니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}