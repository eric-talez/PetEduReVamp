import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// 비밀번호 재설정 요청 스키마
const passwordResetSchema = z.object({
  username: z.string().min(1, '아이디를 입력해주세요'),
  email: z.string().email('유효한 이메일 주소를 입력해주세요')
});

// 비밀번호 변경 스키마
const passwordChangeSchema = z.object({
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  confirmPassword: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다')
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"]
});

type PasswordResetFormProps = {
  onClose: () => void;
  token?: string;
};

export function PasswordResetForm({ onClose, token }: PasswordResetFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'request' | 'success' | 'change'>(token ? 'change' : 'request');
  const [resetToken, setResetToken] = useState<string>(token || '');

  // 비밀번호 재설정 요청 폼
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors }
  } = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema)
  });

  // 비밀번호 변경 폼
  const {
    register: registerChange,
    handleSubmit: handleChangeSubmit,
    formState: { errors: changeErrors }
  } = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema)
  });

  // 비밀번호 재설정 요청 처리
  const onResetSubmit = async (data: z.infer<typeof passwordResetSchema>) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('서버 오류가 발생했습니다.');
      }

      const result = await response.json();
      setStep('success');
      toast({
        title: '비밀번호 재설정 이메일 발송 완료',
        description: result.message,
      });
    } catch (error) {
      toast({
        title: '오류 발생',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 변경 처리
  const onChangeSubmit = async (data: z.infer<typeof passwordChangeSchema>) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: resetToken,
          password: data.password
        })
      });

      if (!response.ok) {
        throw new Error('서버 오류가 발생했습니다.');
      }

      const result = await response.json();
      toast({
        title: '비밀번호 변경 완료',
        description: result.message,
      });
      onClose();
    } catch (error) {
      toast({
        title: '오류 발생',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="text-center p-4">
        <h3 className="text-lg font-bold mb-4">이메일 발송 완료</h3>
        <p className="mb-6">
          비밀번호 재설정 안내 이메일이 발송되었습니다. 이메일을 확인하고 비밀번호를 재설정해주세요.
        </p>
        <Button onClick={onClose} className="w-full">확인</Button>
      </div>
    );
  }

  if (step === 'change') {
    return (
      <form onSubmit={handleChangeSubmit(onChangeSubmit)} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            새 비밀번호
          </label>
          <Input
            id="password"
            type="password"
            disabled={isLoading}
            {...registerChange('password')}
          />
          {changeErrors.password && (
            <p className="text-red-500 text-xs mt-1">{changeErrors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            비밀번호 확인
          </label>
          <Input
            id="confirmPassword"
            type="password"
            disabled={isLoading}
            {...registerChange('confirmPassword')}
          />
          {changeErrors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{changeErrors.confirmPassword.message}</p>
          )}
        </div>

        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          비밀번호 변경
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          아이디
        </label>
        <Input
          id="username"
          type="text"
          disabled={isLoading}
          {...registerReset('username')}
        />
        {resetErrors.username && (
          <p className="text-red-500 text-xs mt-1">{resetErrors.username.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          이메일
        </label>
        <Input
          id="email"
          type="email"
          disabled={isLoading}
          {...registerReset('email')}
        />
        {resetErrors.email && (
          <p className="text-red-500 text-xs mt-1">{resetErrors.email.message}</p>
        )}
      </div>

      <div className="flex space-x-2 pt-2">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1"
        >
          취소
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          요청
        </Button>
      </div>
    </form>
  );
}