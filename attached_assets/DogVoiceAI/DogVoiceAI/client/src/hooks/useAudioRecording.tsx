import { useState, useCallback, useRef } from 'react';

interface UseAudioRecordingReturn {
  isRecording: boolean;
  duration: number;
  audioUrl: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
}

export default function useAudioRecording(): UseAudioRecordingReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      console.log('마이크 접근 요청 중...');
      
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('브라우저가 오디오 녹음을 지원하지 않습니다.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        } 
      });
      
      console.log('마이크 접근 성공:', stream.getAudioTracks()[0].getSettings());
      streamRef.current = stream;
      
      // Check MediaRecorder support and available mimeTypes
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/wav';
        }
      }
      console.log('사용할 오디오 형식:', mimeType);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        console.log('오디오 데이터 수집됨:', event.data.size, 'bytes');
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('녹음 중지됨. 총 청크:', chunksRef.current.length);
        const blob = new Blob(chunksRef.current, { type: mimeType });
        console.log('생성된 블롭 크기:', blob.size, 'bytes');
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder 오류:', event);
        alert('녹음 중 오류가 발생했습니다.');
      };

      mediaRecorder.onstart = () => {
        console.log('녹음 시작됨');
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setDuration(0);

      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
      console.log('녹음 시작 완료');
    } catch (error) {
      console.error('녹음 시작 오류:', error);
      if (error.name === 'NotAllowedError') {
        alert('마이크 접근 권한이 거부되었습니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
      } else if (error.name === 'NotFoundError') {
        alert('마이크를 찾을 수 없습니다. 마이크가 연결되어 있는지 확인해주세요.');
      } else if (error.name === 'NotSupportedError') {
        alert('브라우저가 오디오 녹음을 지원하지 않습니다.');
      } else {
        alert(`마이크 연동 오류: ${error.message}`);
      }
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    stopRecording();
    setDuration(0);
    setAudioUrl(null);
    chunksRef.current = [];
  }, [stopRecording]);

  return {
    isRecording,
    duration,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording
  };
}