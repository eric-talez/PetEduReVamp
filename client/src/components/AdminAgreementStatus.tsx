import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AdminAgreementStatusProps {
  user: {
    agreedTerms?: boolean;
    agreedPrivacy?: boolean;
    agreedMarketing?: boolean;
    verifiedAt?: string | Date | null;
  };
  showTitle?: boolean;
}

/**
 * 관리자용 사용자 약관 동의 상태 표시 컴포넌트
 * 
 * 사용자의 이용약관, 개인정보처리방침, 마케팅 동의 상태를 시각적으로 표시합니다.
 */
export default function AdminAgreementStatus({ user, showTitle = false }: AdminAgreementStatusProps) {
  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return '없음';
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="text-sm space-y-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
      {showTitle && (
        <h4 className="font-medium text-base mb-3">약관 동의 상태</h4>
      )}
      
      <div className="flex justify-between items-center">
        <span>이용약관 동의</span>
        {user.agreedTerms ? 
          <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
            <Check className="h-3.5 w-3.5 mr-1" /> 동의함
          </Badge> : 
          <Badge variant="outline" className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">
            <X className="h-3.5 w-3.5 mr-1" /> 미동의
          </Badge>
        }
      </div>
      
      <div className="flex justify-between items-center">
        <span>개인정보처리방침 동의</span>
        {user.agreedPrivacy ? 
          <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
            <Check className="h-3.5 w-3.5 mr-1" /> 동의함
          </Badge> : 
          <Badge variant="outline" className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">
            <X className="h-3.5 w-3.5 mr-1" /> 미동의
          </Badge>
        }
      </div>
      
      <div className="flex justify-between items-center">
        <span>마케팅 수신 동의</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {user.agreedMarketing ? 
                <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                  <Check className="h-3.5 w-3.5 mr-1" /> 동의함
                </Badge> : 
                <Badge variant="outline" className="bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600">
                  선택 미동의
                </Badge>
              }
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">마케팅 동의는 선택사항입니다</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {user.verifiedAt && (
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <span>본인인증 완료일</span>
          <span className="text-xs text-gray-500">{formatDate(user.verifiedAt)}</span>
        </div>
      )}
    </div>
  );
}