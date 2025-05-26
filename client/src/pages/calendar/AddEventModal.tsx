import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';

// 일정 타입 정의
export type EventType = 'lesson' | 'medical' | 'grooming' | 'other';

// 반려견 타입 정의
export interface Pet {
  id: string;
  name: string;
  image?: string;
}

// 모달 props 정의
interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: any) => void;
  pets: Pet[];
  selectedDate?: Date;
  eventToEdit?: any;
}

// 폼 스키마 정의
const eventFormSchema = z.object({
  title: z.string().min(1, { message: '일정 제목을 입력해주세요' }),
  type: z.enum(['lesson', 'medical', 'grooming', 'other'], {
    required_error: '일정 유형을 선택해주세요',
  }),
  date: z.date({ required_error: '날짜를 선택해주세요' }),
  time: z.string().min(1, { message: '시간을 선택해주세요' }),
  petId: z.string({ required_error: '반려견을 선택해주세요' }),
  location: z.string().min(1, { message: '장소를 입력해주세요' }),
  description: z.string().optional(),
  trainer: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringType: z.enum(['daily', 'weekly', 'monthly']).optional(),
  recurringCount: z.number().min(1).max(12).optional(),
  remindMe: z.boolean().default(false),
  reminderTime: z.enum(['30min', '1hour', '1day']).optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export function AddEventModal({
  isOpen,
  onClose,
  onAddEvent,
  pets,
  selectedDate,
  eventToEdit,
}: AddEventModalProps) {
  const [isRecurring, setIsRecurring] = useState(false);
  const [remindMe, setRemindMe] = useState(false);

  // 폼 초기값 설정
  const defaultValues: Partial<EventFormValues> = {
    title: '',
    type: 'lesson',
    date: selectedDate || new Date(),
    time: '10:00',
    petId: pets.length > 0 ? pets[0].id : '',
    location: '',
    description: '',
    trainer: '',
    isRecurring: false,
    recurringType: 'weekly',
    recurringCount: 4,
    remindMe: false,
    reminderTime: '1hour',
  };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: eventToEdit || defaultValues,
  });

  // 수정 모드에서 데이터 로드
  useEffect(() => {
    if (eventToEdit) {
      // 수정 모드인 경우 폼 데이터 설정
      const time = eventToEdit.date
        ? format(new Date(eventToEdit.date), 'HH:mm')
        : '10:00';

      form.reset({
        ...eventToEdit,
        time,
        date: eventToEdit.date ? new Date(eventToEdit.date) : new Date(),
        petId: eventToEdit.pet?.id || '',
        trainer: eventToEdit.trainer?.name || '',
      });

      setIsRecurring(!!eventToEdit.isRecurring);
      setRemindMe(!!eventToEdit.remindMe);
    } else {
      // 새 일정 추가 모드
      form.reset({
        ...defaultValues,
        date: selectedDate || new Date(),
      });
    }
  }, [eventToEdit, form, selectedDate, defaultValues]);

  // 폼 제출 처리
  const onSubmit = (data: EventFormValues) => {
    // 날짜와 시간 결합
    const [hours, minutes] = data.time.split(':').map(Number);
    const eventDate = new Date(data.date);
    eventDate.setHours(hours, minutes);

    const newEvent = {
      id: eventToEdit?.id || Date.now(), // 수정 모드면 기존 ID 유지, 아니면 새 ID 생성
      title: data.title,
      date: eventDate,
      type: data.type,
      location: data.location,
      description: data.description,
      pet: pets.find(pet => pet.id === data.petId),
      trainer: data.trainer ? { name: data.trainer } : undefined,
      isRecurring: data.isRecurring,
      recurringType: data.recurringType,
      recurringCount: data.recurringCount,
      remindMe: data.remindMe,
      reminderTime: data.reminderTime,
    };

    onAddEvent(newEvent);
    form.reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {eventToEdit ? '일정 수정' : '일정 추가'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>일정 제목</FormLabel>
                  <FormControl>
                    <Input placeholder="일정 제목을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>일정 유형</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="일정 유형 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lesson">강의/훈련</SelectItem>
                        <SelectItem value="medical">의료/병원</SelectItem>
                        <SelectItem value="grooming">그루밍</SelectItem>
                        <SelectItem value="other">기타</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="petId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>반려견</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="반려견 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pets.map((pet) => (
                          <SelectItem key={pet.id} value={pet.id}>
                            {pet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>날짜</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: ko })
                            ) : (
                              <span>날짜 선택</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={ko}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>시간</FormLabel>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-gray-500" />
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>장소</FormLabel>
                  <FormControl>
                    <Input placeholder="장소를 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('type') === 'lesson' && (
              <FormField
                control={form.control}
                name="trainer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>트레이너</FormLabel>
                    <FormControl>
                      <Input placeholder="트레이너 이름" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="일정에 대한 상세 설명을 입력하세요"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          setIsRecurring(checked as boolean);
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>반복 일정</FormLabel>
                      <FormDescription>
                        이 일정을 주기적으로 반복하시겠습니까?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {isRecurring && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                  <FormField
                    control={form.control}
                    name="recurringType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>반복 주기</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="반복 주기 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">매일</SelectItem>
                            <SelectItem value="weekly">매주</SelectItem>
                            <SelectItem value="monthly">매월</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recurringCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>반복 횟수</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="반복 횟수 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 4, 6, 8, 12].map((count) => (
                              <SelectItem key={count} value={count.toString()}>
                                {count}회
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="remindMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          setRemindMe(checked as boolean);
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>알림 설정</FormLabel>
                      <FormDescription>
                        이 일정에 대한 알림을 받으시겠습니까?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {remindMe && (
                <div className="ml-7">
                  <FormField
                    control={form.control}
                    name="reminderTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>알림 시간</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="알림 시간 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="30min">30분 전</SelectItem>
                            <SelectItem value="1hour">1시간 전</SelectItem>
                            <SelectItem value="1day">1일 전</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button type="submit">
                {eventToEdit ? '일정 수정' : '일정 추가'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}