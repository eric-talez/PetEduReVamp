import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDate, isSameMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotebookEntry {
  id: number;
  date: string;
  title: string;
  petId: number;
  petName: string;
  // 다른 필드들은 생략
}

interface NotebookCalendarProps {
  entries: NotebookEntry[];
  selectedDay: Date | null;
  onDaySelect: (day: Date | null) => void;
}

export default function NotebookCalendar({ entries, selectedDay, onDaySelect }: NotebookCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  
  // 현재 달의 모든 날짜를 계산
  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    setCalendarDays(days);
  }, [currentMonth]);
  
  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };
  
  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };
  
  // 특정 날짜에 항목이 있는지 확인
  const hasEntriesForDay = (day: Date) => {
    return entries.some(entry => {
      const entryDate = new Date(entry.date);
      return isSameDay(entryDate, day);
    });
  };
  
  // 해당 날짜의 항목 수 확인
  const getEntryCountForDay = (day: Date) => {
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return isSameDay(entryDate, day);
    }).length;
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {format(currentMonth, 'yyyy년 MM월', { locale: ko })}
        </h3>
        <div className="flex space-x-1">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToPreviousMonth} 
            aria-label="이전 달"
            className="focus:ring-2 focus:ring-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToNextMonth}
            aria-label="다음 달"
            className="focus:ring-2 focus:ring-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-xs font-medium text-center mb-1">
        <div>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div>토</div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
          const hasEntries = hasEntriesForDay(day);
          const entryCount = getEntryCountForDay(day);
          
          return (
            <Button
              key={i}
              variant="ghost"
              size="sm"
              className={cn(
                "h-10 w-full p-0 font-normal",
                isToday(day) && "bg-muted",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                !isSameMonth(day, currentMonth) && "text-muted-foreground opacity-50"
              )}
              onClick={() => onDaySelect(day)}
            >
              <div className="flex flex-col items-center justify-center w-full">
                <span className="text-xs">{getDate(day)}</span>
                {hasEntries && (
                  <span 
                    className={cn(
                      "mt-1 h-1.5 w-1.5 rounded-full",
                      isSelected ? "bg-primary-foreground" : "bg-primary"
                    )}
                  />
                )}
              </div>
            </Button>
          );
        })}
      </div>
      
      {selectedDay && (
        <div className="mt-4 text-sm">
          <p>
            {format(selectedDay, 'yyyy년 MM월 dd일', { locale: ko })}의 알림장: 
            {getEntryCountForDay(selectedDay) > 0 ? ` ${getEntryCountForDay(selectedDay)}개` : ' 없음'}
          </p>
        </div>
      )}
    </div>
  );
}