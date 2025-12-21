import { useState, useEffect, useRef } from 'react';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Camera, 
  Phone,
  Mail,
  Calendar,
  Edit,
  Save,
  X,
  Upload,
  MapPin
} from 'lucide-react';

interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  bio: string;
  profileImage: string;
  avatar: string;
  address: string;
  createdAt: string;
}

interface ProfilePageProps {
  userType?: string;
}

export default function ProfilePage({ userType }: ProfilePageProps) {
  const { userId, userName, userRole } = useGlobalAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setProfile(data.data);
          setEditForm(data.data);
        }
      } else {
        setProfile({
          id: userId,
          username: userName || '',
          name: userName || '',
          email: '',
          phone: '',
          phoneNumber: '',
          birthDate: '',
          gender: '',
          bio: '',
          profileImage: '',
          avatar: '',
          address: '',
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('프로필 로드 오류:', error);
      toast({
        title: "오류",
        description: "프로필을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "오류",
        description: "이미지 파일만 업로드할 수 있습니다.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "오류",
        description: "파일 크기는 5MB 이하여야 합니다.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.url || data.imageUrl;
        
        const updateResponse = await fetch('/api/user/profile/image', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileImage: imageUrl }),
          credentials: 'include'
        });

        if (updateResponse.ok) {
          setProfile(prev => prev ? { ...prev, profileImage: imageUrl } : null);
          setEditForm(prev => ({ ...prev, profileImage: imageUrl }));
          toast({
            title: "성공",
            description: "프로필 사진이 업데이트되었습니다."
          });
        }
      } else {
        throw new Error('업로드 실패');
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      toast({
        title: "오류",
        description: "이미지 업로드 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.data || editForm as UserProfile);
        setIsEditing(false);
        toast({
          title: "성공",
          description: "프로필이 업데이트되었습니다."
        });
      } else {
        throw new Error('저장 실패');
      }
    } catch (error) {
      console.error('프로필 저장 오류:', error);
      toast({
        title: "오류",
        description: "프로필 저장 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const getAvatarUrl = () => {
    if (profile?.profileImage) return profile.profileImage;
    if (profile?.avatar) return profile.avatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || userName || 'U')}&background=2BAA61&color=fff`;
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'admin': return '시스템 관리자';
      case 'trainer': return '훈련사';
      case 'institute-admin': return '기관 관리자';
      case 'pet-owner': return '견주 회원';
      default: return '일반 회원';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">내 프로필</h1>
        <p className="text-muted-foreground">프로필 정보를 확인하고 수정할 수 있습니다.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                프로필 정보
              </CardTitle>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  편집
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    setIsEditing(false);
                    setEditForm(profile || {});
                  }}>
                    <X className="w-4 h-4 mr-2" />
                    취소
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-primary">
                    <AvatarImage src={getAvatarUrl()} alt={profile?.name || '사용자'} />
                    <AvatarFallback className="bg-primary text-white text-3xl">
                      {(profile?.name || userName || 'U').substring(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    data-testid="button-upload-profile-image"
                  >
                    {isUploading ? (
                      <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Camera className="w-8 h-8 text-white" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    data-testid="input-profile-image"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  클릭하여 사진 변경
                </p>
                <div className="mt-4 text-center">
                  <p className="font-semibold text-lg">{profile?.name || userName}</p>
                  <p className="text-sm text-muted-foreground">{getRoleLabel()}</p>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        data-testid="input-name"
                      />
                    ) : (
                      <p className="text-sm py-2">{profile?.name || '-'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">아이디</Label>
                    <p className="text-sm py-2 text-muted-foreground">{profile?.username}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      이메일
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        data-testid="input-email"
                      />
                    ) : (
                      <p className="text-sm py-2">{profile?.email || '-'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      전화번호
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editForm.phoneNumber || editForm.phone || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        placeholder="010-0000-0000"
                        data-testid="input-phone"
                      />
                    ) : (
                      <p className="text-sm py-2">{profile?.phoneNumber || profile?.phone || '-'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      생년월일
                    </Label>
                    {isEditing ? (
                      <Input
                        id="birthDate"
                        type="date"
                        value={editForm.birthDate || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, birthDate: e.target.value }))}
                        data-testid="input-birthdate"
                      />
                    ) : (
                      <p className="text-sm py-2">{profile?.birthDate || '-'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">성별</Label>
                    {isEditing ? (
                      <select
                        id="gender"
                        value={editForm.gender || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        data-testid="select-gender"
                      >
                        <option value="">선택하세요</option>
                        <option value="male">남성</option>
                        <option value="female">여성</option>
                      </select>
                    ) : (
                      <p className="text-sm py-2">
                        {profile?.gender === 'male' ? '남성' : profile?.gender === 'female' ? '여성' : '-'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    주소
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={editForm.address || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="주소를 입력하세요"
                      data-testid="input-address"
                    />
                  ) : (
                    <p className="text-sm py-2">{profile?.address || '-'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">자기소개</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={editForm.bio || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="자기소개를 입력하세요"
                      rows={4}
                      data-testid="input-bio"
                    />
                  ) : (
                    <p className="text-sm py-2 whitespace-pre-wrap">{profile?.bio || '-'}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
