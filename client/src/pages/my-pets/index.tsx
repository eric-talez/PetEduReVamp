
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Heart, Calendar, Weight, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  weight: number;
  color: string;
  personality: string;
  medicalHistory: string;
  specialNotes: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PetFormData {
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  weight: number;
  color: string;
  personality: string;
  medicalHistory: string;
  specialNotes: string;
  imageUrl?: string;
}

export default function MyPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState<PetFormData>({
    name: '',
    species: 'dog',
    breed: '',
    age: 0,
    gender: 'male',
    weight: 0,
    color: '',
    personality: '',
    medicalHistory: '',
    specialNotes: '',
    imageUrl: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/pets', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPets(Array.isArray(data) ? data : data.pets || []);
      } else {
        setPets([]);
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "반려동물 목록을 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingPet ? `/api/pets/${editingPet.id}` : '/api/pets';
      const method = editingPet ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "성공",
          description: editingPet ? "반려동물 정보가 수정되었습니다." : "새 반려동물이 등록되었습니다."
        });
        setIsDialogOpen(false);
        setEditingPet(null);
        resetForm();
        fetchPets();
      } else {
        throw new Error('Failed to save pet');
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "반려동물 정보 저장에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      weight: pet.weight,
      color: pet.color,
      personality: pet.personality,
      medicalHistory: pet.medicalHistory,
      specialNotes: pet.specialNotes,
      imageUrl: pet.imageUrl || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (petId: number) => {
    if (!confirm('정말로 이 반려동물을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/pets/${petId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "성공",
          description: "반려동물이 삭제되었습니다."
        });
        fetchPets();
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "반려동물 삭제에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      species: 'dog',
      breed: '',
      age: 0,
      gender: 'male',
      weight: 0,
      color: '',
      personality: '',
      medicalHistory: '',
      specialNotes: '',
      imageUrl: ''
    });
  };

  const openNewPetDialog = () => {
    setEditingPet(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData({ ...formData, imageUrl });
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">반려동물 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">내 반려동물</h1>
          <p className="text-gray-600 mt-2">소중한 반려동물들의 정보를 관리하세요</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewPetDialog} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              반려동물 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPet ? '반려동물 정보 수정' : '새 반려동물 등록'}
              </DialogTitle>
              <DialogDescription>
                반려동물의 기본 정보를 입력해주세요.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 이미지 업로드 섹션 */}
              <div className="space-y-4">
                <Label>반려동물 사진</Label>
                {formData.imageUrl ? (
                  <div className="relative inline-block">
                    <img 
                      src={formData.imageUrl} 
                      alt="반려동물 사진" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0"
                      onClick={handleRemoveImage}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <ImageUpload
                    onUpload={handleImageUpload}
                    acceptedTypes={['image/*']}
                    maxSize={5}
                  />
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4"></div>
                <div>
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="species">종류 *</Label>
                  <Select value={formData.species} onValueChange={(value) => setFormData({ ...formData, species: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">강아지</SelectItem>
                      <SelectItem value="cat">고양이</SelectItem>
                      <SelectItem value="rabbit">토끼</SelectItem>
                      <SelectItem value="bird">새</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="breed">품종</Label>
                  <Input
                    id="breed"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="age">나이</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="gender">성별</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">수컷</SelectItem>
                      <SelectItem value="female">암컷</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="weight">몸무게 (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="color">색상</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="personality">성격</Label>
                  <Textarea
                    id="personality"
                    value={formData.personality}
                    onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                    placeholder="반려동물의 성격을 설명해주세요"
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="medicalHistory">병력</Label>
                  <Textarea
                    id="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                    placeholder="병력이나 알레르기 등을 기록해주세요"
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="specialNotes">특이사항</Label>
                  <Textarea
                    id="specialNotes"
                    value={formData.specialNotes}
                    onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                    placeholder="특별히 주의할 점이나 기타 사항을 기록해주세요"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  취소
                </Button>
                <Button type="submit">
                  {editingPet ? '수정' : '등록'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {pets.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">등록된 반려동물이 없습니다</h3>
            <p className="text-gray-600 mb-6">첫 번째 반려동물을 등록해보세요!</p>
            <Button onClick={openNewPetDialog}>
              <Plus className="w-4 h-4 mr-2" />
              반려동물 등록
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden">
              {/* 반려동물 이미지 */}
              {pet.imageUrl && (
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={pet.imageUrl} 
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{pet.name}</CardTitle>
                    <CardDescription>
                      {pet.species === 'dog' ? '🐶' : pet.species === 'cat' ? '🐱' : '🐾'} {pet.breed}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(pet)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(pet.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 mr-1" />
                    {pet.age}세
                  </Badge>
                  <Badge variant="secondary">
                    <Weight className="w-3 h-3 mr-1" />
                    {pet.weight}kg
                  </Badge>
                  <Badge variant="outline">
                    {pet.gender === 'male' ? '♂' : '♀'}
                  </Badge>
                </div>
                
                {pet.color && (
                  <p className="text-sm text-gray-600">
                    <strong>색상:</strong> {pet.color}
                  </p>
                )}
                
                {pet.personality && (
                  <p className="text-sm text-gray-600">
                    <strong>성격:</strong> {pet.personality}
                  </p>
                )}
                
                {pet.specialNotes && (
                  <p className="text-sm text-gray-600">
                    <strong>특이사항:</strong> {pet.specialNotes}
                  </p>
                )}
                
                <div className="text-xs text-gray-500 pt-2 border-t">
                  등록일: {new Date(pet.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
