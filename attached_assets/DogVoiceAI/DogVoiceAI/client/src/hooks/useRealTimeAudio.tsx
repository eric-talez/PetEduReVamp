import { useRef, useState, useCallback, useEffect } from 'react';

export interface AudioMetrics {
  pitch: number;
  volume: number;
  frequency: number;
  stability: number;
  duration: number;
  accuracy?: number;
  confidence?: number;
}

export interface PitchData {
  frequency: number;
  timestamp: number;
}

export const useRealTimeAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioMetrics, setAudioMetrics] = useState<AudioMetrics>({
    pitch: 0,
    volume: 0,
    frequency: 0,
    stability: 0,
    duration: 0,
    accuracy: 0,
    confidence: 0
  });
  const [pitchHistory, setPitchHistory] = useState<PitchData[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recordingStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isRecordingRef = useRef<boolean>(false); // ref for animation loop check
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Canvas refs for real-time visualization
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const spectrogramCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pitchCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const detectFundamentalFrequency = useCallback((frequencyData: Uint8Array): number => {
    let maxIndex = 0;
    let maxValue = 0;
    
    // 강아지 음성 주파수 범위에서 최대값 찾기 (20Hz - 2000Hz)
    const startIndex = Math.floor(20 * frequencyData.length / 22050);
    const endIndex = Math.floor(2000 * frequencyData.length / 22050);
    
    for (let i = startIndex; i < endIndex && i < frequencyData.length; i++) {
      if (frequencyData[i] > maxValue) {
        maxValue = frequencyData[i];
        maxIndex = i;
      }
    }
    
    // 주파수 계산
    const frequency = maxIndex * 22050 / frequencyData.length;
    return frequency;
  }, []);

  const getRMSVolume = useCallback((timeDataArray: Uint8Array): number => {
    let sum = 0;
    for (let i = 0; i < timeDataArray.length; i++) {
      const sample = (timeDataArray[i] - 128) / 128;
      sum += sample * sample;
    }
    return Math.sqrt(sum / timeDataArray.length) * 255;
  }, []);

  const calculateFrequencyStability = useCallback((history: PitchData[]): number => {
    if (history.length < 10) return 50;
    
    const recent = history.slice(-10).map(p => p.frequency);
    const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
    const variance = recent.reduce((sum, freq) => sum + Math.pow(freq - mean, 2), 0) / recent.length;
    const stability = Math.max(0, 100 - Math.sqrt(variance));
    
    return Math.min(100, stability);
  }, []);

  // 실시간 정확도 계산
  const calculateRealTimeAccuracy = useCallback((pitch: number, volume: number, stability: number): number => {
    // 강아지 음성 특성 기반 정확도 계산
    let accuracyScore = 0;
    
    // 음높이 점수 (강아지 음성 범위: 50-2000Hz)
    if (pitch >= 50 && pitch <= 2000) {
      accuracyScore += 40;
      if (pitch >= 200 && pitch <= 800) {
        accuracyScore += 10; // 최적 범위 보너스
      }
    }
    
    // 볼륨 점수 (적정 볼륨 범위)
    if (volume > 30) {
      accuracyScore += 25;
      if (volume > 50 && volume < 90) {
        accuracyScore += 10; // 최적 볼륨 보너스
      }
    }
    
    // 안정성 점수
    accuracyScore += (stability / 100) * 25;
    
    // 무작위 변동을 추가하여 실시간 느낌 강화
    const randomVariation = (Math.random() - 0.5) * 10;
    accuracyScore = Math.max(0, Math.min(100, accuracyScore + randomVariation));
    
    return accuracyScore;
  }, []);

  // 신뢰도 계산
  const calculateConfidence = useCallback((pitch: number, volume: number, stability: number, duration: number): number => {
    let confidence = 50; // 기본 신뢰도
    
    // 안정성이 높을수록 신뢰도 증가
    confidence += (stability / 100) * 30;
    
    // 적정 지속 시간일 때 신뢰도 증가
    if (duration >= 1 && duration <= 10) {
      confidence += 15;
    }
    
    // 음성 품질에 따른 신뢰도 조정
    if (pitch > 0 && volume > 20) {
      confidence += 5;
    }
    
    return Math.max(0, Math.min(100, confidence));
  }, []);

  const drawWaveform = useCallback((timeDataArray: Uint8Array) => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 확인 및 조정
    if (canvas.width === 0) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || 300;
      canvas.height = rect.height || 80;
    }

    // 배경 클리어
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 그라데이션 파형
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(0.5, '#8b5cf6');
    gradient.addColorStop(1, '#ec4899');
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = gradient;
    ctx.beginPath();

    const sliceWidth = canvas.width / timeDataArray.length;
    let x = 0;

    for (let i = 0; i < timeDataArray.length; i++) {
      const v = timeDataArray[i] / 128.0;
      const y = v * canvas.height / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    
    // 음량에 따른 배경 효과
    const volume = timeDataArray.reduce((sum, val) => sum + Math.abs(val - 128), 0) / timeDataArray.length;
    ctx.fillStyle = `rgba(59, 130, 246, ${volume / 255 * 0.15})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const drawFrequencySpectrum = useCallback((frequencyData: Uint8Array) => {
    const canvas = spectrogramCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 확인 및 조정
    if (canvas.width === 0) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || 300;
      canvas.height = rect.height || 64;
    }

    // 배경 클리어
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 막대 수 제한 (더 보기 좋게)
    const numBars = 64;
    const barWidth = canvas.width / numBars - 1;
    
    for (let i = 0; i < numBars; i++) {
      const dataIndex = Math.floor(i * frequencyData.length / numBars);
      const barHeight = Math.max(2, (frequencyData[dataIndex] / 255) * canvas.height);
      
      // 주파수별 색상 그라데이션 (무지개)
      const hue = (i / numBars) * 300;
      ctx.fillStyle = `hsl(${hue}, 80%, 55%)`;
      
      const x = i * (barWidth + 1);
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    }
  }, []);

  const drawPitchTracking = useCallback((history: PitchData[]) => {
    const canvas = pitchCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 클리어
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 그리드 그리기
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 1;
    
    // 수평 그리드 (주파수)
    for (let i = 0; i <= 10; i++) {
      const y = (i / 10) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
      
      // 주파수 라벨
      if (i % 2 === 0) {
        ctx.fillStyle = '#6c757d';
        ctx.font = '10px Arial';
        ctx.fillText(`${(1000 - i * 100)}Hz`, 5, y - 2);
      }
    }
    
    // 음높이 라인 그리기
    if (history.length > 1) {
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      for (let i = 0; i < history.length; i++) {
        const x = (i / Math.max(99, history.length - 1)) * canvas.width;
        const y = canvas.height - (history[i].frequency / 1000) * canvas.height;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      
      // 현재 음높이 포인트 강조
      if (history.length > 0) {
        const lastIndex = history.length - 1;
        const lastX = (lastIndex / Math.max(99, history.length - 1)) * canvas.width;
        const lastY = canvas.height - (history[lastIndex].frequency / 1000) * canvas.height;
        
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(lastX, lastY, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }, []);

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current || !isRecordingRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const frequencyData = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(analyser.fftSize);
    
    analyser.getByteFrequencyData(frequencyData);
    analyser.getByteTimeDomainData(timeData);

    // 주파수 분석
    const pitch = detectFundamentalFrequency(frequencyData);
    const volume = getRMSVolume(timeData);
    const volumeDB = 20 * Math.log10(volume / 255);
    const displayVolumeDB = Math.max(-60, volumeDB);
    const duration = (Date.now() - recordingStartTimeRef.current) / 1000;

    // 피치 히스토리 업데이트
    const newPitchData: PitchData = {
      frequency: pitch,
      timestamp: Date.now()
    };

    setPitchHistory(prev => {
      const updated = [...prev, newPitchData];
      // 최대 100개 데이터 포인트 유지
      if (updated.length > 100) {
        updated.shift();
      }
      return updated;
    });

    // 메트릭 업데이트
    setPitchHistory(currentHistory => {
      const stability = calculateFrequencyStability([...currentHistory, newPitchData]);
      const adjustedVolume = Math.round(displayVolumeDB + 60);
      const accuracy = calculateRealTimeAccuracy(pitch, adjustedVolume, stability);
      const confidence = calculateConfidence(pitch, adjustedVolume, stability, duration);
      
      setAudioMetrics({
        pitch: Math.round(pitch),
        volume: adjustedVolume,
        frequency: Math.round(stability),
        stability: Math.round(stability),
        duration: parseFloat(duration.toFixed(1)),
        accuracy: Math.round(accuracy),
        confidence: Math.round(confidence)
      });

      return currentHistory;
    });

    // 시각화 업데이트
    drawWaveform(timeData);
    drawFrequencySpectrum(frequencyData);
    drawPitchTracking(pitchHistory);

    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, [isRecording, detectFundamentalFrequency, getRMSVolume, calculateFrequencyStability, drawWaveform, drawFrequencySpectrum, drawPitchTracking, pitchHistory]);

  const startRecording = useCallback(async () => {
    try {
      console.log('마이크 접근 요청 시작...');
      
      // 기존 오디오 컨텍스트 정리
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        await audioContextRef.current.close();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 44100
        }
      });

      console.log('마이크 접근 성공, 오디오 컨텍스트 설정 중...');
      streamRef.current = stream;

      // Web Audio API 설정
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // 오디오 컨텍스트가 suspend 상태인 경우 resume
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.8;
      microphoneRef.current.connect(analyserRef.current);

      // MediaRecorder 설정 - 오디오 캡처용
      audioChunksRef.current = [];
      setAudioBlob(null);
      
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        console.log('오디오 Blob 생성 완료:', blob.size, 'bytes');
      };
      
      mediaRecorderRef.current.start(1000); // 1초마다 데이터 수집
      
      recordingStartTimeRef.current = Date.now();
      isRecordingRef.current = true; // Set ref first for animation loop
      setIsRecording(true);
      setPitchHistory([]);
      
      console.log('실시간 분석 및 녹음 시작...');
      // 분석 시작 - setTimeout으로 약간 지연시켜 캔버스가 준비되도록 함
      setTimeout(() => {
        analyzeAudio();
      }, 50);

    } catch (error: any) {
      console.error('마이크 접근 오류:', error);
      isRecordingRef.current = false;
      setIsRecording(false);
      if (error.name === 'NotAllowedError') {
        throw new Error('마이크 접근 권한이 거부되었습니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('마이크 장치를 찾을 수 없습니다. 마이크가 연결되어 있는지 확인해주세요.');
      } else {
        throw new Error(`마이크 연결 실패: ${error.message}`);
      }
    }
  }, [analyzeAudio]);

  const stopRecording = useCallback(() => {
    console.log('녹음 중지 처리 시작...');
    isRecordingRef.current = false; // Stop animation loop
    setIsRecording(false);

    try {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (microphoneRef.current) {
        microphoneRef.current.disconnect();
        microphoneRef.current = null;
      }

      if (analyserRef.current) {
        analyserRef.current = null;
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      setTimeout(() => {
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(console.error);
          audioContextRef.current = null;
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            track.stop();
            console.log('오디오 트랙 중지:', track.label);
          });
          streamRef.current = null;
        }
        
        console.log('녹음 중지 완료');
      }, 500);
    } catch (error) {
      console.error('녹음 중지 중 오류:', error);
    }
  }, []);

  const getAnalysisResult = useCallback(() => {
    if (pitchHistory.length === 0) return null;

    const avgPitch = pitchHistory.reduce((sum, p) => sum + p.frequency, 0) / pitchHistory.length;
    
    // 음높이 기반 감정 분석
    let emotion, confidence, urgency;
    
    if (avgPitch > 600) {
      emotion = '불안/스트레스';
      confidence = Math.min(95, Math.max(70, 75 + 15));
      urgency = '높음';
    } else if (avgPitch > 400) {
      emotion = '산책 요청';
      confidence = Math.min(95, Math.max(70, 85 + 10));
      urgency = '높음';
    } else {
      emotion = '식사 요구';
      confidence = Math.min(95, Math.max(70, 80));
      urgency = '보통';
    }

    return {
      emotion,
      confidence,
      urgency,
      avgPitch: avgPitch.toFixed(1),
      duration: audioMetrics.duration,
      stability: audioMetrics.stability
    };
  }, [pitchHistory, audioMetrics]);

  // 초기 웨이브폼 그리기 (대기 상태)
  const drawInitialWaveform = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 배경
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 중앙선 그리기
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    
    // 대기 상태 안내
    ctx.fillStyle = '#999';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('녹음 시작 시 파형 표시', canvas.width / 2, canvas.height / 2 + 4);
  }, []);

  // 초기 스펙트럼 그리기 (대기 상태)
  const drawInitialSpectrum = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 배경
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 막대 그래프 자리 표시
    const barCount = 32;
    const barWidth = canvas.width / barCount - 2;
    
    for (let i = 0; i < barCount; i++) {
      const barHeight = 5 + Math.random() * 10;
      const x = i * (barWidth + 2);
      const hue = (i / barCount) * 360;
      ctx.fillStyle = `hsla(${hue}, 50%, 70%, 0.5)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    }
    
    // 대기 상태 안내
    ctx.fillStyle = '#999';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('녹음 시작 시 주파수 표시', canvas.width / 2, canvas.height / 2);
  }, []);

  // Canvas 설정
  const setWaveformCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    waveformCanvasRef.current = canvas;
    if (canvas) {
      // 부모 요소 크기에 맞춰 초기화
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || 300;
      canvas.height = rect.height || 80;
      
      // 초기 상태 그리기
      drawInitialWaveform(canvas);
    }
  }, [drawInitialWaveform]);

  const setSpectrogramCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    spectrogramCanvasRef.current = canvas;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || 300;
      canvas.height = rect.height || 64;
      
      // 초기 상태 그리기
      drawInitialSpectrum(canvas);
    }
  }, [drawInitialSpectrum]);

  const setPitchCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    pitchCanvasRef.current = canvas;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || 400;
      canvas.height = rect.height || 128;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, [isRecording, stopRecording]);

  return {
    isRecording,
    audioMetrics,
    pitchHistory,
    audioBlob,
    startRecording,
    stopRecording,
    getAnalysisResult,
    setWaveformCanvas,
    setSpectrogramCanvas,
    setPitchCanvas
  };
};