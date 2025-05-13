import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Share, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaViewerProps {
  media: {
    type: 'photo' | 'video';
    url: string;
  }[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MediaViewer({
  media,
  initialIndex = 0,
  open,
  onOpenChange
}: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentMedia = media[currentIndex];
  
  // 이전 미디어로 이동
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };
  
  // 다음 미디어로 이동
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };
  
  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'Escape') {
      onOpenChange(false);
    }
  };
  
  // 썸네일 클릭
  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] max-h-[90vh] p-2 md:p-6 flex flex-col"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>
            미디어 보기 ({currentIndex + 1} / {media.length})
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </DialogHeader>
        
        <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
          {currentMedia.type === 'photo' ? (
            <img
              src={currentMedia.url}
              alt={`미디어 ${currentIndex + 1}`}
              className="max-h-[60vh] max-w-full object-contain"
            />
          ) : (
            <video
              src={currentMedia.url}
              controls
              className="max-h-[60vh] max-w-full"
            />
          )}
          
          {media.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background/90"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background/90"
                onClick={handleNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}
        </div>
        
        {media.length > 1 && (
          <div className="flex justify-center gap-2 mt-2 p-2 overflow-x-auto">
            {media.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2",
                  currentIndex === index ? "border-primary" : "border-transparent"
                )}
                onClick={() => handleThumbnailClick(index)}
              >
                {item.type === 'photo' ? (
                  <img
                    src={item.url}
                    alt={`썸네일 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}
        
        <DialogFooter className="mt-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              공유
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              다운로드
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}