import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Download, Maximize, Minimize } from 'lucide-react';

interface MediaFile {
  type: 'photo' | 'video';
  url: string;
}

interface MediaViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: MediaFile[];
  initialIndex?: number;
}

export default function MediaViewer({
  open,
  onOpenChange,
  files,
  initialIndex = 0
}: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  if (!files || files.length === 0) {
    return null;
  }
  
  const currentFile = files[currentIndex];
  
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : files.length - 1));
  };
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev < files.length - 1 ? prev + 1 : 0));
  };
  
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      const mediaElement = document.getElementById('mediaViewer');
      if (mediaElement) {
        mediaElement.requestFullscreen();
        setIsFullscreen(true);
      }
    }
  };
  
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = currentFile.url;
    a.download = `media-${currentIndex}.${currentFile.type === 'photo' ? 'jpg' : 'mp4'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden" id="mediaViewer">
        <DialogHeader className="p-4 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-white">
              {currentIndex + 1} / {files.length}
            </DialogTitle>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={handleDownload} className="text-white hover:bg-black/20">
                <Download className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-black/20">
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white hover:bg-black/20">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="relative h-[80vh] flex items-center justify-center bg-black">
          {currentFile.type === 'photo' ? (
            <img
              src={currentFile.url}
              alt={`미디어 ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <video
              src={currentFile.url}
              controls
              autoPlay
              className="max-h-full max-w-full"
            />
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
            onClick={goToNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
        
        <DialogFooter className="p-4 gap-2 flex-row flex-wrap justify-center">
          {files.map((file, index) => (
            <Button
              key={index}
              variant={currentIndex === index ? "default" : "outline"}
              size="sm"
              className="p-0 h-12 w-12 aspect-square overflow-hidden"
              onClick={() => setCurrentIndex(index)}
            >
              {file.type === 'photo' ? (
                <img
                  src={file.url}
                  alt={`썸네일 ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="relative h-full w-full">
                  <video
                    src={file.url}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="text-white text-xs">▶</span>
                  </div>
                </div>
              )}
            </Button>
          ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}