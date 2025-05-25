import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

type CommandCallback = (transcript: string) => void;

interface CommandDefinition {
  command: string | RegExp;
  callback: CommandCallback;
  description: string;
}

interface VoiceCommandOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  commands?: CommandDefinition[];
}

/**
 * 음성 명령 인식 및 처리를 위한 커스텀 훅
 * 
 * 브라우저의 Web Speech API를 사용하여 음성 명령을 인식하고 실행합니다.
 * 접근성을 높이기 위한 음성 인터페이스를 제공합니다.
 * 
 * @param options 음성 인식 옵션
 * @returns [isListening, transcript, start, stop, commands] - 상태 및 제어 함수
 */
export function useVoiceCommand({
  lang = 'ko-KR',
  continuous = false,
  interimResults = true,
  maxAlternatives = 1,
  onStart,
  onEnd,
  onError,
  commands = [],
}: VoiceCommandOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // 음성 인식 결과 처리
  const handleResult = useCallback((event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript;
      } else {
        interimTranscript += result[0].transcript;
      }
    }

    // 최종 또는 중간 결과 설정
    const currentTranscript = finalTranscript || interimTranscript;
    setTranscript(currentTranscript);

    // 명령어 매칭 및 실행
    if (finalTranscript) {
      const normalizedTranscript = finalTranscript.trim().toLowerCase();
      
      for (const { command, callback } of commands) {
        // 문자열 또는 정규식 패턴 매칭
        if (
          (typeof command === 'string' && normalizedTranscript.includes(command.toLowerCase())) ||
          (command instanceof RegExp && command.test(normalizedTranscript))
        ) {
          callback(finalTranscript);
          
          // 명령 실행 알림
          toast({
            title: "음성 명령 실행",
            description: `"${finalTranscript}" 명령을 처리했습니다.`,
            duration: 3000,
          });
          
          break;
        }
      }
    }
  }, [commands, toast]);

  // 음성 인식 초기화
  useEffect(() => {
    // SpeechRecognition API 지원 확인 (타입 정의를 위한 타입 캐스팅)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('이 브라우저는 음성 인식을 지원하지 않습니다.');
      if (onError) onError('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }

    // 인식기 생성 및 설정
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.maxAlternatives = maxAlternatives;

    // 이벤트 핸들러 등록
    recognition.onstart = () => {
      setIsListening(true);
      if (onStart) onStart();
    };

    recognition.onresult = handleResult;

    recognition.onerror = (event: any) => {
      console.error('음성 인식 오류:', event.error);
      if (onError) onError(event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (onEnd) onEnd();
    };

    // 참조 저장
    recognitionRef.current = recognition;

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [lang, continuous, interimResults, maxAlternatives, onStart, onEnd, onError, handleResult, isListening]);

  // 음성 인식 시작 함수
  const start = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setTranscript('');
      } catch (error) {
        console.error('음성 인식 시작 오류:', error);
      }
    }
  }, [isListening]);

  // 음성 인식 중지 함수
  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    start,
    stop,
    commands,
  };
}

/**
 * 사용 예시:
 * 
 * // 기본 사용법
 * const { isListening, transcript, start, stop } = useVoiceCommand({
 *   commands: [
 *     {
 *       command: '홈으로',
 *       callback: () => navigate('/'),
 *       description: '홈 페이지로 이동합니다.'
 *     },
 *     {
 *       command: /검색\s(.+)/i,
 *       callback: (transcript) => {
 *         const match = transcript.match(/검색\s(.+)/i);
 *         if (match && match[1]) {
 *           search(match[1]);
 *         }
 *       },
 *       description: '"검색 [검색어]" 형식으로 검색합니다.'
 *     }
 *   ]
 * });
 */