// AI Analysis API Client

export interface JointPoint {
  name: string;
  x: number;
  y: number;
  confidence: number;
}

export interface MotionAnalysis {
  joints: JointPoint[];
  movementSpeed: number;
  postureTilt: number;
  limbAngles: {
    frontLeft: number;
    frontRight: number;
    backLeft: number;
    backRight: number;
  };
  activityType: string;
  estimatedPain: boolean;
}

export interface DogBehaviorAnalysis {
  timestamp: number;
  behavior: string;
  confidence: number;
  emotion: string;
  intensity: number;
  bodyLanguage?: {
    tail: string;
    ears: string;
    posture: string;
    eyeContact: string;
  };
  audioFeatures?: {
    frequency: number;
    amplitude: number;
    pitch: string;
    barType: string;
    duration: number;
  };
  contextualFactors?: {
    environment: string;
    triggers: string[];
    socialContext: string;
  };
  recommendations?: string[];
  motionAnalysis?: MotionAnalysis;
}

export interface AnalysisMetrics {
  overallMood: string;
  stressLevel: number;
  activityLevel: number;
  socialResponsiveness: number;
  alertness: number;
}

// 파일 메타데이터 분석
export async function analyzeFileMetadata(
  filename: string, 
  fileType: string, 
  duration: number
): Promise<Partial<DogBehaviorAnalysis>> {
  const response = await fetch('/api/ai-analysis/analyze-metadata', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, fileType, duration })
  });
  
  if (!response.ok) {
    throw new Error('메타데이터 분석 실패');
  }
  
  return response.json();
}

// 이미지/비디오 프레임 분석
export async function analyzeImageFrame(
  imageBlob: Blob, 
  timestamp: number
): Promise<DogBehaviorAnalysis> {
  const formData = new FormData();
  formData.append('frame', imageBlob);
  formData.append('timestamp', timestamp.toString());
  
  const response = await fetch('/api/ai-analysis/analyze-frame', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('프레임 분석 실패');
  }
  
  return response.json();
}

// 오디오 세그먼트 분석
export async function analyzeAudioSegment(
  audioBlob: Blob, 
  timestamp: number, 
  duration: number
): Promise<DogBehaviorAnalysis> {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  formData.append('timestamp', timestamp.toString());
  formData.append('duration', duration.toString());
  
  const response = await fetch('/api/ai-analysis/analyze-audio', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('오디오 분석 실패');
  }
  
  return response.json();
}

// 종합 메트릭스 계산
export async function calculateOverallMetrics(
  analyses: DogBehaviorAnalysis[]
): Promise<AnalysisMetrics> {
  const response = await fetch('/api/ai-analysis/calculate-metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ analyses })
  });
  
  if (!response.ok) {
    throw new Error('메트릭스 계산 실패');
  }
  
  return response.json();
}

// 캔버스에서 비디오 프레임 캡처
export function captureVideoFrame(video: HTMLVideoElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context를 생성할 수 없습니다'));
      return;
    }
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('프레임 캡처 실패'));
      }
    }, 'image/jpeg', 0.8);
  });
}

// 오디오 세그먼트 캡처
export async function captureAudioSegment(
  audioElement: HTMLAudioElement, 
  startTime: number, 
  duration: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // MediaRecorder를 사용한 오디오 캡처는 복잡하므로
      // 현재는 더미 데이터를 생성합니다
      const audioData = new Uint8Array(duration * 1000); // 1초당 1KB 가정
      const blob = new Blob([audioData], { type: 'audio/wav' });
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
}