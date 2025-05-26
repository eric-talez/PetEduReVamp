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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
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

// 카테고리 옵션
const CATEGORIES = [
  { value: '일반', label: '일반' },
  { value: '훈련팁', label: '훈련팁' },
  { value: '건강관리', label: '건강관리' },
  { value: '행동교정', label: '행동교정' },
  { value: '영양정보', label: '영양정보' },
  { value: '놀이활동', label: '놀이활동' },
  { value: '질문답변', label: '질문답변' },
  { value: '후기공유', label: '후기공유' },
];

export default function CreatePostPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // URL 파라미터에서 카테고리 추출
  const urlParams = new URLSearchParams(window.location.search);
  const defaultCategory = urlParams.get('category') || '';

  // 폼 설정
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: '',
      content: '',
      tag: defaultCategory,
      image: '',
    },
  });

  // 게시글 작성 API 요청
  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormValues) => {
      // 새로운 커뮤니티 API 경로 사용
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      console.log('응답 상태:', response.status);
      console.log('응답 헤더:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('오류 응답 내용:', errorText);
        throw new Error(`서버 오류: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('성공 응답 내용:', responseText);
      
      try {
        return JSON.parse(responseText);
      } catch (e) {
        console.error('JSON 파싱 오류. 응답 내용:', responseText);
        throw new Error('서버 응답 형식 오류');
      }
    },
    onSuccess: () => {
      toast({
        title: '게시글이 작성되었습니다',
        description: '커뮤니티 페이지로 이동합니다.',
      });
      // 모든 커뮤니티 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['/api/community'] });
      queryClient.refetchQueries({ queryKey: ['/api/community/posts'] });
      // 커뮤니티 메인 페이지로 이동
      setLocation('/community');
    },
    onError: (error: Error) => {
      console.error('게시글 작성 오류:', error);
      console.error('오류 상세:', error.message);
      toast({
        title: '게시글 작성 실패',
        description: error.message || '서버 오류가 발생했습니다.',
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

  // 로딩 및 인증 체크 완전 제거하고 바로 렌더링

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
                    <FormLabel>카테고리</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리를 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      게시글의 주제에 맞는 카테고리를 선택해주세요.
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