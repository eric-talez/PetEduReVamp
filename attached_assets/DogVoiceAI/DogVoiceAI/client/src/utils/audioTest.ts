// Audio Testing Utilities for Microphone Integration
export interface AudioTestResult {
  browserSupport: boolean;
  microphoneAvailable: boolean;
  mediaRecorderSupport: boolean;
  supportedFormats: string[];
  errorMessage?: string;
}

export async function testAudioCapabilities(): Promise<AudioTestResult> {
  const result: AudioTestResult = {
    browserSupport: false,
    microphoneAvailable: false,
    mediaRecorderSupport: false,
    supportedFormats: []
  };

  try {
    // Test 1: Browser API Support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      result.errorMessage = '브라우저가 getUserMedia API를 지원하지 않습니다.';
      return result;
    }
    result.browserSupport = true;

    // Test 2: MediaRecorder Support
    if (typeof MediaRecorder === 'undefined') {
      result.errorMessage = '브라우저가 MediaRecorder API를 지원하지 않습니다.';
      return result;
    }
    result.mediaRecorderSupport = true;

    // Test 3: Supported Audio Formats
    const formats = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/wav'
    ];

    result.supportedFormats = formats.filter(format => 
      MediaRecorder.isTypeSupported(format)
    );

    // Test 4: Microphone Permission Test
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        }
      });
      
      result.microphoneAvailable = true;
      
      // Clean up the stream
      stream.getTracks().forEach(track => track.stop());
      
    } catch (permissionError) {
      if (permissionError.name === 'NotAllowedError') {
        result.errorMessage = '마이크 접근 권한이 거부되었습니다.';
      } else if (permissionError.name === 'NotFoundError') {
        result.errorMessage = '마이크 장치를 찾을 수 없습니다.';
      } else {
        result.errorMessage = `마이크 테스트 실패: ${permissionError.message}`;
      }
    }

  } catch (error) {
    result.errorMessage = `오디오 테스트 중 오류 발생: ${error.message}`;
  }

  return result;
}

export function formatAudioTestReport(result: AudioTestResult): string {
  let report = '=== 오디오 시스템 진단 보고서 ===\n';
  
  report += `브라우저 API 지원: ${result.browserSupport ? '✓' : '✗'}\n`;
  report += `MediaRecorder 지원: ${result.mediaRecorderSupport ? '✓' : '✗'}\n`;
  report += `마이크 사용 가능: ${result.microphoneAvailable ? '✓' : '✗'}\n`;
  
  if (result.supportedFormats.length > 0) {
    report += `지원 오디오 형식: ${result.supportedFormats.join(', ')}\n`;
  } else {
    report += '지원 오디오 형식: 없음\n';
  }
  
  if (result.errorMessage) {
    report += `오류: ${result.errorMessage}\n`;
  }
  
  return report;
}