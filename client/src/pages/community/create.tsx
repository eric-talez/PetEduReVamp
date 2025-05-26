import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';

// 게시글 작성 폼 유효성 검사 스키마
const postFormSchema = z.object({
  title: z.string()
    .min(2, { message: '제목은 최소 2글자 이상이어야 합니다.' })
    .max(100, { message: '제목은 최대 100글자까지 가능합니다.' }),
  content: z.string()
    .min(10, { message: '내용은 최소 10글자 이상이어야 합니다.' })
    .max(5000, { message: '내용은 최대 5000글자까지 가능합니다.' }),
  tag: z.string().optional(),
  image: z.string().optional(),
});

type PostFormValues = z.infer<typeof postFormSchema>;

export default function CreatePostPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [serverAuthChecked, setServerAuthChecked] = useState(false);

  // 인증 체크 제거 - 서버에서 처리
  React.useEffect(() => {
    setServerAuthChecked(true);
  }, []);

  // 폼 설정
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: '',
      content: '',
      tag: '',
      image: '',
    },
  });

  // 게시글 작성 API 요청
  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormValues) => {
      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '게시글 작성에 실패했습니다.');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: '게시글이 작성되었습니다',
        description: '커뮤니티 페이지로 이동합니다.',
      });
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['/api/social/posts'] });
      // 커뮤니티 메인 페이지로 이동
      setLocation('/community');
    },
    onError: (error: Error) => {
      toast({
        title: '게시글 작성 실패',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // 폼 제출 핸들러
  const onSubmit = (data: PostFormValues) => {
    createPostMutation.mutate(data);
  };

  // 이미지 업로드 기능 (향후 구현)
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 유형 검사
    if (!file.type.startsWith('image/')) {
      toast({
        title: '지원되지 않는 파일 형식',
        description: '이미지 파일만 업로드 가능합니다.',
        variant: 'destructive',
      });
      return;
    }

    // 이미지 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: '파일 크기 초과',
        description: '이미지 크기는 5MB 이하여야 합니다.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // 실제 구현에서는 이미지를 서버에 업로드하고 URL을 반환받아 사용
      // 현재는 Base64 인코딩으로 대체
      const reader = new FileReader();
      reader.onload = () => {
        form.setValue('image', reader.result as string);
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast({
          title: '이미지 처리 오류',
          description: '이미지 업로드 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: '이미지 업로드 실패',
        description: '이미지 업로드 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !serverAuthChecked) return null; // 인증 확인 후 리다이렉트되므로 필요 없지만 타입 안전성을 위해 추가

  return (
    <div className="container py-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => setLocation('/community')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          커뮤니티로 돌아가기
        </Button>
        <h1 className="text-3xl font-bold">게시글 작성</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>새 게시글 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>제목</FormLabel>
                    <FormControl>
                      <Input placeholder="게시글 제목을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>내용</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="게시글 내용을 입력하세요"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>태그</FormLabel>
                    <FormControl>
                      <Input placeholder="태그를 입력하세요 (예: 반려동물, 훈련, 정보)" {...field} />
                    </FormControl>
                    <FormDescription>
                      태그는 쉼표(,)로 구분하지 않고 하나의 태그만 입력해주세요.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이미지 (선택사항)</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('image-upload')?.click()}
                          disabled={isUploading}
                          className="w-full"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              업로드 중...
                            </>
                          ) : field.value ? (
                            '이미지 변경'
                          ) : (
                            '이미지 업로드'
                          )}
                        </Button>
                        {field.value && (
                          <div className="mt-2 relative">
                            <img
                              src={field.value}
                              alt="업로드 이미지"
                              className="max-h-[200px] rounded-md object-contain"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => form.setValue('image', '')}
                            >
                              삭제
                            </Button>
                          </div>
                        )}
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createPostMutation.isPending}
                >
                  {createPostMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      게시글 작성 중...
                    </>
                  ) : (
                    '게시글 작성'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={() => setLocation('/community')}>
            취소
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={createPostMutation.isPending}
          >
            {createPostMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                게시글 작성 중...
              </>
            ) : (
              '게시글 작성'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}