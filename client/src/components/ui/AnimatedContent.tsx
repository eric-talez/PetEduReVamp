import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { useInView } from 'framer-motion';

interface AnimatedContentProps {
  children: ReactNode;
  type?: 'fade' | 'slide' | 'scale' | 'paw';
  delay?: number;
  duration?: number;
  className?: string;
  reduceMotion?: boolean;
}

/**
 * 애니메이션이 적용된 컨텐츠 컴포넌트
 * 다양한 애니메이션 유형을 제공하여 UI 요소에 생동감을 더함
 */
export function AnimatedContent({
  children,
  type = 'fade',
  delay = 0,
  duration = 0.5,
  className = '',
  reduceMotion = false,
}: AnimatedContentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  // 사용자가 모션 감소를 선택했거나 시스템 설정이 감소된 모션을 요청하면 애니메이션 비활성화
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  // 애니메이션 유형에 따른 변형 설정
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration, delay } }
    },
    slide: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0, transition: { duration, delay } }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration, delay } }
    },
    paw: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
          duration, 
          delay,
          type: "spring", 
          stiffness: 200, 
          damping: 20 
        } 
      }
    }
  };

  // 애니메이션 오버레이 (발바닥 모양 패턴) - paw 타입에서만 사용
  const renderPawOverlay = () => {
    if (type === 'paw') {
      return (
        <div 
          className="absolute inset-0 pointer-events-none opacity-10 paw-pattern-bg"
          style={{ 
            zIndex: -1,
            backgroundSize: '60px 60px',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
            filter: `invert(${theme === 'dark' ? 1 : 0})`,
          }}
        />
      );
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`relative ${className}`}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={variants[type]}
        >
          {renderPawOverlay()}
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 애니메이션이 적용된 텍스트 컴포넌트
export function AnimatedText({
  text,
  type = 'fade',
  staggerChildren = 0.03,
  duration = 0.5,
  className = '',
  tag: Tag = 'p',
  reduceMotion = false,
}: {
  text: string;
  type?: 'fade' | 'slide' | 'scale';
  staggerChildren?: number;
  duration?: number;
  className?: string;
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  reduceMotion?: boolean;
}) {
  // 사용자가 모션 감소를 선택했거나 시스템 설정이 감소된 모션을 요청하면 애니메이션 비활성화
  if (reduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const wordVariants = {
    hidden: {},
    visible: {},
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: type === 'slide' ? 20 : 0,
      scale: type === 'scale' ? 0.5 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration,
      },
    },
  };

  const words = text.split(' ');

  return (
    <Tag className={className}>
      <AnimatePresence>
        <motion.span
          initial="hidden"
          animate="visible"
          variants={wordVariants}
        >
          {words.map((word, wordIndex) => (
            <React.Fragment key={`word-${wordIndex}`}>
              <span className="inline-block whitespace-nowrap">
                {Array.from(word).map((letter, letterIndex) => (
                  <motion.span
                    key={`letter-${letterIndex}`}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{
                      delay: (wordIndex * words.length + letterIndex) * staggerChildren,
                    }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
              {wordIndex !== words.length - 1 && <span>&nbsp;</span>}
            </React.Fragment>
          ))}
        </motion.span>
      </AnimatePresence>
    </Tag>
  );
}

/**
 * 스크롤 시 요소가 나타나는 애니메이션 컴포넌트
 * 사용자가 스크롤할 때 요소가 부드럽게 나타나는 효과를 제공합니다.
 */
export function ScrollReveal({
  children,
  threshold = 0.2,
  animation = "fade-up", // fade-up, fade-down, fade-left, fade-right
  duration = 0.6,
  delay = 0,
  className = "",
  once = true
}: {
  children: ReactNode;
  threshold?: number;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right";
  duration?: number;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  
  // 애니메이션 유형에 따른 초기 및 애니메이션 상태 정의
  const getAnimationProps = () => {
    switch (animation) {
      case "fade-up":
        return {
          initial: { opacity: 0, y: 40 },
          animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
        };
      case "fade-down":
        return {
          initial: { opacity: 0, y: -40 },
          animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -40 }
        };
      case "fade-left":
        return {
          initial: { opacity: 0, x: -40 },
          animate: isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }
        };
      case "fade-right":
        return {
          initial: { opacity: 0, x: 40 },
          animate: isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }
        };
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
        };
    }
  };
  
  const { initial, animate } = getAnimationProps();
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={animate}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}