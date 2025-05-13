import { useState, useEffect } from 'react';
import { format, isSameDay, isSameMonth, isToday, startOfMonth, endOfMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PawPrint, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotebookCalendarProps {
  entries: { date: string }[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export default function NotebookCalendar({
  entries,
  selectedDate,
  onSelectDate
}: NotebookCalendarProps) {
  const [entryDates, setEntryDates] = useState<Date[]>([]);
  const [calendarMonth, setCalendarMonth] = useState<Date>(selectedDate || new Date());
  
  // 알림장 기록이 있는 날짜 추출
  useEffect(() => {
    const dates = entries.map(entry => new Date(entry.date));
    setEntryDates(dates);
  }, [entries]);
  
  // 날짜 셀 렌더링 사용자 정의
  const renderDay = (props: any) => {
    const { date: day, ...rest } = props;
    const hasEntry = entryDates.some(entryDate => isSameDay(entryDate, day));
    const isSelectedDate = selectedDate && isSameDay(selectedDate, day);
    
    return (
      <div
        {...rest}
        className={cn(
          'w-full h-full p-0 flex items-center justify-center relative',
          hasEntry && 'font-bold',
          isSelectedDate && 'bg-primary text-primary-foreground rounded-md'
        )}
      >
        {day.getDate()}
        {hasEntry && !isSelectedDate && (
          <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <PawPrint className="h-3 w-3" />
          </span>
        )}
      </div>
    );
  };
  
  // 월 변경 처리
  const handleMonthChange = (month: Date) => {
    setCalendarMonth(month);
  };
  
  // 이전 월로 이동
  const goToPreviousMonth = () => {
    const prevMonth = new Date(calendarMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCalendarMonth(prevMonth);
  };
  
  // 다음 월로 이동
  const goToNextMonth = () => {
    const nextMonth = new Date(calendarMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCalendarMonth(nextMonth);
  };
  
  // 오늘 날짜로 이동
  const goToToday = () => {
    const today = new Date();
    setCalendarMonth(today);
    onSelectDate(today);
  };
  
  return (
    <div className="bg-card rounded-lg shadow-sm">
      <div className="border-b border-border py-3 px-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousMonth}
            aria-label="이전 달"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {format(calendarMonth, 'yyyy년 MM월', { locale: ko })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextMonth}
            aria-label="다음 달"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={(date) => date && onSelectDate(date)}
          onMonthChange={handleMonthChange}
          locale={ko}
          className="rounded-md border-none"
          components={{
            Day: renderDay
          }}
        />
      </div>
    </div>
  );
}