import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Camera, Phone, Clock, MapPin, FileText } from 'lucide-react';

interface InfoCorrectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  businessId: string;
  currentInfo: {
    address?: string;
    phone?: string;
    hours?: string;
    description?: string;
    services?: string[];
  };
}

interface CorrectionRequest {
  field: string;
  currentValue: string;
  suggestedValue: string;
  reason: string;
  evidence?: File[];
}

export function InfoCorrectionDialog({ 
  isOpen, 
  onClose, 
  businessName, 
  businessId, 
  currentInfo 
}: InfoCorrectionDialogProps) {
  const [selectedField, setSelectedField] = useState<string>('');
  const [suggestedValue, setSuggestedValue] = useState('');
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState<File[]>([]);
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const correctionFields = [
    { value: 'address', label: '주소', icon: MapPin, currentValue: currentInfo.address },
    { value: 'phone', label: '전화번호', icon: Phone, currentValue: currentInfo.phone },
    { value: 'hours', label: '운영시간', icon: Clock, currentValue: currentInfo.hours },
    { value: 'description', label: '업체 설명', icon: FileText, currentValue: currentInfo.description },
    { value: 'services', label: '제공 서비스', icon: FileText, currentValue: currentInfo.services?.join(', ') }
  ];

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/') || file.type === 'application/pdf'
      );
      setEvidence(prev => [...prev, ...newFiles].slice(0, 5)); // 최대 5개 파일
    }
  };

  const removeEvidence = (index: number) => {
    setEvidence(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedField || !suggestedValue || !reason || !reporterName || !reporterEmail) {
      toast({
        title: "필수 정보 누락",
        description: "모든 필수 항목을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const correctionRequest = {
        businessId,
        businessName,
        field: selectedField,
        currentValue: correctionFields.find(f => f.value === selectedField)?.currentValue || '',
        suggestedValue,
        reason,
        reporterName,
        reporterEmail,
        evidence: evidence.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size
        })),
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('정보 수정 요청:', correctionRequest);

      toast({
        title: "수정 요청 완료",
        description: "정보 수정 요청이 접수되었습니다. 검토 후 처리해드리겠습니다."
      });

      // 폼 초기화
      setSelectedField('');
      setSuggestedValue('');
      setReason('');
      setEvidence([]);
      setReporterName('');
      setReporterEmail('');
      onClose();
    } catch (error) {
      toast({
        title: "요청 실패",
        description: "수정 요청 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedFieldInfo = correctionFields.find(f => f.value === selectedField);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            정보 수정 요청 - {businessName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 수정할 항목 선택 */}
          <div className="space-y-2">
            <Label htmlFor="field">수정할 정보 항목 *</Label>
            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger>
                <SelectValue placeholder="수정할 정보를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {correctionFields.map((field) => (
                  <SelectItem key={field.value} value={field.value}>
                    <div className="flex items-center gap-2">
                      <field.icon className="w-4 h-4" />
                      {field.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 현재 정보 표시 */}
          {selectedFieldInfo && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium text-gray-700">현재 정보</Label>
              <p className="text-sm text-gray-600 mt-1">
                {selectedFieldInfo.currentValue || '정보 없음'}
              </p>
            </div>
          )}

          {/* 제안하는 새 정보 */}
          <div className="space-y-2">
            <Label htmlFor="suggested">올바른 정보 *</Label>
            {selectedField === 'services' ? (
              <Textarea
                id="suggested"
                value={suggestedValue}
                onChange={(e) => setSuggestedValue(e.target.value)}
                placeholder="서비스를 쉼표로 구분하여 입력하세요 (예: 기본 훈련, 행동 교정, 퍼피 클래스)"
                rows={3}
              />
            ) : selectedField === 'description' ? (
              <Textarea
                id="suggested"
                value={suggestedValue}
                onChange={(e) => setSuggestedValue(e.target.value)}
                placeholder="올바른 업체 설명을 입력하세요"
                rows={4}
              />
            ) : (
              <Input
                id="suggested"
                value={suggestedValue}
                onChange={(e) => setSuggestedValue(e.target.value)}
                placeholder="올바른 정보를 입력하세요"
              />
            )}
          </div>

          {/* 수정 사유 */}
          <div className="space-y-2">
            <Label htmlFor="reason">수정 사유 *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="정보가 틀린 이유나 근거를 설명해주세요"
              rows={3}
            />
          </div>

          {/* 증빙 자료 업로드 */}
          <div className="space-y-2">
            <Label htmlFor="evidence">증빙 자료 (선택사항)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  사진이나 문서를 업로드하세요 (최대 5개)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="evidence-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('evidence-upload')?.click()}
                >
                  파일 선택
                </Button>
              </div>
              
              {evidence.length > 0 && (
                <div className="mt-4 space-y-2">
                  {evidence.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEvidence(index)}
                      >
                        제거
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 신고자 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="성명을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일 *</Label>
              <Input
                id="email"
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="연락 가능한 이메일"
              />
            </div>
          </div>

          {/* 주의사항 */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">주의사항</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 허위 신고 시 서비스 이용이 제한될 수 있습니다</li>
              <li>• 검토 완료까지 3-5 영업일이 소요됩니다</li>
              <li>• 처리 결과는 이메일로 안내해드립니다</li>
            </ul>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? '요청 중...' : '수정 요청'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}