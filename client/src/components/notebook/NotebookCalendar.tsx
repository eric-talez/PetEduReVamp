import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { PawPrint } from 'lucide-react';

interface NotebookEntry {
  id: number;
  date: string;
  title: string;
  petId: number;
  petName: string;
  mood: string;
}

interface NotebookCalendarProps {
  entries: NotebookEntry[];
  onSelectDate: (date: Date) => void;
  selectedDate: Date | null;
}

export default function NotebookCalendar({ entries, onSelectDate, selectedDate }: NotebookCalendarProps) {
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [entryDates, setEntryDates] = useState<Date[]>([]);
  
  // 알림장이 있는 날짜들을 관리
  useEffect(() => {
    const dates = entries.map(entry => new Date(entry.date));
    setEntryDates(dates);
  }, [entries]);
  
  // 날짜 셀 렌더링 사용자 정의
  const renderDay = (day: Date, mods: Record<string, boolean>) => {
    const hasEntry = entryDates.some(date => isSameDay(date, day));
    const isSelectedDate = selectedDate && isSameDay(selectedDate, day);
    
    return (
      <div
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
  
  // 현재 월에 표시된 알림장 개수
  const currentMonthEntriesCount = () => {
    const start = startOfMonth(calendarMonth);
    const end = endOfMonth(calendarMonth);
    const daysInMonth = eachDayOfInterval({ start, end });
    
    return entryDates.filter(date => 
      daysInMonth.some(day => isSameDay(day, date))
    ).length;
  };
  
  const entriesCount = currentMonthEntriesCount();
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">알림장 달력</h3>
        <Badge variant="outline">
          {format(calendarMonth, 'yyyy년 MM월', { locale: ko })}
          <span className="ml-1 text-primary">{entriesCount}개</span>
        </Badge>
      </div>
      
      <div className="border rounded-md p-2">
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